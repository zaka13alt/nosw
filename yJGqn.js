self.__u22$config = {
	handler: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/cS2YW.js",
	client: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/H685r.js",
	bundle: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/xjAbB.js",
	config: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/yJGqn.js",
	loader: "https://cdn.jsdelivr.net/gh/zaka13alt/nosw@main/AmhtP.js",

	
	rewriteUrl(url) {
		url = String(url).trim();
		if (url.startsWith("javascript:")) return "javascript:" + this.js.rewrite(url.slice(11));
		return !url || /^(#|about:|data:|blob:|mailto:|tel:)/i.test(url) ? url : "data:,";
	},
	sourceUrl(url) {
		return url;
	},
};
