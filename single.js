self.__u22$config = {
	handler: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/Q3wR8.js",
	client: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/5j8hx.js",
	bundle: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/8b3rt.js",
	config: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/single.js",
	loader: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/load.js",

	
	rewriteUrl(url) {
		url = String(url).trim();
		if (url.startsWith("javascript:")) return "javascript:" + this.js.rewrite(url.slice(11));
		return !url || /^(#|about:|data:|blob:|mailto:|tel:)/i.test(url) ? url : "data:,";
	},
	sourceUrl(url) {
		return url;
	},
};
