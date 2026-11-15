// nosw transport: epoxy without HTTP/2.
//
// epoxy's "full" build (what @mercuryworkshop/epoxy-transport bundles) offers h2 via
// ALPN, and hyper's HTTP/2 client caps response headers at 16 KB
// (DEFAULT_MAX_HEADER_LIST_SIZE). h2 0.4 resets any response over that with
//   Reset(StreamId(1), PROTOCOL_ERROR, Library)
// which is what YouTube's pages hit (big CSP/report-to/origin-trial/set-cookie
// headers). libcurl.js doesn't have that limit.
//
// This uses epoxy-tls's "minimal" build only: no h2, so every request is HTTP/1.1.
// Minimal has no WebSocket API, so WebSockets are a small RFC 6455 client on top of
// its raw connect_tls/connect_tcp sockets (which never offer h2 either).
import initEpoxy, {
	EpoxyClient,
	EpoxyClientOptions,
} from "https://cdn.jsdelivr.net/npm/@mercuryworkshop/epoxy-tls@2.1.20-1/minimal/epoxy-bundled.js";

const OPTION_KEYS = ["wisp_v2", "udp_extension_required", "title_case_headers", "redirect_limit", "header_limit", "buffer_size"];
const enc = new TextEncoder();
const dec = new TextDecoder();

function concat(a, b) {
	if (!a.length) return b;
	const out = new Uint8Array(a.length + b.length);
	out.set(a);
	out.set(b, a.length);
	return out;
}

function frame(opcode, payload) {
	const len = payload.length;
	const head = len < 126 ? 2 : len < 65536 ? 4 : 10;
	const out = new Uint8Array(head + 4 + len);
	out[0] = 0x80 | opcode; // FIN + opcode
	if (len < 126) out[1] = 0x80 | len;
	else if (len < 65536) {
		out[1] = 0x80 | 126;
		out[2] = len >> 8;
		out[3] = len & 255;
	} else {
		out[1] = 0x80 | 127;
		new DataView(out.buffer).setBigUint64(2, BigInt(len));
	}
	const mask = crypto.getRandomValues(new Uint8Array(4)); // clients must mask
	out.set(mask, head);
	for (let i = 0; i < len; i++) out[head + 4 + i] = payload[i] ^ mask[i & 3];
	return out;
}

function websocket(client, url, protocols, requestHeaders, onopen, onmessage, onclose, onerror) {
	const secure = url.protocol === "wss:";
	const port = url.port || (secure ? "443" : "80");
	let writer = null;
	let closed = false;
	let sentClose = false;

	const finish = (code, reason) => {
		if (closed) return;
		closed = true;
		try { writer && writer.close().catch(() => {}); } catch {}
		onclose(code, reason);
	};
	const fail = err => {
		if (closed) return;
		onerror(String(err && err.message ? err.message : err));
		finish(1006, "");
	};
	const write = bytes => writer.write(bytes).catch(fail);

	const opened = (async () => {
		const io = await (secure ? client.connect_tls(`wss://${url.hostname}:${port}`) : client.connect_tcp(`ws://${url.hostname}:${port}`));
		writer = io.write.getWriter();
		const reader = io.read.getReader();

		const key = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
		const headers = {
			Host: url.port ? `${url.hostname}:${url.port}` : url.hostname,
			Upgrade: "websocket",
			Connection: "Upgrade",
			"Sec-WebSocket-Key": key,
			"Sec-WebSocket-Version": "13",
			"User-Agent": navigator.userAgent,
		};
		if (protocols && protocols.length) headers["Sec-WebSocket-Protocol"] = protocols.join(", ");
		for (const [k, v] of Object.entries(requestHeaders || {})) {
			if (!/^(host|upgrade|connection|sec-websocket-(key|version|extensions))$/i.test(k)) headers[k] = v;
		}
		const target = (url.pathname || "/") + url.search;
		const head = `GET ${target} HTTP/1.1\r\n` + Object.entries(headers).map(([k, v]) => `${k}: ${v}`).join("\r\n") + "\r\n\r\n";
		await writer.write(enc.encode(head));

		// Read the HTTP response head.
		let buf = new Uint8Array(0);
		let end = -1;
		while (end < 0) {
			const { value, done } = await reader.read();
			if (done) throw new Error("WebSocket connection closed during handshake");
			buf = concat(buf, value);
			for (let i = 3; i < buf.length; i++) if (buf[i - 3] === 13 && buf[i - 2] === 10 && buf[i - 1] === 13 && buf[i] === 10) { end = i + 1; break; }
			if (end < 0 && buf.length > 65536) throw new Error("WebSocket handshake response too large");
		}
		const lines = dec.decode(buf.subarray(0, end)).split("\r\n");
		const status = lines[0].split(" ")[1];
		if (status !== "101") throw new Error(`WebSocket handshake failed: ${lines[0]}`);
		const resHeaders = {};
		for (const line of lines.slice(1)) {
			const i = line.indexOf(":");
			if (i > 0) resHeaders[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
		}
		onopen(resHeaders["sec-websocket-protocol"] || "");
		return { reader, rest: buf.subarray(end) };
	})();

	opened.then(async ({ reader, rest }) => {
		let buf = rest;
		let fragments = [];
		let fragOpcode = 0;
		for (;;) {
			// Parse every complete frame in the buffer.
			for (;;) {
				if (buf.length < 2) break;
				const fin = (buf[0] & 0x80) !== 0;
				const opcode = buf[0] & 0x0f;
				const masked = (buf[1] & 0x80) !== 0;
				let len = buf[1] & 0x7f;
				let off = 2;
				if (len === 126) {
					if (buf.length < 4) break;
					len = (buf[2] << 8) | buf[3];
					off = 4;
				} else if (len === 127) {
					if (buf.length < 10) break;
					len = Number(new DataView(buf.buffer, buf.byteOffset + 2, 8).getBigUint64(0));
					off = 10;
				}
				const maskAt = off;
				if (masked) off += 4;
				if (buf.length < off + len) break;
				let payload = buf.slice(off, off + len);
				if (masked) for (let i = 0; i < len; i++) payload[i] ^= buf[maskAt + (i & 3)];
				buf = buf.subarray(off + len);

				if (opcode === 0x8) {
					// Close: echo it if we didn't start it, then report.
					const code = payload.length >= 2 ? (payload[0] << 8) | payload[1] : 1005;
					const reason = payload.length > 2 ? dec.decode(payload.subarray(2)) : "";
					if (!sentClose) {
						sentClose = true;
						await write(frame(0x8, payload.subarray(0, 2)));
					}
					return finish(code, reason);
				} else if (opcode === 0x9) {
					write(frame(0xa, payload)); // ping -> pong
				} else if (opcode === 0xa) {
					// pong: nothing to do
				} else {
					if (opcode !== 0x0) {
						fragOpcode = opcode;
						fragments = [];
					}
					fragments.push(payload);
					if (fin) {
						const data = fragments.length === 1 ? fragments[0] : fragments.reduce(concat, new Uint8Array(0));
						fragments = [];
						if (fragOpcode === 0x1) onmessage(dec.decode(data));
						else onmessage(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
					}
				}
			}
			const { value, done } = await reader.read();
			if (done) return finish(sentClose ? 1000 : 1006, "");
			buf = concat(buf, value);
		}
	}).catch(fail);

	return [
		async data => {
			await opened;
			if (closed || sentClose) return;
			if (data instanceof Blob) data = await data.arrayBuffer();
			if (typeof data === "string") return write(frame(0x1, enc.encode(data)));
			const bytes = ArrayBuffer.isView(data) ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength) : new Uint8Array(data);
			return write(frame(0x2, bytes));
		},
		async (code, reason) => {
			try { await opened; } catch { return; }
			if (closed || sentClose) return;
			sentClose = true;
			const r = enc.encode(reason || "");
			const payload = new Uint8Array(code ? 2 + r.length : 0);
			if (code) {
				payload[0] = code >> 8;
				payload[1] = code & 255;
				payload.set(r, 2);
			}
			await write(frame(0x8, payload));
			setTimeout(() => finish(code || 1005, reason || ""), 5000); // server should answer first
		},
	];
}

export default class NoswEpoxyTransport {
	ready = false;
	client = null;

	constructor(opts) {
		this.opts = opts;
		this.wisp = opts.wisp;
	}

	async init() {
		await initEpoxy();
		const options = new EpoxyClientOptions();
		options.user_agent = navigator.userAgent;
		for (const key of OPTION_KEYS) if (this.opts[key] != null) options[key] = this.opts[key];
		this.client = new EpoxyClient(this.wisp, options);
		this.ready = true;
	}

	async meta() {}

	async request(remote, method, body, headers, signal) {
		if (body instanceof Blob) body = await body.arrayBuffer();
		const res = await this.client.fetch(remote.href, { method, body, headers, redirect: "manual" });
		return { body: res.body, headers: res.rawHeaders, status: res.status, statusText: res.statusText };
	}

	connect(url, protocols, requestHeaders, onopen, onmessage, onclose, onerror) {
		return websocket(this.client, url, protocols, requestHeaders, onopen, onmessage, onclose, onerror);
	}
}
