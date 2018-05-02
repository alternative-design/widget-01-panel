/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);
/******/
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		0:0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);
/******/
/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;
/******/
/******/ 			script.src = __webpack_require__.p + "" + chunkId + ".bundle.js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var restate = __webpack_require__(1);
	var Login = __webpack_require__(46);
	var Regular = __webpack_require__(3);
	var routes = __webpack_require__(53);
	var dom = __webpack_require__(64);
	__webpack_require__(69);
	
	// 第一种: 直接从组件启动
	if (location.pathname === '/login') {
	
	  new Login({}).$inject('#app');
	} else {
	  // 第二种，即配置单页路由
	  var router = restate({ routes: routes });
	  router.start({
	    html5: true,
	    view: dom.find('#app')
	  });
	}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(2);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Regular = __webpack_require__(3);
	var Stateman = __webpack_require__(35);
	var _ = __webpack_require__(43);
	var dom = Regular.dom;
	
	var createRestate = __webpack_require__(44);
	
	var Restate = createRestate(Stateman);
	var so = Restate.prototype;
	
	var oldStateFn = so.state;
	var oldStart = so.start;
	
	so.start = function (options, callback) {
	  var self = this;
	  options = options || {};
	  var ssr = options.ssr;
	  var view = options.view;
	  this.view = view;
	  // prevent default stateman autoLink feature
	  options.autolink = false;
	  if (ssr) {
	    // wont fix .
	    options.autofix = false;
	    options.html5 = true;
	  }
	  // delete unused options of stateman
	  delete options.ssr;
	  delete options.view;
	  if (options.html5 && window.history && "onpopstate" in window) {
	    this.ssr = ssr;
	    dom.on(document.body, "click", function (ev) {
	      var target = ev.target,
	          href;
	      if (target.getAttribute('data-autolink') != null) {
	        ev.preventDefault();
	        href = dom.attr(target, 'href');
	        self.nav(href);
	      }
	    });
	  }
	  oldStart.call(this, options, callback);
	  return this;
	};
	
	so.state = function (name, config) {
	  var manager = this;
	  var oldConfig;
	  if (typeof name === 'string') {
	
	    // 不代理canEnter事件, 因为此时component还不存在
	    // mount (if not installed, install first)
	
	    // 1. .Null => a.b.c
	    // canEnter a  -> canEnter a.b -> canEnter a.b.c ->
	    //  -> install a ->enter a -> mount a
	    //  -> install a.b -> enter a.b -> mount a.b
	    //  -> install a.b.c -> enter a.b.c -> mount a.b.c
	
	    // 2. update a.b.c
	    // -> install a -> mount a
	    // -> install a.b -> mount a.b
	    // -> install a.b.c -> mount a.b.c
	
	    // 3. a.b.c -> a.b.d
	    // canLeave c -> canEnter d -> leave c
	    //  -> install a -> mount a ->
	    //  -> install b -> mount b ->
	    //  -> install d -> enter d -> mount d
	
	    var install = function install(option, isEnter) {
	      var component = this.component;
	      var parent = this.parent;
	      var self = this;
	      var ssr = option.ssr = isEnter && option.firstTime && manager.ssr && this.ssr !== false;
	
	      if (component && component.$phase === 'destroyed') {
	        component = null;
	      }
	
	      var installOption = {
	        ssr: ssr,
	        state: this,
	        param: option.param,
	        component: component,
	        originOption: option
	      };
	      var installPromise = manager.install(installOption).then(function (installed) {
	
	        var globalView = manager.view,
	            view,
	            ret;
	        var Component = installed.Component;
	        var needComponent = !component || component.constructor !== Component;
	
	        if (parent.component) {
	          view = parent.component.$viewport;
	        } else {
	          view = globalView;
	        }
	
	        // if(!view) throw Error('need viewport for ' + self.name );
	
	        if (needComponent) {
	          // 这里需要给出提示
	          if (component) component.destroy();
	          var mountNode = ssr && view;
	
	          component = self.component = new Component({
	            mountNode: mountNode,
	            data: _.extend({}, installed.data),
	            $state: manager
	          });
	        } else {
	          _.extend(component.data, installed.data, true);
	        }
	        if (needComponent && !mountNode || !needComponent && isEnter) component.$inject(view);
	        return component;
	      });
	      if (isEnter) {
	        installPromise = installPromise.then(function () {
	          return _.proxyMethod(self.component, 'enter', option);
	        });
	      }
	      return installPromise.then(self.mount.bind(self, option)).then(function () {
	        self.component.$update(function () {
	          self.component.$mute(false);
	        });
	      });
	    };
	
	    if (!config) return oldStateFn.call(this, name);
	    oldConfig = config;
	
	    config = {
	      component: null,
	      install: install,
	      mount: function mount(option) {
	        return _.proxyMethod(this.component, 'mount', option);
	      },
	      canEnter: function canEnter(option) {
	        return _.proxyMethod(this, oldConfig.canEnter, option);
	      },
	      canLeave: function canLeave(option) {
	        return _.proxyMethod(this.component, 'canEnter', option);
	      },
	      update: function update(option) {
	        return this.install(option, false);
	      },
	      enter: function enter(option) {
	        return this.install(option, true);
	      },
	      leave: function leave(option) {
	        var component = this.component;
	        if (!component) return;
	
	        return Promise.resolve().then(function () {
	          return _.proxyMethod(component, 'leave', option);
	        }).then(function () {
	          component.$inject(false);
	          component.$mute(true);
	        });
	      }
	    };
	    _.extend(config, oldConfig, true);
	  }
	  return oldStateFn.call(this, name, config);
	};
	
	module.exports = Restate;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var env = __webpack_require__(4);
	var config = __webpack_require__(11);
	var Regular = module.exports = __webpack_require__(12);
	var Parser = Regular.Parser;
	var Lexer = Regular.Lexer;
	
	// if(env.browser){
	__webpack_require__(30);
	__webpack_require__(33);
	__webpack_require__(34);
	Regular.dom = __webpack_require__(19);
	// }
	Regular.env = env;
	Regular.util = __webpack_require__(6);
	Regular.parse = function (str, options) {
	  options = options || {};
	
	  if (options.BEGIN || options.END) {
	    if (options.BEGIN) config.BEGIN = options.BEGIN;
	    if (options.END) config.END = options.END;
	    Lexer.setup();
	  }
	  var ast = new Parser(str).parse();
	  return !options.stringify ? ast : JSON.stringify(ast);
	};
	Regular.Cursor = __webpack_require__(26);
	
	Regular.isServer = env.node;
	Regular.isRegular = function (Comp) {
	  return Comp.prototype instanceof Regular;
	};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// some fixture test;
	// ---------------
	"use strict";
	
	var _ = __webpack_require__(6);
	exports.svg = (function () {
	  return typeof document !== "undefined" && document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
	})();
	
	exports.browser = typeof document !== "undefined" && document.nodeType;
	// whether have component in initializing
	exports.exprCache = _.cache(1000);
	exports.node = typeof process !== "undefined" && '' + process === '[object process]';
	exports.isRunning = false;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	// shim for using process in browser
	'use strict';
	
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout() {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	})();
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;
	
	process.listeners = function (name) {
	    return [];
	};
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, setImmediate) {'use strict';
	
	__webpack_require__(9)();
	
	var _ = module.exports;
	var entities = __webpack_require__(10);
	var slice = [].slice;
	var o2str = ({}).toString;
	var win = typeof window !== 'undefined' ? window : global;
	var MAX_PRIORITY = 9999;
	var config = __webpack_require__(11);
	
	_.noop = function () {};
	_.uid = (function () {
	  var _uid = 0;
	  return function () {
	    return _uid++;
	  };
	})();
	
	_.extend = function (o1, o2, override) {
	  for (var i in o2) if (o2.hasOwnProperty(i)) {
	    if (o1[i] === undefined || override === true) {
	      o1[i] = o2[i];
	    }
	  }
	  return o1;
	};
	
	_.keys = Object.keys ? Object.keys : function (obj) {
	  var res = [];
	  for (var i in obj) if (obj.hasOwnProperty(i)) {
	    res.push(i);
	  }
	  return res;
	};
	
	_.some = function (list, fn) {
	  for (var i = 0, len = list.length; i < len; i++) {
	    if (fn(list[i])) return true;
	  }
	};
	
	_.varName = 'd';
	_.setName = 'p_';
	_.ctxName = 'c';
	_.extName = 'e';
	
	_.rWord = /^[\$\w]+$/;
	_.rSimpleAccessor = /^[\$\w]+(\.[\$\w]+)*$/;
	
	_.nextTick = typeof setImmediate === 'function' ? setImmediate.bind(win) : function (callback) {
	  setTimeout(callback, 0);
	};
	
	_.prefix = "'use strict';var " + _.varName + "=" + _.ctxName + ".data;" + _.extName + "=" + _.extName + "||'';";
	
	_.slice = function (obj, start, end) {
	  var res = [];
	  for (var i = start || 0, len = end || obj.length; i < len; i++) {
	    res.push(obj[i]);
	  }
	  return res;
	};
	
	// beacuse slice and toLowerCase is expensive. we handle undefined and null in another way
	_.typeOf = function (o) {
	  return o == null ? String(o) : o2str.call(o).slice(8, -1).toLowerCase();
	};
	
	_.makePredicate = function makePredicate(words, prefix) {
	  if (typeof words === "string") {
	    words = words.split(" ");
	  }
	  var f = "",
	      cats = [];
	  out: for (var i = 0; i < words.length; ++i) {
	    for (var j = 0; j < cats.length; ++j) {
	      if (cats[j][0].length === words[i].length) {
	        cats[j].push(words[i]);
	        continue out;
	      }
	    }
	    cats.push([words[i]]);
	  }
	  function compareTo(arr) {
	    if (arr.length === 1) return f += "return str === '" + arr[0] + "';";
	    f += "switch(str){";
	    for (var i = 0; i < arr.length; ++i) {
	      f += "case '" + arr[i] + "':";
	    }
	    f += "return true}return false;";
	  }
	
	  // When there are more than three length categories, an outer
	  // switch first dispatches on the lengths, to save on comparisons.
	  if (cats.length > 3) {
	    cats.sort(function (a, b) {
	      return b.length - a.length;
	    });
	    f += "switch(str.length){";
	    for (var i = 0; i < cats.length; ++i) {
	      var cat = cats[i];
	      f += "case " + cat[0].length + ":";
	      compareTo(cat);
	    }
	    f += "}";
	
	    // Otherwise, simply generate a flat `switch` statement.
	  } else {
	      compareTo(words);
	    }
	  return new Function("str", f);
	};
	
	_.trackErrorPos = (function () {
	  // linebreak
	  var lb = /\r\n|[\n\r\u2028\u2029]/g;
	  var minRange = 20,
	      maxRange = 20;
	  function findLine(lines, pos) {
	    var tmpLen = 0;
	    for (var i = 0, len = lines.length; i < len; i++) {
	      var lineLen = (lines[i] || "").length;
	
	      if (tmpLen + lineLen > pos) {
	        return { num: i, line: lines[i], start: pos - i - tmpLen, prev: lines[i - 1], next: lines[i + 1] };
	      }
	      // 1 is for the linebreak
	      tmpLen = tmpLen + lineLen;
	    }
	  }
	  function formatLine(str, start, num, target) {
	    var len = str.length;
	    var min = start - minRange;
	    if (min < 0) min = 0;
	    var max = start + maxRange;
	    if (max > len) max = len;
	
	    var remain = str.slice(min, max);
	    var prefix = "[" + (num + 1) + "] " + (min > 0 ? ".." : "");
	    var postfix = max < len ? ".." : "";
	    var res = prefix + remain + postfix;
	    if (target) res += "\n" + new Array(start - min + prefix.length + 1).join(" ") + "^^^";
	    return res;
	  }
	  return function (input, pos) {
	    if (pos > input.length - 1) pos = input.length - 1;
	    lb.lastIndex = 0;
	    var lines = input.split(lb);
	    var line = findLine(lines, pos);
	    var start = line.start,
	        num = line.num;
	
	    return (line.prev ? formatLine(line.prev, start, num - 1) + '\n' : '') + formatLine(line.line, start, num, true) + '\n' + (line.next ? formatLine(line.next, start, num + 1) + '\n' : '');
	  };
	})();
	
	var ignoredRef = /\((\?\!|\?\:|\?\=)/g;
	_.findSubCapture = function (regStr) {
	  var left = 0,
	      right = 0,
	      len = regStr.length,
	      ignored = regStr.match(ignoredRef); // ignored uncapture
	  if (ignored) ignored = ignored.length;else ignored = 0;
	  for (; len--;) {
	    var letter = regStr.charAt(len);
	    if (len === 0 || regStr.charAt(len - 1) !== "\\") {
	      if (letter === "(") left++;
	      if (letter === ")") right++;
	    }
	  }
	  if (left !== right) throw "RegExp: " + regStr + "'s bracket is not marched";else return left - ignored;
	};
	
	_.escapeRegExp = function (str) {
	  // Credit: XRegExp 0.6.1 (c) 2007-2008 Steven Levithan <http://stevenlevithan.com/regex/xregexp/> MIT License
	  return str.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, function (match) {
	    return '\\' + match;
	  });
	};
	
	var rEntity = new RegExp("&(?:(#x[0-9a-fA-F]+)|(#[0-9]+)|(" + _.keys(entities).join('|') + '));', 'gi');
	
	_.convertEntity = function (chr) {
	
	  return ("" + chr).replace(rEntity, function (all, hex, dec, capture) {
	    var charCode;
	    if (dec) charCode = parseInt(dec.slice(1), 10);else if (hex) charCode = parseInt(hex.slice(2), 16);else charCode = entities[capture];
	
	    return String.fromCharCode(charCode);
	  });
	};
	
	// simple get accessor
	
	_.createObject = Object.create ? function (o) {
	  return Object.create(o || null);
	} : (function () {
	  function Temp() {}
	  return function (o) {
	    if (!o) return {};
	    Temp.prototype = o;
	    var obj = new Temp();
	    Temp.prototype = null; // 不要保持一个 O 的杂散引用（a stray reference）...
	    return obj;
	  };
	})();
	
	_.createProto = function (fn, o) {
	  function Foo() {
	    this.constructor = fn;
	  }
	  Foo.prototype = o;
	  return fn.prototype = new Foo();
	};
	
	_.removeOne = function (list, filter) {
	  var len = list.length;
	  for (; len--;) {
	    if (filter(list[len])) {
	      list.splice(len, 1);
	      return;
	    }
	  }
	};
	
	/**
	clone
	*/
	_.clone = function clone(obj) {
	  if (!obj || typeof obj !== 'object') return obj;
	  if (Array.isArray(obj)) {
	    var cloned = [];
	    for (var i = 0, len = obj.length; i < len; i++) {
	      cloned[i] = obj[i];
	    }
	    return cloned;
	  } else {
	    var cloned = {};
	    for (var i in obj) if (obj.hasOwnProperty(i)) {
	      cloned[i] = obj[i];
	    }
	    return cloned;
	  }
	};
	
	_.equals = function (now, old) {
	  var type = typeof now;
	  if (type === 'number' && typeof old === 'number' && isNaN(now) && isNaN(old)) return true;
	  return now === old;
	};
	
	var dash = /-([a-z])/g;
	_.camelCase = function (str) {
	  return str.replace(dash, function (all, capture) {
	    return capture.toUpperCase();
	  });
	};
	
	_.throttle = function throttle(func, wait) {
	  var wait = wait || 100;
	  var context, args, result;
	  var timeout = null;
	  var previous = 0;
	  var later = function later() {
	    previous = +new Date();
	    timeout = null;
	    result = func.apply(context, args);
	    context = args = null;
	  };
	  return function () {
	    var now = +new Date();
	    var remaining = wait - (now - previous);
	    context = this;
	    args = arguments;
	    if (remaining <= 0 || remaining > wait) {
	      clearTimeout(timeout);
	      timeout = null;
	      previous = now;
	      result = func.apply(context, args);
	      context = args = null;
	    } else if (!timeout) {
	      timeout = setTimeout(later, remaining);
	    }
	    return result;
	  };
	};
	
	// hogan escape
	// ==============
	_.escape = (function () {
	  var rAmp = /&/g,
	      rLt = /</g,
	      rGt = />/g,
	      rApos = /\'/g,
	      rQuot = /\"/g,
	      hChars = /[&<>\"\']/;
	
	  return function (str) {
	    return hChars.test(str) ? str.replace(rAmp, '&amp;').replace(rLt, '&lt;').replace(rGt, '&gt;').replace(rApos, '&#39;').replace(rQuot, '&quot;') : str;
	  };
	})();
	
	_.cache = function (max) {
	  max = max || 1000;
	  var keys = [],
	      cache = {};
	  return {
	    set: function set(key, value) {
	      if (keys.length > this.max) {
	        cache[keys.shift()] = undefined;
	      }
	      //
	      if (cache[key] === undefined) {
	        keys.push(key);
	      }
	      cache[key] = value;
	      return value;
	    },
	    get: function get(key) {
	      if (key === undefined) return cache;
	      return cache[key];
	    },
	    max: max,
	    len: function len() {
	      return keys.length;
	    }
	  };
	};
	
	// // setup the raw Expression
	
	// handle the same logic on component's `on-*` and element's `on-*`
	// return the fire object
	_.handleEvent = function (value, type) {
	  var self = this,
	      evaluate;
	  if (value.type === 'expression') {
	    // if is expression, go evaluated way
	    evaluate = value.get;
	  }
	  if (evaluate) {
	    return function fire(obj) {
	      self.$update(function () {
	        var data = this.data;
	        data.$event = obj;
	        var res = evaluate(self);
	        if (res === false && obj && obj.preventDefault) obj.preventDefault();
	        data.$event = undefined;
	      });
	    };
	  } else {
	    return function fire() {
	      var args = _.slice(arguments);
	      args.unshift(value);
	      self.$update(function () {
	        self.$emit.apply(self, args);
	      });
	    };
	  }
	};
	
	// only call once
	_.once = function (fn) {
	  var time = 0;
	  return function () {
	    if (time++ === 0) fn.apply(this, arguments);
	  };
	};
	
	_.fixObjStr = function (str) {
	  if (str.trim().indexOf('{') !== 0) {
	    return '{' + str + '}';
	  }
	  return str;
	};
	
	_.map = function (array, callback) {
	  var res = [];
	  for (var i = 0, len = array.length; i < len; i++) {
	    res.push(callback(array[i], i));
	  }
	  return res;
	};
	
	function log(msg, type) {
	  if (typeof console !== "undefined") console[type || "log"](msg);
	}
	
	_.log = log;
	
	_.normListener = function (events) {
	  var eventListeners = [];
	  var pType = _.typeOf(events);
	  if (pType === 'array') {
	    return events;
	  } else if (pType === 'object') {
	    for (var i in events) if (events.hasOwnProperty(i)) {
	      eventListeners.push({
	        type: i,
	        listener: events[i]
	      });
	    }
	  }
	  return eventListeners;
	};
	
	//http://www.w3.org/html/wg/drafts/html/master/single-page.html#void-elements
	_.isVoidTag = _.makePredicate("area base br col embed hr img input keygen link menuitem meta param source track wbr r-content");
	_.isBooleanAttr = _.makePredicate('selected checked disabled readonly required open autofocus controls autoplay compact loop defer multiple');
	
	_.isExpr = function (expr) {
	  return expr && expr.type === 'expression';
	};
	// @TODO: make it more strict
	_.isGroup = function (group) {
	  return group.inject || group.$inject;
	};
	
	_.blankReg = /\s+/;
	
	_.getCompileFn = function (source, ctx, options) {
	  return function (passedOptions) {
	    if (passedOptions && options) _.extend(passedOptions, options);else passedOptions = options;
	    return ctx.$compile(source, passedOptions);
	  };
	  return ctx.$compile.bind(ctx, source, options);
	};
	
	// remove directive param from AST
	_.fixTagAST = function (tagAST, Component) {
	
	  if (tagAST.touched) return;
	
	  var attrs = tagAST.attrs;
	
	  if (!attrs) return;
	
	  // Maybe multiple directive need same param,
	  // We place all param in totalParamMap
	  var len = attrs.length;
	  if (!len) return;
	  var directives = [],
	      otherAttrMap = {};
	  for (; len--;) {
	
	    var attr = attrs[len];
	
	    // @IE fix IE9- input type can't assign after value
	    if (attr.name === 'type') attr.priority = MAX_PRIORITY + 1;
	
	    var directive = Component.directive(attr.name);
	    if (directive) {
	
	      attr.priority = directive.priority || 1;
	      attr.directive = true;
	      directives.push(attr);
	    } else if (attr.type === 'attribute') {
	      otherAttrMap[attr.name] = attr.value;
	    }
	  }
	
	  directives.forEach(function (attr) {
	    var directive = Component.directive(attr.name);
	    var param = directive.param;
	    if (param && param.length) {
	      attr.param = {};
	      param.forEach(function (name) {
	        if (name in otherAttrMap) {
	          attr.param[name] = otherAttrMap[name] === undefined ? true : otherAttrMap[name];
	          _.removeOne(attrs, function (attr) {
	            return attr.name === name;
	          });
	        }
	      });
	    }
	  });
	
	  attrs.sort(function (a1, a2) {
	
	    var p1 = a1.priority;
	    var p2 = a2.priority;
	
	    if (p1 == null) p1 = MAX_PRIORITY;
	    if (p2 == null) p2 = MAX_PRIORITY;
	
	    return p2 - p1;
	  });
	
	  tagAST.touched = true;
	};
	
	_.findItem = function (list, filter) {
	  if (!list || !list.length) return;
	  var len = list.length;
	  while (len--) {
	    if (filter(list[len])) return list[len];
	  }
	};
	
	_.getParamObj = function (component, param) {
	  var paramObj = {};
	  if (param) {
	    for (var i in param) if (param.hasOwnProperty(i)) {
	      var value = param[i];
	      paramObj[i] = value && value.type === 'expression' ? component.$get(value) : value;
	    }
	  }
	  return paramObj;
	};
	_.eventReg = /^on-(\w[-\w]+)$/;
	
	_.toText = function (obj) {
	  return obj == null ? "" : "" + obj;
	};
	
	// hogan
	// https://github.com/twitter/hogan.js
	// MIT
	_.escape = (function () {
	  var rAmp = /&/g,
	      rLt = /</g,
	      rGt = />/g,
	      rApos = /\'/g,
	      rQuot = /\"/g,
	      hChars = /[&<>\"\']/;
	
	  function ignoreNullVal(val) {
	    return String(val === undefined || val == null ? '' : val);
	  }
	
	  return function (str) {
	    str = ignoreNullVal(str);
	    return hChars.test(str) ? str.replace(rAmp, '&amp;').replace(rLt, '&lt;').replace(rGt, '&gt;').replace(rApos, '&#39;').replace(rQuot, '&quot;') : str;
	  };
	})();
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(7).setImmediate))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	
	var scope = typeof global !== "undefined" && global || typeof self !== "undefined" && self || window;
	var apply = Function.prototype.apply;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function () {
	  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
	};
	exports.setInterval = function () {
	  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
	};
	exports.clearTimeout = exports.clearInterval = function (timeout) {
	  if (timeout) {
	    timeout.close();
	  }
	};
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function () {};
	Timeout.prototype.close = function () {
	  this._clearFn.call(scope, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function (item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function (item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function (item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout) item._onTimeout();
	    }, msecs);
	  }
	};
	
	// setimmediate attaches itself to the global object
	__webpack_require__(8);
	// On some exotic environments, it's not clear which object `setimmediate` was
	// able to install onto.  Search each possibility in the same order as the
	// `setimmediate` library.
	exports.setImmediate = typeof self !== "undefined" && self.setImmediate || typeof global !== "undefined" && global.setImmediate || undefined && undefined.setImmediate;
	exports.clearImmediate = typeof self !== "undefined" && self.clearImmediate || typeof global !== "undefined" && global.clearImmediate || undefined && undefined.clearImmediate;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {"use strict";
	
	(function (global, undefined) {
	    "use strict";
	
	    if (global.setImmediate) {
	        return;
	    }
	
	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;
	
	    function setImmediate(callback) {
	        // Callback can either be a function or a string
	        if (typeof callback !== "function") {
	            callback = new Function("" + callback);
	        }
	        // Copy function arguments
	        var args = new Array(arguments.length - 1);
	        for (var i = 0; i < args.length; i++) {
	            args[i] = arguments[i + 1];
	        }
	        // Store and register the task
	        var task = { callback: callback, args: args };
	        tasksByHandle[nextHandle] = task;
	        registerImmediate(nextHandle);
	        return nextHandle++;
	    }
	
	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }
	
	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	            case 0:
	                callback();
	                break;
	            case 1:
	                callback(args[0]);
	                break;
	            case 2:
	                callback(args[0], args[1]);
	                break;
	            case 3:
	                callback(args[0], args[1], args[2]);
	                break;
	            default:
	                callback.apply(undefined, args);
	                break;
	        }
	    }
	
	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }
	
	    function installNextTickImplementation() {
	        registerImmediate = function (handle) {
	            process.nextTick(function () {
	                runIfPresent(handle);
	            });
	        };
	    }
	
	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function () {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }
	
	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
	
	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function onGlobalMessage(event) {
	            if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };
	
	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }
	
	        registerImmediate = function (handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }
	
	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function (event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };
	
	        registerImmediate = function (handle) {
	            channel.port2.postMessage(handle);
	        };
	    }
	
	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function (handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }
	
	    function installSetTimeoutImplementation() {
	        registerImmediate = function (handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }
	
	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;
	
	    // Don't get fooled by e.g. browserify environments.
	    if (({}).toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();
	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();
	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();
	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();
	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }
	
	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	})(typeof self === "undefined" ? typeof global === "undefined" ? undefined : global : self);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(5)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	// shim for es5
	"use strict";
	
	var slice = [].slice;
	var tstr = ({}).toString;
	
	function extend(o1, o2) {
	  for (var i in o2) if (o1[i] === undefined) {
	    o1[i] = o2[i];
	  }
	  return o2;
	}
	
	module.exports = function () {
	  // String proto ;
	  extend(String.prototype, {
	    trim: function trim() {
	      return this.replace(/^\s+|\s+$/g, '');
	    }
	  });
	
	  // Array proto;
	  extend(Array.prototype, {
	    indexOf: function indexOf(obj, from) {
	      from = from || 0;
	      for (var i = from, len = this.length; i < len; i++) {
	        if (this[i] === obj) return i;
	      }
	      return -1;
	    },
	    // polyfill from MDN
	    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
	    forEach: function forEach(callback, ctx) {
	      var k = 0;
	
	      // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
	      var O = Object(this);
	
	      var len = O.length >>> 0;
	
	      if (typeof callback !== "function") {
	        throw new TypeError(callback + " is not a function");
	      }
	
	      // 7. Repeat, while k < len
	      while (k < len) {
	
	        var kValue;
	
	        if (k in O) {
	
	          kValue = O[k];
	
	          callback.call(ctx, kValue, k, O);
	        }
	        k++;
	      }
	    },
	    // @deprecated
	    //  will be removed at 0.5.0
	    filter: function filter(fun, context) {
	
	      var t = Object(this);
	      var len = t.length >>> 0;
	      if (typeof fun !== "function") throw new TypeError();
	
	      var res = [];
	      for (var i = 0; i < len; i++) {
	        if (i in t) {
	          var val = t[i];
	          if (fun.call(context, val, i, t)) res.push(val);
	        }
	      }
	
	      return res;
	    }
	  });
	
	  // Function proto;
	  extend(Function.prototype, {
	    bind: function bind(context) {
	      var fn = this;
	      var preArgs = slice.call(arguments, 1);
	      return function () {
	        var args = preArgs.concat(slice.call(arguments));
	        return fn.apply(context, args);
	      };
	    },
	    //@FIXIT
	    __bind__: function __bind__(context) {
	      if (this.__binding__) {
	        return this.__binding__;
	      } else {
	        return this.__binding__ = this.bind.apply(this, arguments);
	      }
	    }
	  });
	
	  // Array
	  extend(Array, {
	    isArray: function isArray(arr) {
	      return tstr.call(arr) === "[object Array]";
	    }
	  });
	};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	// http://stackoverflow.com/questions/1354064/how-to-convert-characters-to-html-entities-using-plain-javascript
	'use strict';
	
	var entities = {
	  'quot': 34,
	  'amp': 38,
	  'apos': 39,
	  'lt': 60,
	  'gt': 62,
	  'nbsp': 160,
	  'iexcl': 161,
	  'cent': 162,
	  'pound': 163,
	  'curren': 164,
	  'yen': 165,
	  'brvbar': 166,
	  'sect': 167,
	  'uml': 168,
	  'copy': 169,
	  'ordf': 170,
	  'laquo': 171,
	  'not': 172,
	  'shy': 173,
	  'reg': 174,
	  'macr': 175,
	  'deg': 176,
	  'plusmn': 177,
	  'sup2': 178,
	  'sup3': 179,
	  'acute': 180,
	  'micro': 181,
	  'para': 182,
	  'middot': 183,
	  'cedil': 184,
	  'sup1': 185,
	  'ordm': 186,
	  'raquo': 187,
	  'frac14': 188,
	  'frac12': 189,
	  'frac34': 190,
	  'iquest': 191,
	  'Agrave': 192,
	  'Aacute': 193,
	  'Acirc': 194,
	  'Atilde': 195,
	  'Auml': 196,
	  'Aring': 197,
	  'AElig': 198,
	  'Ccedil': 199,
	  'Egrave': 200,
	  'Eacute': 201,
	  'Ecirc': 202,
	  'Euml': 203,
	  'Igrave': 204,
	  'Iacute': 205,
	  'Icirc': 206,
	  'Iuml': 207,
	  'ETH': 208,
	  'Ntilde': 209,
	  'Ograve': 210,
	  'Oacute': 211,
	  'Ocirc': 212,
	  'Otilde': 213,
	  'Ouml': 214,
	  'times': 215,
	  'Oslash': 216,
	  'Ugrave': 217,
	  'Uacute': 218,
	  'Ucirc': 219,
	  'Uuml': 220,
	  'Yacute': 221,
	  'THORN': 222,
	  'szlig': 223,
	  'agrave': 224,
	  'aacute': 225,
	  'acirc': 226,
	  'atilde': 227,
	  'auml': 228,
	  'aring': 229,
	  'aelig': 230,
	  'ccedil': 231,
	  'egrave': 232,
	  'eacute': 233,
	  'ecirc': 234,
	  'euml': 235,
	  'igrave': 236,
	  'iacute': 237,
	  'icirc': 238,
	  'iuml': 239,
	  'eth': 240,
	  'ntilde': 241,
	  'ograve': 242,
	  'oacute': 243,
	  'ocirc': 244,
	  'otilde': 245,
	  'ouml': 246,
	  'divide': 247,
	  'oslash': 248,
	  'ugrave': 249,
	  'uacute': 250,
	  'ucirc': 251,
	  'uuml': 252,
	  'yacute': 253,
	  'thorn': 254,
	  'yuml': 255,
	  'fnof': 402,
	  'Alpha': 913,
	  'Beta': 914,
	  'Gamma': 915,
	  'Delta': 916,
	  'Epsilon': 917,
	  'Zeta': 918,
	  'Eta': 919,
	  'Theta': 920,
	  'Iota': 921,
	  'Kappa': 922,
	  'Lambda': 923,
	  'Mu': 924,
	  'Nu': 925,
	  'Xi': 926,
	  'Omicron': 927,
	  'Pi': 928,
	  'Rho': 929,
	  'Sigma': 931,
	  'Tau': 932,
	  'Upsilon': 933,
	  'Phi': 934,
	  'Chi': 935,
	  'Psi': 936,
	  'Omega': 937,
	  'alpha': 945,
	  'beta': 946,
	  'gamma': 947,
	  'delta': 948,
	  'epsilon': 949,
	  'zeta': 950,
	  'eta': 951,
	  'theta': 952,
	  'iota': 953,
	  'kappa': 954,
	  'lambda': 955,
	  'mu': 956,
	  'nu': 957,
	  'xi': 958,
	  'omicron': 959,
	  'pi': 960,
	  'rho': 961,
	  'sigmaf': 962,
	  'sigma': 963,
	  'tau': 964,
	  'upsilon': 965,
	  'phi': 966,
	  'chi': 967,
	  'psi': 968,
	  'omega': 969,
	  'thetasym': 977,
	  'upsih': 978,
	  'piv': 982,
	  'bull': 8226,
	  'hellip': 8230,
	  'prime': 8242,
	  'Prime': 8243,
	  'oline': 8254,
	  'frasl': 8260,
	  'weierp': 8472,
	  'image': 8465,
	  'real': 8476,
	  'trade': 8482,
	  'alefsym': 8501,
	  'larr': 8592,
	  'uarr': 8593,
	  'rarr': 8594,
	  'darr': 8595,
	  'harr': 8596,
	  'crarr': 8629,
	  'lArr': 8656,
	  'uArr': 8657,
	  'rArr': 8658,
	  'dArr': 8659,
	  'hArr': 8660,
	  'forall': 8704,
	  'part': 8706,
	  'exist': 8707,
	  'empty': 8709,
	  'nabla': 8711,
	  'isin': 8712,
	  'notin': 8713,
	  'ni': 8715,
	  'prod': 8719,
	  'sum': 8721,
	  'minus': 8722,
	  'lowast': 8727,
	  'radic': 8730,
	  'prop': 8733,
	  'infin': 8734,
	  'ang': 8736,
	  'and': 8743,
	  'or': 8744,
	  'cap': 8745,
	  'cup': 8746,
	  'int': 8747,
	  'there4': 8756,
	  'sim': 8764,
	  'cong': 8773,
	  'asymp': 8776,
	  'ne': 8800,
	  'equiv': 8801,
	  'le': 8804,
	  'ge': 8805,
	  'sub': 8834,
	  'sup': 8835,
	  'nsub': 8836,
	  'sube': 8838,
	  'supe': 8839,
	  'oplus': 8853,
	  'otimes': 8855,
	  'perp': 8869,
	  'sdot': 8901,
	  'lceil': 8968,
	  'rceil': 8969,
	  'lfloor': 8970,
	  'rfloor': 8971,
	  'lang': 9001,
	  'rang': 9002,
	  'loz': 9674,
	  'spades': 9824,
	  'clubs': 9827,
	  'hearts': 9829,
	  'diams': 9830,
	  'OElig': 338,
	  'oelig': 339,
	  'Scaron': 352,
	  'scaron': 353,
	  'Yuml': 376,
	  'circ': 710,
	  'tilde': 732,
	  'ensp': 8194,
	  'emsp': 8195,
	  'thinsp': 8201,
	  'zwnj': 8204,
	  'zwj': 8205,
	  'lrm': 8206,
	  'rlm': 8207,
	  'ndash': 8211,
	  'mdash': 8212,
	  'lsquo': 8216,
	  'rsquo': 8217,
	  'sbquo': 8218,
	  'ldquo': 8220,
	  'rdquo': 8221,
	  'bdquo': 8222,
	  'dagger': 8224,
	  'Dagger': 8225,
	  'permil': 8240,
	  'lsaquo': 8249,
	  'rsaquo': 8250,
	  'euro': 8364
	};
	
	module.exports = entities;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = {
	  'BEGIN': '{',
	  'END': '}',
	  'PRECOMPILE': false
	};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * render for component in browsers
	 */
	
	'use strict';
	
	var env = __webpack_require__(4);
	var Lexer = __webpack_require__(13);
	var Parser = __webpack_require__(14);
	var _config = __webpack_require__(11);
	var _ = __webpack_require__(6);
	var extend = __webpack_require__(16);
	var shared = __webpack_require__(17);
	var combine = {};
	if (env.browser) {
	  var dom = __webpack_require__(19);
	  var walkers = __webpack_require__(21);
	  var Group = __webpack_require__(25);
	  var doc = dom.doc;
	  combine = __webpack_require__(23);
	}
	var events = __webpack_require__(27);
	var Watcher = __webpack_require__(28);
	var parse = __webpack_require__(18);
	var filter = __webpack_require__(29);
	var ERROR = __webpack_require__(20).ERROR;
	var nodeCursor = __webpack_require__(26);
	var shared = __webpack_require__(17);
	var NOOP = function NOOP() {};
	
	/**
	* `Regular` is regularjs's NameSpace and BaseClass. Every Component is inherited from it
	* 
	* @class Regular
	* @module Regular
	* @constructor
	* @param {Object} options specification of the component
	*/
	var Regular = function Regular(definition, options) {
	  var prevRunning = env.isRunning;
	  env.isRunning = true;
	  var node,
	      template,
	      cursor,
	      context = this,
	      body,
	      mountNode;
	  options = options || {};
	  definition = definition || {};
	
	  var dtemplate = definition.template;
	
	  if (env.browser) {
	
	    if (node = tryGetSelector(dtemplate)) {
	      dtemplate = node;
	    }
	    if (dtemplate && dtemplate.nodeType) {
	      definition.template = dtemplate.innerHTML;
	    }
	
	    mountNode = definition.mountNode;
	    if (typeof mountNode === 'string') {
	      mountNode = dom.find(mountNode);
	      if (!mountNode) throw Error('mountNode ' + mountNode + ' is not found');
	    }
	
	    if (mountNode) {
	      cursor = nodeCursor(mountNode.firstChild);
	      delete definition.mountNode;
	    } else {
	      cursor = options.cursor;
	    }
	  }
	
	  template = shared.initDefinition(context, definition);
	
	  if (context.$parent) {
	    context.$parent._append(context);
	  }
	  context._children = [];
	  context.$refs = {};
	
	  var extra = options.extra;
	  var oldModify = extra && extra.$$modify;
	
	  if (oldModify) {
	    oldModify(this);
	  }
	  context.$root = context.$root || context;
	
	  var newExtra;
	  if (body = context._body) {
	    context._body = null;
	    var modifyBodyComponent = context.modifyBodyComponent;
	    if (typeof modifyBodyComponent === 'function') {
	      modifyBodyComponent = modifyBodyComponent.bind(this);
	      newExtra = _.createObject(extra);
	      newExtra.$$modify = function (comp) {
	        return modifyBodyComponent(comp, oldModify ? oldModify : NOOP);
	      };
	    } else {
	      //@FIXIT: multiply modifier
	      newExtra = extra;
	    }
	    if (body.ast && body.ast.length) {
	      context.$body = _.getCompileFn(body.ast, body.ctx, {
	        outer: context,
	        namespace: options.namespace,
	        extra: newExtra,
	        record: true
	      });
	    }
	  }
	
	  // handle computed
	  if (template) {
	    var cplOpt = {
	      namespace: options.namespace,
	      cursor: cursor
	    };
	    // if(extra && extra.$$modify){
	    cplOpt.extra = { $$modify: extra && extra.$$modify };
	    // }
	    context.group = context.$compile(template, cplOpt);
	    combine.node(context);
	  }
	
	  // this is outest component
	  if (!context.$parent) context.$update();
	  context.$ready = true;
	
	  context.$emit("$init");
	  if (context.init) context.init(context.data);
	  context.$emit("$afterInit");
	
	  env.isRunning = prevRunning;
	
	  // children is not required;
	
	  if (this.devtools) {
	    this.devtools.emit("init", this);
	  }
	};
	
	// check if regular devtools hook exists
	if (typeof window !== 'undefined') {
	  var devtools = window.__REGULAR_DEVTOOLS_GLOBAL_HOOK__;
	  if (devtools) {
	    Regular.prototype.devtools = devtools;
	  }
	}
	
	walkers && (walkers.Regular = Regular);
	
	// description
	// -------------------------
	// 1. Regular and derived Class use same filter
	_.extend(Regular, {
	  // private data stuff
	  _directives: { __regexp__: [] },
	  _plugins: {},
	  _protoInheritCache: ['directive', 'use'],
	  __after__: function __after__(supr, o) {
	
	    var template;
	    this.__after__ = supr.__after__;
	
	    // use name make the component global.
	    if (o.name) Regular.component(o.name, this);
	    // this.prototype.template = dom.initTemplate(o)
	    if (template = o.template) {
	      var node, name;
	      if (env.browser) {
	        if (node = tryGetSelector(template)) template = node;
	        if (template && template.nodeType) {
	
	          if (name = dom.attr(template, 'name')) Regular.component(name, this);
	
	          template = template.innerHTML;
	        }
	      }
	
	      if (typeof template === 'string') {
	        this.prototype.template = _config.PRECOMPILE ? new Parser(template).parse() : template;
	      }
	    }
	
	    if (o.computed) this.prototype.computed = shared.handleComputed(o.computed);
	    // inherit directive and other config from supr
	    Regular._inheritConfig(this, supr);
	  },
	  /**
	   * Define a directive
	   *
	   * @method directive
	   * @return {Object} Copy of ...
	   */
	  directive: function directive(name, cfg) {
	    if (!name) return;
	
	    var type = typeof name;
	    if (type === 'object' && !cfg) {
	      for (var k in name) {
	        if (name.hasOwnProperty(k)) this.directive(k, name[k]);
	      }
	      return this;
	    }
	    var directives = this._directives,
	        directive;
	    if (cfg == null) {
	      if (type === 'string') {
	        if (directive = directives[name]) return directive;else {
	
	          var regexp = directives.__regexp__;
	          for (var i = 0, len = regexp.length; i < len; i++) {
	            directive = regexp[i];
	            var test = directive.regexp.test(name);
	            if (test) return directive;
	          }
	        }
	      }
	    } else {
	      if (typeof cfg === 'function') cfg = { link: cfg };
	      if (type === 'string') directives[name] = cfg;else {
	        cfg.regexp = name;
	        directives.__regexp__.push(cfg);
	      }
	      return this;
	    }
	  },
	  plugin: function plugin(name, fn) {
	    var plugins = this._plugins;
	    if (fn == null) return plugins[name];
	    plugins[name] = fn;
	    return this;
	  },
	  use: function use(fn) {
	    if (typeof fn === "string") fn = Regular.plugin(fn);
	    if (typeof fn !== "function") return this;
	    fn(this, Regular);
	    return this;
	  },
	  // config the Regularjs's global
	  config: function config(name, value) {
	    var needGenLexer = false;
	    if (typeof name === "object") {
	      for (var i in name) {
	        // if you config
	        if (i === "END" || i === 'BEGIN') needGenLexer = true;
	        _config[i] = name[i];
	      }
	    }
	    if (needGenLexer) Lexer.setup();
	  },
	  expression: parse.expression,
	  Parser: Parser,
	  Lexer: Lexer,
	  _addProtoInheritCache: function _addProtoInheritCache(name, transform) {
	    if (Array.isArray(name)) {
	      return name.forEach(Regular._addProtoInheritCache);
	    }
	    var cacheKey = "_" + name + "s";
	    Regular._protoInheritCache.push(name);
	    Regular[cacheKey] = {};
	    if (Regular[name]) return;
	    Regular[name] = function (key, cfg) {
	      var cache = this[cacheKey];
	
	      if (typeof key === "object") {
	        for (var i in key) {
	          if (key.hasOwnProperty(i)) this[name](i, key[i]);
	        }
	        return this;
	      }
	      if (cfg == null) return cache[key];
	      cache[key] = transform ? transform(cfg) : cfg;
	      return this;
	    };
	  },
	  _inheritConfig: function _inheritConfig(self, supr) {
	
	    // prototype inherit some Regular property
	    // so every Component will have own container to serve directive, filter etc..
	    var defs = Regular._protoInheritCache;
	    var keys = _.slice(defs);
	    keys.forEach(function (key) {
	      self[key] = supr[key];
	      var cacheKey = '_' + key + 's';
	      if (supr[cacheKey]) self[cacheKey] = _.createObject(supr[cacheKey]);
	    });
	    return self;
	  }
	
	});
	
	extend(Regular);
	
	Regular._addProtoInheritCache("component");
	
	Regular._addProtoInheritCache("filter", function (cfg) {
	  return typeof cfg === "function" ? { get: cfg } : cfg;
	});
	
	events.mixTo(Regular);
	Watcher.mixTo(Regular);
	
	Regular.implement({
	  init: function init() {},
	  config: function config() {},
	  destroy: function destroy() {
	    // destroy event wont propgation;
	    this.$emit("$destroy");
	    this._watchers = null;
	    this._watchersForStable = null;
	    this.group && this.group.destroy(true);
	    this.group = null;
	    this.parentNode = null;
	    this._children = null;
	    this.$root = null;
	    this._handles = null;
	    this.$refs = null;
	    var parent = this.$parent;
	    if (parent && parent._children) {
	      var index = parent._children.indexOf(this);
	      parent._children.splice(index, 1);
	    }
	    this.$parent = null;
	
	    if (this.devtools) {
	      this.devtools.emit("destroy", this);
	    }
	    this._handles = null;
	    this.$phase = "destroyed";
	  },
	
	  /**
	   * compile a block ast ; return a group;
	   * @param  {Array} parsed ast
	   * @param  {[type]} record
	   * @return {[type]}
	   */
	  $compile: function $compile(ast, options) {
	    options = options || {};
	    if (typeof ast === 'string') {
	      ast = new Parser(ast).parse();
	    }
	    var preExt = this.__ext__,
	        record = options.record,
	        records;
	
	    if (options.extra) this.__ext__ = options.extra;
	
	    if (record) this._record();
	    var group = this._walk(ast, options);
	    if (record) {
	      records = this._release();
	      var self = this;
	      if (records.length) {
	        // auto destroy all wather;
	        group.ondestroy = function () {
	          self.$unwatch(records);
	        };
	      }
	    }
	    if (options.extra) this.__ext__ = preExt;
	    return group;
	  },
	
	  /**
	   * create two-way binding with another component;
	   * *warn*: 
	   *   expr1 and expr2 must can operate set&get, for example: the 'a.b' or 'a[b + 1]' is set-able, but 'a.b + 1' is not, 
	   *   beacuse Regular dont know how to inverse set through the expression;
	   *   
	   *   if before $bind, two component's state is not sync, the component(passed param) will sync with the called component;
	   *
	   * *example: *
	   *
	   * ```javascript
	   * // in this example, we need to link two pager component
	   * var pager = new Pager({}) // pager compoennt
	   * var pager2 = new Pager({}) // another pager component
	   * pager.$bind(pager2, 'current'); // two way bind throw two component
	   * pager.$bind(pager2, 'total');   // 
	   * // or just
	   * pager.$bind(pager2, {"current": "current", "total": "total"}) 
	   * ```
	   * 
	   * @param  {Regular} component the
	   * @param  {String|Expression} expr1     required, self expr1 to operate binding
	   * @param  {String|Expression} expr2     optional, other component's expr to bind with, if not passed, the expr2 will use the expr1;
	   * @return          this;
	   */
	  $bind: function $bind(component, expr1, expr2) {
	    var type = _.typeOf(expr1);
	    if (expr1.type === 'expression' || type === 'string') {
	      this._bind(component, expr1, expr2);
	    } else if (type === "array") {
	      // multiply same path binding through array
	      for (var i = 0, len = expr1.length; i < len; i++) {
	        this._bind(component, expr1[i]);
	      }
	    } else if (type === "object") {
	      for (var i in expr1) if (expr1.hasOwnProperty(i)) {
	        this._bind(component, i, expr1[i]);
	      }
	    }
	    // digest
	    component.$update();
	    return this;
	  },
	  /**
	   * unbind one component( see $bind also)
	   *
	   * unbind will unbind all relation between two component
	   * 
	   * @param  {Regular} component [descriptionegular
	   * @return {This}    this
	   */
	  $unbind: function $unbind() {
	    // todo
	  },
	  $inject: combine.inject,
	  $mute: function $mute(isMute) {
	
	    isMute = !!isMute;
	
	    var needupdate = isMute === false && this._mute;
	
	    this._mute = !!isMute;
	
	    if (needupdate) this.$update();
	    return this;
	  },
	  // private bind logic
	  _bind: function _bind(component, expr1, expr2) {
	
	    var self = this;
	    // basic binding
	
	    if (!component || !(component instanceof Regular)) throw "$bind() should pass Regular component as first argument";
	    if (!expr1) throw "$bind() should  pass as least one expression to bind";
	
	    if (!expr2) expr2 = expr1;
	
	    expr1 = parse.expression(expr1);
	    expr2 = parse.expression(expr2);
	
	    // set is need to operate setting ;
	    if (expr2.set) {
	      var wid1 = this.$watch(expr1, function (value) {
	        component.$update(expr2, value);
	      });
	      component.$on('$destroy', function () {
	        self.$unwatch(wid1);
	      });
	    }
	    if (expr1.set) {
	      var wid2 = component.$watch(expr2, function (value) {
	        self.$update(expr1, value);
	      });
	      // when brother destroy, we unlink this watcher
	      this.$on('$destroy', component.$unwatch.bind(component, wid2));
	    }
	    // sync the component's state to called's state
	    expr2.set(component, expr1.get(this));
	  },
	  _walk: function _walk(ast, options) {
	    if (Array.isArray(ast)) {
	      var res = [];
	
	      for (var i = 0, len = ast.length; i < len; i++) {
	        var ret = this._walk(ast[i], options);
	        if (ret && ret.code === ERROR.UNMATCHED_AST) {
	          ast.splice(i, 1);
	          i--;
	          len--;
	        } else res.push(ret);
	      }
	      return new Group(res);
	    }
	    if (typeof ast === 'string') return doc.createTextNode(ast);
	    return walkers[ast.type || "default"].call(this, ast, options);
	  },
	  _append: function _append(component) {
	    this._children.push(component);
	    component.$parent = this;
	  },
	  _handleEvent: function _handleEvent(elem, type, value, attrs) {
	    var Component = this.constructor,
	        fire = typeof value !== "function" ? _.handleEvent.call(this, value, type) : value,
	        handler = Component.event(type),
	        destroy;
	
	    if (handler) {
	      destroy = handler.call(this, elem, fire, attrs);
	    } else {
	      dom.on(elem, type, fire);
	    }
	    return handler ? destroy : function () {
	      dom.off(elem, type, fire);
	    };
	  },
	  // 1. 用来处理exprBody -> Function
	  // 2. list里的循环
	  _touchExpr: function _touchExpr(expr, ext) {
	    var rawget,
	        ext = this.__ext__,
	        touched = {};
	    if (expr.type !== 'expression' || expr.touched) return expr;
	
	    rawget = expr.get;
	    if (!rawget) {
	      rawget = expr.get = new Function(_.ctxName, _.extName, _.prefix + "return (" + expr.body + ")");
	      expr.body = null;
	    }
	    touched.get = !ext ? rawget : function (context, e) {
	      return rawget(context, e || ext);
	    };
	
	    if (expr.setbody && !expr.set) {
	      var setbody = expr.setbody;
	      var filters = expr.filters;
	      var self = this;
	      if (!filters || !_.some(filters, function (filter) {
	        return !self._f_(filter).set;
	      })) {
	        expr.set = function (ctx, value, ext) {
	          expr.set = new Function(_.ctxName, _.setName, _.extName, _.prefix + setbody);
	          return expr.set(ctx, value, ext);
	        };
	      }
	      expr.filters = expr.setbody = null;
	    }
	    if (expr.set) {
	      touched.set = !ext ? expr.set : function (ctx, value) {
	        return expr.set(ctx, value, ext);
	      };
	    }
	
	    touched.type = 'expression';
	    touched.touched = true;
	    touched.once = expr.once || expr.constant;
	    return touched;
	  },
	  // find filter
	  _f_: function _f_(name) {
	    var Component = this.constructor;
	    var filter = Component.filter(name);
	    if (!filter) throw Error('filter ' + name + ' is undefined');
	    return filter;
	  },
	  // simple accessor get
	  _sg_: function _sg_(path, defaults, ext) {
	    if (path === undefined) return undefined;
	    if (ext && typeof ext === 'object') {
	      if (ext[path] !== undefined) return ext[path];
	    }
	    var computed = this.computed,
	        computedProperty = computed[path];
	    if (computedProperty) {
	      if (computedProperty.type === 'expression' && !computedProperty.get) this._touchExpr(computedProperty);
	      if (computedProperty.get) return computedProperty.get(this);else _.log("the computed '" + path + "' don't define the get function,  get data." + path + " altnately", "warn");
	    }
	
	    if (defaults === undefined) {
	      return undefined;
	    }
	    return defaults[path];
	  },
	  // simple accessor set
	  _ss_: function _ss_(path, value, data, op, computed) {
	    var computed = this.computed,
	        op = op || "=",
	        prev,
	        computedProperty = computed ? computed[path] : null;
	
	    if (op !== '=') {
	      prev = computedProperty ? computedProperty.get(this) : data[path];
	      switch (op) {
	        case "+=":
	          value = prev + value;
	          break;
	        case "-=":
	          value = prev - value;
	          break;
	        case "*=":
	          value = prev * value;
	          break;
	        case "/=":
	          value = prev / value;
	          break;
	        case "%=":
	          value = prev % value;
	          break;
	      }
	    }
	    if (computedProperty) {
	      if (computedProperty.set) return computedProperty.set(this, value);else _.log("the computed '" + path + "' don't define the set function,  assign data." + path + " altnately", "warn");
	    }
	    data[path] = value;
	    return value;
	  }
	});
	
	Regular.prototype.inject = function () {
	  _.log("use $inject instead of inject", "warn");
	  return this.$inject.apply(this, arguments);
	};
	
	// only one builtin filter
	
	Regular.filter(filter);
	
	module.exports = Regular;
	
	function tryGetSelector(tpl) {
	  var node;
	  if (typeof tpl === 'string' && tpl.length < 16 && (node = dom.find(tpl))) {
	    _.log("pass selector as template has be deprecated, pass node or template string instead", 'warn');
	    return node;
	  }
	}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _ = __webpack_require__(6);
	var config = __webpack_require__(11);
	
	// some custom tag  will conflict with the Lexer progress
	var conflictTag = { "}": "{", "]": "[" },
	    map1,
	    map2;
	// some macro for lexer
	var macro = {
	  'NAME': /(?:[:_A-Za-z][-\.:_0-9A-Za-z]*)/,
	  'IDENT': /[\$_A-Za-z][_0-9A-Za-z\$]*/,
	  'SPACE': /[\r\n\t\f ]/
	};
	
	var test = /a|(b)/.exec("a");
	var testSubCapure = test && test[1] === undefined ? function (str) {
	  return str !== undefined;
	} : function (str) {
	  return !!str;
	};
	
	function wrapHander(handler) {
	  return function (all) {
	    return { type: handler, value: all };
	  };
	}
	
	function Lexer(input, opts) {
	  if (conflictTag[config.END]) {
	    this.markStart = conflictTag[config.END];
	    this.markEnd = config.END;
	  }
	
	  this.input = (input || "").trim();
	  this.opts = opts || {};
	  this.map = this.opts.mode !== 2 ? map1 : map2;
	  this.states = ["INIT"];
	  if (opts && opts.expression) {
	    this.states.push("JST");
	    this.expression = true;
	  }
	}
	
	var lo = Lexer.prototype;
	
	lo.lex = function (str) {
	  str = (str || this.input).trim();
	  var tokens = [],
	      split,
	      test,
	      mlen,
	      token,
	      state;
	  this.input = str, this.marks = 0;
	  // init the pos index
	  this.index = 0;
	  var i = 0;
	  while (str) {
	    i++;
	    state = this.state();
	    split = this.map[state];
	    test = split.TRUNK.exec(str);
	    if (!test) {
	      this.error('Unrecoginized Token');
	    }
	    mlen = test[0].length;
	    str = str.slice(mlen);
	    token = this._process.call(this, test, split, str);
	    if (token) tokens.push(token);
	    this.index += mlen;
	    // if(state == 'TAG' || state == 'JST') str = this.skipspace(str);
	  }
	
	  tokens.push({ type: 'EOF' });
	
	  return tokens;
	};
	
	lo.error = function (msg) {
	  throw Error("Parse Error: " + msg + ':\n' + _.trackErrorPos(this.input, this.index));
	};
	
	lo._process = function (args, split, str) {
	  // console.log(args.join(","), this.state())
	  var links = split.links,
	      marched = false,
	      token;
	
	  for (var len = links.length, i = 0; i < len; i++) {
	    var link = links[i],
	        handler = link[2],
	        index = link[0];
	    // if(args[6] === '>' && index === 6) console.log('haha')
	    if (testSubCapure(args[index])) {
	      marched = true;
	      if (handler) {
	        token = handler.apply(this, args.slice(index, index + link[1]));
	        if (token) token.pos = this.index;
	      }
	      break;
	    }
	  }
	  if (!marched) {
	    // in ie lt8 . sub capture is "" but ont
	    switch (str.charAt(0)) {
	      case "<":
	        this.enter("TAG");
	        break;
	      default:
	        this.enter("JST");
	        break;
	    }
	  }
	  return token;
	};
	lo.enter = function (state) {
	  this.states.push(state);
	  return this;
	};
	
	lo.state = function () {
	  var states = this.states;
	  return states[states.length - 1];
	};
	
	lo.leave = function (state) {
	  var states = this.states;
	  if (!state || states[states.length - 1] === state) states.pop();
	};
	
	Lexer.setup = function () {
	  macro.END = config.END;
	  macro.BEGIN = config.BEGIN;
	
	  // living template lexer
	  map1 = genMap([
	  // INIT
	  rules.ENTER_JST, rules.ENTER_TAG, rules.TEXT,
	
	  //TAG
	  rules.TAG_NAME, rules.TAG_OPEN, rules.TAG_CLOSE, rules.TAG_PUNCHOR, rules.TAG_ENTER_JST, rules.TAG_UNQ_VALUE, rules.TAG_STRING, rules.TAG_SPACE, rules.TAG_COMMENT,
	
	  // JST
	  rules.JST_OPEN, rules.JST_CLOSE, rules.JST_COMMENT, rules.JST_EXPR_OPEN, rules.JST_IDENT, rules.JST_SPACE, rules.JST_LEAVE, rules.JST_NUMBER, rules.JST_PUNCHOR, rules.JST_STRING, rules.JST_COMMENT]);
	
	  // ignored the tag-relative token
	  map2 = genMap([
	  // INIT no < restrict
	  rules.ENTER_JST2, rules.TEXT,
	  // JST
	  rules.JST_COMMENT, rules.JST_OPEN, rules.JST_CLOSE, rules.JST_EXPR_OPEN, rules.JST_IDENT, rules.JST_SPACE, rules.JST_LEAVE, rules.JST_NUMBER, rules.JST_PUNCHOR, rules.JST_STRING, rules.JST_COMMENT]);
	};
	
	function genMap(rules) {
	  var rule,
	      map = {},
	      sign;
	  for (var i = 0, len = rules.length; i < len; i++) {
	    rule = rules[i];
	    sign = rule[2] || 'INIT';
	    (map[sign] || (map[sign] = { rules: [], links: [] })).rules.push(rule);
	  }
	  return setup(map);
	}
	
	function setup(map) {
	  var split, rules, trunks, handler, reg, retain, rule;
	  function replaceFn(all, one) {
	    return typeof macro[one] === 'string' ? _.escapeRegExp(macro[one]) : String(macro[one]).slice(1, -1);
	  }
	
	  for (var i in map) {
	
	    split = map[i];
	    split.curIndex = 1;
	    rules = split.rules;
	    trunks = [];
	
	    for (var j = 0, len = rules.length; j < len; j++) {
	      rule = rules[j];
	      reg = rule[0];
	      handler = rule[1];
	
	      if (typeof handler === 'string') {
	        handler = wrapHander(handler);
	      }
	      if (_.typeOf(reg) === 'regexp') reg = reg.toString().slice(1, -1);
	
	      reg = reg.replace(/\{(\w+)\}/g, replaceFn);
	      retain = _.findSubCapture(reg) + 1;
	      split.links.push([split.curIndex, retain, handler]);
	      split.curIndex += retain;
	      trunks.push(reg);
	    }
	    split.TRUNK = new RegExp("^(?:(" + trunks.join(")|(") + "))");
	  }
	  return map;
	}
	
	var rules = {
	
	  // 1. INIT
	  // ---------------
	
	  // mode1's JST ENTER RULE
	  ENTER_JST: [/[^\x00<]*?(?={BEGIN})/, function (all) {
	    this.enter('JST');
	    if (all) return { type: 'TEXT', value: all };
	  }],
	
	  // mode2's JST ENTER RULE
	  ENTER_JST2: [/[^\x00]*?(?={BEGIN})/, function (all) {
	    this.enter('JST');
	    if (all) return { type: 'TEXT', value: all };
	  }],
	
	  ENTER_TAG: [/[^\x00]*?(?=<[\w\/\!])/, function (all) {
	    this.enter('TAG');
	    if (all) return { type: 'TEXT', value: all };
	  }],
	
	  TEXT: [/[^\x00]+/, 'TEXT'],
	
	  // 2. TAG
	  // --------------------
	  TAG_NAME: [/{NAME}/, 'NAME', 'TAG'],
	  TAG_UNQ_VALUE: [/[^\{}&"'=><`\r\n\f\t ]+/, 'UNQ', 'TAG'],
	
	  TAG_OPEN: [/<({NAME})\s*/, function (all, one) {
	    //"
	    return { type: 'TAG_OPEN', value: one };
	  }, 'TAG'],
	  TAG_CLOSE: [/<\/({NAME})[\r\n\f\t ]*>/, function (all, one) {
	    this.leave();
	    return { type: 'TAG_CLOSE', value: one };
	  }, 'TAG'],
	
	  // mode2's JST ENTER RULE
	  TAG_ENTER_JST: [/(?={BEGIN})/, function () {
	    this.enter('JST');
	  }, 'TAG'],
	
	  TAG_PUNCHOR: [/[\>\/=&]/, function (all) {
	    if (all === '>') this.leave();
	    return { type: all, value: all };
	  }, 'TAG'],
	  TAG_STRING: [/'([^']*)'|"([^"]*)\"/, /*'*/function (all, one, two) {
	    var value = one || two || "";
	
	    return { type: 'STRING', value: value };
	  }, 'TAG'],
	
	  TAG_SPACE: [/{SPACE}+/, null, 'TAG'],
	  TAG_COMMENT: [/<\!--([^\x00]*?)--\>/, function (all) {
	    this.leave();
	    // this.leave('TAG')
	  }, 'TAG'],
	
	  // 3. JST
	  // -------------------
	
	  JST_OPEN: ['{BEGIN}#{SPACE}*({IDENT})', function (all, name) {
	    return {
	      type: 'OPEN',
	      value: name
	    };
	  }, 'JST'],
	  JST_LEAVE: [/{END}/, function (all) {
	    if (this.markEnd === all && this.expression) return { type: this.markEnd, value: this.markEnd };
	    if (!this.markEnd || !this.marks) {
	      this.firstEnterStart = false;
	      this.leave('JST');
	      return { type: 'END' };
	    } else {
	      this.marks--;
	      return { type: this.markEnd, value: this.markEnd };
	    }
	  }, 'JST'],
	  JST_CLOSE: [/{BEGIN}\s*\/({IDENT})\s*{END}/, function (all, one) {
	    this.leave('JST');
	    return {
	      type: 'CLOSE',
	      value: one
	    };
	  }, 'JST'],
	  JST_COMMENT: [/{BEGIN}\!([^\x00]*?)\!{END}/, function () {
	    this.leave();
	  }, 'JST'],
	  JST_EXPR_OPEN: ['{BEGIN}', function (all, one) {
	    if (all === this.markStart) {
	      if (this.expression) return { type: this.markStart, value: this.markStart };
	      if (this.firstEnterStart || this.marks) {
	        this.marks++;
	        this.firstEnterStart = false;
	        return { type: this.markStart, value: this.markStart };
	      } else {
	        this.firstEnterStart = true;
	      }
	    }
	    return {
	      type: 'EXPR_OPEN',
	      escape: false
	    };
	  }, 'JST'],
	  JST_IDENT: ['{IDENT}', 'IDENT', 'JST'],
	  JST_SPACE: [/[ \r\n\f]+/, null, 'JST'],
	  JST_PUNCHOR: [/[=!]?==|[-=><+*\/%\!]?\=|\|\||&&|\@\(|\.\.|[<\>\[\]\(\)\-\|\{}\+\*\/%?:\.!,]/, function (all) {
	    return { type: all, value: all };
	  }, 'JST'],
	
	  JST_STRING: [/'([^']*)'|"([^"]*)"/, function (all, one, two) {
	    //"'
	    return { type: 'STRING', value: one || two || "" };
	  }, 'JST'],
	  JST_NUMBER: [/(?:[0-9]*\.[0-9]+|[0-9]+)(e\d+)?/, function (all) {
	    return { type: 'NUMBER', value: parseFloat(all, 10) };
	  }, 'JST']
	};
	
	// setup when first config
	Lexer.setup();
	
	module.exports = Lexer;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _ = __webpack_require__(6);
	
	var config = __webpack_require__(11);
	var node = __webpack_require__(15);
	var Lexer = __webpack_require__(13);
	var varName = _.varName;
	var ctxName = _.ctxName;
	var extName = _.extName;
	var isPath = _.makePredicate("STRING IDENT NUMBER");
	var isKeyWord = _.makePredicate("true false undefined null this Array Date JSON Math NaN RegExp decodeURI decodeURIComponent encodeURI encodeURIComponent parseFloat parseInt Object");
	var isInvalidTag = _.makePredicate("script style");
	var isLastBind = /\.bind$/;
	
	function Parser(input, opts) {
	  opts = opts || {};
	
	  this.input = input;
	  this.tokens = new Lexer(input, opts).lex();
	  this.pos = 0;
	  this.length = this.tokens.length;
	}
	
	var op = Parser.prototype;
	
	op.parse = function () {
	  this.pos = 0;
	  var res = this.program();
	  if (this.ll().type === 'TAG_CLOSE') {
	    this.error("You may got a unclosed Tag");
	  }
	  return res;
	};
	
	op.ll = function (k) {
	  k = k || 1;
	  if (k < 0) k = k + 1;
	  var pos = this.pos + k - 1;
	  if (pos > this.length - 1) {
	    return this.tokens[this.length - 1];
	  }
	  return this.tokens[pos];
	};
	// lookahead
	op.la = function (k) {
	  return (this.ll(k) || '').type;
	};
	
	op.match = function (type, value) {
	  var ll;
	  if (!(ll = this.eat(type, value))) {
	    ll = this.ll();
	    this.error('expect [' + type + (value == null ? '' : ':' + value) + ']" -> got "[' + ll.type + (value == null ? '' : ':' + ll.value) + ']', ll.pos);
	  } else {
	    return ll;
	  }
	};
	
	op.error = function (msg, pos) {
	  msg = "\n【 parse failed 】 " + msg + ':\n\n' + _.trackErrorPos(this.input, typeof pos === 'number' ? pos : this.ll().pos || 0);
	  throw new Error(msg);
	};
	
	op.next = function (k) {
	  k = k || 1;
	  this.pos += k;
	};
	op.eat = function (type, value) {
	  var ll = this.ll();
	  if (typeof type !== 'string') {
	    for (var len = type.length; len--;) {
	      if (ll.type === type[len]) {
	        this.next();
	        return ll;
	      }
	    }
	  } else {
	    if (ll.type === type && (typeof value === 'undefined' || ll.value === value)) {
	      this.next();
	      return ll;
	    }
	  }
	  return false;
	};
	
	// program
	//  :EOF
	//  | (statement)* EOF
	op.program = function () {
	  var statements = [],
	      ll = this.ll();
	  while (ll.type !== 'EOF' && ll.type !== 'TAG_CLOSE') {
	
	    statements.push(this.statement());
	    ll = this.ll();
	  }
	  // if(ll.type === 'TAG_CLOSE') this.error("You may have unmatched Tag")
	  return statements;
	};
	
	// statement
	//  : xml
	//  | jst
	//  | text
	var rRN = /\r\n/g;
	op.statement = function () {
	  var ll = this.ll();
	  switch (ll.type) {
	    case 'NAME':
	    case 'TEXT':
	      var text = ll.value;
	      this.next();
	      while (ll = this.eat(['NAME', 'TEXT'])) {
	        text += ll.value;
	      }
	      return node.text(text.replace(rRN, '\n'));
	    case 'TAG_OPEN':
	      return this.xml();
	    case 'OPEN':
	      return this.directive();
	    case 'EXPR_OPEN':
	      return this.interplation();
	    default:
	      this.error('Unexpected token: ' + this.la());
	  }
	};
	
	// xml
	// stag statement* TAG_CLOSE?(if self-closed tag)
	op.xml = function () {
	  var name, attrs, children, selfClosed;
	  name = this.match('TAG_OPEN').value;
	
	  if (isInvalidTag(name)) {
	    this.error('Invalid Tag: ' + name);
	  }
	  attrs = this.attrs();
	  selfClosed = this.eat('/');
	  this.match('>');
	  if (!selfClosed && !_.isVoidTag(name)) {
	    children = this.program();
	    if (!this.eat('TAG_CLOSE', name)) this.error('expect </' + name + '> got' + 'no matched closeTag');
	  }
	  return node.element(name, attrs, children);
	};
	
	// xentity
	//  -rule(wrap attribute)
	//  -attribute
	//
	// __example__
	//  name = 1 | 
	//  ng-hide |
	//  on-click={{}} |
	//  {{#if name}}on-click={{xx}}{{#else}}on-tap={{}}{{/if}}
	
	op.xentity = function (ll) {
	  var name = ll.value,
	      value,
	      modifier;
	  if (ll.type === 'NAME') {
	    //@ only for test
	    if (~name.indexOf('.')) {
	      var tmp = name.split('.');
	      name = tmp[0];
	      modifier = tmp[1];
	    }
	    if (this.eat("=")) value = this.attvalue(modifier);
	    return node.attribute(name, value, modifier);
	  } else {
	    if (name !== 'if') this.error("current version. ONLY RULE #if #else #elseif is valid in tag, the rule #" + name + ' is invalid');
	    return this['if'](true);
	  }
	};
	
	// stag     ::=    '<' Name (S attr)* S? '>' 
	// attr    ::=     Name Eq attvalue
	op.attrs = function (isAttribute) {
	  var eat;
	  if (!isAttribute) {
	    eat = ["NAME", "OPEN"];
	  } else {
	    eat = ["NAME"];
	  }
	
	  var attrs = [],
	      ll;
	  while (ll = this.eat(eat)) {
	    attrs.push(this.xentity(ll));
	  }
	  return attrs;
	};
	
	// attvalue
	//  : STRING 
	//  | NAME
	op.attvalue = function (mdf) {
	  var ll = this.ll();
	  switch (ll.type) {
	    case "NAME":
	    case "UNQ":
	    case "STRING":
	      this.next();
	      var value = ll.value;
	      return value;
	    case "EXPR_OPEN":
	      return this.interplation();
	    default:
	      this.error('Unexpected token: ' + this.la());
	  }
	};
	
	// {{#}}
	op.directive = function () {
	  var name = this.ll().value;
	  this.next();
	  if (typeof this[name] === 'function') {
	    return this[name]();
	  } else {
	    this.error('Undefined directive[' + name + ']');
	  }
	};
	
	// {{}}
	op.interplation = function () {
	  this.match('EXPR_OPEN');
	  var res = this.expression(true);
	  this.match('END');
	  return res;
	};
	
	// {{~}}
	op.inc = op.include = function () {
	  var content = this.expression();
	  this.match('END');
	  return node.template(content);
	};
	
	// {{#if}}
	op["if"] = function (tag) {
	  var test = this.expression();
	  var consequent = [],
	      alternate = [];
	
	  var container = consequent;
	  var statement = !tag ? "statement" : "attrs";
	
	  this.match('END');
	
	  var ll, close;
	  while (!(close = this.eat('CLOSE'))) {
	    ll = this.ll();
	    if (ll.type === 'OPEN') {
	      switch (ll.value) {
	        case 'else':
	          container = alternate;
	          this.next();
	          this.match('END');
	          break;
	        case 'elseif':
	          this.next();
	          alternate.push(this["if"](tag));
	          return node['if'](test, consequent, alternate);
	        default:
	          container.push(this[statement](true));
	      }
	    } else {
	      container.push(this[statement](true));
	    }
	  }
	  // if statement not matched
	  if (close.value !== "if") this.error('Unmatched if directive');
	  return node["if"](test, consequent, alternate);
	};
	
	// @mark   mustache syntax have natrure dis, canot with expression
	// {{#list}}
	op.list = function () {
	  // sequence can be a list or hash
	  var sequence = this.expression(),
	      variable,
	      ll,
	      track;
	  var consequent = [],
	      alternate = [];
	  var container = consequent;
	
	  this.match('IDENT', 'as');
	
	  variable = this.match('IDENT').value;
	
	  if (this.eat('IDENT', 'by')) {
	    if (this.eat('IDENT', variable + '_index')) {
	      track = true;
	    } else {
	      track = this.expression();
	      if (track.constant) {
	        // true is means constant, we handle it just like xxx_index.
	        track = true;
	      }
	    }
	  }
	
	  this.match('END');
	
	  while (!(ll = this.eat('CLOSE'))) {
	    if (this.eat('OPEN', 'else')) {
	      container = alternate;
	      this.match('END');
	    } else {
	      container.push(this.statement());
	    }
	  }
	
	  if (ll.value !== 'list') this.error('expect ' + 'list got ' + '/' + ll.value + ' ', ll.pos);
	  return node.list(sequence, variable, consequent, alternate, track);
	};
	
	op.expression = function () {
	  var expression;
	  if (this.eat('@(')) {
	    //once bind
	    expression = this.expr();
	    expression.once = true;
	    this.match(')');
	  } else {
	    expression = this.expr();
	  }
	  return expression;
	};
	
	op.expr = function () {
	  this.depend = [];
	
	  var buffer = this.filter();
	
	  var body = buffer.get || buffer;
	  var setbody = buffer.set;
	  return node.expression(body, setbody, !this.depend.length, buffer.filters);
	};
	
	// filter
	// assign ('|' filtername[':' args]) *
	op.filter = function () {
	  var left = this.assign();
	  var ll = this.eat('|');
	  var buffer = [],
	      filters,
	      setBuffer,
	      prefix,
	      attr = "t",
	      set = left.set,
	      get,
	      tmp = "";
	
	  if (ll) {
	    if (set) {
	      setBuffer = [];
	      filters = [];
	    }
	
	    prefix = "(function(" + attr + "){";
	
	    do {
	      var filterName = this.match('IDENT').value;
	      tmp = attr + " = " + ctxName + "._f_('" + filterName + "' ).get.call( " + _.ctxName + "," + attr;
	      if (this.eat(':')) {
	        tmp += ", " + this.arguments("|").join(",") + ");";
	      } else {
	        tmp += ');';
	      }
	      buffer.push(tmp);
	
	      if (set) {
	        // only in runtime ,we can detect  whether  the filter has a set function.
	        filters.push(filterName);
	        setBuffer.unshift(tmp.replace(" ).get.call", " ).set.call"));
	      }
	    } while (ll = this.eat('|'));
	    buffer.push("return " + attr);
	    setBuffer && setBuffer.push("return " + attr);
	
	    get = prefix + buffer.join("") + "})(" + left.get + ")";
	    // we call back to value.
	    if (setBuffer) {
	      // change _ss__(name, _p_) to _s__(name, filterFn(_p_));
	      set = set.replace(_.setName, prefix + setBuffer.join("") + "})(" + _.setName + ")");
	    }
	    // the set function is depend on the filter definition. if it have set method, the set will work
	    var ret = getset(get, set);
	    ret.filters = filters;
	    return ret;
	  }
	  return left;
	};
	
	// assign
	// left-hand-expr = condition
	op.assign = function () {
	  var left = this.condition(),
	      ll;
	  if (ll = this.eat(['=', '+=', '-=', '*=', '/=', '%='])) {
	    if (!left.set) this.error('invalid lefthand expression in assignment expression');
	    return getset(left.set.replace("," + _.setName, "," + this.condition().get).replace("'='", "'" + ll.type + "'"), left.set);
	    // return getset('(' + left.get + ll.type  + this.condition().get + ')', left.set);
	  }
	  return left;
	};
	
	// or
	// or ? assign : assign
	op.condition = function () {
	
	  var test = this.or();
	  if (this.eat('?')) {
	    return getset([test.get + "?", this.assign().get, this.match(":").type, this.assign().get].join(""));
	  }
	
	  return test;
	};
	
	// and
	// and && or
	op.or = function () {
	
	  var left = this.and();
	
	  if (this.eat('||')) {
	    return getset(left.get + '||' + this.or().get);
	  }
	
	  return left;
	};
	// equal
	// equal && and
	op.and = function () {
	
	  var left = this.equal();
	
	  if (this.eat('&&')) {
	    return getset(left.get + '&&' + this.and().get);
	  }
	  return left;
	};
	// relation
	//
	// equal == relation
	// equal != relation
	// equal === relation
	// equal !== relation
	op.equal = function () {
	  var left = this.relation(),
	      ll;
	  // @perf;
	  if (ll = this.eat(['==', '!=', '===', '!=='])) {
	    return getset(left.get + ll.type + this.equal().get);
	  }
	  return left;
	};
	// relation < additive
	// relation > additive
	// relation <= additive
	// relation >= additive
	// relation in additive
	op.relation = function () {
	  var left = this.additive(),
	      ll;
	  // @perf
	  if (ll = this.eat(['<', '>', '>=', '<=']) || this.eat('IDENT', 'in')) {
	    return getset(left.get + ll.value + this.relation().get);
	  }
	  return left;
	};
	// additive :
	// multive
	// additive + multive
	// additive - multive
	op.additive = function () {
	  var left = this.multive(),
	      ll;
	  if (ll = this.eat(['+', '-'])) {
	    return getset(left.get + ll.value + this.additive().get);
	  }
	  return left;
	};
	// multive :
	// unary
	// multive * unary
	// multive / unary
	// multive % unary
	op.multive = function () {
	  var left = this.range(),
	      ll;
	  if (ll = this.eat(['*', '/', '%'])) {
	    return getset(left.get + ll.type + this.multive().get);
	  }
	  return left;
	};
	
	op.range = function () {
	  var left = this.unary(),
	      ll,
	      right;
	
	  if (ll = this.eat('..')) {
	    right = this.unary();
	    var body = "(function(start,end){var res = [],step=end>start?1:-1; for(var i = start; end>start?i <= end: i>=end; i=i+step){res.push(i); } return res })(" + left.get + "," + right.get + ")";
	    return getset(body);
	  }
	
	  return left;
	};
	
	// lefthand
	// + unary
	// - unary
	// ~ unary
	// ! unary
	op.unary = function () {
	  var ll;
	  if (ll = this.eat(['+', '-', '~', '!'])) {
	    return getset('(' + ll.type + this.unary().get + ')');
	  } else {
	    return this.member();
	  }
	};
	
	// call[lefthand] :
	// member args
	// member [ expression ]
	// member . ident 
	
	op.member = function (base, last, pathes, prevBase) {
	  var ll, path;
	
	  var onlySimpleAccessor = false;
	  if (!base) {
	    //first
	    path = this.primary();
	    var type = typeof path;
	    if (type === 'string') {
	      pathes = [];
	      pathes.push(path);
	      last = path;
	      base = ctxName + "._sg_('" + path + "', " + varName + ", " + extName + ")";
	      onlySimpleAccessor = true;
	    } else {
	      //Primative Type
	      if (path.get === 'this') {
	        base = ctxName;
	        pathes = ['this'];
	      } else {
	        pathes = null;
	        base = path.get;
	      }
	    }
	  } else {
	    // not first enter
	    if (typeof last === 'string' && isPath(last)) {
	      // is valid path
	      pathes.push(last);
	    } else {
	      if (pathes && pathes.length) this.depend.push(pathes);
	      pathes = null;
	    }
	  }
	  if (ll = this.eat(['[', '.', '('])) {
	    switch (ll.type) {
	      case '.':
	        // member(object, property, computed)
	        var tmpName = this.match('IDENT').value;
	        prevBase = base;
	        if (this.la() !== "(") {
	          base = ctxName + "._sg_('" + tmpName + "', " + base + ")";
	        } else {
	          base += "." + tmpName;
	        }
	        return this.member(base, tmpName, pathes, prevBase);
	      case '[':
	        // member(object, property, computed)
	        path = this.assign();
	        prevBase = base;
	        if (this.la() !== "(") {
	          // means function call, we need throw undefined error when call function
	          // and confirm that the function call wont lose its context
	          base = ctxName + "._sg_(" + path.get + ", " + base + ")";
	        } else {
	          base += "[" + path.get + "]";
	        }
	        this.match(']');
	        return this.member(base, path, pathes, prevBase);
	      case '(':
	        // call(callee, args)
	
	        base = base.replace(isLastBind, '.__bind__');
	        var args = this.arguments().join(',');
	
	        base = base + "(" + args + ")";
	        this.match(')');
	        return this.member(base, null, pathes);
	    }
	  }
	  if (pathes && pathes.length) this.depend.push(pathes);
	  var res = { get: base };
	  if (last) {
	    res.set = ctxName + "._ss_(" + (last.get ? last.get : "'" + last + "'") + "," + _.setName + "," + (prevBase ? prevBase : _.varName) + ", '=', " + (onlySimpleAccessor ? 1 : 0) + ")";
	  }
	  return res;
	};
	
	/**
	 * 
	 */
	op.arguments = function (end) {
	  end = end || ')';
	  var args = [];
	  do {
	    if (this.la() !== end) {
	      args.push(this.assign().get);
	    }
	  } while (this.eat(','));
	  return args;
	};
	
	// primary :
	// this
	// ident
	// literal
	// array
	// object
	// ( expression )
	
	op.primary = function () {
	  var ll = this.ll();
	  switch (ll.type) {
	    case "{":
	      return this.object();
	    case "[":
	      return this.array();
	    case "(":
	      return this.paren();
	    // literal or ident
	    case 'STRING':
	      this.next();
	      var value = "" + ll.value;
	      var quota = ~value.indexOf("'") ? "\"" : "'";
	      return getset(quota + value + quota);
	    case 'NUMBER':
	      this.next();
	      return getset("" + ll.value);
	    case "IDENT":
	      this.next();
	      if (isKeyWord(ll.value)) {
	        return getset(ll.value);
	      }
	      return ll.value;
	    default:
	      this.error('Unexpected Token: ' + ll.type);
	  }
	};
	
	// object
	//  {propAssign [, propAssign] * [,]}
	
	// propAssign
	//  prop : assign
	
	// prop
	//  STRING
	//  IDENT
	//  NUMBER
	
	op.object = function () {
	  var code = [this.match('{').type];
	
	  var ll = this.eat(['STRING', 'IDENT', 'NUMBER']);
	  while (ll) {
	    code.push("'" + ll.value + "'" + this.match(':').type);
	    var get = this.assign().get;
	    code.push(get);
	    ll = null;
	    if (this.eat(",") && (ll = this.eat(['STRING', 'IDENT', 'NUMBER']))) code.push(",");
	  }
	  code.push(this.match('}').type);
	  return { get: code.join("") };
	};
	
	// array
	// [ assign[,assign]*]
	op.array = function () {
	  var code = [this.match('[').type],
	      item;
	  if (this.eat("]")) {
	
	    code.push("]");
	  } else {
	    while (item = this.assign()) {
	      code.push(item.get);
	      if (this.eat(',')) code.push(",");else break;
	    }
	    code.push(this.match(']').type);
	  }
	  return { get: code.join("") };
	};
	
	// '(' expression ')'
	op.paren = function () {
	  this.match('(');
	  var res = this.filter();
	  res.get = '(' + res.get + ')';
	  res.set = res.set;
	  this.match(')');
	  return res;
	};
	
	function getset(get, set) {
	  return {
	    get: get,
	    set: set
	  };
	}
	
	module.exports = Parser;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = {
	  element: function element(name, attrs, children) {
	    return {
	      type: 'element',
	      tag: name,
	      attrs: attrs,
	      children: children
	    };
	  },
	  attribute: function attribute(name, value, mdf) {
	    return {
	      type: 'attribute',
	      name: name,
	      value: value,
	      mdf: mdf
	    };
	  },
	  "if": function _if(test, consequent, alternate) {
	    return {
	      type: 'if',
	      test: test,
	      consequent: consequent,
	      alternate: alternate
	    };
	  },
	  list: function list(sequence, variable, body, alternate, track) {
	    return {
	      type: 'list',
	      sequence: sequence,
	      alternate: alternate,
	      variable: variable,
	      body: body,
	      track: track
	    };
	  },
	  expression: function expression(body, setbody, constant, filters) {
	    return {
	      type: "expression",
	      body: body,
	      constant: constant || false,
	      setbody: setbody || false,
	      filters: filters
	    };
	  },
	  text: function text(_text) {
	    return {
	      type: "text",
	      text: _text
	    };
	  },
	  template: function template(_template) {
	    return {
	      type: 'template',
	      content: _template
	    };
	  }
	};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	// (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	// Backbone may be freely distributed under the MIT license.
	// For all details and documentation:
	// http://backbonejs.org
	
	// klass: a classical JS OOP façade
	// https://github.com/ded/klass
	// License MIT (c) Dustin Diaz 2014
	
	// inspired by backbone's extend and klass
	"use strict";
	
	var _ = __webpack_require__(6),
	    fnTest = /xy/.test(function () {
	  "xy";
	}) ? /\bsupr\b/ : /.*/,
	    isFn = function isFn(o) {
	  return typeof o === "function";
	};
	
	var hooks = {
	  events: function events(propertyValue, proto) {
	    var eventListeners = proto._eventListeners || [];
	    var normedEvents = _.normListener(propertyValue);
	
	    if (normedEvents.length) {
	      proto._eventListeners = eventListeners.concat(normedEvents);
	    }
	    delete proto.events;
	  }
	};
	
	function wrap(k, fn, supro) {
	  return function () {
	    var tmp = this.supr;
	    this.supr = supro[k];
	    var ret = fn.apply(this, arguments);
	    this.supr = tmp;
	    return ret;
	  };
	}
	
	function process(what, o, supro) {
	  for (var k in o) {
	    if (o.hasOwnProperty(k)) {
	      if (hooks[k]) {
	        hooks[k](o[k], what, supro);
	      }
	      what[k] = isFn(o[k]) && isFn(supro[k]) && fnTest.test(o[k]) ? wrap(k, o[k], supro) : o[k];
	    }
	  }
	}
	
	// if the property is ["events", "data", "computed"] , we should merge them
	var merged = ["data", "computed"],
	    mlen = merged.length;
	module.exports = function extend(o) {
	  o = o || {};
	  var supr = this,
	      proto,
	      supro = supr && supr.prototype || {};
	
	  if (typeof o === 'function') {
	    proto = o.prototype;
	    o.implement = implement;
	    o.extend = extend;
	    return o;
	  }
	
	  function fn() {
	    supr.apply(this, arguments);
	  }
	
	  proto = _.createProto(fn, supro);
	
	  function implement(o) {
	    // we need merge the merged property
	    var len = mlen;
	    for (; len--;) {
	      var prop = merged[len];
	      if (proto[prop] && o.hasOwnProperty(prop) && proto.hasOwnProperty(prop)) {
	        _.extend(proto[prop], o[prop], true);
	        delete o[prop];
	      }
	    }
	
	    process(proto, o, supro);
	    return this;
	  }
	
	  fn.implement = implement;
	  fn.implement(o);
	  if (supr.__after__) supr.__after__.call(fn, supr, o);
	  fn.extend = extend;
	  return fn;
	};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(6);
	var config = __webpack_require__(11);
	var parse = __webpack_require__(18);
	var node = __webpack_require__(15);
	
	function initDefinition(context, definition, beforeConfig) {
	
	  var eventConfig,
	      hasInstanceComputed = !!definition.computed,
	      template;
	  var usePrototyeString = typeof context.template === 'string' && !definition.template;
	
	  // template is a string (len < 16). we will find it container first
	
	  definition.data = definition.data || {};
	  definition.computed = definition.computed || {};
	  if (context.data) _.extend(definition.data, context.data);
	  if (context.computed) _.extend(definition.computed, context.computed);
	
	  var listeners = context._eventListeners || [];
	  var normListener;
	  // hanle initialized event binding
	  if (definition.events) {
	    normListener = _.normListener(definition.events);
	    if (normListener.length) {
	      listeners = listeners.concat(normListener);
	    }
	    delete definition.events;
	  }
	
	  definition.data = definition.data || {};
	  definition.computed = definition.computed || {};
	  if (context.data) _.extend(definition.data, context.data);
	  if (context.computed) _.extend(definition.computed, context.computed);
	
	  var usePrototyeString = typeof context.template === 'string' && !definition.template;
	
	  _.extend(context, definition, true);
	
	  if (listeners && listeners.length) {
	    listeners.forEach(function (item) {
	      context.$on(item.type, item.listener);
	    });
	  }
	
	  // we need add some logic at client.
	  beforeConfig && beforeConfig();
	
	  // only have instance computed, we need prepare the property
	  if (hasInstanceComputed) context.computed = handleComputed(context.computed);
	
	  context.$emit("$config", context.data);
	  context.config && context.config(context.data);
	  context.$emit("$afterConfig", context.data);
	
	  template = context.template;
	
	  if (typeof template === 'string') {
	    template = parse.parse(template);
	    if (usePrototyeString) {
	      // avoid multiply compile
	      context.constructor.prototype.template = template;
	    } else {
	      delete context.template;
	    }
	  }
	  return template;
	}
	
	var handleComputed = (function () {
	  // wrap the computed getter;
	  function wrapGet(get) {
	    return function (context) {
	      return get.call(context, context.data);
	    };
	  }
	  // wrap the computed setter;
	  function wrapSet(set) {
	    return function (context, value) {
	      set.call(context, value, context.data);
	      return value;
	    };
	  }
	
	  return function (computed) {
	    if (!computed) return;
	    var parsedComputed = {},
	        handle,
	        pair,
	        type;
	    for (var i in computed) {
	      handle = computed[i];
	      type = typeof handle;
	
	      if (handle.type === 'expression') {
	        parsedComputed[i] = handle;
	        continue;
	      }
	      if (type === "string") {
	        parsedComputed[i] = parse.expression(handle);
	      } else {
	        pair = parsedComputed[i] = { type: 'expression' };
	        if (type === "function") {
	          pair.get = wrapGet(handle);
	        } else {
	          if (handle.get) pair.get = wrapGet(handle.get);
	          if (handle.set) pair.set = wrapSet(handle.set);
	        }
	      }
	    }
	    return parsedComputed;
	  };
	})();
	
	function prepareAttr(ast, directive) {
	  if (ast.parsed) return ast;
	  var value = ast.value;
	  var name = ast.name,
	      body,
	      constant;
	  if (typeof value === 'string' && ~value.indexOf(config.BEGIN) && ~value.indexOf(config.END)) {
	    if (!directive || !directive.nps) {
	      var parsed = parse.parse(value, { mode: 2 });
	      if (parsed.length === 1 && parsed[0].type === 'expression') {
	        body = parsed[0];
	      } else {
	        constant = true;
	        body = [];
	        parsed.forEach(function (item) {
	          if (!item.constant) constant = false;
	          // silent the mutiple inteplation
	          body.push(item.body || "'" + item.text.replace(/'/g, "\\'") + "'");
	        });
	        body = node.expression("[" + body.join(",") + "].join('')", null, constant);
	      }
	      ast.value = body;
	    }
	  }
	  ast.parsed = true;
	  return ast;
	}
	
	module.exports = {
	  // share logic between server and client
	  initDefinition: initDefinition,
	  handleComputed: handleComputed,
	  prepareAttr: prepareAttr
	};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var exprCache = __webpack_require__(4).exprCache;
	var _ = __webpack_require__(6);
	var Parser = __webpack_require__(14);
	module.exports = {
	  expression: function expression(expr, simple) {
	    // @TODO cache
	    if (typeof expr === 'string' && (expr = expr.trim())) {
	      expr = exprCache.get(expr) || exprCache.set(expr, new Parser(expr, { mode: 2, expression: true }).expression());
	    }
	    if (expr) return expr;
	  },
	  parse: function parse(template) {
	    return new Parser(template).parse();
	  }
	};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	/*jshint -W082 */
	
	// thanks for angular && mootools for some concise&cross-platform  implemention
	// =====================================
	
	// The MIT License
	// Copyright (c) 2010-2014 Google, Inc. http://angularjs.org
	
	// ---
	// license: MIT-style license. http://mootools.net
	
	"use strict";
	
	if (typeof window !== 'undefined') {
	  var dom;
	  var env;
	
	  var _;
	
	  var consts;
	  var tNode;
	  var addEvent, removeEvent;
	  var noop;
	  var namespaces;
	  var camelCase;
	  var specialAttr;
	  var rMouseEvent;
	  var doc;
	  var k;
	
	  (function () {
	
	    // simple Event wrap
	
	    //http://stackoverflow.com/questions/11068196/ie8-ie7-onchange-event-is-emited-only-after-repeated-selection
	
	    var fixEventName = function fixEventName(elem, name) {
	      return name === 'change' && dom.msie < 9 && elem && elem.tagName && elem.tagName.toLowerCase() === 'input' && (elem.type === 'checkbox' || elem.type === 'radio') ? 'click' : name;
	    };
	
	    var Event = function Event(ev) {
	      ev = ev || window.event;
	      if (ev._fixed) return ev;
	      this.event = ev;
	      this.target = ev.target || ev.srcElement;
	
	      var type = this.type = ev.type;
	      var button = this.button = ev.button;
	
	      // if is mouse event patch pageX
	      if (rMouseEvent.test(type)) {
	        //fix pageX
	        this.pageX = ev.pageX != null ? ev.pageX : ev.clientX + doc.scrollLeft;
	        this.pageY = ev.pageX != null ? ev.pageY : ev.clientY + doc.scrollTop;
	        if (type === 'mouseover' || type === 'mouseout') {
	          // fix relatedTarget
	          var related = ev.relatedTarget || ev[(type === 'mouseover' ? 'from' : 'to') + 'Element'];
	          while (related && related.nodeType === 3) related = related.parentNode;
	          this.relatedTarget = related;
	        }
	      }
	      // if is mousescroll
	      if (type === 'DOMMouseScroll' || type === 'mousewheel') {
	        // ff ev.detail: 3    other ev.wheelDelta: -120
	        this.wheelDelta = ev.wheelDelta ? ev.wheelDelta / 120 : -(ev.detail || 0) / 3;
	      }
	
	      // fix which
	      this.which = ev.which || ev.keyCode;
	      if (!this.which && button !== undefined) {
	        // http://api.jquery.com/event.which/ use which
	        this.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
	      }
	      this._fixed = true;
	    };
	
	    dom = module.exports;
	    env = __webpack_require__(4);
	    _ = __webpack_require__(6);
	    consts = __webpack_require__(20);
	    tNode = document.createElement('div');
	
	    noop = function noop() {};
	
	    namespaces = consts.NAMESPACE;
	
	    dom.body = document.body;
	    dom.doc = document;
	    dom.tNode = tNode;
	
	    // camelCase
	
	    camelCase = function camelCase(str) {
	      return ("" + str).replace(/-\D/g, function (match) {
	        return match.charAt(1).toUpperCase();
	      });
	    };
	
	    if (tNode.addEventListener) {
	      addEvent = function (node, type, fn) {
	        node.addEventListener(type, fn, false);
	      };
	      removeEvent = function (node, type, fn) {
	        node.removeEventListener(type, fn, false);
	      };
	    } else {
	      addEvent = function (node, type, fn) {
	        node.attachEvent('on' + type, fn);
	      };
	      removeEvent = function (node, type, fn) {
	        node.detachEvent('on' + type, fn);
	      };
	    }
	
	    dom.msie = parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
	    if (isNaN(dom.msie)) {
	      dom.msie = parseInt((/trident\/.*; rv:(\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
	    }
	
	    dom.find = function (sl) {
	      if (document.querySelector) {
	        try {
	          return document.querySelector(sl);
	        } catch (e) {}
	      }
	      if (sl.indexOf('#') !== -1) return document.getElementById(sl.slice(1));
	    };
	
	    dom.inject = function (node, refer, position) {
	
	      position = position || 'bottom';
	      if (!node) return;
	      if (Array.isArray(node)) {
	        var tmp = node;
	        node = dom.fragment();
	        for (var i = 0, len = tmp.length; i < len; i++) {
	          node.appendChild(tmp[i]);
	        }
	      }
	
	      var firstChild, next;
	      switch (position) {
	        case 'bottom':
	          refer.appendChild(node);
	          break;
	        case 'top':
	          if (firstChild = refer.firstChild) {
	            refer.insertBefore(node, refer.firstChild);
	          } else {
	            refer.appendChild(node);
	          }
	          break;
	        case 'after':
	          if (next = refer.nextSibling) {
	            next.parentNode.insertBefore(node, next);
	          } else {
	            refer.parentNode.appendChild(node);
	          }
	          break;
	        case 'before':
	          refer.parentNode.insertBefore(node, refer);
	      }
	    };
	
	    dom.id = function (id) {
	      return document.getElementById(id);
	    };
	
	    // createElement
	    dom.create = function (type, ns) {
	      if (ns === 'svg') {
	        if (!env.svg) throw Error('the env need svg support');
	        ns = namespaces.svg;
	      }
	      return !ns ? document.createElement(type) : document.createElementNS(ns, type);
	    };
	
	    // documentFragment
	    dom.fragment = function () {
	      return document.createDocumentFragment();
	    };
	
	    specialAttr = {
	      'class': function _class(node, value) {
	        'className' in node && (!node.namespaceURI || node.namespaceURI === namespaces.html) ? node.className = value || '' : node.setAttribute('class', value);
	      },
	      'for': function _for(node, value) {
	        'htmlFor' in node ? node.htmlFor = value : node.setAttribute('for', value);
	      },
	      'style': function style(node, value) {
	        node.style ? node.style.cssText = value : node.setAttribute('style', value);
	      },
	      'value': function value(node, _value) {
	        node.value = _value != null ? _value : '';
	      }
	    };
	
	    // attribute Setter & Getter
	    dom.attr = function (node, name, value) {
	      if (_.isBooleanAttr(name)) {
	        if (typeof value !== 'undefined') {
	          if (!!value) {
	            node[name] = true;
	            node.setAttribute(name, name);
	            // lt ie7 . the javascript checked setting is in valid
	            //http://bytes.com/topic/javascript/insights/799167-browser-quirk-dynamically-appended-checked-checkbox-does-not-appear-checked-ie
	            if (dom.msie && dom.msie <= 7 && name === 'checked') node.defaultChecked = true;
	          } else {
	            node[name] = false;
	            node.removeAttribute(name);
	          }
	        } else {
	          return node[name] || (node.attributes.getNamedItem(name) || noop).specified ? name : undefined;
	        }
	      } else if (typeof value !== 'undefined') {
	        // if in specialAttr;
	        if (specialAttr[name]) specialAttr[name](node, value);else if (value === null) node.removeAttribute(name);else node.setAttribute(name, value);
	      } else if (node.getAttribute) {
	        // the extra argument "2" is to get the right thing for a.href in IE, see jQuery code
	        // some elements (e.g. Document) don't have get attribute, so return undefined
	        var ret = node.getAttribute(name, 2);
	        // normalize non-existing attributes to undefined (as jQuery)
	        return ret === null ? undefined : ret;
	      }
	    };
	
	    dom.on = function (node, type, handler) {
	      var types = type.split(' ');
	      handler.real = function (ev) {
	        var $event = new Event(ev);
	        $event.origin = node;
	        handler.call(node, $event);
	      };
	      types.forEach(function (type) {
	        type = fixEventName(node, type);
	        addEvent(node, type, handler.real);
	      });
	      return dom;
	    };
	    dom.off = function (node, type, handler) {
	      var types = type.split(' ');
	      handler = handler.real || handler;
	      types.forEach(function (type) {
	        type = fixEventName(node, type);
	        removeEvent(node, type, handler);
	      });
	    };
	
	    dom.text = (function () {
	      var map = {};
	      if (dom.msie && dom.msie < 9) {
	        map[1] = 'innerText';
	        map[3] = 'nodeValue';
	      } else {
	        map[1] = map[3] = 'textContent';
	      }
	
	      return function (node, value) {
	        var textProp = map[node.nodeType];
	        if (value == null) {
	          return textProp ? node[textProp] : '';
	        }
	        node[textProp] = value;
	      };
	    })();
	
	    dom.html = function (node, html) {
	      if (typeof html === "undefined") {
	        return node.innerHTML;
	      } else {
	        node.innerHTML = html;
	      }
	    };
	
	    dom.replace = function (node, replaced) {
	      if (replaced.parentNode) replaced.parentNode.replaceChild(node, replaced);
	    };
	
	    dom.remove = function (node) {
	      if (node.parentNode) node.parentNode.removeChild(node);
	    };
	
	    // css Settle & Getter from angular
	    // =================================
	    // it isnt computed style
	    dom.css = function (node, name, value) {
	      if (typeof name === "object" && name) {
	        for (var i in name) {
	          if (name.hasOwnProperty(i)) {
	            dom.css(node, i, name[i]);
	          }
	        }
	        return;
	      }
	      if (typeof value !== "undefined") {
	
	        name = camelCase(name);
	        if (name) node.style[name] = value;
	      } else {
	
	        var val;
	        if (dom.msie <= 8) {
	          // this is some IE specific weirdness that jQuery 1.6.4 does not sure why
	          val = node.currentStyle && node.currentStyle[name];
	          if (val === '') val = 'auto';
	        }
	        val = val || node.style[name];
	        if (dom.msie <= 8) {
	          val = val === '' ? undefined : val;
	        }
	        return val;
	      }
	    };
	
	    dom.addClass = function (node, className) {
	      var current = node.className || "";
	      if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
	        node.className = current ? current + " " + className : className;
	      }
	    };
	
	    dom.delClass = function (node, className) {
	      var current = node.className || "";
	      node.className = (" " + current + " ").replace(" " + className + " ", " ").trim();
	    };
	
	    dom.hasClass = function (node, className) {
	      var current = node.className || "";
	      return (" " + current + " ").indexOf(" " + className + " ") !== -1;
	    };rMouseEvent = /^(?:click|dblclick|contextmenu|DOMMouseScroll|mouse(?:\w+))$/;
	    doc = document;
	
	    doc = !doc.compatMode || doc.compatMode === 'CSS1Compat' ? doc.documentElement : doc.body;
	
	    _.extend(Event.prototype, {
	      stop: function stop() {
	        this.preventDefault().stopPropagation();
	      },
	      preventDefault: function preventDefault() {
	        if (this.event.preventDefault) this.event.preventDefault();else this.event.returnValue = false;
	        return this;
	      },
	      stopPropagation: function stopPropagation() {
	        if (this.event.stopPropagation) this.event.stopPropagation();else this.event.cancelBubble = true;
	        return this;
	      },
	      stopImmediatePropagation: function stopImmediatePropagation() {
	        if (this.event.stopImmediatePropagation) this.event.stopImmediatePropagation();
	      }
	    });
	
	    dom.nextFrame = (function () {
	      var request = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
	        return setTimeout(callback, 16);
	      };
	
	      var cancel = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || function (tid) {
	        clearTimeout(tid);
	      };
	
	      return function (callback) {
	        var id = request(callback);
	        return function () {
	          cancel(id);
	        };
	      };
	    })();
	
	    // 3ks for angular's raf  service
	
	    dom.nextReflow = dom.msie ? function (callback) {
	      return dom.nextFrame(function () {
	        k = document.body.offsetWidth;
	        callback();
	      });
	    } : dom.nextFrame;
	  })();
	}

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = {
	  'COMPONENT_TYPE': 1,
	  'ELEMENT_TYPE': 2,
	  'ERROR': {
	    'UNMATCHED_AST': 101
	  },
	  "MSG": {
	    101: "Unmatched ast and mountNode, report issue at https://github.com/regularjs/regular/issues"
	  },
	  'NAMESPACE': {
	    html: "http://www.w3.org/1999/xhtml",
	    svg: "http://www.w3.org/2000/svg"
	  },
	  'OPTIONS': {
	    'STABLE_INIT': { stable: !0, init: !0 },
	    'FORCE_INIT': { force: !0, init: !0 },
	    'STABLE': { stable: !0 },
	    'INIT': { init: !0 },
	    'SYNC': { sync: !0 },
	    'FORCE': { force: !0 }
	  }
	};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var diffArray = __webpack_require__(22).diffArray;
	var combine = __webpack_require__(23);
	var animate = __webpack_require__(24);
	var Parser = __webpack_require__(14);
	var node = __webpack_require__(15);
	var Group = __webpack_require__(25);
	var dom = __webpack_require__(19);
	var _ = __webpack_require__(6);
	var consts = __webpack_require__(20);
	var OPTIONS = consts.OPTIONS;
	var ERROR = consts.ERROR;
	var MSG = consts.MSG;
	var nodeCursor = __webpack_require__(26);
	var config = __webpack_require__(11);
	var shared = __webpack_require__(17);
	
	var walkers = module.exports = {};
	
	// used in walkers.list
	// remove block in group
	function removeRange(index, rlen, children) {
	  for (var j = 1; j <= rlen; j++) {
	    //removed
	    var removed = children[index + j];
	    if (removed) removed.destroy(true);
	  }
	  children.splice(index + 1, rlen);
	}
	
	walkers.list = function (ast, options) {
	
	  var Regular = walkers.Regular;
	  var placeholder = document.createComment("Regular list"),
	      namespace = options.namespace,
	      extra = options.extra;
	
	  var self = this;
	  var group = new Group([placeholder]);
	  var children = group.children;
	
	  var indexName = ast.variable + '_index';
	  var keyName = ast.variable + '_key';
	  var variable = ast.variable;
	  var alternate = ast.alternate;
	  var track = ast.track,
	      keyOf,
	      extraObj;
	  var cursor = options.cursor;
	
	  if (track && track !== true) {
	
	    track = this._touchExpr(track);
	    extraObj = _.createObject(extra);
	    keyOf = function (item, index) {
	      extraObj[variable] = item;
	      extraObj[indexName] = index;
	      // @FIX keyName
	      return track.get(self, extraObj);
	    };
	  }
	
	  function addRange(index, end, newList, rawNewValue) {
	    for (var o = index; o < end; o++) {
	      //add
	      // prototype inherit
	      var item = newList[o];
	      var data = _.createObject(extra);
	      updateTarget(data, o, item, rawNewValue);
	
	      var section = self.$compile(ast.body, {
	        extra: data,
	        namespace: namespace,
	        record: true,
	        outer: options.outer,
	        cursor: cursor
	      });
	      section.data = data;
	      // autolink
	      var insert = combine.last(group.get(o));
	      if (insert.parentNode && !(cursor && cursor.node)) {
	        animate.inject(combine.node(section), insert, 'after');
	      }
	      // insert.parentNode.insertBefore(combine.node(section), insert.nextSibling);
	      children.splice(o + 1, 0, section);
	    }
	  }
	
	  function updateTarget(target, index, item, rawNewValue) {
	    target[indexName] = index;
	    if (rawNewValue) {
	      target[keyName] = item;
	      target[variable] = rawNewValue[item];
	    } else {
	      target[variable] = item;
	      target[keyName] = null;
	    }
	  }
	
	  function updateRange(start, end, newList, rawNewValue) {
	    for (var k = start; k < end; k++) {
	      // no change
	      var sect = group.get(k + 1),
	          item = newList[k];
	      updateTarget(sect.data, k, item, rawNewValue);
	    }
	  }
	
	  function updateLD(newList, oldList, splices, rawNewValue) {
	
	    var cur = placeholder;
	    var m = 0,
	        len = newList.length;
	
	    if (!splices && (len !== 0 || oldList.length !== 0)) {
	      splices = diffArray(newList, oldList, true);
	    }
	
	    if (!splices || !splices.length) return;
	
	    for (var i = 0; i < splices.length; i++) {
	      //init
	      var splice = splices[i];
	      var index = splice.index; // beacuse we use a comment for placeholder
	      var removed = splice.removed;
	      var add = splice.add;
	      var rlen = removed.length;
	      // for track
	      if (track && rlen && add) {
	        var minar = Math.min(rlen, add);
	        var tIndex = 0;
	        while (tIndex < minar) {
	          if (keyOf(newList[index], index) !== keyOf(removed[0], index)) {
	            removeRange(index, 1, children);
	            addRange(index, index + 1, newList, rawNewValue);
	          }
	          removed.shift();
	          add--;
	          index++;
	          tIndex++;
	        }
	        rlen = removed.length;
	      }
	      // update
	      updateRange(m, index, newList, rawNewValue);
	
	      removeRange(index, rlen, children);
	
	      addRange(index, index + add, newList, rawNewValue);
	
	      m = index + add - rlen;
	      m = m < 0 ? 0 : m;
	    }
	    if (m < len) {
	      for (var i = m; i < len; i++) {
	        var pair = group.get(i + 1);
	        pair.data[indexName] = i;
	        // @TODO fix keys
	      }
	    }
	  }
	
	  // if the track is constant test.
	  function updateSimple(newList, oldList, rawNewValue) {
	
	    var nlen = newList.length;
	    var olen = oldList.length;
	    var mlen = Math.min(nlen, olen);
	
	    updateRange(0, mlen, newList, rawNewValue);
	    if (nlen < olen) {
	      //need add
	      removeRange(nlen, olen - nlen, children);
	    } else if (nlen > olen) {
	      addRange(olen, nlen, newList, rawNewValue);
	    }
	  }
	
	  function update(newValue, oldValue, splices) {
	
	    var nType = _.typeOf(newValue);
	    var oType = _.typeOf(oldValue);
	
	    var newList = getListFromValue(newValue, nType);
	    var oldList = getListFromValue(oldValue, oType);
	
	    var rawNewValue;
	
	    var nlen = newList && newList.length;
	    var olen = oldList && oldList.length;
	
	    // if previous list has , we need to remove the altnated section.
	    if (!olen && nlen && group.get(1)) {
	      var altGroup = children.pop();
	      if (altGroup.destroy) altGroup.destroy(true);
	    }
	
	    if (nType === 'object') rawNewValue = newValue;
	
	    if (track === true) {
	      updateSimple(newList, oldList, rawNewValue);
	    } else {
	      updateLD(newList, oldList, splices, rawNewValue);
	    }
	
	    // @ {#list} {#else}
	    if (!nlen && alternate && alternate.length) {
	      var section = self.$compile(alternate, {
	        extra: extra,
	        record: true,
	        outer: options.outer,
	        namespace: namespace
	      });
	      children.push(section);
	      if (placeholder.parentNode) {
	        animate.inject(combine.node(section), placeholder, 'after');
	      }
	    }
	  }
	
	  this.$watch(ast.sequence, update, {
	    init: true,
	    diff: track !== true,
	    deep: true
	  });
	  //@FIXIT, beacuse it is sync process, we can
	  cursor = null;
	  return group;
	};
	
	// {#include } or {#inc template}
	walkers.template = function (ast, options) {
	  var content = ast.content,
	      compiled;
	  var placeholder = document.createComment('inlcude');
	  var compiled,
	      namespace = options.namespace,
	      extra = options.extra;
	  var group = new Group([placeholder]);
	  var cursor = options.cursor;
	
	  if (content) {
	    var self = this;
	    this.$watch(content, function (value) {
	      var removed = group.get(1),
	          type = typeof value;
	      if (removed) {
	        removed.destroy(true);
	        group.children.pop();
	      }
	      if (!value) return;
	
	      group.push(compiled = type === 'function' ? value(cursor ? { cursor: cursor } : null) : self.$compile(type !== 'object' ? String(value) : value, {
	        record: true,
	        outer: options.outer,
	        namespace: namespace,
	        cursor: cursor,
	        extra: extra }));
	      if (placeholder.parentNode) {
	        compiled.$inject(placeholder, 'before');
	      }
	    }, OPTIONS.INIT);
	  }
	  return group;
	};
	
	function getListFromValue(value, type) {
	  return type === 'array' ? value : type === 'object' ? _.keys(value) : [];
	}
	
	// how to resolve this problem
	var ii = 0;
	walkers['if'] = function (ast, options) {
	  var self = this,
	      consequent,
	      alternate,
	      extra = options.extra;
	  if (options && options.element) {
	    // attribute inteplation
	    var update = function update(nvalue) {
	      if (!!nvalue) {
	        if (alternate) combine.destroy(alternate);
	        if (ast.consequent) consequent = self.$compile(ast.consequent, {
	          record: true,
	          element: options.element,
	          extra: extra
	        });
	      } else {
	        if (consequent) combine.destroy(consequent);
	        if (ast.alternate) alternate = self.$compile(ast.alternate, { record: true, element: options.element, extra: extra });
	      }
	    };
	    this.$watch(ast.test, update, OPTIONS.FORCE);
	    return {
	      destroy: function destroy() {
	        if (consequent) combine.destroy(consequent);else if (alternate) combine.destroy(alternate);
	      }
	    };
	  }
	
	  var test, node;
	  var placeholder = document.createComment("Regular if" + ii++);
	  var group = new Group();
	  group.push(placeholder);
	  var preValue = null,
	      namespace = options.namespace;
	  var cursor = options.cursor;
	  if (cursor && cursor.node) {
	    dom.inject(placeholder, cursor.node, 'before');
	  }
	
	  var update = function update(nvalue, old) {
	    var value = !!nvalue,
	        compiledSection;
	    if (value === preValue) return;
	    preValue = value;
	    if (group.children[1]) {
	      group.children[1].destroy(true);
	      group.children.pop();
	    }
	    var curOptions = {
	      record: true,
	      outer: options.outer,
	      namespace: namespace,
	      extra: extra,
	      cursor: cursor
	    };
	    if (value) {
	      //true
	
	      if (ast.consequent && ast.consequent.length) {
	        compiledSection = self.$compile(ast.consequent, curOptions);
	      }
	    } else {
	      //false
	      if (ast.alternate && ast.alternate.length) {
	        compiledSection = self.$compile(ast.alternate, curOptions);
	      }
	    }
	    // placeholder.parentNode && placeholder.parentNode.insertBefore( node, placeholder );
	    if (compiledSection) {
	      group.push(compiledSection);
	      if (placeholder.parentNode) {
	        animate.inject(combine.node(compiledSection), placeholder, 'before');
	      }
	    }
	    cursor = null;
	    // after first mount , we need clear this flat;
	  };
	  this.$watch(ast.test, update, OPTIONS.FORCE_INIT);
	
	  return group;
	};
	
	walkers._handleMountText = function (cursor, astText) {
	  var node,
	      mountNode = cursor.node;
	  // fix unused black in astText;
	  var nodeText = dom.text(mountNode);
	
	  if (nodeText === astText) {
	    node = mountNode;
	    cursor.next();
	  } else {
	    // maybe have some redundancy  blank
	    var index = nodeText.indexOf(astText);
	    if (~index) {
	      node = document.createTextNode(astText);
	      dom.text(mountNode, nodeText.slice(index + astText.length));
	    } else {
	      // if( _.blankReg.test( astText ) ){ }
	      throw Error(MSG[ERROR.UNMATCHED_AST]);
	    }
	  }
	
	  return node;
	};
	
	walkers.expression = function (ast, options) {
	
	  var cursor = options.cursor,
	      node,
	      mountNode = cursor && cursor.node;
	
	  if (mountNode) {
	    //@BUG: if server render &gt; in Expression will cause error
	    var astText = _.toText(this.$get(ast));
	
	    node = walkers._handleMountText(cursor, astText);
	  } else {
	    node = document.createTextNode("");
	  }
	
	  this.$watch(ast, function (newval) {
	    dom.text(node, _.toText(newval));
	  }, OPTIONS.STABLE_INIT);
	  return node;
	};
	
	walkers.text = function (ast, options) {
	  var cursor = options.cursor,
	      node;
	  var text = ast.text;
	  var astText = text.indexOf('&') !== -1 ? _.convertEntity(text) : text;
	
	  if (cursor && cursor.node) {
	    var mountNode = cursor.node;
	    // maybe regularjs parser have some difference with html builtin parser when process  empty text
	    // @todo error report
	    if (mountNode.nodeType !== 3) {
	
	      if (_.blankReg.test(astText)) return {
	        code: ERROR.UNMATCHED_AST
	      };
	    } else {
	      node = walkers._handleMountText(cursor, astText);
	    }
	  }
	
	  return node || document.createTextNode(astText);
	};
	
	/**
	 * walkers element (contains component)
	 */
	walkers.element = function (ast, options) {
	
	  var attrs = ast.attrs,
	      self = this,
	      Constructor = this.constructor,
	      children = ast.children,
	      namespace = options.namespace,
	      extra = options.extra,
	      cursor = options.cursor,
	      tag = ast.tag,
	      Component = Constructor.component(tag),
	      ref,
	      group,
	      element,
	      mountNode;
	
	  // if inititalized with mount mode, sometime,
	  // browser will ignore the whitespace between node, and sometimes it won't
	  if (cursor) {
	    // textCOntent with Empty text
	    if (cursor.node && cursor.node.nodeType === 3) {
	      if (_.blankReg.test(dom.text(cursor.node))) cursor.next();else throw Error(MSG[ERROR.UNMATCHED_AST]);
	    }
	  }
	
	  if (cursor) mountNode = cursor.node;
	
	  if (tag === 'r-content') {
	    _.log('r-content is deprecated, use {#inc this.$body} instead (`{#include}` as same)', 'warn');
	    return this.$body && this.$body(cursor ? { cursor: cursor } : null);
	  }
	
	  if (Component || tag === 'r-component') {
	    options.Component = Component;
	    return walkers.component.call(this, ast, options);
	  }
	
	  if (tag === 'svg') namespace = "svg";
	  // @Deprecated: may be removed in next version, use {#inc } instead
	
	  if (children && children.length) {
	
	    var subMountNode = mountNode ? mountNode.firstChild : null;
	    group = this.$compile(children, {
	      extra: extra,
	      outer: options.outer,
	      namespace: namespace,
	      cursor: subMountNode ? nodeCursor(subMountNode) : null
	    });
	  }
	
	  if (mountNode) {
	    element = mountNode;
	    cursor.next();
	  } else {
	    element = dom.create(tag, namespace, attrs);
	  }
	
	  if (group && !_.isVoidTag(tag)) {
	    // if not init with mount mode
	    animate.inject(combine.node(group), element);
	  }
	
	  // fix tag ast, some infomation only avaliable at runtime (directive etc..)
	  _.fixTagAST(ast, Constructor);
	
	  var destroies = walkAttributes.call(this, attrs, element, extra);
	
	  return {
	    type: "element",
	    group: group,
	    node: function node() {
	      return element;
	    },
	    last: function last() {
	      return element;
	    },
	    destroy: function destroy(first) {
	      if (first) {
	        animate.remove(element, group ? group.destroy.bind(group) : _.noop);
	      } else if (group) {
	        group.destroy();
	      }
	      // destroy ref
	      if (destroies.length) {
	        destroies.forEach(function (destroy) {
	          if (destroy) {
	            if (typeof destroy.destroy === 'function') {
	              destroy.destroy();
	            } else {
	              destroy();
	            }
	          }
	        });
	      }
	    }
	  };
	};
	
	walkers.component = function (ast, options) {
	  var attrs = ast.attrs,
	      Component = options.Component,
	      cursor = options.cursor,
	      Constructor = this.constructor,
	      isolate,
	      extra = options.extra,
	      namespace = options.namespace,
	      refDirective = walkers.Regular.directive('ref'),
	      ref,
	      self = this,
	      is;
	
	  var data = {},
	      events;
	
	  for (var i = 0, len = attrs.length; i < len; i++) {
	    var attr = attrs[i];
	    // consider disabled   equlasto  disabled={true}
	
	    shared.prepareAttr(attr, attr.name === 'ref' && refDirective);
	
	    var value = this._touchExpr(attr.value === undefined ? true : attr.value);
	    if (value.constant) value = attr.value = value.get(this);
	    if (attr.value && attr.value.constant === true) {
	      value = value.get(this);
	    }
	    var name = attr.name;
	    if (!attr.event) {
	      var etest = name.match(_.eventReg);
	      // event: 'nav'
	      if (etest) attr.event = etest[1];
	    }
	
	    // @compile modifier
	    if (attr.mdf === 'cmpl') {
	      value = _.getCompileFn(value, this, {
	        record: true,
	        namespace: namespace,
	        extra: extra,
	        outer: options.outer
	      });
	    }
	
	    // @if is r-component . we need to find the target Component
	    if (name === 'is' && !Component) {
	      is = value;
	      var componentName = this.$get(value, true);
	      Component = Constructor.component(componentName);
	      if (typeof Component !== 'function') throw new Error("component " + componentName + " has not registed!");
	    }
	    // bind event proxy
	    var eventName;
	    if (eventName = attr.event) {
	      events = events || {};
	      events[eventName] = _.handleEvent.call(this, value, eventName);
	      continue;
	    } else {
	      name = attr.name = _.camelCase(name);
	    }
	
	    if (!value || value.type !== 'expression') {
	      data[name] = value;
	    } else {
	      data[name] = value.get(self);
	    }
	    if (name === 'ref' && value != null) {
	      ref = value;
	    }
	    if (name === 'isolate') {
	      // 1: stop: composite -> parent
	      // 2. stop: composite <- parent
	      // 3. stop 1 and 2: composite <-> parent
	      // 0. stop nothing (defualt)
	      isolate = value.type === 'expression' ? value.get(self) : parseInt(value === true ? 3 : value, 10);
	      data.isolate = isolate;
	    }
	  }
	
	  var definition = {
	    data: data,
	    events: events,
	    $parent: isolate & 2 ? null : this,
	    $root: this.$root,
	    $outer: options.outer,
	    _body: {
	      ctx: this,
	      ast: ast.children
	    }
	  };
	  var options = {
	    namespace: namespace,
	    cursor: cursor,
	    extra: options.extra
	  };
	
	  var component = new Component(definition, options),
	      reflink;
	
	  if (ref && this.$refs) {
	    reflink = refDirective.link;
	    var refDestroy = reflink.call(this, component, ref);
	    component.$on('$destroy', refDestroy);
	  }
	  for (var i = 0, len = attrs.length; i < len; i++) {
	    var attr = attrs[i];
	    var value = attr.value || true;
	    var name = attr.name;
	    // need compiled
	    if (value.type === 'expression' && !attr.event) {
	      value = self._touchExpr(value);
	      // use bit operate to control scope
	      if (!(isolate & 2)) this.$watch(value, (function (name, val) {
	        this.data[name] = val;
	      }).bind(component, name), OPTIONS.SYNC);
	      if (value.set && !(isolate & 1))
	        // sync the data. it force the component don't trigger attr.name's first dirty echeck
	        component.$watch(name, self.$update.bind(self, value), OPTIONS.INIT);
	    }
	  }
	  if (is && is.type === 'expression') {
	    var group = new Group();
	    group.push(component);
	    this.$watch(is, function (value) {
	      // found the new component
	      var Component = Constructor.component(value);
	      if (!Component) throw new Error("component " + value + " has not registed!");
	      var ncomponent = new Component(definition);
	      var component = group.children.pop();
	      group.push(ncomponent);
	      ncomponent.$inject(combine.last(component), 'after');
	      component.destroy();
	      // @TODO  if component changed , we need update ref
	      if (ref) {
	        self.$refs[ref] = ncomponent;
	      }
	    }, OPTIONS.SYNC);
	    return group;
	  }
	  return component;
	};
	
	function walkAttributes(attrs, element, extra) {
	  var bindings = [];
	  for (var i = 0, len = attrs.length; i < len; i++) {
	    var binding = this._walk(attrs[i], { element: element, fromElement: true, attrs: attrs, extra: extra });
	    if (binding) bindings.push(binding);
	  }
	  return bindings;
	}
	
	walkers.attribute = function (ast, options) {
	
	  var attr = ast;
	  var Component = this.constructor;
	  var name = attr.name;
	  var directive = Component.directive(name);
	
	  shared.prepareAttr(ast, directive);
	
	  var value = attr.value || "";
	  var constant = value.constant;
	  var element = options.element;
	  var self = this;
	
	  value = this._touchExpr(value);
	
	  if (constant) value = value.get(this);
	
	  if (directive && directive.link) {
	    var extra = {
	      attrs: options.attrs,
	      param: _.getParamObj(this, attr.param)
	    };
	    var binding = directive.link.call(self, element, value, name, extra);
	    // if update has been passed in , we will  automately watch value for user
	    if (typeof directive.update === 'function') {
	      if (_.isExpr(value)) {
	        this.$watch(value, function (val, old) {
	          directive.update.call(self, element, val, old, extra);
	        });
	      } else {
	        directive.update.call(self, element, value, undefined, extra);
	      }
	    }
	    if (typeof binding === 'function') binding = { destroy: binding };
	    return binding;
	  } else {
	    if (value.type === 'expression') {
	      this.$watch(value, function (nvalue, old) {
	        dom.attr(element, name, nvalue);
	      }, OPTIONS.STABLE_INIT);
	    } else {
	      if (_.isBooleanAttr(name)) {
	        dom.attr(element, name, true);
	      } else {
	        dom.attr(element, name, value);
	      }
	    }
	    if (!options.fromElement) {
	      return {
	        destroy: function destroy() {
	          dom.attr(element, name, null);
	        }
	      };
	    }
	  }
	};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(6);
	
	function simpleDiff(now, old) {
	  var nlen = now.length;
	  var olen = old.length;
	  if (nlen !== olen) {
	    return true;
	  }
	  for (var i = 0; i < nlen; i++) {
	    if (now[i] !== old[i]) return true;
	  }
	  return false;
	}
	
	function equals(a, b) {
	  return a === b;
	}
	
	// array1 - old array
	// array2 - new array
	function ld(array1, array2, equalFn) {
	  var n = array1.length;
	  var m = array2.length;
	  var equalFn = equalFn || equals;
	  var matrix = [];
	  for (var i = 0; i <= n; i++) {
	    matrix.push([i]);
	  }
	  for (var j = 1; j <= m; j++) {
	    matrix[0][j] = j;
	  }
	  for (var i = 1; i <= n; i++) {
	    for (var j = 1; j <= m; j++) {
	      if (equalFn(array1[i - 1], array2[j - 1])) {
	        matrix[i][j] = matrix[i - 1][j - 1];
	      } else {
	        matrix[i][j] = Math.min(matrix[i - 1][j] + 1, //delete
	        matrix[i][j - 1] + 1 //add
	        );
	      }
	    }
	  }
	  return matrix;
	}
	// arr2 - new array
	// arr1 - old array
	function diffArray(arr2, arr1, diff, diffFn) {
	  if (!diff) return simpleDiff(arr2, arr1);
	  var matrix = ld(arr1, arr2, diffFn);
	  var n = arr1.length;
	  var i = n;
	  var m = arr2.length;
	  var j = m;
	  var edits = [];
	  var current = matrix[i][j];
	  while (i > 0 || j > 0) {
	    // the last line
	    if (i === 0) {
	      edits.unshift(3);
	      j--;
	      continue;
	    }
	    // the last col
	    if (j === 0) {
	      edits.unshift(2);
	      i--;
	      continue;
	    }
	    var northWest = matrix[i - 1][j - 1];
	    var west = matrix[i - 1][j];
	    var north = matrix[i][j - 1];
	
	    var min = Math.min(north, west, northWest);
	
	    if (min === west) {
	      edits.unshift(2); //delete
	      i--;
	      current = west;
	    } else if (min === northWest) {
	      if (northWest === current) {
	        edits.unshift(0); //no change
	      } else {
	          edits.unshift(1); //update
	          current = northWest;
	        }
	      i--;
	      j--;
	    } else {
	      edits.unshift(3); //add
	      j--;
	      current = north;
	    }
	  }
	  var LEAVE = 0;
	  var ADD = 3;
	  var DELELE = 2;
	  var UPDATE = 1;
	  var n = 0;m = 0;
	  var steps = [];
	  var step = { index: null, add: 0, removed: [] };
	
	  for (var i = 0; i < edits.length; i++) {
	    if (edits[i] > 0) {
	      // NOT LEAVE
	      if (step.index === null) {
	        step.index = m;
	      }
	    } else {
	      //LEAVE
	      if (step.index != null) {
	        steps.push(step);
	        step = { index: null, add: 0, removed: [] };
	      }
	    }
	    switch (edits[i]) {
	      case LEAVE:
	        n++;
	        m++;
	        break;
	      case ADD:
	        step.add++;
	        m++;
	        break;
	      case DELELE:
	        step.removed.push(arr1[n]);
	        n++;
	        break;
	      case UPDATE:
	        step.add++;
	        step.removed.push(arr1[n]);
	        n++;
	        m++;
	        break;
	    }
	  }
	  if (step.index != null) {
	    steps.push(step);
	  }
	  return steps;
	}
	
	// diffObject
	// ----
	// test if obj1 deepEqual obj2
	function diffObject(now, last, diff) {
	
	  if (!diff) {
	
	    for (var j in now) {
	      if (last[j] !== now[j]) return true;
	    }
	
	    for (var n in last) {
	      if (last[n] !== now[n]) return true;
	    }
	  } else {
	
	    var nKeys = _.keys(now);
	    var lKeys = _.keys(last);
	
	    /**
	     * [description]
	     * @param  {[type]} a    [description]
	     * @param  {[type]} b){                   return now[b] [description]
	     * @return {[type]}      [description]
	     */
	    return diffArray(nKeys, lKeys, diff, function (a, b) {
	      return now[b] === last[a];
	    });
	  }
	
	  return false;
	}
	
	module.exports = {
	  diffArray: diffArray,
	  diffObject: diffObject
	};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	// some nested  operation in ast
	// --------------------------------
	
	"use strict";
	
	var dom = __webpack_require__(19);
	var animate = __webpack_require__(24);
	
	var combine = module.exports = {
	
	  // get the initial dom in object
	  node: function node(item) {
	    var children, node, nodes;
	    if (!item) return;
	    if (typeof item.node === "function") return item.node();
	    if (typeof item.nodeType === "number") return item;
	    if (item.group) return combine.node(item.group);
	
	    item = item.children || item;
	    if (Array.isArray(item)) {
	      var len = item.length;
	      if (len === 1) {
	        return combine.node(item[0]);
	      }
	      nodes = [];
	      for (var i = 0, len = item.length; i < len; i++) {
	        node = combine.node(item[i]);
	        if (Array.isArray(node)) {
	          nodes.push.apply(nodes, node);
	        } else if (node) {
	          nodes.push(node);
	        }
	      }
	      return nodes;
	    }
	  },
	  // @TODO remove _gragContainer
	  inject: function inject(node, pos) {
	    var group = this;
	    var fragment = combine.node(group.group || group);
	    if (node === false) {
	      animate.remove(fragment);
	      return group;
	    } else {
	      if (!fragment) return group;
	      if (typeof node === 'string') node = dom.find(node);
	      if (!node) throw Error('injected node is not found');
	      // use animate to animate firstchildren
	      animate.inject(fragment, node, pos);
	    }
	    // if it is a component
	    if (group.$emit) {
	      var preParent = group.parentNode;
	      var newParent = pos === 'after' || pos === 'before' ? node.parentNode : node;
	      group.parentNode = newParent;
	      group.$emit("$inject", node, pos, preParent);
	    }
	    return group;
	  },
	
	  // get the last dom in object(for insertion operation)
	  last: function last(item) {
	    var children = item.children;
	
	    if (typeof item.last === "function") return item.last();
	    if (typeof item.nodeType === "number") return item;
	
	    if (children && children.length) return combine.last(children[children.length - 1]);
	    if (item.group) return combine.last(item.group);
	  },
	
	  destroy: function destroy(item, first) {
	    if (!item) return;
	    if (typeof item.nodeType === "number") return first && dom.remove(item);
	    if (typeof item.destroy === "function") return item.destroy(first);
	
	    if (Array.isArray(item)) {
	      for (var i = 0, len = item.length; i < len; i++) {
	        combine.destroy(item[i], first);
	      }
	    }
	  }
	
	};
	
	// @TODO: need move to dom.js
	dom.element = function (component, all) {
	  if (!component) return !all ? null : [];
	  var nodes = combine.node(component);
	  if (nodes.nodeType === 1) return all ? [nodes] : nodes;
	  var elements = [];
	  for (var i = 0; i < nodes.length; i++) {
	    var node = nodes[i];
	    if (node && node.nodeType === 1) {
	      if (!all) return node;
	      elements.push(node);
	    }
	  }
	  return !all ? elements[0] : elements;
	};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _ = __webpack_require__(6);
	var dom = __webpack_require__(19);
	var animate = {};
	var env = __webpack_require__(4);
	
	if (typeof window !== 'undefined') {
	  var transitionEnd = 'transitionend',
	      animationEnd = 'animationend',
	      transitionProperty = 'transition',
	      animationProperty = 'animation';
	
	  if (!('ontransitionend' in window)) {
	    if ('onwebkittransitionend' in window) {
	
	      // Chrome/Saf (+ Mobile Saf)/Android
	      transitionEnd += ' webkitTransitionEnd';
	      transitionProperty = 'webkitTransition';
	    } else if ('onotransitionend' in dom.tNode || navigator.appName === 'Opera') {
	
	      // Opera
	      transitionEnd += ' oTransitionEnd';
	      transitionProperty = 'oTransition';
	    }
	  }
	  if (!('onanimationend' in window)) {
	    if ('onwebkitanimationend' in window) {
	      // Chrome/Saf (+ Mobile Saf)/Android
	      animationEnd += ' webkitAnimationEnd';
	      animationProperty = 'webkitAnimation';
	    } else if ('onoanimationend' in dom.tNode) {
	      // Opera
	      animationEnd += ' oAnimationEnd';
	      animationProperty = 'oAnimation';
	    }
	  }
	}
	
	/**
	 * inject node with animation
	 * @param  {[type]} node      [description]
	 * @param  {[type]} refer     [description]
	 * @param  {[type]} direction [description]
	 * @return {[type]}           [description]
	 */
	animate.inject = function (node, refer, direction, callback) {
	  callback = callback || _.noop;
	  if (Array.isArray(node)) {
	    var fragment = dom.fragment();
	    var count = 0;
	
	    for (var i = 0, len = node.length; i < len; i++) {
	      fragment.appendChild(node[i]);
	    }
	    dom.inject(fragment, refer, direction);
	
	    // if all nodes is done, we call the callback
	    var enterCallback = function enterCallback() {
	      count++;
	      if (count === len) callback();
	    };
	    if (len === count) callback();
	    for (i = 0; i < len; i++) {
	      if (node[i].onenter) {
	        node[i].onenter(enterCallback);
	      } else {
	        enterCallback();
	      }
	    }
	  } else {
	    if (!node) return;
	    dom.inject(node, refer, direction);
	    if (node.onenter) {
	      node.onenter(callback);
	    } else {
	      callback();
	    }
	  }
	};
	
	/**
	 * remove node with animation
	 * @param  {[type]}   node     [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	
	animate.remove = function (node, callback) {
	  if (!node) return;
	  var count = 0;
	  function loop() {
	    count++;
	    if (count === len) callback && callback();
	  }
	  if (Array.isArray(node)) {
	    for (var i = 0, len = node.length; i < len; i++) {
	      animate.remove(node[i], loop);
	    }
	    return;
	  }
	  if (typeof node.onleave === 'function') {
	    node.onleave(function () {
	      removeDone(node, callback);
	    });
	  } else {
	    removeDone(node, callback);
	  }
	};
	
	function removeDone(node, callback) {
	  dom.remove(node);
	  callback && callback();
	}
	
	animate.startClassAnimate = function (node, className, callback, mode) {
	  var activeClassName, timeout, tid, onceAnim;
	  if (!animationEnd && !transitionEnd || env.isRunning) {
	    return callback();
	  }
	
	  if (mode !== 4) {
	    onceAnim = _.once(function onAnimateEnd() {
	      if (tid) clearTimeout(tid);
	
	      if (mode === 2) {
	        dom.delClass(node, activeClassName);
	      }
	      if (mode !== 3) {
	        // mode hold the class
	        dom.delClass(node, className);
	      }
	      dom.off(node, animationEnd, onceAnim);
	      dom.off(node, transitionEnd, onceAnim);
	
	      callback();
	    });
	  } else {
	    onceAnim = _.once(function onAnimateEnd() {
	      if (tid) clearTimeout(tid);
	      callback();
	    });
	  }
	  if (mode === 2) {
	    // auto removed
	    dom.addClass(node, className);
	
	    activeClassName = _.map(className.split(/\s+/), function (name) {
	      return name + '-active';
	    }).join(" ");
	
	    dom.nextReflow(function () {
	      dom.addClass(node, activeClassName);
	      timeout = getMaxTimeout(node);
	      tid = setTimeout(onceAnim, timeout);
	    });
	  } else if (mode === 4) {
	    dom.nextReflow(function () {
	      dom.delClass(node, className);
	      timeout = getMaxTimeout(node);
	      tid = setTimeout(onceAnim, timeout);
	    });
	  } else {
	    dom.nextReflow(function () {
	      dom.addClass(node, className);
	      timeout = getMaxTimeout(node);
	      tid = setTimeout(onceAnim, timeout);
	    });
	  }
	
	  dom.on(node, animationEnd, onceAnim);
	  dom.on(node, transitionEnd, onceAnim);
	  return onceAnim;
	};
	
	animate.startStyleAnimate = function (node, styles, callback) {
	  var timeout, onceAnim, tid;
	
	  dom.nextReflow(function () {
	    dom.css(node, styles);
	    timeout = getMaxTimeout(node);
	    tid = setTimeout(onceAnim, timeout);
	  });
	
	  onceAnim = _.once(function onAnimateEnd() {
	    if (tid) clearTimeout(tid);
	
	    dom.off(node, animationEnd, onceAnim);
	    dom.off(node, transitionEnd, onceAnim);
	
	    callback();
	  });
	
	  dom.on(node, animationEnd, onceAnim);
	  dom.on(node, transitionEnd, onceAnim);
	
	  return onceAnim;
	};
	
	/**
	 * get maxtimeout
	 * @param  {Node} node 
	 * @return {[type]}   [description]
	 */
	function getMaxTimeout(node) {
	  var timeout = 0,
	      tDuration = 0,
	      tDelay = 0,
	      aDuration = 0,
	      aDelay = 0,
	      ratio = 5 / 3,
	      styles;
	
	  if (window.getComputedStyle) {
	
	    styles = window.getComputedStyle(node), tDuration = getMaxTime(styles[transitionProperty + 'Duration']) || tDuration;
	    tDelay = getMaxTime(styles[transitionProperty + 'Delay']) || tDelay;
	    aDuration = getMaxTime(styles[animationProperty + 'Duration']) || aDuration;
	    aDelay = getMaxTime(styles[animationProperty + 'Delay']) || aDelay;
	    timeout = Math.max(tDuration + tDelay, aDuration + aDelay);
	  }
	  return timeout * 1000 * ratio;
	}
	
	function getMaxTime(str) {
	
	  var maxTimeout = 0,
	      time;
	
	  if (!str) return 0;
	
	  str.split(",").forEach(function (str) {
	
	    time = parseFloat(str);
	    if (time > maxTimeout) maxTimeout = time;
	  });
	
	  return maxTimeout;
	}
	
	module.exports = animate;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(6);
	var combine = __webpack_require__(23);
	
	function Group(list) {
	  this.children = list || [];
	}
	
	var o = _.extend(Group.prototype, {
	  destroy: function destroy(first) {
	    combine.destroy(this.children, first);
	    if (this.ondestroy) this.ondestroy();
	    this.children = null;
	  },
	  get: function get(i) {
	    return this.children[i];
	  },
	  push: function push(item) {
	    this.children.push(item);
	  }
	});
	o.inject = o.$inject = combine.inject;
	
	module.exports = Group;

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	"use strict";
	
	function NodeCursor(node) {
	  this.node = node;
	}
	
	var no = NodeCursor.prototype;
	
	no.next = function () {
	  this.node = this.node.nextSibling;
	  return this;
	};
	
	module.exports = function (n) {
	  return new NodeCursor(n);
	};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	// simplest event emitter 60 lines
	// ===============================
	"use strict";
	
	var _ = __webpack_require__(6);
	var API = {
	  $on: function $on(event, fn, desc) {
	    if (typeof event === "object" && event) {
	      for (var i in event) {
	        this.$on(i, event[i], fn);
	      }
	    } else {
	      desc = desc || {};
	      // @patch: for list
	      var context = this;
	      var handles = context._handles || (context._handles = {}),
	          calls = handles[event] || (handles[event] = []);
	      var realFn;
	      if (desc.once) {
	        realFn = function () {
	          fn.apply(this, arguments);
	          this.$off(event, fn);
	        };
	        fn.real = realFn;
	      }
	      calls.push(realFn || fn);
	    }
	    return this;
	  },
	  $off: function $off(event, fn) {
	    var context = this;
	    if (!context._handles) return;
	    if (!event) this._handles = {};
	    var handles = context._handles,
	        calls;
	
	    if (calls = handles[event]) {
	      if (!fn) {
	        handles[event] = [];
	        return context;
	      }
	      fn = fn.real || fn;
	      for (var i = 0, len = calls.length; i < len; i++) {
	        if (fn === calls[i]) {
	          calls.splice(i, 1);
	          return context;
	        }
	      }
	    }
	    return context;
	  },
	  // bubble event
	  $emit: function $emit(event) {
	    // @patch: for list
	    var context = this;
	    var handles = context._handles,
	        calls,
	        args,
	        type;
	    if (!event) return;
	    var args = _.slice(arguments, 1);
	    var type = event;
	
	    if (!handles) return context;
	    if (calls = handles[type.slice(1)]) {
	      for (var j = 0, len = calls.length; j < len; j++) {
	        calls[j].apply(context, args);
	      }
	    }
	    if (!(calls = handles[type])) return context;
	    for (var i = 0, len = calls.length; i < len; i++) {
	      calls[i].apply(context, args);
	    }
	    // if(calls.length) context.$update();
	    return context;
	  },
	  // capture  event
	  $once: function $once(event, fn) {
	    var args = _.slice(arguments);
	    args.push({ once: true });
	    return this.$on.apply(this, args);
	  }
	};
	// container class
	function Event() {}
	_.extend(Event.prototype, API);
	
	Event.mixTo = function (obj) {
	  obj = typeof obj === "function" ? obj.prototype : obj;
	  _.extend(obj, API);
	};
	module.exports = Event;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(6);
	var parseExpression = __webpack_require__(18).expression;
	var diff = __webpack_require__(22);
	var diffArray = diff.diffArray;
	var diffObject = diff.diffObject;
	
	function Watcher() {}
	
	var methods = {
	  $watch: function $watch(expr, fn, options) {
	    var get,
	        once,
	        test,
	        rlen,
	        extra = this.__ext__; //records length
	    if (!this._watchers) this._watchers = [];
	    if (!this._watchersForStable) this._watchersForStable = [];
	
	    options = options || {};
	    if (options === true) {
	      options = { deep: true };
	    }
	    var uid = _.uid('w_');
	    if (Array.isArray(expr)) {
	      var tests = [];
	      for (var i = 0, len = expr.length; i < len; i++) {
	        tests.push(this.$expression(expr[i]).get);
	      }
	      var prev = [];
	      test = function (context) {
	        var equal = true;
	        for (var i = 0, len = tests.length; i < len; i++) {
	          var splice = tests[i](context, extra);
	          if (!_.equals(splice, prev[i])) {
	            equal = false;
	            prev[i] = _.clone(splice);
	          }
	        }
	        return equal ? false : prev;
	      };
	    } else {
	      if (typeof expr === 'function') {
	        get = expr.bind(this);
	      } else {
	        expr = this.$expression(expr);
	        get = expr.get;
	        once = expr.once;
	      }
	    }
	
	    var watcher = {
	      id: uid,
	      get: get,
	      fn: fn,
	      once: once,
	      force: options.force,
	      // don't use ld to resolve array diff
	      diff: options.diff,
	      test: test,
	      deep: options.deep,
	      last: options.sync ? get(this) : options.last
	    };
	
	    this[options.stable ? '_watchersForStable' : '_watchers'].push(watcher);
	
	    rlen = this._records && this._records.length;
	    if (rlen) this._records[rlen - 1].push(watcher);
	    // init state.
	    if (options.init === true) {
	      var prephase = this.$phase;
	      this.$phase = 'digest';
	      this._checkSingleWatch(watcher);
	      this.$phase = prephase;
	    }
	    return watcher;
	  },
	  $unwatch: function $unwatch(watcher) {
	    if (!this._watchers || !watcher) return;
	    var watchers = this._watchers;
	    var type = typeof watcher;
	
	    if (type === 'object') {
	      var len = watcher.length;
	      if (!len) {
	        watcher.removed = true;
	      } else {
	        while (len-- >= 0) {
	          this.$unwatch(watcher[len]);
	        }
	      }
	    } else if (type === 'number') {
	      var id = watcher;
	      watcher = _.findItem(watchers, function (item) {
	        return item.id === id;
	      });
	      if (!watcher) watcher = _.findItem(this._watchersForStable, function (item) {
	        return item.id === id;
	      });
	      return this.$unwatch(watcher);
	    }
	    return this;
	  },
	  $expression: function $expression(value) {
	    return this._touchExpr(parseExpression(value));
	  },
	  /**
	   * the whole digest loop ,just like angular, it just a dirty-check loop;
	   * @param  {String} path  now regular process a pure dirty-check loop, but in parse phase, 
	   *                  Regular's parser extract the dependencies, in future maybe it will change to dirty-check combine with path-aware update;
	   * @return {Void}   
	   */
	
	  $digest: function $digest() {
	    if (this.$phase === 'digest' || this._mute) return;
	    this.$phase = 'digest';
	    var dirty = false,
	        n = 0;
	    while (dirty = this._digest()) {
	
	      if (++n > 20) {
	        // max loop
	        throw Error('there may a circular dependencies reaches');
	      }
	    }
	    // stable watch is dirty
	    var stableDirty = this._digest(true);
	
	    if ((n > 0 || stableDirty) && this.$emit) {
	      this.$emit("$update");
	      if (this.devtools) {
	        this.devtools.emit("flush", this);
	      }
	    }
	    this.$phase = null;
	  },
	  // private digest logic
	  _digest: function _digest(stable) {
	    if (this._mute) return;
	    var watchers = !stable ? this._watchers : this._watchersForStable;
	    var dirty = false,
	        children,
	        watcher,
	        watcherDirty;
	    var len = watchers && watchers.length;
	    if (len) {
	      var mark = 0,
	          needRemoved = 0;
	      for (var i = 0; i < len; i++) {
	        watcher = watchers[i];
	        var shouldRemove = !watcher || watcher.removed;
	        if (shouldRemove) {
	          needRemoved += 1;
	        } else {
	          watcherDirty = this._checkSingleWatch(watcher);
	          if (watcherDirty) dirty = true;
	        }
	        // remove when encounter first unmoved item or touch the end
	        if (!shouldRemove || i === len - 1) {
	          if (needRemoved) {
	            watchers.splice(mark, needRemoved);
	            len -= needRemoved;
	            i -= needRemoved;
	            needRemoved = 0;
	          }
	          mark = i + 1;
	        }
	      }
	    }
	    // check children's dirty.
	    children = this._children;
	    if (children && children.length) {
	      for (var m = 0, mlen = children.length; m < mlen; m++) {
	        var child = children[m];
	        if (child && child._digest(stable)) dirty = true;
	      }
	    }
	    return dirty;
	  },
	  // check a single one watcher
	  _checkSingleWatch: function _checkSingleWatch(watcher) {
	    var dirty = false;
	    if (!watcher) return;
	
	    var now, last, tlast, tnow, eq, diff;
	
	    if (!watcher.test) {
	
	      now = watcher.get(this);
	      last = watcher.last;
	
	      if (now !== last || watcher.force) {
	        tlast = _.typeOf(last);
	        tnow = _.typeOf(now);
	        eq = true;
	
	        // !Object
	        if (!(tnow === 'object' && tlast === 'object' && watcher.deep)) {
	          // Array
	          if (tnow === 'array' && (tlast == 'undefined' || tlast === 'array')) {
	            diff = diffArray(now, watcher.last || [], watcher.diff);
	            if (tlast !== 'array' || diff === true || diff.length) dirty = true;
	          } else {
	            eq = _.equals(now, last);
	            if (!eq || watcher.force) {
	              watcher.force = null;
	              dirty = true;
	            }
	          }
	        } else {
	          diff = diffObject(now, last, watcher.diff);
	          if (diff === true || diff.length) dirty = true;
	        }
	      }
	    } else {
	      // @TODO 是否把多重改掉
	      var result = watcher.test(this);
	      if (result) {
	        dirty = true;
	        watcher.fn.apply(this, result);
	      }
	    }
	    if (dirty && !watcher.test) {
	      if (tnow === 'object' && watcher.deep || tnow === 'array') {
	        watcher.last = _.clone(now);
	      } else {
	        watcher.last = now;
	      }
	      watcher.fn.call(this, now, last, diff);
	      if (watcher.once) this.$unwatch(watcher);
	    }
	
	    return dirty;
	  },
	
	  /**
	   * **tips**: whatever param you passed in $update, after the function called, dirty-check(digest) phase will enter;
	   * 
	   * @param  {Function|String|Expression} path  
	   * @param  {Whatever} value optional, when path is Function, the value is ignored
	   * @return {this}     this 
	   */
	  $set: function $set(path, value) {
	    if (path != null) {
	      var type = typeof path;
	      if (type === 'string' || path.type === 'expression') {
	        path = this.$expression(path);
	        path.set(this, value);
	      } else if (type === 'function') {
	        path.call(this, this.data);
	      } else {
	        for (var i in path) {
	          this.$set(i, path[i]);
	        }
	      }
	    }
	  },
	  // 1. expr canbe string or a Expression
	  // 2. detect: if true, if expr is a string will directly return;
	  $get: function $get(expr, detect) {
	    if (detect && typeof expr === 'string') return expr;
	    return this.$expression(expr).get(this);
	  },
	  $update: function $update() {
	    var rootParent = this;
	    do {
	      if (rootParent.data.isolate || !rootParent.$parent) break;
	      rootParent = rootParent.$parent;
	    } while (rootParent);
	
	    var prephase = rootParent.$phase;
	    rootParent.$phase = 'digest';
	
	    this.$set.apply(this, arguments);
	
	    rootParent.$phase = prephase;
	
	    rootParent.$digest();
	    return this;
	  },
	  // auto collect watchers for logic-control.
	  _record: function _record() {
	    if (!this._records) this._records = [];
	    this._records.push([]);
	  },
	  _release: function _release() {
	    return this._records.pop();
	  }
	};
	
	_.extend(Watcher.prototype, methods);
	
	Watcher.mixTo = function (obj) {
	  obj = typeof obj === "function" ? obj.prototype : obj;
	  return _.extend(obj, methods);
	};
	
	module.exports = Watcher;

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	'use strict';
	
	var f = module.exports = {};
	
	// json:  two way
	//  - get: JSON.stringify
	//  - set: JSON.parse
	//  - example: `{ title|json }`
	f.json = {
	  get: function get(value) {
	    return typeof JSON !== 'undefined' ? JSON.stringify(value) : value;
	  },
	  set: function set(value) {
	    return typeof JSON !== 'undefined' ? JSON.parse(value) : value;
	  }
	};
	
	// last: one-way
	//  - get: return the last item in list
	//  - example: `{ list|last }`
	f.last = function (arr) {
	  return arr && arr[arr.length - 1];
	};
	
	// average: one-way
	//  - get: copute the average of the list
	//  - example: `{ list| average: "score" }`
	f.average = function (array, key) {
	  array = array || [];
	  return array.length ? f.total(array, key) / array.length : 0;
	};
	
	// total: one-way
	//  - get: copute the total of the list
	//  - example: `{ list| total: "score" }`
	f.total = function (array, key) {
	  var total = 0;
	  if (!array) return;
	  array.forEach(function (item) {
	    total += key ? item[key] : item;
	  });
	  return total;
	};
	
	// var basicSortFn = function(a, b){return b - a}

	// f.sort = function(array, key, reverse){
	//   var type = typeof key, sortFn;
	//   switch(type){
	//     case 'function': sortFn = key; break;
	//     case 'string': sortFn = function(a, b){};break;
	//     default:
	//       sortFn = basicSortFn;
	//   }
	//   // need other refernce.
	//   return array.slice().sort(function(a,b){
	//     return reverse? -sortFn(a, b): sortFn(a, b);
	//   })
	//   return array
	// }

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	// Regular
	"use strict";
	
	var _ = __webpack_require__(6);
	var dom = __webpack_require__(19);
	var animate = __webpack_require__(24);
	var Regular = __webpack_require__(12);
	var consts = __webpack_require__(20);
	var namespaces = consts.NAMESPACE;
	var OPTIONS = consts.OPTIONS;
	var STABLE = OPTIONS.STABLE;
	var DEEP_STABLE = { deep: true, stable: true };
	
	__webpack_require__(31);
	__webpack_require__(32);
	
	module.exports = {
	  // **warn**: class inteplation will override this directive
	  'r-class': function rClass(elem, value) {
	
	    if (typeof value === 'string') {
	      value = _.fixObjStr(value);
	    }
	    var isNotHtml = elem.namespaceURI && elem.namespaceURI !== namespaces.html;
	    this.$watch(value, function (nvalue) {
	      var className = isNotHtml ? elem.getAttribute('class') : elem.className;
	      className = ' ' + (className || '').replace(/\s+/g, ' ') + ' ';
	      for (var i in nvalue) if (nvalue.hasOwnProperty(i)) {
	        className = className.replace(' ' + i + ' ', ' ');
	        if (nvalue[i] === true) {
	          className += i + ' ';
	        }
	      }
	      className = className.trim();
	      if (isNotHtml) {
	        dom.attr(elem, 'class', className);
	      } else {
	        elem.className = className;
	      }
	    }, DEEP_STABLE);
	  },
	  // **warn**: style inteplation will override this directive
	  'r-style': function rStyle(elem, value) {
	    if (typeof value === 'string') {
	      value = _.fixObjStr(value);
	    }
	    this.$watch(value, function (nvalue) {
	      for (var i in nvalue) if (nvalue.hasOwnProperty(i)) {
	        dom.css(elem, i, nvalue[i]);
	      }
	    }, DEEP_STABLE);
	  },
	  // when expression is evaluate to true, the elem will add display:none
	  // Example: <div r-hide={{items.length > 0}}></div>
	  'r-hide': function rHide(elem, value) {
	    var preBool = null,
	        compelete;
	    if (_.isExpr(value) || typeof value === "string") {
	      this.$watch(value, function (nvalue) {
	        var bool = !!nvalue;
	        if (bool === preBool) return;
	        preBool = bool;
	        if (bool) {
	          if (elem.onleave) {
	            compelete = elem.onleave(function () {
	              elem.style.display = "none";
	              compelete = null;
	            });
	          } else {
	            elem.style.display = "none";
	          }
	        } else {
	          if (compelete) compelete();
	          elem.style.display = "";
	          if (elem.onenter) {
	            elem.onenter();
	          }
	        }
	      }, STABLE);
	    } else if (!!value) {
	      elem.style.display = "none";
	    }
	  },
	  'r-html': {
	    ssr: function ssr(value, tag) {
	      tag.body = value;
	      return "";
	    },
	    link: function link(elem, value) {
	      this.$watch(value, function (nvalue) {
	        nvalue = nvalue || "";
	        dom.html(elem, nvalue);
	      }, { force: true, stable: true });
	    }
	  },
	  'ref': {
	    accept: consts.COMPONENT_TYPE + consts.ELEMENT_TYPE,
	    link: function link(elem, value) {
	      var refs = this.$refs || (this.$refs = {});
	      var cval;
	      if (_.isExpr(value)) {
	        this.$watch(value, function (nval, oval) {
	          cval = nval;
	          if (refs[oval] === elem) refs[oval] = null;
	          if (cval) refs[cval] = elem;
	        }, STABLE);
	      } else {
	        refs[cval = value] = elem;
	      }
	      return function () {
	        refs[cval] = null;
	      };
	    }
	  }
	};
	
	Regular.directive(module.exports);

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * event directive  bundle
	 *
	 */
	"use strict";
	
	var _ = __webpack_require__(6);
	var dom = __webpack_require__(19);
	var Regular = __webpack_require__(12);
	
	Regular._addProtoInheritCache("event");
	
	Regular.directive(/^on-\w+$/, function (elem, value, name, attrs) {
	  if (!name || !value) return;
	  var type = name.split("-")[1];
	  return this._handleEvent(elem, type, value, attrs);
	});
	// TODO.
	/**
	- $('dx').delegate()
	*/
	Regular.directive(/^(delegate|de)-\w+$/, function (elem, value, name) {
	  var root = this.$root;
	  var _delegates = root._delegates || (root._delegates = {});
	  if (!name || !value) return;
	  var type = name.split("-")[1];
	  var fire = _.handleEvent.call(this, value, type);
	
	  function delegateEvent(ev) {
	    matchParent(ev, _delegates[type], root.parentNode);
	  }
	
	  if (!_delegates[type]) {
	    _delegates[type] = [];
	
	    if (root.parentNode) {
	      dom.on(root.parentNode, type, delegateEvent);
	    } else {
	      root.$on("$inject", function (node, position, preParent) {
	        var newParent = this.parentNode;
	        if (preParent) {
	          dom.off(preParent, type, delegateEvent);
	        }
	        if (newParent) dom.on(this.parentNode, type, delegateEvent);
	      });
	    }
	    root.$on("$destroy", function () {
	      if (root.parentNode) dom.off(root.parentNode, type, delegateEvent);
	      _delegates[type] = null;
	    });
	  }
	  var delegate = {
	    element: elem,
	    fire: fire
	  };
	  _delegates[type].push(delegate);
	
	  return function () {
	    var delegates = _delegates[type];
	    if (!delegates || !delegates.length) return;
	    for (var i = 0, len = delegates.length; i < len; i++) {
	      if (delegates[i] === delegate) delegates.splice(i, 1);
	    }
	  };
	});
	
	function matchParent(ev, delegates, stop) {
	  if (!stop) return;
	  var target = ev.target,
	      pair;
	  while (target && target !== stop) {
	    for (var i = 0, len = delegates.length; i < len; i++) {
	      pair = delegates[i];
	      if (pair && pair.element === target) {
	        pair.fire(ev);
	      }
	    }
	    target = target.parentNode;
	  }
	}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	// Regular
	"use strict";
	
	var _ = __webpack_require__(6);
	var dom = __webpack_require__(19);
	var OPTIONS = __webpack_require__(20).OPTIONS;
	var STABLE = OPTIONS.STABLE;
	var hasInput;
	var Regular = __webpack_require__(12);
	
	var modelHandlers = {
	  "text": initText,
	  "select": initSelect,
	  "checkbox": initCheckBox,
	  "radio": initRadio
	};
	
	// @TODO
	
	// autoUpdate directive for select element
	// to fix r-model issue , when handle dynamic options
	
	/**
	 * <select r-model={name}> 
	 *   <r-option value={value} ></r-option>
	 * </select>
	 */
	
	// two-way binding with r-model
	// works on input, textarea, checkbox, radio, select
	
	Regular.directive("r-model", {
	  param: ['throttle', 'lazy'],
	  link: function link(elem, value, name, extra) {
	    var tag = elem.tagName.toLowerCase();
	    var sign = tag;
	    if (sign === "input") sign = elem.type || "text";else if (sign === "textarea") sign = "text";
	    if (typeof value === "string") value = this.$expression(value);
	
	    if (modelHandlers[sign]) return modelHandlers[sign].call(this, elem, value, extra);else if (tag === "input") {
	      return modelHandlers.text.call(this, elem, value, extra);
	    }
	  }
	  //@TODO
	  // ssr: function(name, value){
	  //   return value? "value=" + value: ""
	  // }
	});
	
	// binding <select>
	
	function initSelect(elem, parsed, extra) {
	  var self = this;
	  var wc = this.$watch(parsed, function (newValue) {
	    var children = elem.getElementsByTagName('option');
	    for (var i = 0, len = children.length; i < len; i++) {
	      if (children[i].value == newValue) {
	        elem.selectedIndex = i;
	        break;
	      }
	    }
	  }, STABLE);
	
	  function handler() {
	    parsed.set(self, this.value);
	    wc.last = this.value;
	    self.$update();
	  }
	
	  dom.on(elem, "change", handler);
	
	  if (parsed.get(self) === undefined && elem.value) {
	    parsed.set(self, elem.value);
	  }
	
	  return function destroy() {
	    dom.off(elem, "change", handler);
	  };
	}
	
	// input,textarea binding
	function initText(elem, parsed, extra) {
	  var param = extra.param;
	  var throttle,
	      lazy = param.lazy;
	
	  if ('throttle' in param) {
	    // <input throttle r-model>
	    if (param[throttle] === true) {
	      throttle = 400;
	    } else {
	      throttle = parseInt(param.throttle, 10);
	    }
	  }
	
	  var self = this;
	  var wc = this.$watch(parsed, function (newValue) {
	    if (elem.value !== newValue) elem.value = newValue == null ? "" : "" + newValue;
	  }, STABLE);
	
	  // @TODO to fixed event
	  var handler = function handler(ev) {
	    var that = this;
	    if (ev.type === 'cut' || ev.type === 'paste') {
	      _.nextTick(function () {
	        var value = that.value;
	        parsed.set(self, value);
	        wc.last = value;
	        self.$update();
	      });
	    } else {
	      var value = that.value;
	      parsed.set(self, value);
	      wc.last = value;
	      self.$update();
	    }
	  };
	
	  if (throttle && !lazy) {
	    var preHandle = handler,
	        tid;
	    handler = _.throttle(handler, throttle);
	  }
	
	  if (hasInput === undefined) {
	    hasInput = dom.msie !== 9 && "oninput" in document.createElement('input');
	  }
	
	  if (lazy) {
	    dom.on(elem, 'change', handler);
	  } else {
	    if (hasInput) {
	      elem.addEventListener("input", handler);
	    } else {
	      dom.on(elem, "paste keyup cut change", handler);
	    }
	  }
	  if (parsed.get(self) === undefined && elem.value) {
	    parsed.set(self, elem.value);
	  }
	  return function () {
	    if (lazy) return dom.off(elem, "change", handler);
	    if (hasInput) {
	      elem.removeEventListener("input", handler);
	    } else {
	      dom.off(elem, "paste keyup cut change", handler);
	    }
	  };
	}
	
	// input:checkbox  binding
	
	function initCheckBox(elem, parsed) {
	  var self = this;
	  var watcher = this.$watch(parsed, function (newValue) {
	    dom.attr(elem, 'checked', !!newValue);
	  }, STABLE);
	
	  var handler = function handler() {
	    var value = this.checked;
	    parsed.set(self, value);
	    watcher.last = value;
	    self.$update();
	  };
	  if (parsed.set) dom.on(elem, "change", handler);
	
	  if (parsed.get(self) === undefined) {
	    parsed.set(self, !!elem.checked);
	  }
	
	  return function destroy() {
	    if (parsed.set) dom.off(elem, "change", handler);
	  };
	}
	
	// input:radio binding
	
	function initRadio(elem, parsed) {
	  var self = this;
	  var wc = this.$watch(parsed, function (newValue) {
	    if (newValue == elem.value) elem.checked = true;else elem.checked = false;
	  }, STABLE);
	
	  var handler = function handler() {
	    var value = this.value;
	    parsed.set(self, value);
	    self.$update();
	  };
	  if (parsed.set) dom.on(elem, "change", handler);
	  // beacuse only after compile(init), the dom structrue is exsit.
	  if (parsed.get(self) === undefined) {
	    if (elem.checked) {
	      parsed.set(self, elem.value);
	    }
	  }
	
	  return function destroy() {
	    if (parsed.set) dom.off(elem, "change", handler);
	  };
	}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var // packages
	_ = __webpack_require__(6),
	    animate = __webpack_require__(24),
	    dom = __webpack_require__(19),
	    Regular = __webpack_require__(12);
	
	var // variables
	rClassName = /^[-\w]+(\s[-\w]+)*$/,
	    rCommaSep = /[\r\n\f ]*,[\r\n\f ]*(?=\w+\:)/,
	    //  dont split comma in  Expression
	rStyles = /^\{.*\}$/,
	    //  for Simpilfy
	rSpace = /\s+/,
	    //  for Simpilfy
	WHEN_COMMAND = "when",
	    EVENT_COMMAND = "on",
	    THEN_COMMAND = "then";
	
	/**
	 * Animation Plugin
	 * @param {Component} Component 
	 */
	
	function createSeed(type) {
	
	  var steps = [],
	      current = 0,
	      callback = _.noop;
	  var key;
	
	  var out = {
	    type: type,
	    start: function start(cb) {
	      key = _.uid();
	      if (typeof cb === "function") callback = cb;
	      if (current > 0) {
	        current = 0;
	      } else {
	        out.step();
	      }
	      return out.compelete;
	    },
	    compelete: function compelete() {
	      key = null;
	      callback && callback();
	      callback = _.noop;
	      current = 0;
	    },
	    step: function step() {
	      if (steps[current]) steps[current](out.done.bind(out, key));
	    },
	    done: function done(pkey) {
	      if (pkey !== key) return; // means the loop is down
	      if (current < steps.length - 1) {
	        current++;
	        out.step();
	      } else {
	        out.compelete();
	      }
	    },
	    push: function push(step) {
	      steps.push(step);
	    }
	  };
	
	  return out;
	}
	
	Regular._addProtoInheritCache("animation");
	
	// builtin animation
	Regular.animation({
	  "wait": function wait(step) {
	    var timeout = parseInt(step.param) || 0;
	    return function (done) {
	      // _.log("delay " + timeout)
	      setTimeout(done, timeout);
	    };
	  },
	  "class": function _class(step) {
	    var tmp = step.param.split(","),
	        className = tmp[0] || "",
	        mode = parseInt(tmp[1]) || 1;
	
	    return function (done) {
	      // _.log(className)
	      animate.startClassAnimate(step.element, className, done, mode);
	    };
	  },
	  "call": function call(step) {
	    var fn = this.$expression(step.param).get,
	        self = this;
	    return function (done) {
	      // _.log(step.param, 'call')
	      fn(self);
	      self.$update();
	      done();
	    };
	  },
	  "emit": function emit(step) {
	    var param = step.param;
	    var tmp = param.split(","),
	        evt = tmp[0] || "",
	        args = tmp[1] ? this.$expression(tmp[1]).get : null;
	
	    if (!evt) throw Error("you shoud specified a eventname in emit command");
	
	    var self = this;
	    return function (done) {
	      self.$emit(evt, args ? args(self) : undefined);
	      done();
	    };
	  },
	  // style: left {10}px,
	  style: function style(step) {
	    var styles = {},
	        param = step.param,
	        pairs = param.split(","),
	        valid;
	    pairs.forEach(function (pair) {
	      pair = pair.trim();
	      if (pair) {
	        var tmp = pair.split(rSpace),
	            name = tmp.shift(),
	            value = tmp.join(" ");
	
	        if (!name || !value) throw Error("invalid style in command: style");
	        styles[name] = value;
	        valid = true;
	      }
	    });
	
	    return function (done) {
	      if (valid) {
	        animate.startStyleAnimate(step.element, styles, done);
	      } else {
	        done();
	      }
	    };
	  }
	});
	
	// hancdle the r-animation directive
	// el : the element to process
	// value: the directive value
	function processAnimate(element, value) {
	  var Component = this.constructor;
	
	  if (_.isExpr(value)) {
	    value = value.get(this);
	  }
	
	  value = value.trim();
	
	  var composites = value.split(";"),
	      composite,
	      context = this,
	      seeds = [],
	      seed,
	      destroies = [],
	      destroy,
	      command,
	      param,
	      current = 0,
	      tmp,
	      animator,
	      self = this;
	
	  function reset(type) {
	    seed && seeds.push(seed);
	    seed = createSeed(type);
	  }
	
	  function whenCallback(start, value) {
	    if (!!value) start();
	  }
	
	  function animationDestroy(element) {
	    return function () {
	      element.onenter = null;
	      element.onleave = null;
	    };
	  }
	
	  for (var i = 0, len = composites.length; i < len; i++) {
	
	    composite = composites[i];
	    tmp = composite.split(":");
	    command = tmp[0] && tmp[0].trim();
	    param = tmp[1] && tmp[1].trim();
	
	    if (!command) continue;
	
	    if (command === WHEN_COMMAND) {
	      reset("when");
	      this.$watch(param, whenCallback.bind(this, seed.start));
	      continue;
	    }
	
	    if (command === EVENT_COMMAND) {
	      reset(param);
	      if (param === "leave") {
	        element.onleave = seed.start;
	        destroies.push(animationDestroy(element));
	      } else if (param === "enter") {
	        element.onenter = seed.start;
	        destroies.push(animationDestroy(element));
	      } else {
	        if ("on" + param in element) {
	          // if dom have the event , we use dom event
	          destroies.push(this._handleEvent(element, param, seed.start));
	        } else {
	          // otherwise, we use component event
	          this.$on(param, seed.start);
	          destroies.push(this.$off.bind(this, param, seed.start));
	        }
	      }
	      continue;
	    }
	
	    var animator = Component.animation(command);
	    if (animator && seed) {
	      seed.push(animator.call(this, {
	        element: element,
	        done: seed.done,
	        param: param
	      }));
	    } else {
	      throw Error(animator ? "you should start with `on` or `event` in animation" : "undefined animator 【" + command + "】");
	    }
	  }
	
	  if (destroies.length) {
	    return function () {
	      destroies.forEach(function (destroy) {
	        destroy();
	      });
	    };
	  }
	}
	
	Regular.directive("r-animation", processAnimate);
	Regular.directive("r-anim", processAnimate);

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Regular = __webpack_require__(12);
	
	/**
	 * Timeout Module
	 * @param {Component} Component 
	 */
	function TimeoutModule(Component) {
	
	  Component.implement({
	    /**
	     * just like setTimeout, but will enter digest automately
	     * @param  {Function} fn    
	     * @param  {Number}   delay 
	     * @return {Number}   timeoutid
	     */
	    $timeout: function $timeout(fn, delay) {
	      delay = delay || 0;
	      return setTimeout((function () {
	        fn.call(this);
	        this.$update(); //enter digest
	      }).bind(this), delay);
	    },
	    /**
	     * just like setInterval, but will enter digest automately
	     * @param  {Function} fn    
	     * @param  {Number}   interval 
	     * @return {Number}   intervalid
	     */
	    $interval: function $interval(fn, interval) {
	      interval = interval || 1000 / 60;
	      return setInterval((function () {
	        fn.call(this);
	        this.$update(); //enter digest
	      }).bind(this), interval);
	    }
	  });
	}
	
	Regular.plugin('timeout', TimeoutModule);
	Regular.plugin('$timeout', TimeoutModule);

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var stateman;
	
	if (typeof window === 'object') {
	  stateman = __webpack_require__(36);
	  stateman.History = __webpack_require__(39);
	  stateman.util = __webpack_require__(38);
	  stateman.isServer = false;
	} else {
	  stateman = __webpack_require__(42);
	  stateman.isServer = true;
	}
	
	stateman.State = __webpack_require__(37);
	
	module.exports = stateman;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var State = __webpack_require__(37),
	    History = __webpack_require__(39),
	    Base = __webpack_require__(41),
	    _ = __webpack_require__(38),
	    baseTitle = document.title,
	    stateFn = State.prototype.state;
	
	function StateMan(options) {
	
	  if (this instanceof StateMan === false) {
	    return new StateMan(options);
	  }
	  options = options || {};
	  Base.call(this, options);
	  if (options.history) this.history = options.history;
	  this._stashCallback = [];
	  this.current = this.active = this;
	  // auto update document.title, when navigation has been down
	  this.on("end", function (options) {
	    var cur = this.current;
	    document.title = cur.getTitle(options) || baseTitle;
	  });
	}
	
	var o = _.inherit(StateMan, Base.prototype);
	
	_.extend(o, {
	
	  start: function start(options, callback) {
	
	    this._startCallback = callback;
	    if (!this.history) this.history = new History(options);
	    if (!this.history.isStart) {
	      this.history.on("change", _.bind(this._afterPathChange, this));
	      this.history.start();
	    }
	    return this;
	  },
	  stop: function stop() {
	    this.history.stop();
	  },
	  // @TODO direct go the point state
	  go: function go(state, option, callback) {
	    option = option || {};
	    var statename;
	    if (typeof state === "string") {
	      statename = state;
	      state = this.state(state);
	    }
	
	    if (!state) return this._notfound({ state: statename });
	
	    if (typeof option === "function") {
	      callback = option;
	      option = {};
	    }
	
	    if (option.encode !== false) {
	      var url = state.encode(option.param);
	      option.path = url;
	      this.nav(url, { silent: true, replace: option.replace });
	    }
	
	    this._go(state, option, callback);
	
	    return this;
	  },
	  nav: function nav(url, options, callback) {
	    if (typeof options === "function") {
	      callback = options;
	      options = {};
	    }
	    options = options || {};
	
	    options.path = url;
	
	    this.history.nav(url, _.extend({ silent: true }, options));
	    if (!options.silent) this._afterPathChange(_.cleanPath(url), options, callback);
	
	    return this;
	  },
	
	  // after pathchange changed
	  // @TODO: afterPathChange need based on decode
	  _afterPathChange: function _afterPathChange(path, options, callback) {
	
	    this.emit("history:change", path);
	
	    var found = this.decode(path);
	
	    options = options || {};
	
	    options.path = path;
	
	    if (!found) {
	      return this._notfound(options);
	    }
	
	    options.param = found.param;
	
	    if (options.firstTime && !callback) {
	      callback = this._startCallback;
	      delete this._startCallback;
	    }
	
	    this._go(found.state, options, callback);
	  },
	  _notfound: function _notfound(options) {
	
	    return this.emit("notfound", options);
	  },
	  // goto the state with some option
	  _go: function _go(state, option, callback) {
	
	    var over;
	
	    if (state.hasNext && this.strict) return this._notfound({ name: state.name });
	
	    option.param = option.param || {};
	
	    var current = this.current,
	        baseState = this._findBase(current, state),
	        prepath = this.path,
	        self = this;
	
	    if (typeof callback === "function") this._stashCallback.push(callback);
	    // if we done the navigating when start
	    function done(success) {
	      over = true;
	      if (success !== false) self.emit("end", option);
	      self.pending = null;
	      self._popStash(option);
	    }
	
	    option.previous = current;
	    option.current = state;
	
	    if (current !== state) {
	      option.stop = function () {
	        done(false);
	        self.nav(prepath ? prepath : "/", { silent: true });
	      };
	      self.emit("begin", option);
	    }
	    // if we stop it in 'begin' listener
	    if (over === true) return;
	
	    option.phase = 'permission';
	    this._walk(current, state, option, true, _.bind(function (notRejected) {
	
	      if (notRejected === false) {
	        // if reject in callForPermission, we will return to old
	        prepath && this.nav(prepath, { silent: true });
	
	        done(false, 2);
	
	        return this.emit('abort', option);
	      }
	
	      // stop previous pending.
	      if (this.pending) this.pending.stop();
	      this.pending = option;
	      this.path = option.path;
	      this.current = option.current;
	      this.param = option.param;
	      this.previous = option.previous;
	      option.phase = 'navigation';
	      this._walk(current, state, option, false, _.bind(function (notRejected) {
	
	        if (notRejected === false) {
	          this.current = this.active;
	          done(false);
	          return this.emit('abort', option);
	        }
	
	        this.active = option.current;
	
	        option.phase = 'completion';
	        return done();
	      }, this));
	    }, this));
	  },
	  _popStash: function _popStash(option) {
	
	    var stash = this._stashCallback,
	        len = stash.length;
	
	    this._stashCallback = [];
	
	    if (!len) return;
	
	    for (var i = 0; i < len; i++) {
	      stash[i].call(this, option);
	    }
	  },
	
	  // the transition logic  Used in Both canLeave canEnter && leave enter LifeCycle
	
	  _walk: function _walk(from, to, option, callForPermit, callback) {
	    // if(from === to) return callback();
	
	    // nothing -> app.state
	    var parent = this._findBase(from, to);
	    var self = this;
	
	    option.backward = true;
	    this._transit(from, parent, option, callForPermit, function (notRejected) {
	
	      if (notRejected === false) return callback(notRejected);
	
	      // only actual transiton need update base state;
	      option.backward = false;
	      self._walkUpdate(self, parent, option, callForPermit, function (notRejected) {
	        if (notRejected === false) return callback(notRejected);
	
	        self._transit(parent, to, option, callForPermit, callback);
	      });
	    });
	  },
	
	  _transit: function _transit(from, to, option, callForPermit, callback) {
	    //  touch the ending
	    if (from === to) return callback();
	
	    var back = from.name.length > to.name.length;
	    var method = back ? 'leave' : 'enter';
	    var applied;
	
	    // use canEnter to detect permission
	    if (callForPermit) method = 'can' + method.replace(/^\w/, function (a) {
	      return a.toUpperCase();
	    });
	
	    var loop = _.bind(function (notRejected) {
	
	      // stop transition or touch the end
	      if (applied === to || notRejected === false) return callback(notRejected);
	
	      if (!applied) {
	
	        applied = back ? from : this._computeNext(from, to);
	      } else {
	
	        applied = this._computeNext(applied, to);
	      }
	
	      if (back && applied === to || !applied) return callback(notRejected);
	
	      this._moveOn(applied, method, option, loop);
	    }, this);
	
	    loop();
	  },
	
	  _moveOn: function _moveOn(applied, method, option, callback) {
	
	    var isDone = false;
	    var isPending = false;
	
	    option.async = function () {
	
	      isPending = true;
	
	      return done;
	    };
	
	    function done(notRejected) {
	      if (isDone) return;
	      isPending = false;
	      isDone = true;
	      callback(notRejected);
	    }
	
	    option.stop = function () {
	      done(false);
	    };
	
	    this.active = applied;
	    var retValue = applied[method] ? applied[method](option) : true;
	
	    if (method === 'enter') applied.visited = true;
	    // promise
	    // need breadk , if we call option.stop first;
	
	    if (_.isPromise(retValue)) {
	
	      return this._wrapPromise(retValue, done);
	    }
	
	    // if haven't call option.async yet
	    if (!isPending) done(retValue);
	  },
	
	  _wrapPromise: function _wrapPromise(promise, next) {
	
	    return promise.then(next, function (err) {
	      //TODO: 万一promise中throw了Error如何处理？
	      if (err instanceof Error) throw err;
	      next(false);
	    });
	  },
	
	  _computeNext: function _computeNext(from, to) {
	
	    var fname = from.name;
	    var tname = to.name;
	
	    var tsplit = tname.split('.');
	    var fsplit = fname.split('.');
	
	    var tlen = tsplit.length;
	    var flen = fsplit.length;
	
	    if (fname === '') flen = 0;
	    if (tname === '') tlen = 0;
	
	    if (flen < tlen) {
	      fsplit[flen] = tsplit[flen];
	    } else {
	      fsplit.pop();
	    }
	
	    return this.state(fsplit.join('.'));
	  },
	
	  _findQuery: function _findQuery(querystr) {
	
	    var queries = querystr && querystr.split("&"),
	        query = {};
	    if (queries) {
	      var len = queries.length;
	      for (var i = 0; i < len; i++) {
	        var tmp = queries[i].split("=");
	        query[tmp[0]] = tmp[1];
	      }
	    }
	    return query;
	  },
	
	  _sortState: function _sortState(a, b) {
	    return (b.priority || 0) - (a.priority || 0);
	  },
	  // find the same branch;
	  _findBase: function _findBase(now, before) {
	
	    if (!now || !before || now == this || before == this) return this;
	    var np = now,
	        bp = before,
	        tmp;
	    while (np && bp) {
	      tmp = bp;
	      while (tmp) {
	        if (np === tmp) return tmp;
	        tmp = tmp.parent;
	      }
	      np = np.parent;
	    }
	  },
	  // check the query and Param
	  _walkUpdate: function _walkUpdate(baseState, to, options, callForPermit, done) {
	
	    var method = callForPermit ? 'canUpdate' : 'update';
	    var from = baseState;
	    var self = this;
	
	    var pathes = [],
	        node = to;
	    while (node !== this) {
	      pathes.push(node);
	      node = node.parent;
	    }
	
	    var loop = function loop(notRejected) {
	      if (notRejected === false) return done(false);
	      if (!pathes.length) return done();
	      from = pathes.pop();
	      self._moveOn(from, method, options, loop);
	    };
	
	    self._moveOn(from, method, options, loop);
	  }
	
	}, true);
	
	module.exports = StateMan;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _ = __webpack_require__(38);
	
	function State(option) {
	  this._states = {};
	  this._pending = false;
	  this.visited = false;
	  if (option) this.config(option);
	}
	
	//regexp cache
	State.rCache = {};
	
	_.extend(_.emitable(State), {
	
	  getTitle: function getTitle(options) {
	    var cur = this,
	        title;
	    while (cur) {
	      title = cur.title;
	      if (title) return typeof title === 'function' ? cur.title(options) : cur.title;
	      cur = cur.parent;
	    }
	    return title;
	  },
	
	  state: function state(stateName, config) {
	    if (_.typeOf(stateName) === "object") {
	      var keys = _.values(stateName, true);
	      keys.sort(function (ka, kb) {
	        return _.countDot(ka) - _.countDot(kb);
	      });
	
	      for (var i = 0, len = keys.length; i < len; i++) {
	        var key = keys[i];
	        this.state(key, stateName[key]);
	      }
	      return this;
	    }
	    var current = this,
	        next,
	        nextName,
	        states = this._states,
	        i = 0;
	
	    if (typeof stateName === "string") stateName = stateName.split(".");
	
	    var slen = stateName.length;
	    var stack = [];
	
	    do {
	      nextName = stateName[i];
	      next = states[nextName];
	      stack.push(nextName);
	      if (!next) {
	        if (!config) return;
	        next = states[nextName] = new State();
	        _.extend(next, {
	          parent: current,
	          manager: current.manager || current,
	          name: stack.join("."),
	          currentName: nextName
	        });
	        current.hasNext = true;
	        next.configUrl();
	      }
	      current = next;
	      states = next._states;
	    } while (++i < slen);
	
	    if (config) {
	      next.config(config);
	      return this;
	    } else {
	      return current;
	    }
	  },
	
	  config: function config(configure) {
	
	    configure = this._getConfig(configure);
	
	    for (var i in configure) {
	      var prop = configure[i];
	      switch (i) {
	        case "url":
	          if (typeof prop === "string") {
	            this.url = prop;
	            this.configUrl();
	          }
	          break;
	        case "events":
	          this.on(prop);
	          break;
	        default:
	          this[i] = prop;
	      }
	    }
	  },
	
	  // children override
	  _getConfig: function _getConfig(configure) {
	    return typeof configure === "function" ? { enter: configure } : configure;
	  },
	
	  //from url
	  configUrl: function configUrl() {
	    var url = "",
	        base = this;
	
	    while (base) {
	
	      url = (typeof base.url === "string" ? base.url : base.currentName || "") + "/" + url;
	
	      // means absolute;
	      if (url.indexOf("^/") === 0) {
	        url = url.slice(1);
	        break;
	      }
	      base = base.parent;
	    }
	    this.pattern = _.cleanPath("/" + url);
	    var pathAndQuery = this.pattern.split("?");
	    this.pattern = pathAndQuery[0];
	    // some Query we need watched
	
	    _.extend(this, _.normalize(this.pattern), true);
	  },
	  encode: function encode(param) {
	
	    var state = this;
	    param = param || {};
	
	    var matched = "%";
	
	    var url = state.matches.replace(/\(([\w-]+)\)/g, function (all, capture) {
	
	      var sec = param[capture];
	      var stype = typeof sec;
	      if (stype === 'boolean' || stype === 'number') sec = '' + sec;
	      sec = sec || '';
	      matched += capture + "%";
	      return sec;
	    }) + "?";
	
	    // remained is the query, we need concat them after url as query
	    for (var i in param) {
	      if (matched.indexOf("%" + i + "%") === -1) url += i + "=" + param[i] + "&";
	    }
	    return _.cleanPath(url.replace(/(?:\?|&)$/, ""));
	  },
	  decode: function decode(path) {
	    var matched = this.regexp.exec(path),
	        keys = this.keys;
	
	    if (matched) {
	
	      var param = {};
	      for (var i = 0, len = keys.length; i < len; i++) {
	        param[keys[i]] = matched[i + 1];
	      }
	      return param;
	    } else {
	      return false;
	    }
	  },
	  // by default, all lifecycle is permitted
	
	  async: function async() {
	    throw new Error('please use option.async instead');
	  }
	
	});
	
	module.exports = State;

/***/ }),
/* 38 */
/***/ (function(module, exports) {

	'use strict';
	
	var _ = module.exports = {};
	var slice = [].slice,
	    o2str = ({}).toString;
	
	// merge o2's properties to Object o1.
	_.extend = function (o1, o2, override) {
	  for (var i in o2) if (override || o1[i] === undefined) {
	    o1[i] = o2[i];
	  }
	  return o1;
	};
	
	var rDot = /\./g;
	_.countDot = function (word) {
	  var ret = word.match(rDot);
	  return ret ? ret.length : 0;
	};
	
	_.values = function (o, key) {
	  var keys = [];
	  for (var i in o) if (o.hasOwnProperty(i)) {
	    keys.push(key ? i : o[i]);
	  }
	  return keys;
	};
	
	_.inherit = function (cstor, o) {
	  function Faker() {}
	  Faker.prototype = o;
	  cstor.prototype = new Faker();
	  cstor.prototype.constructor = cstor;
	  return o;
	};
	
	_.slice = function (arr, index) {
	  return slice.call(arr, index);
	};
	
	_.typeOf = function typeOf(o) {
	  return o == null ? String(o) : o2str.call(o).slice(8, -1).toLowerCase();
	};
	
	//strict eql
	_.eql = function (o1, o2) {
	  var t1 = _.typeOf(o1),
	      t2 = _.typeOf(o2);
	  if (t1 !== t2) return false;
	  if (t1 === 'object') {
	    // only check the first's properties
	    for (var i in o1) {
	      // Immediately return if a mismatch is found.
	      if (o1[i] !== o2[i]) return false;
	    }
	    return true;
	  }
	  return o1 === o2;
	};
	
	// small emitter
	_.emitable = (function () {
	  function norm(ev) {
	    var eventAndNamespace = (ev || '').split(':');
	    return { event: eventAndNamespace[0], namespace: eventAndNamespace[1] };
	  }
	  var API = {
	    once: function once(event, fn) {
	      var callback = function callback() {
	        fn.apply(this, arguments);
	        this.off(event, callback);
	      };
	      return this.on(event, callback);
	    },
	    on: function on(event, fn) {
	      if (typeof event === 'object') {
	        for (var i in event) {
	          this.on(i, event[i]);
	        }
	        return this;
	      }
	      var ne = norm(event);
	      event = ne.event;
	      if (event && typeof fn === 'function') {
	        var handles = this._handles || (this._handles = {}),
	            calls = handles[event] || (handles[event] = []);
	        fn._ns = ne.namespace;
	        calls.push(fn);
	      }
	      return this;
	    },
	    off: function off(event, fn) {
	      var ne = norm(event);event = ne.event;
	      if (!event || !this._handles) this._handles = {};
	
	      var handles = this._handles;
	      var calls = handles[event];
	
	      if (calls) {
	        if (!fn && !ne.namespace) {
	          handles[event] = [];
	        } else {
	          for (var i = 0, len = calls.length; i < len; i++) {
	            if ((!fn || fn === calls[i]) && (!ne.namespace || calls[i]._ns === ne.namespace)) {
	              calls.splice(i, 1);
	              return this;
	            }
	          }
	        }
	      }
	
	      return this;
	    },
	    emit: function emit(event) {
	      var ne = norm(event);event = ne.event;
	
	      var args = _.slice(arguments, 1),
	          handles = this._handles,
	          calls;
	
	      if (!handles || !(calls = handles[event])) return this;
	      for (var i = 0, len = calls.length; i < len; i++) {
	        var fn = calls[i];
	        if (!ne.namespace || fn._ns === ne.namespace) fn.apply(this, args);
	      }
	      return this;
	    }
	  };
	  return function (obj) {
	    obj = typeof obj == "function" ? obj.prototype : obj;
	    return _.extend(obj, API);
	  };
	})();
	
	_.bind = function (fn, context) {
	  return function () {
	    return fn.apply(context, arguments);
	  };
	};
	
	var rDbSlash = /\/+/g,
	    // double slash
	rEndSlash = /\/$/; // end slash
	
	_.cleanPath = function (path) {
	  return ("/" + path).replace(rDbSlash, "/").replace(rEndSlash, "") || "/";
	};
	
	// normalize the path
	function normalizePath(path) {
	  // means is from
	  // (?:\:([\w-]+))?(?:\(([^\/]+?)\))|(\*{2,})|(\*(?!\*)))/g
	  var preIndex = 0;
	  var keys = [];
	  var index = 0;
	  var matches = "";
	
	  path = _.cleanPath(path);
	
	  var regStr = path
	  //  :id(capture)? | (capture)   |  ** | *
	  .replace(/\:([\w-]+)(?:\(([^\/]+?)\))?|(?:\(([^\/]+)\))|(\*{2,})|(\*(?!\*))/g, function (all, key, keyformat, capture, mwild, swild, startAt) {
	    // move the uncaptured fragment in the path
	    if (startAt > preIndex) matches += path.slice(preIndex, startAt);
	    preIndex = startAt + all.length;
	    if (key) {
	      matches += "(" + key + ")";
	      keys.push(key);
	      return "(" + (keyformat || "[\\w-]+") + ")";
	    }
	    matches += "(" + index + ")";
	
	    keys.push(index++);
	
	    if (capture) {
	      // sub capture detect
	      return "(" + capture + ")";
	    }
	    if (mwild) return "(.*)";
	    if (swild) return "([^\\/]*)";
	  });
	
	  if (preIndex !== path.length) matches += path.slice(preIndex);
	
	  return {
	    regexp: new RegExp("^" + regStr + "/?$"),
	    keys: keys,
	    matches: matches || path
	  };
	}
	
	_.log = function (msg, type) {
	  typeof console !== "undefined" && console[type || "log"](msg); //eslint-disable-line no-console
	};
	
	_.isPromise = function (obj) {
	
	  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
	};
	
	_.normalize = normalizePath;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	
	// MIT
	// Thx Backbone.js 1.1.2  and https://github.com/cowboy/jquery-hashchange/blob/master/jquery.ba-hashchange.js
	// for iframe patches in old ie.
	
	"use strict";
	
	var browser = __webpack_require__(40);
	var _ = __webpack_require__(38);
	
	// the mode const
	var QUIRK = 3,
	    HASH = 1,
	    HISTORY = 2;
	
	// extract History for test
	// resolve the conficlt with the Native History
	function History(options) {
	  options = options || {};
	
	  // Trick from backbone.history for anchor-faked testcase
	  this.location = options.location || browser.location;
	
	  // mode config, you can pass absolute mode (just for test);
	  this.html5 = options.html5;
	  this.mode = options.html5 && browser.history ? HISTORY : HASH;
	  if (!browser.hash) this.mode = QUIRK;
	  if (options.mode) this.mode = options.mode;
	
	  // hash prefix , used for hash or quirk mode
	  this.prefix = "#" + (options.prefix || "");
	  this.rPrefix = new RegExp(this.prefix + '(.*)$');
	  this.interval = options.interval || 66;
	
	  // the root regexp for remove the root for the path. used in History mode
	  this.root = options.root || "/";
	  this.rRoot = new RegExp("^" + this.root);
	
	  this.autolink = options.autolink !== false;
	  this.autofix = options.autofix !== false;
	
	  this.curPath = undefined;
	}
	
	_.extend(_.emitable(History), {
	  // check the
	  start: function start(callback) {
	    var path = this.getPath();
	    this._checkPath = _.bind(this.checkPath, this);
	
	    if (this.isStart) return;
	    this.isStart = true;
	
	    if (this.mode === QUIRK) {
	      this._fixHashProbelm(path);
	    }
	
	    switch (this.mode) {
	      case HASH:
	        browser.on(window, "hashchange", this._checkPath);
	        break;
	      case HISTORY:
	        browser.on(window, "popstate", this._checkPath);
	        break;
	      case QUIRK:
	        this._checkLoop();
	    }
	    // event delegate
	    this.autolink && this._autolink();
	    this.autofix && this._fixInitState();
	
	    this.curPath = path;
	
	    this.emit("change", path, { firstTime: true });
	  },
	
	  // the history teardown
	  stop: function stop() {
	
	    browser.off(window, 'hashchange', this._checkPath);
	    browser.off(window, 'popstate', this._checkPath);
	    clearTimeout(this.tid);
	    this.isStart = false;
	    this._checkPath = null;
	  },
	
	  // get the path modify
	  checkPath: function checkPath() /*ev*/{
	
	    var path = this.getPath(),
	        curPath = this.curPath;
	
	    //for oldIE hash history issue
	    if (path === curPath && this.iframe) {
	      path = this.getPath(this.iframe.location);
	    }
	
	    if (path !== curPath) {
	      this.iframe && this.nav(path, { silent: true });
	      this.curPath = path;
	      this.emit('change', path);
	    }
	  },
	
	  // get the current path
	  getPath: function getPath(location) {
	    location = location || this.location;
	    var tmp;
	
	    if (this.mode !== HISTORY) {
	      tmp = location.href.match(this.rPrefix);
	      return _.cleanPath(tmp && tmp[1] ? tmp[1] : "");
	    } else {
	      return _.cleanPath((location.pathname + location.search || "").replace(this.rRoot, "/"));
	    }
	  },
	
	  nav: function nav(to, options) {
	
	    var iframe = this.iframe;
	
	    options = options || {};
	
	    to = _.cleanPath(to);
	
	    if (this.curPath == to) return;
	
	    // pushState wont trigger the checkPath
	    // but hashchange will
	    // so we need set curPath before to forbit the CheckPath
	    this.curPath = to;
	
	    // 3 or 1 is matched
	    if (this.mode !== HISTORY) {
	      this._setHash(this.location, to, options.replace);
	      if (iframe && this.getPath(iframe.location) !== to) {
	        if (!options.replace) iframe.document.open().close();
	        this._setHash(this.iframe.location, to, options.replace);
	      }
	    } else {
	      this._changeState(this.location, options.title || "", _.cleanPath(this.root + to), options.replace);
	    }
	
	    if (!options.silent) this.emit('change', to);
	  },
	  _autolink: function _autolink() {
	    if (this.mode !== HISTORY) return;
	    // only in html5 mode, the autolink is works
	    // if(this.mode !== 2) return;
	    var self = this;
	    browser.on(document.body, "click", function (ev) {
	
	      var target = ev.target || ev.srcElement;
	      if (target.tagName.toLowerCase() !== "a") return;
	      var tmp = browser.isSameDomain(target.href) && (browser.getHref(target) || "").match(self.rPrefix);
	
	      var hash = tmp && tmp[1] ? tmp[1] : "";
	
	      if (!hash) return;
	
	      ev.preventDefault && ev.preventDefault();
	      self.nav(hash);
	      return ev.returnValue = false;
	    });
	  },
	  _setHash: function _setHash(location, path, replace) {
	    var href = location.href.replace(/(javascript:|#).*$/, '');
	    if (replace) {
	      location.replace(href + this.prefix + path);
	    } else location.hash = this.prefix + path;
	  },
	  // for browser that not support onhashchange
	  _checkLoop: function _checkLoop() {
	    var self = this;
	    this.tid = setTimeout(function () {
	      self._checkPath();
	      self._checkLoop();
	    }, this.interval);
	  },
	  // if we use real url in hash env( browser no history popstate support)
	  // or we use hash in html5supoort mode (when paste url in other url)
	  // then , history should repara it
	  _fixInitState: function _fixInitState() {
	    var pathname = _.cleanPath(this.location.pathname),
	        hash,
	        hashInPathName;
	
	    // dont support history popstate but config the html5 mode
	    if (this.mode !== HISTORY && this.html5) {
	
	      hashInPathName = pathname.replace(this.rRoot, "");
	      if (hashInPathName) this.location.replace(this.root + this.prefix + _.cleanPath(hashInPathName));
	    } else if (this.mode === HISTORY /* && pathname === this.root*/) {
	
	        hash = this.location.hash.replace(this.prefix, "");
	        if (hash) this._changeState(this.location, document.title, _.cleanPath(this.root + hash));
	      }
	  },
	  // ONLY for test, forbid browser to update
	  _changeState: function _changeState(location, title, path, replace) {
	    var history = location.history || window.history;
	    return history[replace ? 'replaceState' : 'pushState']({}, title, path);
	  },
	  // Thanks for backbone.history and https://github.com/cowboy/jquery-hashchange/blob/master/jquery.ba-hashchange.js
	  // for helping stateman fixing the oldie hash history issues when with iframe hack
	  _fixHashProbelm: function _fixHashProbelm(path) {
	    var iframe = document.createElement('iframe'),
	        body = document.body;
	    iframe.src = 'javascript:;';
	    iframe.style.display = 'none';
	    iframe.tabIndex = -1;
	    iframe.title = "";
	    this.iframe = body.insertBefore(iframe, body.firstChild).contentWindow;
	    this.iframe.document.open().close();
	    this.iframe.location.hash = '#' + path;
	  }
	
	});
	
	module.exports = History;

/***/ }),
/* 40 */
/***/ (function(module, exports) {

	"use strict";
	
	var win = window,
	    doc = document;
	
	module.exports = {
	  hash: "onhashchange" in win && (!doc.documentMode || doc.documentMode > 7),
	  history: win.history && "onpopstate" in win,
	  location: win.location,
	  isSameDomain: function isSameDomain(url) {
	    var matched = url.match(/^.*?:\/\/([^/]*)/);
	    if (matched) {
	      return matched[0] == this.location.origin;
	    }
	    return true;
	  },
	  getHref: function getHref(node) {
	    return "href" in node ? node.getAttribute("href", 2) : node.getAttribute("href");
	  },
	  on: "addEventListener" in win ? // IE10 attachEvent is not working when binding the onpopstate, so we need check addEventLister first
	  function (node, type, cb) {
	    return node.addEventListener(type, cb);
	  } : function (node, type, cb) {
	    return node.attachEvent("on" + type, cb);
	  },
	
	  off: "removeEventListener" in win ? function (node, type, cb) {
	    return node.removeEventListener(type, cb);
	  } : function (node, type, cb) {
	    return node.detachEvent("on" + type, cb);
	  }
	};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var State = __webpack_require__(37),
	    _ = __webpack_require__(38),
	    stateFn = State.prototype.state;
	
	function BaseMan(options) {
	
	  options = options || {};
	
	  this._states = {};
	
	  this.strict = options.strict;
	  this.title = options.title;
	
	  if (options.routes) this.state(options.routes);
	}
	
	_.extend(_.emitable(BaseMan), {
	  // keep blank
	  name: '',
	
	  root: true,
	
	  state: function state(stateName) {
	
	    var active = this.active;
	    var args = _.slice(arguments, 1);
	
	    if (typeof stateName === "string" && active) {
	      stateName = stateName.replace("~", active.name);
	      if (active.parent) stateName = stateName.replace("^", active.parent.name || "");
	    }
	    // ^ represent current.parent
	    // ~ represent  current
	    // only
	    args.unshift(stateName);
	    return stateFn.apply(this, args);
	  },
	
	  decode: function decode(path, needLocation) {
	
	    var pathAndQuery = path.split("?");
	    var query = this._findQuery(pathAndQuery[1]);
	    path = pathAndQuery[0];
	    var found = this._findState(this, path);
	    if (found) _.extend(found.param, query);
	    return found;
	  },
	  encode: function encode(stateName, param, needLink) {
	    var state = this.state(stateName);
	    var history = this.history;
	    if (!state) return;
	    var url = state.encode(param);
	
	    return needLink ? history.mode !== 2 ? history.prefix + url : url : url;
	  },
	  // notify specify state
	  // check the active statename whether to match the passed condition (stateName and param)
	  is: function is(stateName, param, isStrict) {
	    if (!stateName) return false;
	    stateName = stateName.name || stateName;
	    var current = this.current,
	        currentName = current.name;
	    var matchPath = isStrict ? currentName === stateName : (currentName + ".").indexOf(stateName + ".") === 0;
	    return matchPath && (!param || _.eql(param, this.param));
	  },
	
	  _wrapPromise: function _wrapPromise(promise, next) {
	
	    return promise.then(next, function () {
	      next(false);
	    });
	  },
	
	  _findQuery: function _findQuery(querystr) {
	
	    var queries = querystr && querystr.split("&"),
	        query = {};
	    if (queries) {
	      var len = queries.length;
	      for (var i = 0; i < len; i++) {
	        var tmp = queries[i].split("=");
	        query[tmp[0]] = tmp[1];
	      }
	    }
	    return query;
	  },
	  _findState: function _findState(state, path) {
	    var states = state._states,
	        found,
	        param;
	
	    // leaf-state has the high priority upon branch-state
	    if (state.hasNext) {
	
	      var stateList = _.values(states).sort(this._sortState);
	      var len = stateList.length;
	
	      for (var i = 0; i < len; i++) {
	
	        found = this._findState(stateList[i], path);
	        if (found) return found;
	      }
	    }
	    // in strict mode only leaf can be touched
	    // if all children is don. will try it self
	    param = state.regexp && state.decode(path);
	    if (param) {
	      return {
	        state: state,
	        param: param
	      };
	    } else {
	      return false;
	    }
	  },
	  _sortState: function _sortState(a, b) {
	    return (b.priority || 0) - (a.priority || 0);
	  },
	  // find the same branch;
	  _findBase: function _findBase(now, before) {
	
	    if (!now || !before || now == this || before == this) return this;
	    var np = now,
	        bp = before,
	        tmp;
	    while (np && bp) {
	      tmp = bp;
	      while (tmp) {
	        if (np === tmp) return tmp;
	        tmp = tmp.parent;
	      }
	      np = np.parent;
	    }
	  }
	
	}, true);
	
	module.exports = BaseMan;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(38);
	var Base = __webpack_require__(41);
	
	function ServerManager(options) {
	  if (this instanceof ServerManager === false) {
	    return new ServerManager(options);
	  }
	  Base.apply(this, arguments);
	}
	
	var o = _.inherit(ServerManager, Base.prototype);
	
	_.extend(o, {
	  exec: function exec(path) {
	    var found = this.decode(path);
	    if (!found) return;
	    var param = found.param;
	
	    //@FIXIT: We NEED decodeURIComponent in server side!!
	
	    for (var i in param) {
	      if (typeof param[i] === 'string') param[i] = decodeURIComponent(param[i]);
	    }
	    var states = [];
	    var state = found.state;
	    this.current = state;
	
	    while (state && !state.root) {
	      states.unshift(state);
	      state = state.parent;
	    }
	
	    return {
	      states: states,
	      param: param
	    };
	  }
	});
	
	module.exports = ServerManager;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Regular = __webpack_require__(3);
	
	var util = {
	  isPromiseLike: function isPromiseLike(obj) {
	    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
	  },
	  normPromise: function normPromise(ret) {
	    return util.isPromiseLike(ret) ? ret : Promise.resolve(ret);
	  },
	  // if your define second argument, we will automatic generate a promise for you
	  proxyMethod: function proxyMethod(context, method, option) {
	    if (!context) return;
	    var fn = typeof method === 'string' ? context[method] : method;
	    if (typeof fn === 'function') {
	      if (fn.length >= 2) {
	        return new Promise(function (resolve) {
	          fn.call(context, option, resolve);
	        });
	      } else {
	        return fn.call(context, option);
	      }
	    }
	  },
	  extend: Regular.util.extend,
	  extractState: (function () {
	    var rStateLink = /^([\w-]+(?:\.[\w-]+)*)\((.*)\)$/;
	
	    // app.blog({id:3})
	    return function extractState(stateLinkExpr) {
	      stateLinkExpr = stateLinkExpr.replace(/\s+/g, '');
	      var parsed = rStateLink.exec(stateLinkExpr);
	      if (parsed) {
	        return {
	          name: parsed[1],
	          param: parsed[2]
	        };
	      }
	    };
	  })()
	
	};
	
	module.exports = util;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Regular = __webpack_require__(3);
	var u = __webpack_require__(43);
	var extend = u.extend;
	var win = typeof window !== 'undefined' && window;
	
	var extension = __webpack_require__(45);
	
	function createRestate(Stateman) {
	
	  function Restate(options) {
	    options = options || {};
	    if (!(this instanceof Restate)) return new Restate(options);
	    extend(this, options);
	    extension(this);
	    Stateman.call(this, options);
	  }
	
	  var so = Regular.util.createProto(Restate, Stateman.prototype);
	
	  extend(so, {
	    installData: function installData(option) {
	      var ret,
	          state = option.state;
	      var firstData = this.firstData;
	
	      if (option.ssr) {
	        //证明首次服务端渲染后的初始化
	        var type = typeof firstData;
	
	        if (type === 'string') {
	          ret = win[firstData][state.name];
	        }
	        if (type === 'function') {
	          ret = u.proxyMethod(this, 'firstData', option);
	        }
	      }
	
	      if (ret) return u.normPromise(ret);
	
	      return u.proxyMethod(state, 'data', option);
	    },
	    installView: function installView(option) {
	      var state = option.state,
	          Comp = state.view;
	      // if(typeof Comp !== 'function') throw Error('view of [' + state.name + '] with wrong type')
	      // Lazy load
	      if (state.ssr === false && Regular.env.node) {
	        Comp = undefined;
	      } else if (!Regular.isRegular(Comp)) {
	        Comp = u.proxyMethod(state, Comp, option);
	      }
	      return u.normPromise(Comp);
	    },
	    install: function install(option) {
	      return Promise.all([this.installData(option), this.installView(option)]).then(function (ret) {
	        return {
	          Component: ret[1],
	          data: ret[0]
	        };
	      });
	    }
	  });
	  return Restate;
	}
	
	module.exports = createRestate;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(43);
	var Regular = __webpack_require__(3);
	var dom = Regular.dom;
	
	function handleUrl(url, history) {
	  return history.mode === 2 ? url : history.prefix + url;
	}
	
	module.exports = function (stateman) {
	
	  function getParam(name, context) {
	    if (typeof name !== 'string' || name.toLowerCase().trim() === '') {
	      return null;
	    } else {
	      return context.$get(name);
	    }
	  }
	
	  Regular.directive({
	    'r-view': {
	      link: function link(element) {
	        this.$viewport = element;
	      },
	      ssr: function ssr(attr) {
	        return 'r-view';
	      }
	    },
	    'r-link': {
	      nps: true,
	      link: function link(element, value) {
	
	        // use html5 history
	        if (stateman.history.mode === 2) {
	          dom.attr(element, 'data-autolink', 'data-autolink');
	        }
	        if (value && value.type === 'expression') {
	
	          this.$watch(value, function (val) {
	            dom.attr(element, 'href', handleUrl(val, stateman.history));
	          });
	          return;
	        }
	        var parsedLinkExpr = _.extractState(value);
	
	        if (parsedLinkExpr) {
	
	          var param = parsedLinkExpr.param;
	          if (param.trim() === '') {
	            value = stateman.encode(parsedLinkExpr.name);
	          } else {
	            this.$watch(parsedLinkExpr.param, function (param) {
	              dom.attr(element, 'href', handleUrl(stateman.encode(parsedLinkExpr.name, param), stateman.history));
	            }, { deep: true });
	            return;
	          }
	        }
	
	        dom.attr(element, 'href', handleUrl(value, stateman.history));
	      },
	      ssr: function ssr(value, tag) {
	
	        if (value && value.type === 'expression') {
	          return 'href="' + Regular.util.escape(getParam(value, this)) + '"';
	        }
	        var parsedLinkExpr = _.extractState(value);
	
	        if (parsedLinkExpr) {
	          var param = getParam(parsedLinkExpr.param, this);
	          return 'href="' + stateman.encode(parsedLinkExpr.name, param) + '"';
	        } else {}
	      }
	    }
	  });
	};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Regular = __webpack_require__(3);
	var service = __webpack_require__(47);
	
	var template = '\n<div class="m-login" ref=container>\n  <div class="login-triangle"></div>\n  \n  <h2 class="login-header">Log In</h2>\n\n  <form class="login-container" on-submit={this.login($event)}>\n    <p><input type="text" placeholder="Username" r-model={username} /></p>\n    <p><input type="password" placeholder="Password" r-model={password} /></p>\n    <p><input class=\'btn btn-primary\' type="submit" value="Log In" /></p>\n  </form>\n</div>\n';
	
	module.exports = Regular.extend({
	
	  template: template
	
	  // login($event){
	
	  //   $event.preventDefault();
	
	  //   const data = this.data;
	  //   service.login(data.username, data.password).then( ()=>{
	  //     location.href='/poster'
	  //   })['catch'](function( err ){
	  //     console.log(err)
	  //     throw err
	  //   })
	  //   return false;
	  // }
	
	});

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var blog = __webpack_require__(48);
	
	module.exports = { blog: blog };

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Progress = __webpack_require__(49);
	var fetchBase = __webpack_require__(51);
	var _ = __webpack_require__(50);
	
	var progress;
	
	/**
	 * 建议所有的产品都为xhr设置一个统一入口， 方便加上统一逻辑. 
	 */
	function fetch(url, opt) {
	
	  opt = opt || {};
	  if (!progress) progress = new Progress();
	
	  opt.method = opt.method || 'GET';
	  opt.credentials = 'same-origin';
	
	  // 1. 根据规范， 我们fix一些参数
	  var queryString;
	  if (opt.data) {
	    if (/GET|HEAD/.test(opt.method)) {
	      url = url + '?' + _.obj2query(opt.data);
	    } else {
	
	      opt.headers = {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      };
	      opt.body = JSON.stringify(opt.data);
	    }
	  }
	
	  var indicator;
	
	  if (opt.needProgress !== false) {
	
	    indicator = progress;
	    indicator.start();
	  }
	
	  return fetchBase(url, opt).then(function (ret) {
	
	    indicator && indicator.end();
	    return !opt.raw ? ret.json() : ret;
	  })['catch'](function (err) {
	
	    indicator && indicator.end(true);
	    throw err;
	  });
	}
	
	module.exports = fetch;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Regular = __webpack_require__(3);
	var _ = __webpack_require__(50);
	
	var tpl = '\n<div class="progress progress-fix animated" r-hide={!progress}  r-animation= \'on:enter; class: {inClass}; on: leave; class: {outClass};\'>\n  <div class="progress-bar progress-bar-striped active" role="rogressbar" style=" background-color: {currentColor};width: {percent||0}% ;">\n  </div>\n</div>\n';
	
	function mix(c1, c2, weight) {
	  var p = weight / 100,
	      a = 0,
	      w = p * 2 - 1,
	      w1 = ((w * a == -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0,
	      w2 = 1 - w1,
	      channels = [parseInt(c1[0] * w1 + c2[0] * w2, 10), parseInt(c1[1] * w1 + c2[1] * w2, 10), parseInt(c1[2] * w1 + c2[2] * w2, 10)];
	  return channels;
	}
	
	var COLORS = {
	  SUCCESS: [92, 184, 92], // '#5cb85c';
	  INFO: [91, 192, 222], // '#5bc0de',
	  DANGER: [217, 83, 79], //'#d9534f',
	  WARNING: [240, 173, 78] // '#f0ad4e';
	};
	
	var Progress = Regular.extend({
	
	  template: tpl,
	  // 计算属性
	  computed: {
	    currentColor: function currentColor(data) {
	      var channels = mix(data.startColor, data.endColor, 100 - data.percent);
	      return 'rgb(' + channels[0] + ',' + channels[1] + ',' + channels[2] + ')';
	    }
	  },
	  config: function config(data) {
	    // 默认属性
	    _.extend(data, {
	      startColor: COLORS.INFO,
	      endColor: COLORS.SUCCESS,
	      inClass: 'fadeIn',
	      outClass: 'fadeOut',
	      percent: 0
	    });
	  },
	  // 初始化后的函数
	  init: function init() {
	    // 证明不是内嵌组件
	    if (this.$root == this) this.$inject(document.body);
	    if (this.data.autoStart) this.start();
	  },
	  // 移动到某个百分比
	  move: function move(percent) {
	    clearTimeout(this.timer);
	    if (percent === 100) this.end(true);else this.$update('percent', percent);
	  },
	  // 开始
	  start: function start() {
	    if (this.timer) clearTimeout(this.timer);
	    this.data.progress = true;
	    this.data.percent = 2;
	    this.data.endColor = COLORS.SUCCESS;
	    this.$update();
	    this._startTimer();
	  },
	  // 结束
	  end: function end(error) {
	    clearTimeout(this.timer);
	    this.data.progress = false;
	    this.data.percent = 100;
	    this.data.endColor = !error ? COLORS.SUCCESS : COLORS.DANGER;
	    this.$update();
	  },
	  // 开始定时器
	  _startTimer: function _startTimer() {
	    var data = this.data;
	    this.timer = this.$timeout(function () {
	      data.percent = data.percent + (100 - data.percent) * (Math.random() * 0.2);
	      this._startTimer();
	    }, Math.random() * 300 + 500);
	  }
	  // 使用timeout模块
	}).use('$timeout');
	
	module.exports = Progress;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Regular = __webpack_require__(3);
	
	module.exports = Regular.util.extend({
	
	  extend: function extend(o1, o2, override) {
	    for (var i in o2) if (o2.hasOwnProperty(i)) {
	      if (override || typeof o1[i] === 'undefined') o1[i] = o2[i];
	    }
	    return o1;
	  },
	
	  obj2query: function obj2query(data) {
	    var query = '';
	    if (!data) return query;
	    for (var i in data) {
	      query += i + '=' + encodeURIComponent(data[i]) + '&';
	    }
	    // remove last `&`;
	    return query.replace(/&$/, '');
	  }
	}, Regular.util);

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	// the whatwg-fetch polyfill installs the fetch() function
	// on the global object (window or self)
	//
	// Return that as the export for use in Webpack, Browserify etc.
	'use strict';
	
	__webpack_require__(52);
	module.exports = self.fetch.bind(self);

/***/ }),
/* 52 */
/***/ (function(module, exports) {

	'use strict';
	
	(function (self) {
	  'use strict';
	
	  if (self.fetch) {
	    return;
	  }
	
	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function () {
	      try {
	        new Blob();
	        return true;
	      } catch (e) {
	        return false;
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  };
	
	  if (support.arrayBuffer) {
	    var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];
	
	    var isDataView = function isDataView(obj) {
	      return obj && DataView.prototype.isPrototypeOf(obj);
	    };
	
	    var isArrayBufferView = ArrayBuffer.isView || function (obj) {
	      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
	    };
	  }
	
	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name);
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name');
	    }
	    return name.toLowerCase();
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value);
	    }
	    return value;
	  }
	
	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function next() {
	        var value = items.shift();
	        return { done: value === undefined, value: value };
	      }
	    };
	
	    if (support.iterable) {
	      iterator[Symbol.iterator] = function () {
	        return iterator;
	      };
	    }
	
	    return iterator;
	  }
	
	  function Headers(headers) {
	    this.map = {};
	
	    if (headers instanceof Headers) {
	      headers.forEach(function (value, name) {
	        this.append(name, value);
	      }, this);
	    } else if (Array.isArray(headers)) {
	      headers.forEach(function (header) {
	        this.append(header[0], header[1]);
	      }, this);
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function (name) {
	        this.append(name, headers[name]);
	      }, this);
	    }
	  }
	
	  Headers.prototype.append = function (name, value) {
	    name = normalizeName(name);
	    value = normalizeValue(value);
	    var oldValue = this.map[name];
	    this.map[name] = oldValue ? oldValue + ',' + value : value;
	  };
	
	  Headers.prototype['delete'] = function (name) {
	    delete this.map[normalizeName(name)];
	  };
	
	  Headers.prototype.get = function (name) {
	    name = normalizeName(name);
	    return this.has(name) ? this.map[name] : null;
	  };
	
	  Headers.prototype.has = function (name) {
	    return this.map.hasOwnProperty(normalizeName(name));
	  };
	
	  Headers.prototype.set = function (name, value) {
	    this.map[normalizeName(name)] = normalizeValue(value);
	  };
	
	  Headers.prototype.forEach = function (callback, thisArg) {
	    for (var name in this.map) {
	      if (this.map.hasOwnProperty(name)) {
	        callback.call(thisArg, this.map[name], name, this);
	      }
	    }
	  };
	
	  Headers.prototype.keys = function () {
	    var items = [];
	    this.forEach(function (value, name) {
	      items.push(name);
	    });
	    return iteratorFor(items);
	  };
	
	  Headers.prototype.values = function () {
	    var items = [];
	    this.forEach(function (value) {
	      items.push(value);
	    });
	    return iteratorFor(items);
	  };
	
	  Headers.prototype.entries = function () {
	    var items = [];
	    this.forEach(function (value, name) {
	      items.push([name, value]);
	    });
	    return iteratorFor(items);
	  };
	
	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
	  }
	
	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'));
	    }
	    body.bodyUsed = true;
	  }
	
	  function fileReaderReady(reader) {
	    return new Promise(function (resolve, reject) {
	      reader.onload = function () {
	        resolve(reader.result);
	      };
	      reader.onerror = function () {
	        reject(reader.error);
	      };
	    });
	  }
	
	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader();
	    var promise = fileReaderReady(reader);
	    reader.readAsArrayBuffer(blob);
	    return promise;
	  }
	
	  function readBlobAsText(blob) {
	    var reader = new FileReader();
	    var promise = fileReaderReady(reader);
	    reader.readAsText(blob);
	    return promise;
	  }
	
	  function readArrayBufferAsText(buf) {
	    var view = new Uint8Array(buf);
	    var chars = new Array(view.length);
	
	    for (var i = 0; i < view.length; i++) {
	      chars[i] = String.fromCharCode(view[i]);
	    }
	    return chars.join('');
	  }
	
	  function bufferClone(buf) {
	    if (buf.slice) {
	      return buf.slice(0);
	    } else {
	      var view = new Uint8Array(buf.byteLength);
	      view.set(new Uint8Array(buf));
	      return view.buffer;
	    }
	  }
	
	  function Body() {
	    this.bodyUsed = false;
	
	    this._initBody = function (body) {
	      this._bodyInit = body;
	      if (!body) {
	        this._bodyText = '';
	      } else if (typeof body === 'string') {
	        this._bodyText = body;
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body;
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body;
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString();
	      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	        this._bodyArrayBuffer = bufferClone(body.buffer);
	        // IE 10-11 can't handle a DataView body.
	        this._bodyInit = new Blob([this._bodyArrayBuffer]);
	      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	        this._bodyArrayBuffer = bufferClone(body);
	      } else {
	        throw new Error('unsupported BodyInit type');
	      }
	
	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8');
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type);
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	        }
	      }
	    };
	
	    if (support.blob) {
	      this.blob = function () {
	        var rejected = consumed(this);
	        if (rejected) {
	          return rejected;
	        }
	
	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob);
	        } else if (this._bodyArrayBuffer) {
	          return Promise.resolve(new Blob([this._bodyArrayBuffer]));
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob');
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]));
	        }
	      };
	
	      this.arrayBuffer = function () {
	        if (this._bodyArrayBuffer) {
	          return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
	        } else {
	          return this.blob().then(readBlobAsArrayBuffer);
	        }
	      };
	    }
	
	    this.text = function () {
	      var rejected = consumed(this);
	      if (rejected) {
	        return rejected;
	      }
	
	      if (this._bodyBlob) {
	        return readBlobAsText(this._bodyBlob);
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as text');
	      } else {
	        return Promise.resolve(this._bodyText);
	      }
	    };
	
	    if (support.formData) {
	      this.formData = function () {
	        return this.text().then(decode);
	      };
	    }
	
	    this.json = function () {
	      return this.text().then(JSON.parse);
	    };
	
	    return this;
	  }
	
	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
	
	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase();
	    return methods.indexOf(upcased) > -1 ? upcased : method;
	  }
	
	  function Request(input, options) {
	    options = options || {};
	    var body = options.body;
	
	    if (input instanceof Request) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read');
	      }
	      this.url = input.url;
	      this.credentials = input.credentials;
	      if (!options.headers) {
	        this.headers = new Headers(input.headers);
	      }
	      this.method = input.method;
	      this.mode = input.mode;
	      if (!body && input._bodyInit != null) {
	        body = input._bodyInit;
	        input.bodyUsed = true;
	      }
	    } else {
	      this.url = String(input);
	    }
	
	    this.credentials = options.credentials || this.credentials || 'omit';
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers);
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET');
	    this.mode = options.mode || this.mode || null;
	    this.referrer = null;
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests');
	    }
	    this._initBody(body);
	  }
	
	  Request.prototype.clone = function () {
	    return new Request(this, { body: this._bodyInit });
	  };
	
	  function decode(body) {
	    var form = new FormData();
	    body.trim().split('&').forEach(function (bytes) {
	      if (bytes) {
	        var split = bytes.split('=');
	        var name = split.shift().replace(/\+/g, ' ');
	        var value = split.join('=').replace(/\+/g, ' ');
	        form.append(decodeURIComponent(name), decodeURIComponent(value));
	      }
	    });
	    return form;
	  }
	
	  function parseHeaders(rawHeaders) {
	    var headers = new Headers();
	    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
	    // https://tools.ietf.org/html/rfc7230#section-3.2
	    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
	    preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
	      var parts = line.split(':');
	      var key = parts.shift().trim();
	      if (key) {
	        var value = parts.join(':').trim();
	        headers.append(key, value);
	      }
	    });
	    return headers;
	  }
	
	  Body.call(Request.prototype);
	
	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {};
	    }
	
	    this.type = 'default';
	    this.status = options.status === undefined ? 200 : options.status;
	    this.ok = this.status >= 200 && this.status < 300;
	    this.statusText = 'statusText' in options ? options.statusText : 'OK';
	    this.headers = new Headers(options.headers);
	    this.url = options.url || '';
	    this._initBody(bodyInit);
	  }
	
	  Body.call(Response.prototype);
	
	  Response.prototype.clone = function () {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    });
	  };
	
	  Response.error = function () {
	    var response = new Response(null, { status: 0, statusText: '' });
	    response.type = 'error';
	    return response;
	  };
	
	  var redirectStatuses = [301, 302, 303, 307, 308];
	
	  Response.redirect = function (url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code');
	    }
	
	    return new Response(null, { status: status, headers: { location: url } });
	  };
	
	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;
	
	  self.fetch = function (input, init) {
	    return new Promise(function (resolve, reject) {
	      var request = new Request(input, init);
	      var xhr = new XMLHttpRequest();
	
	      xhr.onload = function () {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	        };
	        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options));
	      };
	
	      xhr.onerror = function () {
	        reject(new TypeError('Network request failed'));
	      };
	
	      xhr.ontimeout = function () {
	        reject(new TypeError('Network request failed'));
	      };
	
	      xhr.open(request.method, request.url, true);
	
	      if (request.credentials === 'include') {
	        xhr.withCredentials = true;
	      } else if (request.credentials === 'omit') {
	        xhr.withCredentials = false;
	      }
	
	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob';
	      }
	
	      request.headers.forEach(function (value, name) {
	        xhr.setRequestHeader(name, value);
	      });
	
	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
	    });
	  };
	  self.fetch.polyfill = true;
	})(typeof self !== 'undefined' ? self : undefined);

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var BlogDetail = __webpack_require__(54);
	var BlogList = __webpack_require__(56);
	var BlogEdit = __webpack_require__(58);
	var Application = __webpack_require__(59);
	var Poster = __webpack_require__(62);
	var Index = __webpack_require__(66);
	var Blog = __webpack_require__(67);
	var Regular = __webpack_require__(3);
	
	module.exports = {
	  'app': {
	    url: '',
	    view: Application
	  },
	  'app.index': {
	    url: '',
	    view: Index
	  },
	  'app.blog': {
	    view: Blog
	  },
	  'app.blog.edit': {
	    url: ':id/edit',
	    view: BlogEdit
	  },
	  'app.blog.detail': {
	    url: ':id',
	    view: BlogDetail
	  },
	  'app.blog.list': {
	    url: '',
	    view: BlogList
	  },
	  // lazy load Chat Module
	  'app.chat': {
	    view: function view(option, resolve) {
	      __webpack_require__.e/* nsure */(1, function (require) {
	        resolve(__webpack_require__(68));
	      });
	    }
	  }
	};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Regular = __webpack_require__(3);
	var blogService = __webpack_require__(55);
	var _ = __webpack_require__(50);
	
	var tpl = '\n<div class="blog-post">\n  <h2 class="blog-post-title">{blog.title}\n    <span class="badge">preview</span>\n    <a r-link=\'app.blog.edit({id:id})\' >Edit</a>\n  </h2>\n\n  <div class="form-group">\n  <label for="content">Tag</label>\n  <div>\n   {#list blog.tags as tag by tag_index}\n   <span class="label label-info">{tag}</span>\n   {/list}\n  </div>\n  </div>\n  <div class="blog-post-meta">\n    {blog.time|format}\n    <a href=\'javascript:;\'>{blog.user.name}</a>\n    <div class="content" r-html={blog.content} ></div>\n  </div>\n</div>\n';
	
	module.exports = Regular.extend({
	
	  template: tpl,
	  mount: function mount(option) {
	    var data = this.data;
	    var id = data.id = parseInt(option.param.id);
	
	    return blogService.get(id).then(function (detail) {
	      data.blog = detail;
	    });
	  }
	});

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var fetch = __webpack_require__(48);
	
	function getList(page) {
	
	  page = parseInt(page) - 1;
	
	  return fetch('/api/blogs', {
	    data: {
	      limit: 20,
	      offset: page * 20
	    }
	  });
	}
	
	function get(id) {
	  return fetch('/api/blogs/' + id);
	}
	
	function update(id, blog) {
	  return fetch('/api/blogs/' + id, {
	    method: 'PUT',
	    data: blog
	  });
	}
	
	function add(blog) {
	
	  return fetch('/api/blogs', {
	    method: 'POST',
	    data: blog
	  });
	}
	
	function remove(id) {
	  return fetch('/api/blogs/' + id, {
	    method: 'DELETE'
	  });
	}
	
	module.exports = { getList: getList, get: get, update: update, remove: remove, add: add };

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Regular = __webpack_require__(3);
	var Pager = __webpack_require__(57);
	var blogService = __webpack_require__(55);
	
	var tpl = '\n  <h2 class="sub-header">Bloging List <a  r-link=\'app.blog.edit({id:-1})\' class=\'btn btn-primary\'>(Add a blog)</a></h2>\n<div class="table-responsive">\n\n<pager total={total}  current={page} on-nav={this.refresh($event.page, true)}></pager>\n  <table class="table table-striped">\n    <thead>\n      <tr>\n        <th>id</th>\n        <th>author</th>\n        <th>time</th>\n        <th>title</th>\n        <th>abstract</th>\n        <th>action</th>\n      </tr>\n    </thead>\n    <tbody>\n      {#list blogs as blog by blog_index}\n      <tr on-click={activeIndex = blog_index} class={activeIndex === blog_index? \'active\': \'disabled\'}>\n        <td>{blog.id}</td>\n        <td>{blog.user.name}</td>\n        <td>{blog.time|format}</td>\n        <td>{blog.title}</td>\n        <td>{blog.content.slice(0,30) + "..."}</td>\n        <td>\n        <div class="btn-group" role="group" aria-label="...">\n          <a r-link=\'app.index()\' class="btn btn-sm btn-default">edit</a>\n          <a r-link=\'app.blog.detail({id: blog.id})\'  class="btn btn-sm btn-default">view</a>\n          <a href=\'#\' on-click={this.remove(blog.id, blog_index)} class="btn btn-sm btn-danger">delete</a>\n        </div>\n      </td>\n      </tr>\n      {#else}\n      <tr><td colspan=6>no blogs here</td></tr>\n      {/list}\n    </tbody>\n  </table>\n  <pager total={total} current={page} on-nav={this.refresh($event.page)}></pager>\n</div>\n';
	
	module.exports = Regular.extend({
	
	  template: tpl,
	
	  mount: function mount(option) {
	
	    var page = parseInt(option.param.page) || 1;
	    var data = this.data;
	
	    return blogService.getList(page || 1).then(function (res) {
	      data.blogs = res.blogs;
	      data.total = Math.ceil(res.total / 20);
	      data.current = page;
	      // 异步获取的数据 ，在目前版本需要手动$update()
	    })['catch'](function (err) {
	      throw err;
	    });
	  },
	
	  // get particular page
	  refresh: function refresh(page, redirect) {
	
	    var data = this.data;
	
	    return this.$state.go('app.blog.list', { param: { page: page } });
	  },
	  remove: function remove(id, index) {
	    var _this = this;
	
	    var data = this.data;
	
	    return blogService.remove({ id: id }).then(function () {
	      data.blogs.splice(index, 1);
	      _this.$update(); // 由于是异步响应，所以需要主动update
	    });
	    return false;
	  }
	
	});

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Regular = __webpack_require__(3);
	var dom = Regular.dom;
	
	var tpl = '\n<ul class="pagination">\n  <li on-click={ this.nav(current-1)}  class=\'pageprv {current==1? "disabled": ""}\'><a  href=\'#\' >上一页</a></li>\n  {#if total - 5 > show * 2} \n  <li  on-click={ this.nav(1)} class={current==1? \'active\': \'\'}><a href=\'#\'>1</a></li>\n  <li>{#if begin > 2}<a>...</a>{/if}</li>\n  {#list begin..end as i}\n    <li on-click={ this.nav(i)} class={current==i? \'active\': \'\'}><a href=\'#\' >{i}</a></li> \n  {/list}\n  {#if (end < total-1)}<li><a>...</a></li> {/if}\n  <li on-click={ this.nav(total)} class={current==total? \'active\': \'\'}><a href=\'#\'>{total}</a></li> \n  {#else}\n  {#list 1..total as i} \n  <li on-click={ this.nav(i)} class={current==i? \'active\': \'\'}><a href=\'#\' >{i}</a></li>  \n  {/list}\n  {/if}\n  <li on-click={ this.nav(current + 1)}  class=\'pagenxt {current==total? "disabled": ""}\'><a  href=\'#\' >下一页</a></li>\n</ul>\n';
	
	var Pager = Regular.extend({
	
	  name: 'pager',
	  template: tpl,
	
	  config: function config(data) {
	    var count = 5;
	    var show = data.show = Math.floor(count / 2);
	    data.current = parseInt(data.current || 1);
	    data.total = parseInt(data.total || 1);
	
	    this.$watch(['current', 'total'], function (current, total) {
	      data.begin = current - show;
	      data.end = current + show;
	      if (data.begin < 2) data.begin = 2;
	      if (data.end > data.total - 1) data.end = data.total - 1;
	      if (current - data.begin <= 1) data.end = data.end + show + data.begin - current;
	      if (data.end - current <= 1) data.begin = data.begin - show - current + data.end;
	    }, { init: true });
	  },
	
	  nav: function nav(page) {
	    var data = this.data;
	    if (page < 1) return false;
	    if (page > data.total) return false;
	    if (page === data.current) return false;
	    var evObj = { page: page };
	    this.$emit('nav', evObj);
	    if (!evObj.stop) {
	      data.current = page;
	    }
	    return false;
	  }
	
	});
	
	module.exports = Pager;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var blogService = __webpack_require__(55);
	var Regular = __webpack_require__(3);
	
	var tpl = '\n<h2>{$param.id==\'-1\'?\'Add\':\'Edit\'} Post</h2>\n<div class=\'row\'>\n  <div class="col-md-10">\n    <form>\n      <div class="form-group">\n        <label for="title">Title</label>\n        <input type="text" class="form-control" r-model={blog.title} placeholder="Enter Title">\n      </div>\n      <div class="form-group">\n        <label for="content">Tag</label>\n        <div>\n         {#list blog.tags as tag by tag_index}\n         <span class="label label-info">{tag} <i class=\'glyphicon glyphicon-remove\' on-click={blog.tags.splice(tag_index, 1)}></i></span>\n         {/list}\n         <input r-model={tagContent} placeholder="Enter Tag" on-enter={this.addTag(tagContent)} >\n        </div>\n      </div>\n      <div class="form-group">\n        <label for="content">Content</label>\n        <textarea r-model={blog.content} placeholder="Blog Content" class="form-control" rows=10 ></textarea>\n      </div>\n       <a class="btn btn-primary" on-click={this.submit( id )}>Submit</a>\n    </form>\n  </div>\n</div>\n';
	
	module.exports = Regular.extend({
	
	  template: tpl,
	
	  mount: function mount(option) {
	    var data = this.data;
	    var id = data.id = parseInt(option.param.id);
	    if (id == -1) {
	      data.blog = {
	        tags: []
	      };
	      return;
	    }
	
	    return blogService.get(id).then(function (detail) {
	      data.blog = detail;
	    });
	  },
	
	  submit: function submit(id) {
	    var _this = this;
	
	    var data = this.data;
	    id = parseInt(id);
	    var detail = data.blog;
	
	    if (id == '-1') {
	      //add
	      blogService.add(detail).then(function () {
	        _this.$state.go('app.blog.list');
	      });
	    } else {
	      blogService.update(id, detail).then(function () {
	        _this.$state.go('app.blog.detail', { param: { id: id } });
	      });
	    }
	  },
	  addTag: function addTag() {
	    var data = this.data;
	    if (!data.tagContent) return;
	    data.blog.tags.push(data.tagContent);
	    data.tagContent = '';
	  }
	
	});

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Regular = __webpack_require__(3);
	var Menu = __webpack_require__(60);
	var consts = __webpack_require__(61);
	
	var tpl = '\n  <div class="g-sd col-sm-2">\n    <div class="m-nav">\n      <div class="u-logo">\n        <img src="/img/logo.svg" alt="网易有数">\n        <h3>博客</h3>\n      </div>\n      <app-menu panes={panes} state={@(this.$state)} title={subTitle}></app-menu>\n    </div>\n  </div>\n  <div class="g-bd col-sm-10">\n    <!-- 顶栏 -->\n    <div class="row m-header">\n      <ul class="breadcrumb">\n        <li>\n          <a href="">\n            <span class="glyphicon glyphicon-home"></span>\n          </a>\n        </li>\n        <li class="active" r-hide={!subTitle}>{subTitle}</li>\n      </ul>\n      <ul class="nav navbar-right">\n        \n        <li class="dropdown">\n         <a href="/api/logout">{user.name} <i class="glyphicon glyphicon-log-out"></i>登出</a>\n        </li>\n      </ul>\n    </div>\n    <!-- card -->\n    <div class="row">\n      <div class="col-sm-12" r-view>\n      </div>\n    </div>\n  </div>\n';
	
	module.exports = Regular.extend({
	
	  template: tpl,
	
	  config: function config(data) {
	
	    data.nowYear = new Date().getFullYear();
	
	    data.panes = consts.PANES;
	  },
	  login: function login(username, password) {
	
	    return false;
	  }
	});
	
	// <app-menu menus={menus} state={@(this.$state)}></app-menu>

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Regular = __webpack_require__(3);
	
	var tpl = '\n\n{#list panes as pane by pane_index}\n  <div class="m-snav">\n    <h4>{pane.title}</h4>\n    <ul class="nav">\n      {#list pane.menus as menu by menu_index}\n      <li class="snav_item" r-class={{\'active\': title==menu.title }} >\n        <a r-link={menu.url} >\n          <span class="glyphicon glyphicon-{menu.icon||\'inbox\'}"></span>{menu.title}\n        </a>\n        {#if menu.menus}\n        <ul class=\'nav\'>\n          {#list menu.menus as mn}\n            <li> <a r-link={mn.url} >{mn.title}</a> </li>\n          {/list}\n        </ul>\n        {/if}\n      </li>\n      {/list}\n    </ul>\n  </div>\n{/list}\n';
	
	var Menu = Regular.extend({
	
	  name: 'app-menu',
	  template: tpl,
	
	  config: function config(data) {
	    var _this = this;
	
	    // 确保在每次state改变后Menu会重新update
	    if (!Regular.isServer) {
	      data.state.on('end', function (option) {
	        _this.$update(function () {
	          return _this.findMenu(option.path);
	        });
	      });
	    }
	  },
	  findMenu: function findMenu(path) {
	
	    var data = this.data;
	    var panes = data.panes;
	
	    panes.forEach(function (pane) {
	      if (pane.menus) {
	        pane.menus.some(function (menu) {
	          if (menu.test && menu.test.test(path)) {
	            console.log(path, menu);
	            data.title = menu.title;
	            return true;
	          }
	        });
	      }
	    });
	  }
	});
	
	module.exports = Menu;

/***/ }),
/* 61 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = {
	
	  LIMIT: 20,
	
	  PANES: [{
	    title: '首页',
	    menus: [{
	      title: '首页',
	      icon: 'home',
	      url: '/',
	      test: /\/|/
	    }]
	  }, {
	    title: '平台',
	    menus: [{
	      title: '博客',
	      icon: 'book',
	      url: '/blog',
	      test: /\/blog/
	    }, {
	      title: '聊天室',
	      icon: 'comment',
	      url: '/chat',
	      test: /\/chat/
	    }]
	  }]
	
	};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Modal = __webpack_require__(63);
	var template = '\n<div class="row">\n  <div class="col-sm-6 col-md-4">\n    <div class="thumbnail">\n      <img data-src="holder.js/100%x200" alt="100%x200" style="height: 200px; width: 100%; display: block;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzE5IiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMxOSAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MjAwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTU1NTIxMjI5ZGMgdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxNnB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNTU1MjEyMjlkYyI+PHJlY3Qgd2lkdGg9IjMxOSIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMTcuOTg0Mzc1IiB5PSIxMDcuMiI+MzE5eDIwMDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">\n      <div class="caption">\n        <h3>Thumbnail 1</h3>\n        <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>\n        <p><a href="#" class="btn btn-primary" role="button">Button</a> <a href="#" class="btn btn-default" role="button">Button</a></p>\n      </div>\n    </div>\n  </div>\n  <div class="col-sm-6 col-md-4">\n    <div class="thumbnail">\n      <img data-src="holder.js/100%x200" alt="100%x200" style="height: 200px; width: 100%; display: block;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzE5IiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMxOSAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MjAwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTU1NTIxMjM2YzQgdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxNnB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNTU1MjEyMzZjNCI+PHJlY3Qgd2lkdGg9IjMxOSIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMTcuOTg0Mzc1IiB5PSIxMDcuMiI+MzE5eDIwMDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">\n      <div class="caption">\n        <h3>Thumbnail 2</h3>\n        <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>\n        <p><a href="#" class="btn btn-primary" role="button">Button</a> <a href="#" class="btn btn-default" role="button">Button</a></p>\n      </div>\n    </div>\n  </div>\n  <div class="col-sm-6 col-md-4">\n    <div class="thumbnail">\n      <img data-src="holder.js/100%x200" alt="100%x200" style="height: 200px; width: 100%; display: block;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMzE5IiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMxOSAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MjAwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTU1NTIxMWQ1YWMgdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxNnB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNTU1MjExZDVhYyI+PHJlY3Qgd2lkdGg9IjMxOSIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMTcuOTg0Mzc1IiB5PSIxMDcuMiI+MzE5eDIwMDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" data-holder-rendered="true">\n      <div class="caption">\n        <h3>Thumbnail 3</h3>\n        <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>\n        <p><a href="#" class="btn btn-primary" role="button">Button</a> <a href="#" class="btn btn-default" role="button">Button</a></p>\n      </div>\n    </div>\n  </div>\n</div>\n';
	
	var Poster = Modal.extend({
	  // 注意这里我们只修改了Modal中的this.$body, 从而复用其它部分
	  $body: template
	});
	
	module.exports = Poster;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var dom = __webpack_require__(64);
	var Regular = __webpack_require__(3);
	
	var tpl = __webpack_require__(65);
	
	function getPosition(elem, center) {
	  var win = window;
	  var doc = elem && elem.ownerDocument,
	      docElem = doc.documentElement,
	      body = doc.body,
	      box = elem.getBoundingClientRect ? elem.getBoundingClientRect() : { top: 0, left: 0 },
	      clientTop = docElem.clientTop || body.clientTop || 0,
	      clientLeft = docElem.clientLeft || body.clientLeft || 0,
	      scrollTop = win.pageYOffset || docElem.scrollTop,
	      scrollLeft = win.pageXOffset || docElem.scrollLeft;
	
	  return {
	    top: box.top + scrollTop - clientTop + (center && box.height ? box.height / 2 : 0),
	    left: box.left + scrollLeft - clientLeft + (center && box.width ? box.width / 2 : 0)
	  };
	}
	
	function setVendorStyle(element, property, value) {
	  var propertyChanged = property.replace(/^\w/, function (a) {
	    return a.toUpperCase();
	  });
	
	  element.style['Webkit' + propertyChanged] = value;
	  element.style['Moz' + propertyChanged] = value;
	  element.style['Ms' + propertyChanged] = value;
	  element.style['O' + propertyChanged] = value;
	  element.style[property] = value;
	}
	
	/**
	 * options: 
	 *   - autoRecycleRequest : 是否自动回收弹窗开始以后的请求
	 */
	
	var Modal = Regular.extend({
	  name: 'modal',
	  template: tpl,
	
	  init: function init() {
	    var data = this.data;
	    var modal = this.$refs.modal;
	    // 处理
	    // 动画开始位置
	    var showAt = data.showAt;
	
	    if (showAt) {
	
	      if (showAt.nodeType === 1) {
	        //证明传入的是节点
	
	        var position = getPosition(showAt, true);
	
	        showAt = {
	          x: position.left,
	          y: position.top
	        };
	      }
	
	      if (showAt.x && showAt.y) {
	        setVendorStyle(modal, 'transformOrigin', '' + parseInt(showAt.x, 10) + 'px ' + parseInt(showAt.y, 10) + 'px');
	      }
	    }
	
	    var self = this;
	    dom.on(document, 'keyup', cancel);
	
	    function cancel(ev) {
	      if (ev.which === 27) {
	        //ESC
	        self.destroy();
	      }
	    }
	
	    this.$on('$destroy', function () {
	      dom.off(document, 'keyup', cancel);
	    }); //ESC
	
	    this.$watch('!!show', function (show) {
	      var body = data.container || document.body;
	      this.$inject(show ? body : false);
	    });
	
	    // this._bindDragEvent();
	  },
	  confirm: function confirm(accept) {
	    var data = this.data;
	    this.$emit('confirm', { accept: accept });
	    var body = data.container || document.body;
	
	    if (data.autoClose) {
	      data.show = false;
	      this.destroy();
	    }
	  },
	  show: function show() {
	    this.$update('show', true);
	    return this;
	  },
	  hide: function hide() {
	    this.$update('show', false);
	  }
	  //
	});
	
	['Head', 'Body', 'Foot'].forEach(function (name) {
	  var lname = name.toLowerCase();
	  Modal[name] = Regular.extend({
	    name: 'modal.' + lname,
	
	    init: function init() {
	      // this.$outer point to modal
	      this.$outer.data[lname] = this.$body;
	    }
	  });
	});
	
	module.exports = Modal;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Regular = __webpack_require__(3);
	
	var dom = Regular.dom;
	
	module.exports = dom;

/***/ }),
/* 65 */
/***/ (function(module, exports) {

	module.exports = "\n<div class=\"modal fade show\" tabindex=\"-1\" \n  r-anim='on:enter; wait: 200;class: in, 3; on: leave; class: in, 4'  role=\"dialog\" ref=modal>\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\" role=\"document\">\n      <div class=\"modal-header\">\n        {#if !noClose}\n        <button class=\"close\" aria-label=\"Close\" on-click={this.confirm(false)}>\n          <span aria-hidden=\"true\">×</span>\n        </button>\n        {/if}\n        <h4 class=\"modal-title\">{#inc title || '弹窗'}</h4>\n      </div>\n      <div class=\"modal-body\">\n        {#inc  body || this.$body }\n      </div>\n      <div class=\"modal-footer\">\n        {#if foot} \n          {#inc foot } \n        {#else}\n          <button type=\"button\" class=\"btn btn-primary\" on-click={ this.confirm(true) }>{confirmText||'确认'}</button>\n          <button type=\"button\" class=\"btn btn-default\" on-click={ this.confirm(false) }>{cancelText||'取消'}</button>\n        {/if}\n      </div>\n    </div>\n  </div>\n</div>"

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Regular = __webpack_require__(3);
	
	module.exports = Regular.extend({
	  template: '<div class="jumbotron">\n  <div class="container">\n    <h1>Hello!</h1>\n    <p>\n      This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.\n    </p>\n    <p>\n      <a class="btn btn-primary btn-lg" r-link="/poster" role="button">查看广告版  »</a>\n    </p>\n  </div>\n</div>\n<div class="row">\n  <div class="col-md-4">\n    <h2>Heading<span class="label label-default">New</span></h2>\n    <p>\n      Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.\n    </p>\n    <p>\n    </p>\n  </div>\n  <div class="col-md-4">\n    <h2>Heading<span class="label label-default">New</span></h2>\n    <p>\n      Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.\n    </p>\n    <p>\n    </p>\n  </div>\n  <div class="col-md-4">\n    <h2>Heading<span class="label label-default">New</span></h2>\n    <p>\n      Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.\n    </p>\n    <p>\n    </p>\n  </div>\n</div>'
	});

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Regular = __webpack_require__(3);
	
	var tpl = '\n<h1 class="page-header"></h1>\n<nav class="navbar navbar-default">\n  <div class="container-fluid">\n    \n    <div id="navbar" class="navbar-collapse collapse">\n      <ul class="nav navbar-nav">\n        <li  class={ this.$state.is("app.blog.list")? \'active\':\'\' }>\n          <a r-link=\'/blog\'>List</a>\n        </li>\n        <li  class={ this.$state.is("app.blog.detail")? \'active\':\'\' }>\n          <a href=\'javascript:;\'>Detail</a>\n        </li>\n        <li  class={ this.$state.is("app.blog.edit")? \'active\':\'\' }>\n          <a r-link=\'/blog/-1/edit\'>Edit</a>\n        </li>\n        <li></li>\n      </ul>\n    </div>\n    </div>\n</nav>\n<menu state={$state} menu={menus} ></menu>\n<div class="col-sm-12" r-view ></div>\n';
	
	module.exports = Regular.extend({
	
	  template: tpl,
	
	  config: function config() {
	    this.$state.on('end', this.$update.bind(this, null));
	    // 监听其它模块的$notify
	    this.$on('updateTotal', function (option) {
	      this.$update('total', option.param);
	    });
	  }
	
	});

/***/ }),
/* 68 */,
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	// 做一些全局的shim，以及Regular本身的扩展
	
	'use strict';
	
	var Regular = __webpack_require__(3);
	var dom = Regular.dom;
	
	var keys = Object.keys || function (obj) {
	  var ret = [];
	  for (var i in obj) {
	    ret.push(i);
	  }
	  return ret;
	};
	
	// 如果需要就把
	
	var filters = (function () {
	  // dateformat util
	  var fmap = {
	    'yyyy': function yyyy(date) {
	      return date.getFullYear();
	    },
	    'MM': function MM(date) {
	      return fix(date.getMonth() + 1);
	    },
	    'dd': function dd(date) {
	      return fix(date.getDate());
	    },
	    'HH': function HH(date) {
	      return fix(date.getHours());
	    },
	    'mm': function mm(date) {
	      return fix(date.getMinutes());
	    }
	  };
	  var trunk = new RegExp(keys(fmap).join('|'), 'g');
	  function fix(str) {
	    str = '' + (str || '');
	    return str.length <= 1 ? '0' + str : str;
	  }
	
	  return {
	    // fomat date
	    // ------------------
	    // example:
	    // {1449737531544|format: 'yyyy年MM月dd日'}
	    format: function format(value, _format) {
	
	      _format = _format || 'yyyy-MM-dd HH:mm';
	      if (!value) return;
	      value = new Date(value);
	
	      return _format.replace(trunk, function (cap) {
	        return fmap[cap] ? fmap[cap](value) : '';
	      });
	    }
	  };
	})();
	
	Regular.filter(filters).event({
	  'enter': function enter(elem, fire) {
	    function update(ev) {
	      if (ev.which === 13) {
	        ev.preventDefault();
	        fire(ev);
	      }
	    }
	
	    dom.on(elem, 'keypress', update);
	  }
	});

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map