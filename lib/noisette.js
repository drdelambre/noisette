var phantom = require('node-phantom'),
	Promise = require('bluebird');

function initializePage(inst){
	return new Promise(function(resolve,reject){
		if(!inst.page){
			reject('Noisette: initializePage called without a page');
			return;
		}

		inst.callbacks = [];

		inst.page.onCallback = function(ret){
			if(ret.hasOwnProperty('system')){
				if(ret.system === 'take_a_picture'){
					inst.page.render(ret.data + '.png');
					return;
				}
				if(ret.system === 'dd_init'){
					resolve();
				}

				return;
			}
			if(!ret.hasOwnProperty('callback') || ret.callback < 0 || ret.callback > inst.callbacks.length){
				return;
			}
			inst.callbacks[ret.callback](ret.data||[]);
		};
		inst.page.onError = function(msg, trace){
			var msgStack = ['ERROR: ' + msg];
			if(trace && trace.length){
				msgStack.push('TRACE:');
				trace.forEach(function(t){
					msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
				});
			}
			console.error(msgStack.join('\n'));
		};

		inst.page.evaluate(function(){
			//this needs to be moved into a dependecy or something
			if(!window.$dd){
				!function(a){var b={};b.type=function(a,b){var e,c=typeof a,d=!1;if("object"===c&&(e=Object.prototype.toString.call(a),"[object Array]"===e?c="array":"[object Null]"===e?c="null":"[object Date]"===e?c="date":"[object DOMWindow]"===e?c="node":a.nodeType&&(c=1===a.nodeType?"node":"textnode")),!b)return c;for(b=b.split(","),e=0;e<b.length;e++)d=d||b[e]===c;return d},b.mixin=function(a){if(!b.type(a,"object"))throw new Error("$dd.mixin called with incorrect parameters");for(var c in a){if(/(mixin)/.test(c))throw new Error("mixin isn't allowed for $dd.mixin");b[c]=a[c]}},b.init=function(){var b,c,a=[];b=setInterval(function(){document.body&&(clearInterval(b),b=null,setTimeout(function(){for(c=0;c<a.length;c++)a[c]()},200))},10);var d=function(c){b?a.push(c):c()};return d.queue=a,d}(),b.extend=function(){if(!arguments.length)throw new Error("$dd.extend called with too few parameters");var c,d,a={};for(c=0;c<arguments.length;c++)if(b.type(arguments[c],"object"))for(d in arguments[c])a[d]=arguments[c][d];return a},b.clone=function(a){var c=b.type(a);if(!/^(object||array||date)$/.test(c))return a;if("date"===c)return(new Date).setTime(a.getTime());if("array"===c)return a.slice(0);var e,d={};for(e in a)a.hasOwnProperty(e)&&(d[e]=b.clone(a[e]));return d},b.expose=function(c,d){return a.hasOwnProperty(d)&&console.log("$dd.expose: Overwritting global variable ["+d+"]"),a[d]=c,b},b.expose(b,"$dd")}("undefined"!=typeof window?window:this);
			}
			if(!$dd.dom){
				!function(){Element.prototype.matchesSelector=Element.prototype.webkitMatchesSelector||Element.prototype.mozMatchesSelector||function(a){var c,d,b=document.querySelectorAll(a);for(c=0,d=b.length;d>c;c++)if(b[c]===this)return!0;return!1}}(),function(){document.querySelectorAll=document.querySelectorAll||function(a){var b=document,c=b.documentElement.firstChild,d=b.createElement("style");return c.appendChild(d),b._qsa=[],d.styleSheet.cssText=a+"{x:expression(document._qsa.push(this))}",window.scrollBy(0,0),b._qsa}}(),function(a){var b=function(a,b){if(!a.length)return[];var f,g,h,c=a.split(","),d=b||document,e=[];for(f=0;f<c.length;f++)g=c[f].lastIndexOf("#"),h=d,g>0&&(h=document.getElementById(c[f].substr(g).match(/^#[^\s]*/)[0]),c[f]=c[f].substr(g).replace(/^#[^\s]*[\s]*/,"")),c[f].length&&(e=e.concat(Array.prototype.slice.call(h.querySelectorAll(c[f]),0)));return e},c=function(a,b){return b.toUpperCase()},d={},e={css:function(b,d){if(a.type(d,"string")){var e=document.defaultView.getComputedStyle(b[0])[d.replace(/-(\w)/g,c)];if(a.type(e,"undefined")||"none"===e)return;if(!isNaN(parseFloat(e)))return parseFloat(e);if(/^matrix\(/i.test(e)){var f=e.match(/(-?\d*\.?\d+)/g);e={},6===f.length&&(e.translateX=parseFloat(f[4]),e.translateY=parseFloat(f[5]),e.rotation=Math.atan(f[1]/f[3]),e.scaleX=f[0]/Math.cos(e.rotation),e.scaleY=f[3]/Math.cos(e.rotation))}return e}var g,h;for(g=0;g<b._len;g++)for(h in d)b[g].style[h.replace(/-(\w)/g,c)]=d[h];return b},addClass:function(a,b){var e,f,c=b.split(","),d=a._len;for(a.removeClass(b),e=0;d>e;e++)for(f=0;f<c.length;f++)a[e].className+=" "+c[f].replace(/(^\s*|\s*$)/g,"");return a},removeClass:function(a,b){var e,f,g,c=b.split(","),d=a._len;for(e=0;d>e;e++){for(g=" "+a[e].className.replace(/\s+/g," "),f=0;f<c.length;f++)g=g.replace(new RegExp("\\s"+c[f].replace(/(^\s*|\s*$)/g,""),"g"),"");a[e].className=g.slice(1)}return a},matches:function(b,c){var d,e;for(a.type(c,"string")||(c=a.dom(c)),d=0;d<b._len;d++)if(b[d]===window){if(a.type(c,"string")&&"window"===c||c[0]===window)return!0}else if(c.hasOwnProperty("_len")){for(e=0;e<c._len;e++)if(b[d]===c[e])return!0}else if(b[d].matchesSelector(c))return!0;return!1},find:function(a,b){return f(b,a)},__closest:function(a,b){var e,f,g,h,i,j,c=[],d=document.documentElement;if("string"!=typeof b&&!b.hasOwnProperty("_len"))throw new Error("invalid selector passed to library.dom.closest");for(e=0;e<a._len;e++){for(h=a[e],i=0;h!==d;){if("string"!=typeof b){for(j=!1,f=0;f<b._len;f++)if(b[f]===window||h===b[f]){j=!0;break}if(j)break}else if(h.matchesSelector(b))break;if(!h.parentNode){h=d;break}i++,h=h.parentNode}h!==d&&c.push({elem:h,depth:i})}for(g=c.length,e=0;g>e;e++)for(f=e+1;g>f;f++)c[e].elem===c[f].elem&&(c.splice(f--,1),g--);return c},closest:function(a,b){var d,g,c=e.__closest(a,b),h=f(null,a);if(!c.length)return h;for(d=h._len=c.length,g=0;d>g;g++)h[g]=c[g].elem;return h},remove:function(a){var b,c;for(b=0,c=a._len;c>b;b++)a[b].parentNode&&a[b].parentNode.removeChild(a[b]);return a},delay:function(a,b){var e,c=[],d={},f=function(a,b){var e=function(){return c.push({args:arguments,ctx:a,name:b}),d};return e};for(e in a)/^(_|init)/.test(e)||(d[e]=f(a,e));a._pending++;var g=function(){for(e=0;e<c.length;e++)"function"==typeof c[e].ctx[c[e].name]&&(a=c[e].ctx[c[e].name].apply(a,c[e].args));if(--a._pending<=0&&a._done.length)for(e=0;e<a._done.length;e++)a._done[e](a)};return window._phantom?setTimeout(function(){setTimeout(g,b)},1):setTimeout(g,b),d},done:function(b,c){return a.type(c,"function")?(b._pending>0?b._done.push(c):c(b),b):b},before:function(b,c){var d,e;for(c.hasOwnProperty("_len")||(c=a.dom(c)),d=0;d<b._len;d++)if(b[d].parentNode)for(e=0;e<c._len;e++)b[d].parentNode.insertBefore(c[e],b[d]);return b},after:function(b,c){var d,e;for(c.hasOwnProperty("_len")||(c=a.dom(c)),d=0;d<b._len;d++)if(b[d].parentNode)for(e=0;e<c._len;e++)b[d].parentNode.insertBefore(c[e],b[d].nextSibling)},clone:function(a){var c,d,e,g,b=f();for(b._selector=a._selector,b._len=a._len,c=0;c<a._len;c++){for(e=document.createElement(a[c].nodeName),g=a[c].attributes,d=0;d<g.length;d++)e.setAttribute(g[d].name,g[d].value);e.innerHTML=a[c].innerHTML,b[c]=e}return b},measure:function(a){var b=a[0].getBoundingClientRect();if(!b)return{top:0,left:0,width:0,height:0};var c=a[0].ownerDocument.body,d=document.documentElement.clientTop||c.clientTop||0,e=document.documentElement.clientLeft||c.clientLeft||0,f=window.pageYOffset||document.documentElement.scrollTop||c.scrollTop,g=window.pageXOffset||document.documentElement.scrollLeft||c.scrollLeft,h=b.top+f-d,i=b.left+g-e,j=document.defaultView.getComputedStyle(a[0]),k=parseFloat(j.getPropertyValue("padding-top")),l=parseFloat(j.getPropertyValue("padding-bottom")),m=parseFloat(j.getPropertyValue("padding-left")),n=parseFloat(j.getPropertyValue("padding-right")),o=parseFloat(j.getPropertyValue("border-top-width")),p=parseFloat(j.getPropertyValue("border-bottom-width")),q=parseFloat(j.getPropertyValue("border-left-width")),r=parseFloat(j.getPropertyValue("border-right-width"));return{top:h,left:i,width:b.right-b.left,height:b.bottom-b.top,innerWidth:b.right-b.left-(q+r+m+n),innerHeight:b.bottom-b.top-(o+p+k+l)}},get:function(a,b){return 0>b||b>a._len?void 0:f(a[b],a)},length:function(a){return a._len},html:function(b,c){if(a.type(c,"undefined"))return b[0].innerHTML||"";for(var d=0;d<b._len;d++)b[d].innerHTML=c;return b},append:function(b,c){var d,e;for(c=a.dom(c),d=0;d<b._len;d++)for(e=0;e<c._len;e++)b[d].appendChild(c[e]);return b},on:function(b,c,e){if(/^(focus|blur)$/.test(c)){var h,f=window.addEvent?"on"+c:c,g=window.addEvent?"addEvent":"addEventListener";for(h=0;h<b._len;h++)b[h][g](f,e);return b}return d[c]||(d[c]=function(){var b={evt:c,fun:null,routes:[]};return b.fun=function(c){var e,f,d=a.dom(c.target);for(e=0;e<b.routes.length;e++)f=d.closest(b.routes[e].dom),f.hasOwnProperty("_len")&&f._len&&b.routes[e].callback(c)},b}(),window.addEvent?"scroll"===c?window.addEventListener("onmousewheel",d[c].fun,!1):window.addEvent("on"+c,d[c].fun):window.addEventListener&&("scroll"===c?(window.addEventListener("mousewheel",d[c].fun,!1),window.addEventListener("DOMMouseScroll",d[c].fun,!1)):window.addEventListener(c,d[c].fun,!1))),d[c].routes.push({dom:b,callback:e}),b},off:function(a,b,c){if(d[b]&&d[b].routes.length){var f,e=d[b].routes,g=!1;for(f=e.length;f>0;)a.matches(e[--f].dom)&&(c&&e[f].callback!==c||(g=!0,e.splice(f,1)));return a}},fire:function(a,b){function c(a,b){var c;document.createEvent?(c=document.createEvent("MouseEvent"),c.initMouseEvent(b,!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null),a.dispatchEvent(c)):document.createEventObject&&(c=document.createEventObject(),a.fireEvent("on"+b,c))}for(var d=0;d<a._len;d++)c(a[d],b);return a},each:function(a,b){for(var c=0;c<a._len;c++)b(a.get(c),c);return a}},f=function(c,d){var g,f={_back:null,_len:0,_selector:"",_pending:0,_done:[]},h=function(a,b){a[b]=function(){var c=Array.prototype.slice.call(arguments);return c.unshift(a),e[b].apply(a,c)}};for(g in e)h(f,g);if(f._back=d,!c)return f;if(a.type(c,"node"))return f[0]=c,f._len=1,f;if(/^[^<]*(<[\w\W]+>)[^>]*$/.test(c)){var j,k,i=document.createElement("div");for(i.innerHTML=c.replace(/(^\s*|\s*$)/g,""),k=i.childNodes,f._len=k.length,j=0;j<f._len;j++)f[j]=k[j];return f}if(f._selector=c,!c)return f;var l=[];if(d&&d._len)for(g=0;g<d._len;g++)l=l.concat(b(c,d[g]));else l=b(c);for(g=0;g<l.length;g++)f[g]=l[g];return f._len=l.length,f},g=function(b){return a.type(b,"object")&&b.hasOwnProperty("_len")?b:f(b)};return g.atPoint=function(b,c){return a.dom(document.elementFromPoint(b,c))},a.mixin({dom:g}),a.dom}($dd);
			}

			$dd.init(function(){
				window.callPhantom({
					system: 'dd_init'
				});
			});

			window._serialize_dom = function(dom){
				var out = [],
					ni,obj,d,no;

				for(ni = 0; ni < dom.length(); ni++){
					d = dom[ni];
					obj = {}
					if(d === window){
						obj.node = 'window';
					} else if(d === document){
						obj.node = 'document';
					} else if(d.nodeType === 3){
						obj.node = 'text';
					} else {
						obj.node = d.nodeName.toLowerCase();
					}

					switch(obj.node){
						case 'window':
							obj.location = {
								href: d.location.href,
								origin: d.location.origin,
								pathname: d.location.pathname,
								hash: d.location.hash
							};
							obj.width = d.innerWidth;
							obj.height = d.innerHeight;
							break;
						case 'document':
							obj.scripts = [];
							for(no = 0; no < d.scripts.length; no++){
								if(!d.scripts[no].src){
									obj.scripts.push('<local>');
								} else {
									obj.scripts.push(d.scripts[no].src);
								}
							}
							break;
						case 'text':
							obj.text = d.textContent;
							break;
						default:
							obj.id = d.id || '';
							obj.className = d.className || '';
							break;
					}

					out.push(obj);
				}

				return out;
			};

			window._parse_queue = function(callback,list){
				var context = $dd.dom('window'),
					ni,no;
				for(ni = 0; ni < list.length; ni++){
					switch(list[ni].type){
						case 'eval':
							(new Function(list[ni].fun))();
							break;
						case 'find':
							context = context.find(list[ni].selector);
							break;
						case 'get':
							context = context.get(list[ni].index);
							break;
						case 'wait':
							context = context.delay(parseInt(list[ni].delay));
							break;
						case 'fill':
							for(no = 0; no < context.length(); no++){
								if(!/^(input|textarea)$/i.test(context[no].nodeType)){
									continue;
								}
								context[no].value = list[ni].text;
							}
							break;
						case 'click':
							context = context.fire('mousedown').fire('mouseup');
							break;
						default:
							continue;
					}
				}

				context.done(function(ctx){
					window.callPhantom({
						callback: callback,
						data: window._serialize_dom(ctx)
					});
				});
			};
		},function(error,resp){
			if(error){
				reject(error);
			}
		});
	});
}

var Noisette = function(options,callback){
	var self = this;
	self.options = options||{};

	var _options = {
		echo_console: true,
		site: '',
		width: 800,
		height: 600
	}, ni;

	for(ni in _options){
		if(self.options.hasOwnProperty(ni)){
			continue;
		}
		self.options[ni] = _options[ni];
	}

	var params = {};
	if(self.parameters){
		params.parameters = self.parameters;
	}

	return new Promise(function(resolve,reject){
		phantom.create(function(error, ph) {
			if(error){
				reject(error);
				return;
			}
			self.phantom = ph;
			ph.createPage(function(error, page) {
				if(error){
					reject(error);
					return;
				}
				self.page = page;
				if(self.options.echo_console){
					self.page.onConsoleMessage = function(msg){
						console.log('From Phantom:\n' + msg);
					};
				}
				self.page.onLoadFinished = function(status){
					self.success = (status === 'success');
					if(!self.success){
						reject('Error initializing page');
					}
				};
				page.set('viewportSize',{width:self.options.width,height:self.options.height},function(err){
					if(err){
						reject(error);
						return;
					}
					resolve.call(self,self);
				});
			});
		}, params);
	});
};
Noisette.prototype.visit = function(url){
	var self = this;
	return new Promise(function(resolve,reject){
		self.page.onResourceReceived = function(response){
			if(response.stage !== 'end')
				return;
			if(response.url === self.options.site + url){
				initializePage(self).then(resolve);
			}
		};

		self.page.open(self.options.site + url,function(err,status){
			if(err){
				reject(err);
			}
		});
	});
};
Noisette.prototype.eval = function(fun){
	var self = this;
	return new Promise(function(resolve,reject){
		if(typeof fun !== 'function'){
			reject('Noisette.eval: needs a function');
			return;
		}

		self.page.evaluate(fun,resolve);
	});
};
Noisette.prototype.resize = function(width,height){
	var self = this;
	return new Promise(function(resolve,reject){
		self.page.set('viewportSize',{
			width: width,
			height: height
		},function(err){
			if(err){
				reject(err);
			} else {
				resolve();
			}
		});
	});
};
Noisette.prototype.close = function(){
	if(!this.phantom){
		return;
	}

	this.phantom.exit();
};
Noisette.prototype.capture = function(dest){
	if(!this.page){
		return;
	}
	this.page.render(dest);
};
Noisette.prototype.dom = function(selector){
	var self = this,
		queue = [],
		dom = {};

	dom.find = function(selector){
		queue.push({
			type: 'find',
			selector: selector
		});
		return dom;
	}
	dom.get = function(index){
		queue.push({
			type: 'get',
			index: index
		});
		return dom;
	};
	dom.click = function(){
		queue.push({ type: 'click' });
		return dom;
	};
	dom.wait = function(delay){
		queue.push({
			type: 'wait',
			delay: delay
		});
		return dom;
	};
	dom.fill = function(text){
		queue.push({
			type: 'fill',
			text: text
		});
		return dom;
	};
	dom.exec = function(){
		return new Promise(function(resolve,reject){
			var index = self.callbacks.length;
			self.callbacks.push(function(d){ resolve(d); });

			self.page.evaluate(function(item){
				window._parse_queue(item.callback,item.list);
			},function(){},{
				callback: index,
				list: queue
			});
		});
	};

	return dom;
};

module.exports = Noisette;