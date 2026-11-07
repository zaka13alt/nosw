self.__u22$config = {
	handler: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/q7Bz5.js",
	client: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/f6Yp2.js",
	bundle: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/k2Rj7.js",
	config: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/c7Lw2.js",
	loader: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/y4Pd8.js",

	
	rewriteUrl(url) {
		url = String(url).trim();
		if (url.startsWith("javascript:")) return "javascript:" + this.js.rewrite(url.slice(11));
		return !url || /^(#|about:|data:|blob:|mailto:|tel:)/i.test(url) ? url : "data:,";
	},
	sourceUrl(url) {
		return url;
	},
};
