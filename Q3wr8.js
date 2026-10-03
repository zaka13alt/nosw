"use strict";
(() => {
 var m = self.u2,
  W = self.u22Client,
  A = self.__u22$config,
  k = self.__u22$cookies;
 if (typeof k != "string") throw new TypeError("Unable to load global u22 data");
 self.__u22 || p(self);
 self.__u22Hook = p;
 function p(o) {
  if ("__u22" in o) return !1;
  o.document && o.window && o.document.querySelectorAll("script[__u22-script]").forEach(t => t.remove());
  let h = !o.window,
   b = "__u22",
   i = "__u22$",
   e = new m(A),
   c;
  h ? c = new m.meir2Client(new Promise(t => {
   addEventListener("message", ({
    data: r
   }) => {
    typeof r == "object" && "__u22$type" in r && r.__u22$type === "meir2muxinit" && t(r.port)
   })
  })) : c = {
   createWebSocket: (...r) => u22Loader().transport().createWebSocket(...r)
  };
  var V = null;
  let a = new W(o, c, h),
   {
    HTMLMediaElement: g,
    HTMLScriptElement: y,
    HTMLAudioElement: M,
    HTMLVideoElement: j,
    HTMLInputElement: v,
    HTMLEmbedElement: H,
    HTMLTrackElement: x,
    HTMLAnchorElement: L,
    HTMLIFrameElement: n,
    HTMLAreaElement: O,
    HTMLLinkElement: T,
    HTMLBaseElement: E,
    HTMLFormElement: $,
    HTMLImageElement: _,
    HTMLSourceElement: S
   } = o;
  a.nativeMethods.defineProperty(o, "__u22", {
   value: e,
   enumerable: !1
  }), e.meta.origin = location.origin, V = u22InitState(), e.location = a.location.emulate(t => new URL(V.url), (t, r) => u22LocationAssign(t, r));
  let u = k;
  if (e.meta.url = e.location, e.domain = e.meta.url.host, e.blobUrls = new o.Map, e.referrer = typeof o.__u22$referrer === "string" ? o.__u22$referrer : "", e.cookies = [], e.localStorageObj = {}, e.sessionStorageObj = {},  o.EventTarget && (e.addEventListener = o.EventTarget.prototype.addEventListener, e.removeListener = o.EventTarget.prototype.removeListener, e.dispatchEvent = o.EventTarget.prototype.dispatchEvent), a.nativeMethods.defineProperty(a.storage.storeProto, "__u22$storageObj", {
    get() {
     if (this === a.storage.sessionStorage) return e.sessionStorageObj;
     if (this === a.storage.localStorage) return e.localStorageObj
    },
    enumerable: !1
   }), o.localStorage) {
   for (let t in o.localStorage) t.startsWith(i + e.location.origin + "@") && (e.localStorageObj[t.slice((i + e.location.origin + "@").length)] = o.localStorage.getItem(t));
   e.lsWrap = a.storage.emulate(a.storage.localStorage, e.localStorageObj)
  }
  if (o.sessionStorage) {
   for (let t in o.sessionStorage) t.startsWith(i + e.location.origin + "@") && (e.sessionStorageObj[t.slice((i + e.location.origin + "@").length)] = o.sessionStorage.getItem(t));
   e.ssWrap = a.storage.emulate(a.storage.sessionStorage, e.sessionStorageObj)
  }
  a.nativeMethods.defineProperty(e.meta, "base", {
   get() {
    return u22Base()
   },
   set(t) {}
  }), e.methods = {
   setSource: i + "setSource",
   source: i + "source",
   location: i + "location",
   function: i + "function",
   string: i + "string",
   eval: i + "eval",
   parent: i + "parent",
   top: i + "top"
  }, e.filterKeys = [b, e.methods.setSource, e.methods.source, e.methods.location, e.methods.function, e.methods.string, e.methods.eval, e.methods.parent, e.methods.top, i + "protocol", i + "storageObj", i + "url", i + "modifiedStyle", i + "config", i + "dispatched", "u2", "__u22Hook"], a.on("wrap", (t, r) => {
   a.nativeMethods.defineProperty(r, "name", a.nativeMethods.getOwnPropertyDescriptor(t, "name")), a.nativeMethods.defineProperty(r, "length", a.nativeMethods.getOwnPropertyDescriptor(t, "length")), a.nativeMethods.defineProperty(r, e.methods.string, {
    enumerable: !1,
    value: a.nativeMethods.fnToString.call(t)
   }), a.nativeMethods.defineProperty(r, e.methods.function, {
    enumerable: !1,
    value: t
   })
  }), a.fetch.on("request", t => {
   t.data.input = u22AbsInput(t.data.input)
  }), a.fetch.on("requestUrl", t => {
   t.data.value = e.sourceUrl(t.data.value)
  }), a.fetch.on("responseUrl", t => {
   t.data.value = e.sourceUrl(t.data.value)
  }), a.xhr.on("open", t => {
   t.data.input = u22AbsInput(t.data.input)
  }), a.xhr.on("responseUrl", t => {
   t.data.value = e.sourceUrl(t.data.value)
  }), a.workers.on("worker", t => {
   t.data.url = e.rewriteUrl(t.data.url)
  }), a.workers.on("addModule", t => {
   t.data.url = e.rewriteUrl(t.data.url)
  }), a.workers.on("importScripts", t => {
   for (let r in t.data.scripts) t.data.scripts[r] = e.rewriteUrl(t.data.scripts[r])
  }), a.workers.on("postMessage", t => {
   let r = t.data.origin;
   t.data.origin = "*", t.data.message = {
    __data: t.data.message,
    __origin: e.meta.url.origin,
    __to: r
   }
  }), a.navigator.on("sendBeacon", t => {
   t.respondWith(u22Beacon(t.data.url, t.data.data))
  }), a.document.on("getCookie", t => {
   t.data.value = u
  }), a.document.on("setCookie", t => {
   e.cookie.db().then(l => {
    e.cookie.setCookies(t.data.value, l, e.meta), e.cookie.getCookies(l).then(s => {
     u = e.cookie.serialize(s, e.meta, !0)
    })
   });
   let r = e.cookie.setCookie(t.data.value)[0];
   r.path || (r.path = "/"), r.domain || (r.domain = e.meta.url.hostname), e.cookie.validateCookie(r, e.meta, !0) && (u.length && (u += "; "), u += `${r.name}=${r.value}`), t.respondWith(t.data.value)
  }), a.element.on("setInnerHTML", t => {
   switch (t.that.tagName) {
    case "SCRIPT":
     t.data.value = e.js.rewrite(t.data.value);
     break;
    case "STYLE":
     t.data.value = e.rewriteCSS(t.data.value);
     break;
    default:
     t.data.value = e.rewriteHtml(t.data.value)
   }
  }), a.element.on("getInnerHTML", t => {
   switch (t.that.tagName) {
    case "SCRIPT":
     t.data.value = e.js.source(t.data.value);
     break;
    case "STYLE":
     t.data.value = e.sourceCSS(t.data.value);
     break;
    default:
     t.data.value = e.sourceHtml(t.data.value)
   }
  }), a.element.on("setOuterHTML", t => {
   t.data.value = e.rewriteHtml(t.data.value, {
    document: t.that.tagName === "HTML"
   })
  }), a.element.on("getOuterHTML", t => {
   switch (t.that.tagName) {
    case "HEAD":
     t.data.value = e.sourceHtml(t.data.value.replace(/<head(.*)>(.*)<\/head>/s, "<op-head$1>$2</op-head>")).replace(/<op-head(.*)>(.*)<\/op-head>/s, "<head$1>$2</head>");
     break;
    case "BODY":
     t.data.value = e.sourceHtml(t.data.value.replace(/<body(.*)>(.*)<\/body>/s, "<op-body$1>$2</op-body>")).replace(/<op-body(.*)>(.*)<\/op-body>/s, "<body$1>$2</body>");
     break;
    default:
     t.data.value = e.sourceHtml(t.data.value, {
      document: t.that.tagName === "HTML"
     });
     break
   }
  }), a.document.on("write", t => {
   if (!t.data.html.length) return !1;
   t.data.html = [e.rewriteHtml(t.data.html.join(""))]
  }), a.document.on("writeln", t => {
   if (!t.data.html.length) return !1;
   t.data.html = [e.rewriteHtml(t.data.html.join(""))]
  }), a.element.on("insertAdjacentHTML", t => {
   t.data.html = e.rewriteHtml(t.data.html)
  }), a.eventSource.on("construct", t => {
   t.data.url = e.rewriteUrl(t.data.url)
  }), a.eventSource.on("url", t => {
   t.data.url = e.rewriteUrl(t.data.url)
  }), a.idb.on("idbFactoryOpen", t => {
   t.data.name !== "__op" && (t.data.name = `${e.meta.url.origin}@${t.data.name}`)
  }), a.idb.on("idbFactoryName", t => {
   t.data.value = t.data.value.slice(e.meta.url.origin.length + 1)
  }), a.history.on("replaceState", t => {
   t.respondWith(u22HistoryWrite("replace", t.data.state, t.data.title, t.data.url))
  }), a.history.on("pushState", t => {
   t.respondWith(u22HistoryWrite("push", t.data.state, t.data.title, t.data.url))
  }), a.element.on("getAttribute", t => {
   a.element.hasAttribute.call(t.that, e.attributePrefix + "-attr-" + t.data.name) && t.respondWith(t.target.call(t.that, e.attributePrefix + "-attr-" + t.data.name))
  }), a.message.on("postMessage", t => {
   let r = t.data.origin,
    l = e.call;
   t.that && (l = t.that.__u22$source.call), t.data.origin = "*", t.data.message = {
    __data: t.data.message,
    __origin: (t.that || t.target).__u22$source.location.origin,
    __to: r
   }, t.respondWith(h ? l(t.target, [t.data.message, t.data.transfer], t.that) : l(t.target, [t.data.message, t.data.origin, t.data.transfer], t.that))
  }), a.message.on("data", t => {
   let {
    value: r
   } = t.data;
   typeof r == "object" && "__data" in r && "__origin" in r && t.respondWith(r.__data)
  }), a.message.on("origin", t => {
   let r = a.message.messageData.get.call(t.that);
   typeof r == "object" && r.__data && r.__origin && t.respondWith(r.__origin)
  }), a.overrideDescriptor(o, "origin", {
   get: () => e.location.origin
  }), a.node.on("baseURI", t => {
   t.data.value = u22Base()
  }), a.element.on("setAttribute", t => {
   {
    let lower = String(t.data.name).toLowerCase();
    if (u22IsUrlAttr(t.that, lower) || e.attrs.isSrcset(lower)) return u22SetUrlAttr(t.that, lower, t.data.value), t.respondWith(void 0)
   }
   e.attrs.isStyle(t.data.name) && (t.target.call(t.that, e.attributePrefix + "-attr-" + t.data.name, t.data.value), t.data.value = e.rewriteCSS(t.data.value, {
    context: "declarationList"
   })), e.attrs.isHtml(t.data.name) && (t.target.call(t.that, e.attributePrefix + "-attr-" + t.data.name, t.data.value), t.data.value = e.rewriteHtml(t.data.value, {
    ...e.meta,
    document: !0,
    _7b2PqHead: u22HeadNodes()
   })), e.attrs.isForbidden(t.data.name) && (t.data.name = e.attributePrefix + "-attr-" + t.data.name)
  }), a.element.on("audio", t => {
   let r = new t.target;
   r.src = t.data.url, t.respondWith(r)
  }), a.element.hookProperty([L, O, T, E], "href", {
   get: (t, r) => u22UrlProp(t, r, "href"),
   set: (t, r, [l]) => u22SetUrlAttr(r, "href", l)
  }), a.element.hookProperty([y, M, j, g, _, v, H, n, x, S], "src", {
   get: (t, r) => u22UrlProp(t, r, "src"),
   set: (t, r, [l]) => u22SetUrlAttr(r, "src", l)
  }), a.element.hookProperty([$], "action", {
   get: (t, r) => u22UrlProp(t, r, "action"),
   set: (t, r, [l]) => u22SetUrlAttr(r, "action", l)
  }), a.element.hookProperty([_, S], "srcset", {
   get: (t, r) => a.element.getAttribute.call(r, e.attributePrefix + "-attr-srcset") || t.call(r),
   set: (t, r, [l]) => u22SetUrlAttr(r, "srcset", l)
  }), a.element.hookProperty(y, "integrity", {
   get: (t, r) => a.element.getAttribute.call(r, e.attributePrefix + "-attr-integrity"),
   set: (t, r, [l]) => {
    a.element.setAttribute.call(r, e.attributePrefix + "-attr-integrity", l)
   }
  }), a.element.hookProperty(n, "sandbox", {
   get: (t, r) => a.element.getAttribute.call(r, e.attributePrefix + "-attr-sandbox") || t.call(r),
   set: (t, r, [l]) => {
    a.element.setAttribute.call(r, e.attributePrefix + "-attr-sandbox", l)
   }
  });
  let C = n && Object.getOwnPropertyDescriptor(n.prototype, "contentWindow").get;

  function U(t) {
   let r = C.call(t);
   if (!r.__u22) try {
    p(r)
   } catch (l) {
    console.error("catastrophic failure"), console.error(l)
   }
  }
  if (a.element.hookProperty(n, "contentWindow", {
    get: (t, r) => (U(r), t.call(r))
   }), a.element.hookProperty(n, "contentDocument", {
    get: (t, r) => (U(r), t.call(r))
   }), a.element.hookProperty(n, "srcdoc", {
    get: (t, r) => a.element.getAttribute.call(r, e.attributePrefix + "-attr-srcdoc") || t.call(r),
    set: (t, r, [l]) => {
     t.call(r, e.rewriteHtml(l, {
      document: !0,
      _7b2PqHead: u22HeadNodes()
     }))
    }
   }), a.node.on("getTextContent", t => {
    switch (t.that.tagName) {
     case "SCRIPT":
      t.data.value = e.js.source(t.data.value);
      break;
     case "STYLE":
      t.data.value = e.sourceCSS(t.data.value);
      break;
     default:
    }
   }), a.node.on("setTextContent", t => {
    switch (t.that.tagName) {
     case "SCRIPT":
      t.data.value = e.js.rewrite(t.data.value);
      break;
     case "STYLE":
      t.data.value = e.rewriteCSS(t.data.value);
      break;
     default:
    }
   }), "serviceWorker" in o.navigator && delete o.Navigator.prototype.serviceWorker, a.document.on("getDomain", t => {
    t.data.value = e.domain
   }), a.document.on("setDomain", t => {
    if (!t.data.value.toString().endsWith(e.meta.url.hostname.split(".").slice(-2).join("."))) return t.respondWith("");
    t.respondWith(e.domain = t.data.value)
   }), a.document.on("url", t => {
    t.data.value = e.location.href
   }), a.document.on("documentURI", t => {
    t.data.value = e.location.href
   }), a.document.on("referrer", t => {
    t.data.value = e.referrer
   }), a.document.on("parseFromString", t => {
    if (t.data.type !== "text/html") return !1;
    t.data.string = e.rewriteHtml(t.data.string, {
     ...e.meta,
     document: !0
    })
   }), a.attribute.on("getValue", t => {
    a.element.hasAttribute.call(t.that.ownerElement, e.attributePrefix + "-attr-" + t.data.name) && (t.data.value = a.element.getAttribute.call(t.that.ownerElement, e.attributePrefix + "-attr-" + t.data.name))
   }), a.attribute.on("setValue", t => {
    {
     let lower = String(t.data.name).toLowerCase();
     if (u22IsUrlAttr(t.that.ownerElement, lower) || e.attrs.isSrcset(lower)) return u22SetUrlAttr(t.that.ownerElement, lower, t.data.value), t.respondWith(void 0)
    }
    e.attrs.isStyle(t.data.name) && (a.element.setAttribute.call(t.that.ownerElement, e.attributePrefix + "-attr-" + t.data.name, t.data.value), t.data.value = e.rewriteCSS(t.data.value, {
     context: "declarationList"
    })), e.attrs.isHtml(t.data.name) && (a.element.setAttribute.call(t.that.ownerElement, e.attributePrefix + "-attr-" + t.data.name, t.data.value), t.data.value = e.rewriteHtml(t.data.value, {
     ...e.meta,
     document: !0,
     _7b2PqHead: u22HeadNodes()
    }))
   }),  a.storage.on("get", t => {
    t.data.name = i + e.meta.url.origin + "@" + t.data.name
   }), a.storage.on("set", t => {
    t.that.__u22$storageObj && (t.that.__u22$storageObj[t.data.name] = t.data.value), t.data.name = i + e.meta.url.origin + "@" + t.data.name
   }), a.storage.on("delete", t => {
    t.that.__u22$storageObj && delete t.that.__u22$storageObj[t.data.name], t.data.name = i + e.meta.url.origin + "@" + t.data.name
   }), a.storage.on("getItem", t => {
    t.data.name = i + e.meta.url.origin + "@" + t.data.name
   }), a.storage.on("setItem", t => {
    t.that.__u22$storageObj && (t.that.__u22$storageObj[t.data.name] = t.data.value), t.data.name = i + e.meta.url.origin + "@" + t.data.name
   }), a.storage.on("removeItem", t => {
    t.that.__u22$storageObj && delete t.that.__u22$storageObj[t.data.name], t.data.name = i + e.meta.url.origin + "@" + t.data.name
   }), a.storage.on("clear", t => {
    if (t.that.__u22$storageObj)
     for (let r of a.nativeMethods.keys.call(null, t.that.__u22$storageObj)) delete t.that.__u22$storageObj[r], a.storage.removeItem.call(t.that, i + e.meta.url.origin + "@" + r), t.respondWith()
   }), a.storage.on("length", t => {
    t.that.__u22$storageObj && t.respondWith(a.nativeMethods.keys.call(null, t.that.__u22$storageObj).length)
   }), a.storage.on("key", t => {
    t.that.__u22$storageObj && t.respondWith(a.nativeMethods.keys.call(null, t.that.__u22$storageObj)[t.data?.index] || null)
   }), a.function.on("function", t => {
    t.data.script = e.rewriteJS(t.data.script)
   }), a.function.on("toString", t => {
    e.methods.string in t.that && t.respondWith(t.that[e.methods.string])
   }), a.object.on("getOwnPropertyNames", t => {
    t.data.names = t.data.names.filter(r => !e.filterKeys.includes(r))
   }), a.object.on("getOwnPropertyDescriptors", t => {
    for (let r of e.filterKeys) delete t.data.descriptors[r]
   }), a.style.on("setProperty", t => {
    a.style.dashedUrlProps.includes(t.data.property) && (t.data.value = e.rewriteCSS(t.data.value, {
     context: "value",
     ...e.meta
    }))
   }), a.style.on("getPropertyValue", t => {
    a.style.dashedUrlProps.includes(t.data.property) && t.respondWith(e.sourceCSS(t.target.call(t.that, t.data.property), {
     context: "value",
     ...e.meta
    }))
   }), "CSS2Properties" in o)
   for (let t of a.style.urlProps) a.overrideDescriptor(o.CSS2Properties.prototype, t, {
    get: (r, l) => e.sourceCSS(r.call(l), {
     context: "value",
     ...e.meta
    }),
    set: (r, l, s) => {
     r.call(l, e.rewriteCSS(s, {
      context: "value",
      ...e.meta
     }))
    }
   });
  else "HTMLElement" in o && a.overrideDescriptor(o.HTMLElement.prototype, "style", {
   get: (t, r) => {
    let l = t.call(r);
    if (!l[i + "modifiedStyle"])
     for (let s of a.style.urlProps) a.nativeMethods.defineProperty(l, s, {
      enumerable: !0,
      configurable: !0,
      get() {
       let f = a.style.getPropertyValue.call(this, s) || "";
       return e.sourceCSS(f, {
        context: "value",
        ...e.meta
       })
      },
      set(f) {
       a.style.setProperty.call(this, a.style.propToDashed[s] || s, e.rewriteCSS(f, {
        context: "value",
        ...e.meta
       }))
      }
     }), a.nativeMethods.defineProperty(l, i + "modifiedStyle", {
      enumerable: !1,
      value: !0
     });
    return l
   }
  });
  a.style.on("setCssText", t => {
   t.data.value = e.rewriteCSS(t.data.value, {
    context: "declarationList",
    ...e.meta
   })
  }), a.style.on("getCssText", t => {
   t.data.value = e.sourceCSS(t.data.value, {
    context: "declarationList",
    ...e.meta
   })
  }), e.addEventListener.call(o, "hashchange", t => {
   if (t.__u22$dispatched) return !1;
   t.stopImmediatePropagation()
  }), a.location.on("hashchange", (t, r, l) => {
   u22HashNavigate(r)
  }), a.fetch.overrideRequest(), a.fetch.overrideUrl(), a.xhr.overrideOpen(), a.xhr.overrideResponseUrl(), a.element.overrideHtml(), a.element.overrideAttribute(), a.element.overrideInsertAdjacentHTML(), a.element.overrideAudio(), a.node.overrideBaseURI(), a.node.overrideTextContent(), a.attribute.overrideNameValue(), a.document.overrideDomain(), a.document.overrideURL(), a.document.overrideDocumentURI(), a.document.overrideWrite(), a.document.overrideReferrer(), a.document.overrideParseFromString(), a.storage.overrideMethods(), a.storage.overrideLength(), a.object.overrideGetPropertyNames(), a.object.overrideGetOwnPropertyDescriptors(), a.idb.overrideName(), a.idb.overrideOpen(), a.history.overridePushState(), a.history.overrideReplaceState(), a.eventSource.overrideConstruct(), a.eventSource.overrideUrl(), a.websocket.overrideWebSocket(c), a.url.overrideObjectURL(), a.document.overrideCookie(), a.message.overridePostMessage(), a.message.overrideMessageOrigin(), a.message.overrideMessageData(), a.workers.overrideWorker(), a.workers.overrideAddModule(), a.workers.overrideImportScripts(), a.workers.overridePostMessage(), a.style.overrideSetGetProperty(), a.style.overrideCssText(), a.navigator.overrideSendBeacon(), a.function.overrideFunction(), a.function.overrideToString(), a.location.overrideWorkerLocation(t => new URL(e.sourceUrl(t))), a.overrideDescriptor(o, "localStorage", {
   get: (t, r) => (r || o).__u22.lsWrap
  }), a.overrideDescriptor(o, "sessionStorage", {
   get: (t, r) => (r || o).__u22.ssWrap
  }),  e.$wrap = function(t) {
   return t === "location" ? e.methods.location : t === "eval" ? e.methods.eval : t
  }, e.$get = function(t) {
   return t === o.location ? e.location : t === o.eval ? e.eval : t === o.parent ? o.__u22$parent : t === o.top ? o.__u22$top : t
  }, e.eval = a.wrap(o, "eval", (t, r, l) => {
   if (!l.length || typeof l[0] != "string") return t.apply(r, l);
   let [s] = l;
   return s = e.rewriteJS(s), t.call(r, s)
  }), e.call = function(t, r, l) {
   return l ? t.apply(l, r) : t(...r)
  }, e.call$ = function(t, r, l = []) {
   return t[r].apply(t, l)
  }, a.nativeMethods.defineProperty(o.Object.prototype, b, {
   get: () => e,
   enumerable: !1
  }), a.nativeMethods.defineProperty(o.Object.prototype, e.methods.setSource, {
   configurable: !0,
   value: function(t) {
    return a.nativeMethods.isExtensible(this) ? (a.nativeMethods.defineProperty(this, e.methods.source, {
     configurable: !0,
     value: t,
     writable: !0,
     enumerable: !1
    }), this) : this
   },
   enumerable: !1
  }), a.nativeMethods.defineProperty(o.Object.prototype, e.methods.source, {
   configurable: !0,
   value: e,
   writable: !0,
   enumerable: !1
  }), a.nativeMethods.defineProperty(o.Object.prototype, e.methods.location, {
   configurable: !0,
   get() {
    return this === o.document || this === o ? e.location : this.location
   },
   set(t) {
    this === o.document || this === o ? e.location.href = t : this.location = t
   }
  }), a.nativeMethods.defineProperty(o.Object.prototype, e.methods.parent, {
   configurable: !0,
   get() {
    let t = this.parent;
    if (this === o) try {
     return "__u22" in t ? t : this
    } catch {
     return this
    }
    return t
   },
   set(t) {
    this.parent = t
   }
  }), a.nativeMethods.defineProperty(o.Object.prototype, e.methods.top, {
   configurable: !0,
   get() {
    let t = this.top;
    if (this === o) {
     if (t === this.parent) return this[e.methods.parent];
     try {
      if ("__u22" in t) return t;
      {
       let r = this;
       for (; r.parent !== t;) r = r.parent;
       return "__u22" in r ? r : this
      }
     } catch {
      return this
     }
    }
    return t
   },
   set(t) {
    this.top = t
   }
  }), a.nativeMethods.defineProperty(o.Object.prototype, e.methods.eval, {
   configurable: !0,
   get() {
    return this === o ? e.eval : this.eval
   },
   set(t) {
    this.eval = t
   }
  })

  /* ===================== service-worker-free runtime ===================== */

  var U22_MARK = e.attributePrefix + "-attr-";
  var U22_LOCAL = /^\s*(#|data:|blob:|about:)/i;
  var u22ShellCache = null;

  // The shell page owns the transport, cookies and blob URLs; documents only talk to it.
  function u22FindShell() {
    if (u22ShellCache) return u22ShellCache;
    var w = o;
    for (var depth = 0; depth < 32; depth++) {
      try { if (w.__u22Shell && w.u22Loader) return (u22ShellCache = w); } catch (_) { break; }
      var next;
      try { next = w.parent; } catch (_) { break; }
      if (!next || next === w) break;
      w = next;
    }
    throw new Error("u22: shell page not found");
  }
  function u22Loader() { return u22FindShell().u22Loader; }

  function u22InitState() {
    var url = typeof o.__u22$url === "string" ? o.__u22$url : null;
    var start = { url: null, current: 0 };
    try {
      var raw = u22RawHistoryState();
      if (raw && raw.__u22 != null && typeof raw.u === "string") { url = raw.u; start.current = raw.__u22; }
    } catch (_) {}
    if (!url) {
      try {
        if (!/^about:/i.test(o.location.href)) url = o.location.href;
        else url = "about:blank";
      } catch (_) { url = "about:blank"; }
    }
    start.url = url;
    start.initialUrl = typeof o.__u22$url === "string" ? o.__u22$url : url;
    start.counter = Math.floor(Math.random() * 1e6);
    return start;
  }

  function u22RawHistoryState() {
    var descriptor = a.nativeMethods.getOwnPropertyDescriptor(o.History.prototype, "state");
    return descriptor.get.call(o.history);
  }

  // Real base URL of the document, honouring <base href>.
  function u22Base() {
    var doc = o.document;
    if (doc) {
      var baseEl = doc.querySelector("base[" + U22_MARK + "href]");
      if (baseEl) {
        try { return new o.URL(a.element.getAttribute.call(baseEl, U22_MARK + "href"), V.url).href; } catch (_) {}
      }
    }
    if (/^about:/i.test(V.url)) {
      try { return o.parent.__u22.meta.base; } catch (_) {}
    }
    return V.url;
  }

  function u22Resolve(raw, base) {
    try { return new o.URL(String(raw).trim(), base || u22Base()).href; } catch (_) { return null; }
  }

  function u22AbsInput(input) {
    if (typeof input === "string") return u22Resolve(input) || input;
    if (input instanceof o.URL) return input.href;
    return input;
  }

  function u22HeadNodes() {
    var asset = function (path) { return /^[a-z][a-z\d+.-]*:/i.test(path) ? path : o.location.origin + (path.charAt(0) === "/" ? "" : "/") + path; };
    var js = function (value) { return JSON.stringify(value).replace(/</g, "\\u003c"); };
    var node = function (attrs, text) {
      var list = [{ name: "__u22-script", value: "1", skip: true }];
      Object.keys(attrs).forEach(function (name) { list.push({ name: name, value: attrs[name], skip: true }); });
      return { tagName: "script", nodeName: "script", childNodes: text ? [{ nodeName: "#text", value: text }] : [], attrs: list, skip: true };
    };
    return [
      node({}, "self.__u22$cookies=" + js(u) + ";self.__u22$referrer=" + js(V.url) + ";self.__u22$url=" + js(V.url) + ";"),
      node({ src: asset(A.bundle) }),
      node({ src: asset(A.client) }),
      node({ src: asset(A.config) }),
      node({ src: asset(A.handler) })
    ];
  }

  /* ---------- navigation ---------- */

  function u22NativeNavigate(url, replace) {
    var loc = a.location.location;
    if (replace) loc.replace(url); else loc.assign(url);
  }

  function u22LocationAssign(url, mode) {
    u22Navigate(url, { replace: mode === "replace" });
    return "javascript:void(0)";
  }

  function u22SameDocument(current, next) {
    return current.split("#")[0] === next.split("#")[0];
  }

  function u22Navigate(target, options) {
    options = options || {};
    var abs = u22Resolve(target);
    if (!abs) return Promise.resolve();
    if (/^javascript:/i.test(abs)) {
      try { (0, o.eval)(e.rewriteJS(abs.slice(11))); } catch (error) { console.error(error); }
      return Promise.resolve();
    }
    if (/^(mailto:|tel:|data:|blob:|about:)/i.test(abs)) { u22NativeNavigate(abs, options.replace); return Promise.resolve(); }
    if (!options.method && !options.reload && u22SameDocument(V.url, abs) && abs.indexOf("#") >= 0 && abs !== V.url) {
      u22HashNavigate(abs);
      return Promise.resolve();
    }
    var loader;
    try { loader = u22Loader(); } catch (error) { console.error(error); return Promise.resolve(); }
    return loader.loadDocument(abs, { referrer: V.url, method: options.method, headers: options.headers, body: options.body }).then(function (result) {
      if (result.kind === "none") return;
      if (result.kind === "download") return loader.download(result);
      u22NativeNavigate(result.url, options.replace);
    }, function (error) { console.error("[u22] navigation failed", error); });
  }

  function u22TopProxied() {
    var w = o;
    for (var depth = 0; depth < 32; depth++) {
      var par;
      try { par = w.parent; if (!par || par === w || !par.__u22) break; } catch (_) { break; }
      w = par;
    }
    return w;
  }
  function u22ParentProxied() {
    try { if (o.parent && o.parent !== o && o.parent.__u22) return o.parent; } catch (_) {}
    return o;
  }

  function u22ShellLink(abs) {
    var shell = u22FindShell();
    var encoded = btoa(abs).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return shell.location.href.split(/[?#]/)[0] + "?go=" + encoded;
  }

  function u22OpenNewTab(abs, name, features) {
    return u22FindShell().open(u22ShellLink(abs), name || "_blank", features);
  }

  function u22Open(nativeOpen, that, args) {
    var url = args[0], name = args[1], features = args[2];
    if (url == null || url === "" || /^about:blank$/i.test(String(url))) return nativeOpen.apply(that, args);
    var abs = u22Resolve(url);
    if (!abs) return nativeOpen.apply(that, args);
    var target = String(name == null || name === "" ? "_blank" : name).toLowerCase();
    if (target === "_self") { u22Navigate(abs); return o; }
    if (target === "_top" || target === "_parent") {
      var win = target === "_top" ? u22TopProxied() : u22ParentProxied();
      win.__u22.navigate(abs);
      return win;
    }
    return u22OpenNewTab(abs, name == null || name === "" ? "_blank" : name, features);
  }

  /* ---------- virtual history (documents are blob: URLs, so URLs are emulated) ---------- */

  function u22HistoryWrite(kind, state, title, rawUrl) {
    var url = V.url;
    if (rawUrl != null && rawUrl !== "") {
      var abs = u22Resolve(rawUrl);
      var sameOrigin = false;
      try { sameOrigin = !abs ? false : /^about:/i.test(V.url) || new o.URL(abs).origin === new o.URL(V.url).origin; } catch (_) {}
      if (!sameOrigin) throw new o.DOMException("Failed to execute '" + kind + "State' on 'History': A history state object with URL '" + rawUrl + "' cannot be created in a document with origin '" + e.location.origin + "'.", "SecurityError");
      url = abs;
    }
    if (kind === "push") {
      var id = ++V.counter;
      a.history.pushState.call(o.history, { __u22: id, u: url, s: state }, "", "#u22-" + id);
      V.current = id;
    } else {
      a.history.replaceState.call(o.history, { __u22: V.current || 0, u: url, s: state }, "");
    }
    V.url = url;
  }

  function u22FireHashChange(oldUrl, newUrl) {
    if (!o.HashChangeEvent) return;
    var event = new o.HashChangeEvent("hashchange", { oldURL: oldUrl, newURL: newUrl });
    a.nativeMethods.defineProperty(event, "__u22$dispatched", { value: true, enumerable: false });
    e.dispatchEvent.call(o, event);
  }

  function u22ScrollToHash(url) {
    try {
      var hash = new o.URL(url).hash.slice(1);
      var doc = o.document;
      if (!doc) return;
      if (!hash) { o.scrollTo(0, 0); return; }
      var id = decodeURIComponent(hash);
      var el = doc.getElementById(id) || doc.getElementsByName(id)[0];
      if (el) el.scrollIntoView();
      else if (id.toLowerCase() === "top") o.scrollTo(0, 0);
    } catch (_) {}
  }

  function u22HashNavigate(next) {
    var previous = V.url;
    if (next === previous) return;
    u22HistoryWrite("push", null, "", next);
    u22FireHashChange(previous, V.url);
    u22ScrollToHash(V.url);
  }

  /* ---------- URL attributes ---------- */

  function u22IsUrlAttr(el, name) {
    return name === "src" || name === "href" || name === "ping" || name === "movie" || name === "action" || name === "poster" || name === "profile" || name === "background" || (name === "data" && el.localName === "object");
  }

  function u22SetUrlAttr(el, name, value) {
    name = String(name).toLowerCase();
    var text = String(value);
    var tag = el.localName;
    var anchor = tag === "a" || tag === "area";
    var set = a.element.setAttribute, remove = a.element.removeAttribute, has = a.element.hasAttribute;
    if (!anchor && name !== "action" && U22_LOCAL.test(text)) {
      if (has.call(el, U22_MARK + name)) remove.call(el, U22_MARK + name);
      set.call(el, name, text);
      return;
    }
    set.call(el, U22_MARK + name, text);
    if (name === "href" && anchor) { set.call(el, "href", "javascript:void(0)"); return; }
    if (name !== "srcset" && has.call(el, name)) remove.call(el, name);
    u22ResolveAttr(el, name);
  }

  function u22PickSrcset(raw) {
    var best = null;
    String(raw).replace(/\s*([^\s,][^\s]*?)(?:\s+(\d+(?:\.\d+)?)([wx]))?\s*(?:,|$)/g, function (all, url, n) {
      var weight = n ? parseFloat(n) : 1;
      if (!best || weight >= best.weight) best = { url: url, weight: weight };
      return all;
    });
    return best && best.url;
  }

  function u22Kind(el, attr) {
    var tag = el.localName;
    switch (tag) {
      case "script": return "script";
      case "link": {
        var rel = (a.element.getAttribute.call(el, "rel") || "").toLowerCase().split(/\s+/);
        if (rel.indexOf("stylesheet") >= 0) return "style";
        return rel.indexOf("icon") >= 0 || rel.indexOf("apple-touch-icon") >= 0 || rel.indexOf("mask-icon") >= 0 ? "image" : null;
      }
      case "iframe": case "frame": return "document";
      case "img": case "image": case "use": return "image";
      case "source": return attr === "srcset" || (el.parentNode && el.parentNode.localName === "picture") ? "image" : "media";
      case "input": return (a.element.getAttribute.call(el, "type") || "").toLowerCase() === "image" ? "image" : null;
      case "video": case "audio": case "track": case "embed": case "object": return attr === "poster" ? "image" : "media";
      default: return null;
    }
  }

  var u22Pending = new o.WeakMap();

  function u22ResolveAttr(el, attr) {
    var raw = a.element.getAttribute.call(el, U22_MARK + attr);
    if (raw == null) return;
    var kind = u22Kind(el, attr);
    if (!kind) return;
    var slots = u22Pending.get(el);
    if (!slots) { slots = {}; u22Pending.set(el, slots); }
    var token = slots[attr] = {};
    var target = attr, value = raw;
    if (attr === "srcset") {
      value = u22PickSrcset(raw);
      if (!value) return;
      if (el.localName === "img") target = "src";
    }
    var apply = function (out) { if (slots[attr] === token) a.element.setAttribute.call(el, target, out); };
    if (U22_LOCAL.test(value)) return apply(value.trim());
    if (/^\s*javascript:/i.test(value)) return;
    var abs = u22Resolve(value);
    if (!abs || !/^https?:/i.test(abs)) return;
    var hashAt = kind === "document" ? -1 : abs.indexOf("#");
    var bare = hashAt < 0 ? abs : abs.slice(0, hashAt);
    var hash = hashAt < 0 ? "" : abs.slice(hashAt);
    u22Loader().resource(bare, kind, V.url).then(function (blob) { apply(blob + hash); }, function (error) {
      console.warn("[u22] could not load", abs, error);
      apply("x-u22-failed:");
    });
  }

  var U22_RESOLVABLE = ["src", "srcset", "href", "poster", "data"];
  var U22_SELECTOR = U22_RESOLVABLE.map(function (n) { return "[" + U22_MARK + n + "]"; }).join(",");

  function u22ResolveElement(el) {
    var tag = el.localName;
    for (var i = 0; i < U22_RESOLVABLE.length; i++) {
      var attr = U22_RESOLVABLE[i];
      if (!a.element.hasAttribute.call(el, U22_MARK + attr)) continue;
      if (attr === "href" && (tag === "a" || tag === "area" || tag === "base")) continue;
      if (attr !== "srcset" && a.element.hasAttribute.call(el, attr)) continue;
      u22ResolveAttr(el, attr);
    }
  }

  var u22Observer = null;
  function u22Scan(node) {
    if (!node || node.nodeType !== 1) return;
    u22ResolveElement(node);
    if (node.shadowRoot) u22Watch(node.shadowRoot);
    if (node.querySelectorAll) {
      var found = node.querySelectorAll(U22_SELECTOR);
      for (var i = 0; i < found.length; i++) u22ResolveElement(found[i]);
      var all = node.querySelectorAll("*");
      for (var j = 0; j < all.length; j++) if (all[j].shadowRoot) u22Watch(all[j].shadowRoot);
    }
  }
  function u22Watch(root) {
    if (!u22Observer || root.__u22$watched) return;
    a.nativeMethods.defineProperty(root, "__u22$watched", { value: true, enumerable: false });
    u22Observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["rel"] });
    for (var c = root.firstChild; c; c = c.nextSibling) u22Scan(c);
  }

  /* ---------- request bodies, fetch, XMLHttpRequest, beacons ---------- */

  function u22BodyBytes(body, headers) {
    if (body == null) return Promise.resolve({ bytes: null, contentType: null });
    var probe = new o.Request("http://u22.invalid/", { method: "POST", body: body, headers: headers });
    return probe.arrayBuffer().then(function (bytes) { return { bytes: bytes, contentType: probe.headers.get("content-type") }; });
  }

  function u22AbortError() { return new o.DOMException("The operation was aborted.", "AbortError"); }

  function u22Fetch(nativeFetch, that, args) {
    var input = args[0], init = args[1] || {};
    var probe = typeof input === "string" || input instanceof o.URL ? u22Resolve(input instanceof o.URL ? input.href : input) : input && input.url;
    if (!probe || !/^https?:/i.test(probe)) return nativeFetch.apply(that, args);
    var request = input instanceof o.Request ? input : null;
    var method = String(init.method || (request && request.method) || "GET").toUpperCase();
    var headers = new o.Headers(init.headers || (request && request.headers) || {});
    var signal = init.signal || (request && request.signal) || null;
    if (signal && signal.aborted) return Promise.reject(u22AbortError());

    var rawBody = Promise.resolve(null);
    if (method !== "GET" && method !== "HEAD") {
      if (init.body !== undefined) rawBody = Promise.resolve(init.body);
      else if (request) rawBody = request.clone().arrayBuffer();
    }
    var run = rawBody.then(function (raw) { return raw == null ? { bytes: null, contentType: null } : u22BodyBytes(raw, headers); }).then(function (packed) {
      if (packed.contentType && !headers.has("content-type")) headers.set("content-type", packed.contentType);
      var plain = {};
      headers.forEach(function (value, key) { plain[key] = value; });
      return u22Loader().fetchProxy(probe, {
        method: method, headers: plain, body: packed.bytes, referrer: V.url,
        redirect: init.redirect || (request && request.redirect) || "follow",
        mode: init.mode || (request && request.mode) || "cors",
        cache: init.cache || (request && request.cache) || "default"
      });
    }).then(function (res) {
      var list = new o.Headers();
      res.headers.forEach(function (pair) { try { list.append(pair[0], pair[1]); } catch (_) {} });
      var empty = res.status === 101 || res.status === 204 || res.status === 205 || res.status === 304;
      var response = new o.Response(empty ? null : res.body, { status: res.status, statusText: res.statusText, headers: list });
      a.nativeMethods.defineProperty(response, "url", { value: res.url });
      a.nativeMethods.defineProperty(response, "redirected", { value: res.redirected });
      return response;
    });
    if (!signal) return run;
    return Promise.race([run, new Promise(function (_, reject) { signal.addEventListener("abort", function () { reject(u22AbortError()); }, { once: true }); })]);
  }

  function u22Beacon(url, data) {
    try {
      var abs = u22Resolve(url);
      u22BodyBytes(data, {}).then(function (packed) {
        return u22Loader().fetchProxy(abs, { method: "POST", headers: packed.contentType ? { "content-type": packed.contentType } : {}, body: packed.bytes, referrer: V.url, mode: "no-cors" });
      }).catch(function () {});
      return true;
    } catch (_) { return false; }
  }

  function u22MakeXhr() {
    var Base = o.EventTarget;
    var EVENTS = ["readystatechange", "loadstart", "progress", "abort", "error", "load", "timeout", "loadend"];
    var decode = function (buffer, type) {
      var label = /charset=["']?([^;"'\s]+)/i.exec(type || "");
      try { return new o.TextDecoder(label ? label[1] : "utf-8").decode(buffer); } catch (_) { return new o.TextDecoder().decode(buffer); }
    };
    function XMLHttpRequest() {
      var self = Reflect.construct(Base, [], new.target || XMLHttpRequest);
      a.nativeMethods.defineProperty(self, "_s", { value: { readyState: 0, status: 0, statusText: "", buffer: null, url: "", responseURL: "", headers: {}, resHeaders: [], method: "GET", sent: false, aborted: false, mime: null, cache: undefined }, enumerable: false });
      self.responseType = "";
      self.timeout = 0;
      self.withCredentials = false;
      self.upload = new Base();
      EVENTS.forEach(function (name) { self["on" + name] = null; });
      return self;
    }
    XMLHttpRequest.prototype = Object.create(Base.prototype, { constructor: { value: XMLHttpRequest, writable: true, configurable: true } });
    Object.setPrototypeOf(XMLHttpRequest, Base);
    var constants = { UNSENT: 0, OPENED: 1, HEADERS_RECEIVED: 2, LOADING: 3, DONE: 4 };
    Object.keys(constants).forEach(function (key) {
      Object.defineProperty(XMLHttpRequest, key, { value: constants[key], enumerable: true });
      Object.defineProperty(XMLHttpRequest.prototype, key, { value: constants[key], enumerable: true });
    });
    var getters = {
      readyState: function (s) { return s.readyState; },
      status: function (s) { return s.status; },
      statusText: function (s) { return s.statusText; },
      responseURL: function (s) { return s.responseURL; },
      responseXML: function (s, self) {
        if (self.responseType !== "" && self.responseType !== "document") return null;
        return s.buffer ? new o.DOMParser().parseFromString(decode(s.buffer, s.contentType), /xml/.test(s.contentType) ? "text/xml" : "text/html") : null;
      },
      responseText: function (s, self) {
        if (self.responseType !== "" && self.responseType !== "text") throw new o.DOMException("The value is only accessible if the object's 'responseType' is '' or 'text'.", "InvalidStateError");
        return s.buffer && s.readyState >= 3 ? decode(s.buffer, s.contentType) : "";
      },
      response: function (s, self) {
        if (!s.buffer || s.readyState < 3) return self.responseType === "" || self.responseType === "text" ? "" : null;
        switch (self.responseType) {
          case "arraybuffer": return s.buffer.slice(0);
          case "blob": return new o.Blob([s.buffer], { type: s.contentType || "" });
          case "json": try { return JSON.parse(decode(s.buffer, s.contentType)); } catch (_) { return null; }
          case "document": return getters.responseXML(s, self);
          default: return decode(s.buffer, s.contentType);
        }
      }
    };
    Object.keys(getters).forEach(function (key) {
      Object.defineProperty(XMLHttpRequest.prototype, key, { get: function () { return getters[key](this._s, this); }, enumerable: true, configurable: true });
    });
    function emit(self, type, loaded) {
      var event = new o.ProgressEvent(type, { lengthComputable: false, loaded: loaded || 0, total: 0 });
      var handler = self["on" + type];
      if (typeof handler === "function") { try { handler.call(self, event); } catch (error) { console.error(error); } }
      self.dispatchEvent(event);
    }
    function finish(self, type) {
      var s = self._s;
      s.readyState = 4;
      emit(self, "readystatechange");
      if (type !== "readystatechange") emit(self, type, s.buffer ? s.buffer.byteLength : 0);
      emit(self, "loadend", s.buffer ? s.buffer.byteLength : 0);
    }
    var proto = XMLHttpRequest.prototype;
    proto.open = function (method, url, isAsync) {
      if (isAsync === false) throw new o.DOMException("Synchronous XMLHttpRequest is not supported by this proxy.", "InvalidAccessError");
      var s = this._s;
      s.method = String(method).toUpperCase();
      s.url = String(url);
      s.headers = {};
      s.sent = false; s.aborted = false; s.buffer = null; s.status = 0; s.statusText = ""; s.resHeaders = [];
      s.readyState = 1;
      emit(this, "readystatechange");
    };
    proto.setRequestHeader = function (name, value) {
      var s = this._s;
      if (s.readyState !== 1 || s.sent) throw new o.DOMException("Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.", "InvalidStateError");
      var key = String(name).toLowerCase();
      s.headers[key] = s.headers[key] ? s.headers[key] + ", " + value : String(value);
    };
    proto.overrideMimeType = function (mime) { this._s.mime = String(mime); };
    proto.getResponseHeader = function (name) {
      var key = String(name).toLowerCase(), found = [];
      this._s.resHeaders.forEach(function (pair) { if (pair[0] === key) found.push(pair[1]); });
      return found.length ? found.join(", ") : null;
    };
    proto.getAllResponseHeaders = function () {
      return this._s.resHeaders.map(function (pair) { return pair[0] + ": " + pair[1] + "\r\n"; }).join("");
    };
    proto.abort = function () {
      var s = this._s;
      if (s.aborted) return;
      var active = s.sent && s.readyState !== 4;
      s.aborted = true;
      if (active) { finish(this, "abort"); }
      s.readyState = 0;
    };
    proto.send = function (body) {
      var self = this, s = this._s;
      if (s.readyState !== 1 || s.sent) throw new o.DOMException("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.", "InvalidStateError");
      s.sent = true;
      emit(self, "loadstart");
      var abs = u22Resolve(s.url);
      var timer = self.timeout > 0 ? o.setTimeout(function () { if (s.readyState !== 4 && !s.aborted) { s.aborted = true; finish(self, "timeout"); } }, self.timeout) : 0;
      var packed = s.method === "GET" || s.method === "HEAD" ? Promise.resolve({ bytes: null, contentType: null }) : u22BodyBytes(body, s.headers);
      packed.then(function (pack) {
        if (pack.contentType && !s.headers["content-type"]) s.headers["content-type"] = pack.contentType;
        return u22Loader().fetchProxy(abs, { method: s.method, headers: s.headers, body: pack.bytes, referrer: V.url, mode: "cors" });
      }).then(function (res) {
        if (s.aborted) return;
        s.status = res.status; s.statusText = res.statusText; s.responseURL = res.url;
        s.resHeaders = res.headers.map(function (pair) { return [pair[0].toLowerCase(), pair[1]]; });
        s.contentType = s.mime || self.getResponseHeader("content-type") || "";
        s.readyState = 2; emit(self, "readystatechange");
        s.buffer = res.body;
        s.readyState = 3; emit(self, "readystatechange"); emit(self, "progress", res.body.byteLength);
        if (timer) o.clearTimeout(timer);
        finish(self, "load");
      }).catch(function (error) {
        if (timer) o.clearTimeout(timer);
        if (s.aborted) return;
        console.warn("[u22] XMLHttpRequest failed", s.url, error);
        finish(self, "error");
      });
    };
    return XMLHttpRequest;
  }

  /* ---------- link clicks and form submission ---------- */

  function u22FindLink(event) {
    var path = event.composedPath ? event.composedPath() : [];
    for (var i = 0; i < path.length; i++) {
      var node = path[i];
      if (node && node.nodeType === 1 && (node.localName === "a" || node.localName === "area") && a.element.hasAttribute.call(node, U22_MARK + "href")) return node;
    }
    return null;
  }

  function u22FollowLink(link, event) {
    var raw = a.element.getAttribute.call(link, U22_MARK + "href");
    var abs = u22Resolve(raw);
    if (abs == null) return;
    if (a.element.hasAttribute.call(link, "download") && /^https?:/i.test(abs)) {
      var name = a.element.getAttribute.call(link, "download") || "download";
      u22Loader().fetchProxy(abs, { referrer: V.url }).then(function (res) {
        var anchor = o.document.createElement("a");
        anchor.href = o.URL.createObjectURL(new o.Blob([res.body]));
        anchor.download = name;
        o.document.body.appendChild(anchor); anchor.click(); anchor.remove();
      });
      return;
    }
    var target = (a.element.getAttribute.call(link, "target") || "").toLowerCase();
    if (!target) {
      var baseEl = o.document.querySelector("base[target]");
      target = baseEl ? (a.element.getAttribute.call(baseEl, "target") || "").toLowerCase() : "";
    }
    var modifier = event && (event.ctrlKey || event.metaKey || event.shiftKey);
    if (/^https?:/i.test(abs) && (modifier || target === "_blank" || (target && target !== "_self" && target !== "_top" && target !== "_parent"))) { u22OpenNewTab(abs); return; }
    if (target === "_top") { u22TopProxied().__u22.navigate(abs); return; }
    if (target === "_parent") { u22ParentProxied().__u22.navigate(abs); return; }
    u22Navigate(abs);
  }

  function u22SubmitForm(form, submitter) {
    var get = function (el, name) { return el ? a.element.getAttribute.call(el, name) : null; };
    var method = String(get(submitter, "formmethod") || get(form, "method") || "get").toLowerCase();
    var actionRaw = get(submitter, "formaction");
    if (actionRaw == null) actionRaw = get(form, U22_MARK + "action");
    var action = actionRaw == null || actionRaw === "" ? V.url.split("#")[0] : u22Resolve(actionRaw);
    if (!action) return;
    var data = new o.FormData(form);
    if (submitter && submitter.name) data.append(submitter.name, submitter.value);
    var target = String(get(submitter, "formtarget") || get(form, "target") || "").toLowerCase();
    var flat = [];
    data.forEach(function (value, key) { flat.push([key, typeof value === "string" ? value : value.name]); });
    if (method !== "post") {
      var url = new o.URL(action);
      url.search = new o.URLSearchParams(flat).toString();
      if (target === "_blank") u22OpenNewTab(url.href); else u22Navigate(url.href);
      return;
    }
    var enctype = String(get(submitter, "formenctype") || get(form, "enctype") || "application/x-www-form-urlencoded").toLowerCase();
    var payload = enctype === "multipart/form-data" ? data : enctype === "text/plain" ? flat.map(function (p) { return p[0] + "=" + p[1]; }).join("\r\n") : new o.URLSearchParams(flat);
    u22BodyBytes(payload, {}).then(function (packed) {
      u22Navigate(action, { method: "POST", headers: packed.contentType ? { "content-type": packed.contentType } : {}, body: packed.bytes });
    });
  }

  /* ---------- wiring ---------- */

  function u22Install() {
    var doc = o.document;
    var native = a.nativeMethods;
    if (!doc) return;

    a.location.onReload = function () { u22Navigate(V.url, { replace: true, reload: true }); };
    e.navigate = function (url, options) { return u22Navigate(url, options); };
    e.reload = function () { return u22Navigate(V.url, { replace: true, reload: true }); };
    e.resolve = u22Resolve;

    a.override(o, "fetch", function (target, that, args) { return u22Fetch(target, that, args); });
    native.defineProperty(o, "XMLHttpRequest", { value: u22MakeXhr(), writable: true, configurable: true, enumerable: false });
    a.override(o, "open", function (target, that, args) { return u22Open(target, that, args); });

    // history.state / popstate expose the page's own state, not our wrapper
    var rawPopState = native.getOwnPropertyDescriptor(o.PopStateEvent.prototype, "state").get;
    var unwrap = function (raw) { return raw && typeof raw === "object" && raw.__u22 != null && "u" in raw ? raw.s : raw; };
    a.overrideDescriptor(o.History.prototype, "state", { get: function (t, r) { return unwrap(t.call(r)); } });
    a.overrideDescriptor(o.PopStateEvent.prototype, "state", { get: function (t, r) { return unwrap(t.call(r)); } });
    e.addEventListener.call(o, "popstate", function (event) {
      var raw = rawPopState.call(event);
      var wrapped = raw && typeof raw === "object" && raw.__u22 != null && "u" in raw;
      var next = wrapped ? raw.u : V.initialUrl;
      var previous = V.url;
      V.current = wrapped ? raw.__u22 : 0;
      V.url = next;
      if (previous !== next && u22SameDocument(previous, next)) u22FireHashChange(previous, next);
    });

    // anchors
    var anchorProps = ["origin", "protocol", "username", "password", "host", "hostname", "port", "pathname", "search", "hash"];
    [o.HTMLAnchorElement, o.HTMLAreaElement].forEach(function (Ctor) {
      if (!Ctor) return;
      anchorProps.forEach(function (key) {
        a.overrideDescriptor(Ctor.prototype, key, { get: function (t, r) {
          var raw = a.element.getAttribute.call(r, U22_MARK + "href");
          if (raw == null) return t.call(r);
          try { return new o.URL(u22Resolve(raw))[key]; } catch (_) { return t.call(r); }
        } });
      });
      a.override(Ctor.prototype, "toString", function (t, r, args) {
        var raw = a.element.getAttribute.call(r, U22_MARK + "href");
        return raw == null ? t.apply(r, args) : u22Resolve(raw) || raw;
      });
    });

    e.addEventListener.call(o, "click", function (event) {
      if (event.defaultPrevented || event.button !== 0) return;
      var link = u22FindLink(event);
      if (!link) return;
      event.preventDefault();
      u22FollowLink(link, event);
    });
    e.addEventListener.call(o, "auxclick", function (event) {
      if (event.button !== 1 || event.defaultPrevented) return;
      var link = u22FindLink(event);
      if (!link) return;
      event.preventDefault();
      var abs = u22Resolve(a.element.getAttribute.call(link, U22_MARK + "href"));
      if (abs && /^https?:/i.test(abs)) u22OpenNewTab(abs);
    });

    // forms
    e.addEventListener.call(o, "submit", function (event) {
      var form = event.target;
      if (event.defaultPrevented || !form || form.localName !== "form") return;
      event.preventDefault();
      u22SubmitForm(form, event.submitter || null);
    });
    if (o.HTMLFormElement) a.override(o.HTMLFormElement.prototype, "submit", function (t, r) { u22SubmitForm(r, null); });

    a.element.on("removeAttribute", function (t) {
      var name = String(t.data.name).toLowerCase();
      if ((u22IsUrlAttr(t.that, name) || name === "srcset") && a.element.hasAttribute.call(t.that, U22_MARK + name)) {
        a.element.removeAttribute.call(t.that, U22_MARK + name);
        var slots = u22Pending.get(t.that);
        if (slots) delete slots[name];
      }
    });
    a.element.on("hasAttribute", function (t) {
      var name = String(t.data.name).toLowerCase();
      if ((u22IsUrlAttr(t.that, name) || name === "srcset") && a.element.hasAttribute.call(t.that, U22_MARK + name)) t.respondWith(true);
    });

    // resources added to the document (images, iframes, dynamic scripts, ...)
    u22Observer = new o.MutationObserver(function (records) {
      records.forEach(function (record) {
        if (record.type === "childList") { for (var i = 0; i < record.addedNodes.length; i++) u22Scan(record.addedNodes[i]); }
        else if (record.type === "attributes" && record.target.nodeType === 1) u22ResolveElement(record.target);
      });
    });
    u22Watch(doc);
    if (o.Element && o.Element.prototype.attachShadow) {
      a.override(o.Element.prototype, "attachShadow", function (t, r, args) { var root = t.apply(r, args); u22Watch(root); return root; });
    }

    // cookies set by network responses (the shell notifies every document)
    if (typeof o.BroadcastChannel === "function") {
      var channel = new o.BroadcastChannel("u22-cookies");
      channel.onmessage = function () {
        e.cookie.db().then(function (db) { return e.cookie.getCookies(db); }).then(function (all) { u = e.cookie.serialize(all || [], e.meta, !0); }).catch(function () {});
      };
    }
  }
  u22Install();

  function u22UrlProp(native, el, name) {
    var raw = a.element.getAttribute.call(el, U22_MARK + name);
    if (raw == null) return native.call(el);
    return u22Resolve(raw) || raw;
  }

 }
})();
