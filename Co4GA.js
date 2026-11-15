self.__u22$config = {
	handler: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/StlHE.js",
	client: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/DcKuT.js",
	bundle: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/HUMyZ.js",
	config: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/Co4GA.js",
	loader: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/bQtBk.js",

	
	rewriteUrl(url) {
		url = String(url).trim();
		if (url.startsWith("javascript:")) return "javascript:" + this.js.rewrite(url.slice(11));
		return !url || /^(#|about:|data:|blob:|mailto:|tel:)/i.test(url) ? url : "data:,";
	},
	sourceUrl(url) {
		return url;
	},
};
