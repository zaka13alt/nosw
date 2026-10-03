"use strict";
/*
 * Page-side replacement for the former service worker.
 *
 * Runs only in the top-level shell page (index.html). Proxied documents live in
 * blob: iframes below the shell and call into this object (see Q3wR8.js), so
 * every network request, cookie write and blob URL is owned by one long-lived
 * realm (blob URLs die with the document that created them).
 */
(() => {
	if (self.u22Loader) return;

	const u2 = self.u2;
	const config = self.__u22$config;
	if (!u2 || !config) throw new Error("u22-loader: u2 and __u22$config must be loaded first");

	// Same list the service worker removed from upstream responses.
	const STRIP_HEADERS = [
		"cross-origin-embedder-policy",
		"cross-origin-opener-policy",
		"cross-origin-resource-policy",
		"content-security-policy",
		"content-security-policy-report-only",
		"expect-ct",
		"feature-policy",
		"origin-isolation",
		"strict-transport-security",
		"upgrade-insecure-requests",
		"x-content-type-options",
		"x-download-options",
		"x-frame-options",
		"x-permitted-cross-domain-policies",
		"x-powered-by",
		"x-xss-protection",
	];

	const ACCEPT = {
		document: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
		style: "text/css,*/*;q=0.1",
		image: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
		script: "*/*",
	};

	const NO_REWRITE = /^(#|about:|data:|blob:|javascript:|mailto:|tel:)/i;
	const MAX_CSS_DEPTH = 4;
	const FETCH_TIMEOUT_MS = 30000;

	const cookieChannel = typeof BroadcastChannel === "function" ? new BroadcastChannel("u22-cookies") : null;

	let transport = null;
	let dbPromise = null;

	const getTransport = () => (transport ||= config.transport ? config.transport() : new u2.meir2Client());

	function makeCtx(url) {
		const ctx = new u2(config);
		ctx.meta.origin = location.origin;
		ctx.meta.base = ctx.meta.url = new URL(url);
		return ctx;
	}

	const getDb = ctx => (dbPromise ||= ctx.cookie.db());

	const blobUrl = (data, type) => URL.createObjectURL(new Blob([data], { type }));

	const header = (headers, name) => {
		const v = headers[name];
		return Array.isArray(v) ? v[0] : v;
	};

	function decode(buffer, contentType) {
		let label = /charset=["']?([^;"'\s]+)/i.exec(contentType || "")?.[1];
		if (!label) {
			const head = new TextDecoder("latin1").decode(buffer.slice(0, 2048));
			label = /<meta[^>]+charset=["']?\s*([\w-]+)/i.exec(head)?.[1];
		}
		try {
			return new TextDecoder(label || "utf-8").decode(buffer);
		} catch {
			return new TextDecoder("utf-8").decode(buffer);
		}
	}

	const jsonForScript = value => JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028|\u2029/g, " ");

	const withTimeout = (promise, ms, what) =>
		Promise.race([
			promise,
			new Promise((_, reject) => setTimeout(() => reject(new Error(`Timed out: ${what}`)), ms)),
		]);

	/*
	 * Cookie jar + headers + transport: everything the service worker did around
	 * the raw fetch. Returns the decoded upstream response.
	 */
	async function request(url, options = {}) {
		const target = new URL(url);
		if (target.protocol !== "http:" && target.protocol !== "https:")
			throw new TypeError(`Unsupported protocol: ${target.protocol}`);

		const method = (options.method || "GET").toUpperCase();
		const ctx = makeCtx(target.href);
		const db = await getDb(ctx);
		const cookies = (await ctx.cookie.getCookies(db)) || [];

		const headers = {};
		for (const [key, value] of Object.entries(options.headers || {})) headers[key.toLowerCase()] = value;

		const cookieHeader = ctx.cookie.serialize(cookies, ctx.meta, false);
		if (cookieHeader) headers.cookie = cookieHeader;
		headers["user-agent"] = navigator.userAgent;
		headers["accept-language"] ||= (navigator.languages || [navigator.language]).join(",");
		headers.accept ||= ACCEPT[options.destination] || "*/*";

		if (options.referrer && /^https?:/i.test(options.referrer)) {
			const referrer = new URL(options.referrer);
			headers.referer = referrer.href;
			const unsafe = method !== "GET" && method !== "HEAD";
			if (!headers.origin && (unsafe || (options.mode === "cors" && referrer.origin !== target.origin)))
				headers.origin = referrer.origin;
		}

		const hasBody = method !== "GET" && method !== "HEAD" && options.body != null;
		const res = await withTimeout(
			getTransport().fetch(target.href, {
				headers,
				method,
				body: hasBody ? options.body : undefined,
				credentials: "omit",
				mode: "same-origin",
				cache: options.cache || "default",
				redirect: options.redirect || "follow",
			}),
			FETCH_TIMEOUT_MS,
			target.href,
		);

		const finalUrl = res.finalURL || target.href;
		const raw = {};
		for (const [key, value] of Object.entries(res.rawHeaders || {})) raw[key.toLowerCase()] = value;
		for (const name of STRIP_HEADERS) delete raw[name];

		const setCookie = raw["set-cookie"];
		delete raw["set-cookie"];
		if (setCookie) {
			// Cookies belong to the host that answered, which differs after redirects.
			ctx.meta.base = ctx.meta.url = new URL(finalUrl);
			await ctx.cookie.setCookies(setCookie, db, ctx.meta);
			cookieChannel?.postMessage(finalUrl);
		}

		const body = [204, 205, 304].includes(res.status) ? new ArrayBuffer(0) : await res.arrayBuffer();
		return { status: res.status, statusText: res.statusText, headers: raw, body, finalUrl, ctx };
	}

	/* ---------- CSS: fetch every dependency, embed as blob: URLs ---------- */

	async function asyncReplace(input, regex, replacer) {
		const matches = [...input.matchAll(regex)];
		const results = await Promise.all(matches.map(match => replacer(match)));
		let out = "";
		let last = 0;
		matches.forEach((match, i) => {
			out += input.slice(last, match.index) + results[i];
			last = match.index + match[0].length;
		});
		return out + input.slice(last);
	}

	const cached = new Map();
	function once(key, make) {
		let promise = cached.get(key);
		if (!promise) {
			promise = make();
			cached.set(key, promise);
			promise.catch(() => cached.delete(key));
		}
		return promise;
	}

	function resourceBlob(url, referrer, destination = "") {
		return once(`r:${url}`, async () => {
			const res = await request(url, { referrer, destination, mode: "no-cors" });
			if (res.status >= 400) throw new Error(`HTTP ${res.status} for ${url}`);
			return blobUrl(res.body, header(res.headers, "content-type") || "application/octet-stream");
		});
	}

	async function inlineCss(css, baseUrl, referrer, depth = 0) {
		const importRe = /@import\s+(?:url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))\s*\)|"([^"]*)"|'([^']*)')\s*([^;]*);?/gi;
		const urlRe = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))\s*\)/gi;

		css = await asyncReplace(css, importRe, async match => {
			const raw = match[1] ?? match[2] ?? match[3] ?? match[4] ?? match[5];
			const media = (match[6] || "").trim();
			if (!raw || depth >= MAX_CSS_DEPTH || NO_REWRITE.test(raw)) return "";
			try {
				const abs = new URL(raw, baseUrl).href;
				const res = await request(abs, { referrer, destination: "style", mode: "no-cors" });
				if (res.status >= 400) return "";
				const nested = await inlineCss(decode(res.body, header(res.headers, "content-type")), res.finalUrl, referrer, depth + 1);
				return media ? `@media ${media}{${nested}}` : nested;
			} catch {
				return "";
			}
		});

		return asyncReplace(css, urlRe, async match => {
			const raw = (match[1] ?? match[2] ?? match[3] ?? "").trim();
			if (!raw || raw[0] === "#" || /^(data:|blob:|about:)/i.test(raw)) return match[0];
			try {
				return `url("${await resourceBlob(new URL(raw, baseUrl).href, referrer, "image")}")`;
			} catch {
				return 'url("data:,")';
			}
		});
	}

	function styleBlob(url, referrer) {
		return once(`c:${url}`, async () => {
			const res = await request(url, { referrer, destination: "style", mode: "no-cors" });
			if (res.status >= 400) throw new Error(`HTTP ${res.status} for ${url}`);
			const css = await inlineCss(decode(res.body, header(res.headers, "content-type")), res.finalUrl, referrer);
			return blobUrl(css, "text/css");
		});
	}

	function scriptBlob(url, referrer) {
		return once(`s:${url}`, async () => {
			const res = await request(url, { referrer, destination: "script", mode: "no-cors" });
			if (res.status >= 400) throw new Error(`HTTP ${res.status} for ${url}`);
			const source = decode(res.body, header(res.headers, "content-type"));
			return blobUrl(res.ctx.rewriteJS(source), "text/javascript");
		});
	}

	/* ---------- Documents ---------- */

	function walk(node, visit) {
		visit(node);
		for (const child of node.childNodes || []) walk(child, visit);
		if (node.content) walk(node.content, visit);
	}

	const attr = (node, name) => (node.attrs || []).find(a => a.name === name)?.value;

	// Finds resources that must exist before the page runs so ordering is preserved.
	function collectBlocking(ctx, html, pageUrl) {
		const tree = ctx.html.constructor.parse(html);
		let base = new URL(pageUrl);
		let baseSeen = false;
		const scripts = new Set();
		const styles = new Set();
		const styleTexts = new Set();
		const resolve = raw => {
			if (!raw || NO_REWRITE.test(raw.trim())) return null;
			try {
				return new URL(raw.trim(), base).href;
			} catch {
				return null;
			}
		};

		walk(tree, node => {
			const tag = node.tagName;
			if (!tag) return;
			if (tag === "base" && !baseSeen && attr(node, "href") != null) {
				baseSeen = true;
				try {
					base = new URL(attr(node, "href"), pageUrl);
				} catch {}
			} else if (tag === "script") {
				const src = attr(node, "src");
				const type = (attr(node, "type") || "").trim().toLowerCase();
				if (src && type !== "module" && attr(node, "nomodule") == null && resolve(src)) scripts.add(resolve(src));
			} else if (tag === "link") {
				const rel = (attr(node, "rel") || "").toLowerCase().split(/\s+/);
				const abs = rel.includes("stylesheet") && resolve(attr(node, "href"));
				if (abs) styles.add(abs);
			} else if (tag === "style") {
				const text = (node.childNodes || []).map(child => child.value || "").join("");
				if (/url\(|@import/i.test(text)) styleTexts.add(text);
			}
		});

		return { scripts, styles, styleTexts, resolve, getBase: () => base };
	}

	async function resolveBlocking(ctx, html, pageUrl, referrer) {
		const found = collectBlocking(ctx, html, pageUrl);
		const resolved = { resolve: found.resolve, scripts: {}, styles: {}, css: {} };
		const settle = (set, store, make) =>
			[...set].map(async key => {
				try {
					store[key] = await make(key);
				} catch (error) {
					console.warn("[u22] could not preload", key, error);
				}
			});

		await Promise.all([
			...settle(found.scripts, resolved.scripts, url => scriptBlob(url, referrer)),
			...settle(found.styles, resolved.styles, url => styleBlob(url, referrer)),
			...settle(found.styleTexts, resolved.css, text => inlineCss(text, found.getBase().href, referrer)),
		]);
		return resolved;
	}

	function headNodes(finalUrl, cookies, referrer) {
		const script = (attrs, text) => ({
			tagName: "script",
			nodeName: "script",
			childNodes: text ? [{ nodeName: "#text", value: text }] : [],
			attrs: Object.entries({ "__u22-script": "1", ...attrs }).map(([name, value]) => ({ name, value, skip: true })),
			skip: true,
		});
		const asset = path => (/^[a-z][a-z\d+.-]*:/i.test(path) ? path : location.origin + (path.startsWith("/") ? "" : "/") + path);
		return [
			script({}, `self.__u22$cookies=${jsonForScript(cookies)};self.__u22$referrer=${jsonForScript(referrer)};self.__u22$url=${jsonForScript(finalUrl)};`),
			script({ src: asset(config.bundle) }),
			script({ src: asset(config.client) }),
			script({ src: asset(config.config) }),
			script({ src: asset(config.handler) }),
		];
	}

	function errorPage(error, url) {
		const esc = text => String(text).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
		return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Error</title>
<style>body{font:16px system-ui,sans-serif;margin:2rem;color:#222;background:#fff}pre{background:#f4f4f4;padding:1rem;white-space:pre-wrap}</style></head>
<body><h1>Error processing your request</h1><p>Failed to load <b>${esc(url)}</b></p><pre>${esc(error && error.stack ? error.stack : error)}</pre>
<button onclick="history.back()">Back</button></body></html>`;
	}

	async function loadDocument(url, options = {}) {
		const referrer = options.referrer || "";
		let res;
		try {
			res = await request(url, {
				method: options.method,
				headers: options.headers,
				body: options.body,
				referrer,
				destination: "document",
				mode: "navigate",
			});
		} catch (error) {
			console.error("[u22] navigation failed", error);
			return { kind: "html", url: blobUrl(errorPage(error, url), "text/html;charset=utf-8"), finalUrl: url, status: 502 };
		}

		const requested = new URL(url);
		const final = new URL(res.finalUrl);
		if (!final.hash && requested.hash) final.hash = requested.hash;
		const contentType = (header(res.headers, "content-type") || "").toLowerCase();

		if (res.status === 204 || res.status === 205) return { kind: "none", finalUrl: final.href, status: res.status };

		const disposition = header(res.headers, "content-disposition") || "";
		if (/^\s*attachment/i.test(disposition)) {
			const filename = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition)?.[1];
			return { kind: "download", url: blobUrl(res.body, contentType || "application/octet-stream"), filename: filename ? decodeURIComponent(filename) : "download", finalUrl: final.href };
		}

		const sniffedHtml = !contentType && /^\s*(<!doctype html|<html)/i.test(decode(res.body.slice(0, 256), ""));
		if (!/html|xhtml/.test(contentType) && !sniffedHtml)
			return { kind: "blob", url: blobUrl(res.body, contentType || "application/octet-stream"), finalUrl: final.href, status: res.status };

		const ctx = makeCtx(final.href);
		const text = decode(res.body, contentType);
		const resolved = await resolveBlocking(ctx, text, final.href, final.href).catch(error => {
			console.warn("[u22] preload failed", error);
			return null;
		});

		const db = await getDb(ctx);
		const cookies = ctx.cookie.serialize((await ctx.cookie.getCookies(db)) || [], ctx.meta, true);
		const html = ctx.rewriteHtml(text, {
			document: true,
			_7b2PqHead: headNodes(final.href, cookies, referrer),
			u22Resolved: resolved || undefined,
		});
		return { kind: "html", url: blobUrl(html, "text/html;charset=utf-8"), finalUrl: final.href, status: res.status };
	}

	
	async function fetchProxy(url, init = {}) {
		const res = await request(url, {
			method: init.method,
			headers: init.headers,
			body: init.body,
			referrer: init.referrer,
			redirect: init.redirect,
			cache: init.cache,
			mode: init.mode,
			destination: "",
		});
		const headers = [];
		for (const [key, value] of Object.entries(res.headers))
			for (const v of Array.isArray(value) ? value : [value]) headers.push([key, String(v)]);
		return {
			status: res.status,
			statusText: res.statusText,
			headers,
			body: res.body,
			url: res.finalUrl,
			redirected: res.finalUrl !== new URL(url).href,
		};
	}

	// Used by the runtime to lazily resolve <img src>, <iframe src>, dynamic scripts, etc.
	async function resource(url, kind, referrer) {
		switch (kind) {
			case "script":
				return scriptBlob(url, referrer);
			case "style":
				return styleBlob(url, referrer);
			case "document": {
				const doc = await loadDocument(url, { referrer });
				return doc.url || "about:blank";
			}
			default:
				return resourceBlob(url, referrer, kind === "image" ? "image" : "");
		}
	}

	async function navigate(iframe, url) {
		const doc = await loadDocument(url, { referrer: "" });
		if (doc.kind === "none") return doc;
		if (doc.kind === "download") return download(doc);
		iframe.src = doc.url;
		return doc;
	}

	function download(doc) {
		const link = document.createElement("a");
		link.href = doc.url;
		link.download = doc.filename || "download";
		document.body.append(link);
		link.click();
		link.remove();
		return doc;
	}

	self.__u22Shell = true;
	self.u22Loader = { loadDocument, fetchProxy, resource, navigate, download, request, inlineCss, transport: getTransport };
})();
