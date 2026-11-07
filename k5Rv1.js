self.__u22$config = {
	handler: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/h2Vx6.js",
	client: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/c4Nw9.js",
	bundle: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/b9Wd4.js",
	config: "https://gcore.jsdelivr.net/gh/zaka13alt/nosw@main/k5Rv1.js",
	loader: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/n6Qb2.js",

	
	rewriteUrl(url) {
		url = String(url).trim();
		if (url.startsWith("javascript:")) return "javascript:" + this.js.rewrite(url.slice(11));
		return !url || /^(#|about:|data:|blob:|mailto:|tel:)/i.test(url) ? url : "data:,";
	},
	sourceUrl(url) {
		return url;
	},
};
