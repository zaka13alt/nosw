self.__u22$config = {
	handler: "/Q3wR8.js",
	client: "/5j8hx.js",
	bundle: "/8b3rt.js",
	config: "/pGJxh.js",
	loader: "/load.js",

	
	rewriteUrl(url) {
		url = String(url).trim();
		if (url.startsWith("javascript:")) return "javascript:" + this.js.rewrite(url.slice(11));
		return !url || /^(#|about:|data:|blob:|mailto:|tel:)/i.test(url) ? url : "data:,";
	},
	sourceUrl(url) {
		return url;
	},
};
