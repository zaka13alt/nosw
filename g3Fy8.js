// Paths resolve against this script's own URL (not the site root), so the build
// works from a subfolder and from file://.
const __u22base = self.document && document.currentScript && document.currentScript.src ? new URL(".", document.currentScript.src).href : "";
self.__u22$config = {
	handler: __u22base + "h2Vx6.js",
	client: __u22base + "c4Nw9.js",
	bundle: __u22base + "r7Kq2.js",
	config: __u22base + "g3Fy8.js",
	loader: __u22base + "l5Pj7.js",

	
	rewriteUrl(url) {
		url = String(url).trim();
		if (url.startsWith("javascript:")) return "javascript:" + this.js.rewrite(url.slice(11));
		return !url || /^(#|about:|data:|blob:|mailto:|tel:)/i.test(url) ? url : "data:,";
	},
	sourceUrl(url) {
		return url;
	},
};
