module.exports = function() {
  "use strict";
  (function(global) {
    'use strict';
    if (global.$traceurRuntime) {
      return;
    }
    var $Object = Object;
    var $TypeError = TypeError;
    var $create = $Object.create;
    var $defineProperty = $Object.defineProperty;
    var $freeze = $Object.freeze;
    var $getOwnPropertyNames = $Object.getOwnPropertyNames;
    var $keys = $Object.keys;
    var $apply = Function.prototype.call.bind(Function.prototype.apply);
    var $random = Math.random;
    var $getOwnPropertySymbols = $Object.getOwnPropertySymbols;
    var $Symbol = global.Symbol;
    var $WeakMap = global.WeakMap;
    var hasNativeSymbol = $getOwnPropertySymbols && typeof $Symbol === 'function';
    var hasNativeWeakMap = typeof $WeakMap === 'function';
    function $bind(operand, thisArg, args) {
      var argArray = [thisArg];
      for (var i = 0; i < args.length; i++) {
        argArray[i + 1] = args[i];
      }
      var func = $apply(Function.prototype.bind, operand, argArray);
      return func;
    }
    function $construct(func, argArray) {
      var object = new ($bind(func, null, argArray));
      return object;
    }
    var counter = Date.now() % 1e9;
    function newUniqueString() {
      return '__$' + ($random() * 1e9 >>> 1) + '$' + ++counter + '$__';
    }
    var createPrivateSymbol,
        deletePrivate,
        getPrivate,
        hasPrivate,
        isPrivateSymbol,
        setPrivate;
    if (hasNativeWeakMap) {
      isPrivateSymbol = function(s) {
        return false;
      };
      createPrivateSymbol = function() {
        return new $WeakMap();
      };
      hasPrivate = function(obj, sym) {
        return sym.has(obj);
      };
      deletePrivate = function(obj, sym) {
        return sym.delete(obj);
      };
      setPrivate = function(obj, sym, val) {
        sym.set(obj, val);
      };
      getPrivate = function(obj, sym) {
        return sym.get(obj);
      };
    } else {
      var privateNames = $create(null);
      isPrivateSymbol = function(s) {
        return privateNames[s];
      };
      createPrivateSymbol = function() {
        var s = hasNativeSymbol ? $Symbol() : newUniqueString();
        privateNames[s] = true;
        return s;
      };
      hasPrivate = function(obj, sym) {
        return hasOwnProperty.call(obj, sym);
      };
      deletePrivate = function(obj, sym) {
        if (!hasPrivate(obj, sym)) {
          return false;
        }
        delete obj[sym];
        return true;
      };
      setPrivate = function(obj, sym, val) {
        obj[sym] = val;
      };
      getPrivate = function(obj, sym) {
        var val = obj[sym];
        if (val === undefined)
          return undefined;
        return hasOwnProperty.call(obj, sym) ? val : undefined;
      };
    }
    (function() {
      function nonEnum(value) {
        return {
          configurable: true,
          enumerable: false,
          value: value,
          writable: true
        };
      }
      var method = nonEnum;
      var symbolInternalProperty = newUniqueString();
      var symbolDescriptionProperty = newUniqueString();
      var symbolDataProperty = newUniqueString();
      var symbolValues = $create(null);
      var SymbolImpl = function Symbol(description) {
        var value = new SymbolValue(description);
        if (!(this instanceof SymbolImpl))
          return value;
        throw new TypeError('Symbol cannot be new\'ed');
      };
      $defineProperty(SymbolImpl.prototype, 'constructor', nonEnum(SymbolImpl));
      $defineProperty(SymbolImpl.prototype, 'toString', method(function() {
        var symbolValue = this[symbolDataProperty];
        return symbolValue[symbolInternalProperty];
      }));
      $defineProperty(SymbolImpl.prototype, 'valueOf', method(function() {
        var symbolValue = this[symbolDataProperty];
        if (!symbolValue)
          throw TypeError('Conversion from symbol to string');
        return symbolValue[symbolInternalProperty];
      }));
      function SymbolValue(description) {
        var key = newUniqueString();
        $defineProperty(this, symbolDataProperty, {value: this});
        $defineProperty(this, symbolInternalProperty, {value: key});
        $defineProperty(this, symbolDescriptionProperty, {value: description});
        $freeze(this);
        symbolValues[key] = this;
      }
      $defineProperty(SymbolValue.prototype, 'constructor', nonEnum(SymbolImpl));
      $defineProperty(SymbolValue.prototype, 'toString', {
        value: SymbolImpl.prototype.toString,
        enumerable: false
      });
      $defineProperty(SymbolValue.prototype, 'valueOf', {
        value: SymbolImpl.prototype.valueOf,
        enumerable: false
      });
      $freeze(SymbolValue.prototype);
      function isSymbolString(s) {
        return symbolValues[s] || isPrivateSymbol(s);
      }
      function removeSymbolKeys(array) {
        var rv = [];
        for (var i = 0; i < array.length; i++) {
          if (!isSymbolString(array[i])) {
            rv.push(array[i]);
          }
        }
        return rv;
      }
      function getOwnPropertyNames(object) {
        return removeSymbolKeys($getOwnPropertyNames(object));
      }
      function keys(object) {
        return removeSymbolKeys($keys(object));
      }
      var getOwnPropertySymbolsEmulate = function getOwnPropertySymbols(object) {
        var rv = [];
        var names = $getOwnPropertyNames(object);
        for (var i = 0; i < names.length; i++) {
          var symbol = symbolValues[names[i]];
          if (symbol) {
            rv.push(symbol);
          }
        }
        return rv;
      };
      var getOwnPropertySymbolsPrivate = function getOwnPropertySymbols(object) {
        var rv = [];
        var symbols = $getOwnPropertySymbols(object);
        for (var i = 0; i < symbols.length; i++) {
          var symbol = symbols[i];
          if (!isPrivateSymbol(symbol)) {
            rv.push(symbol);
          }
        }
        return rv;
      };
      function exportStar(object) {
        for (var i = 1; i < arguments.length; i++) {
          var names = $getOwnPropertyNames(arguments[i]);
          for (var j = 0; j < names.length; j++) {
            var name = names[j];
            if (name === '__esModule' || name === 'default' || isSymbolString(name))
              continue;
            (function(mod, name) {
              $defineProperty(object, name, {
                get: function() {
                  return mod[name];
                },
                enumerable: true
              });
            })(arguments[i], names[j]);
          }
        }
        return object;
      }
      function isObject(x) {
        return x != null && ((typeof x === 'undefined' ? 'undefined' : $traceurRuntime.typeof(x)) === 'object' || typeof x === 'function');
      }
      function toObject(x) {
        if (x == null)
          throw $TypeError();
        return $Object(x);
      }
      function checkObjectCoercible(argument) {
        if (argument == null) {
          throw new TypeError('Value cannot be converted to an Object');
        }
        return argument;
      }
      function polyfillSymbol(global) {
        if (!hasNativeSymbol) {
          global.Symbol = SymbolImpl;
          var Object = global.Object;
          Object.getOwnPropertyNames = getOwnPropertyNames;
          Object.keys = keys;
          $defineProperty(Object, 'getOwnPropertySymbols', nonEnum(getOwnPropertySymbolsEmulate));
        } else if (!hasNativeWeakMap) {
          $defineProperty(Object, 'getOwnPropertySymbols', nonEnum(getOwnPropertySymbolsPrivate));
        }
        if (!global.Symbol.iterator) {
          global.Symbol.iterator = Symbol('Symbol.iterator');
        }
        if (!global.Symbol.observer) {
          global.Symbol.observer = Symbol('Symbol.observer');
        }
      }
      function hasNativeSymbolFunc() {
        return hasNativeSymbol;
      }
      function setupGlobals(global) {
        polyfillSymbol(global);
        global.Reflect = global.Reflect || {};
        global.Reflect.global = global.Reflect.global || global;
      }
      setupGlobals(global);
      var typeOf = hasNativeSymbol ? function(x) {
        return (typeof x === 'undefined' ? 'undefined' : $traceurRuntime.typeof(x));
      } : function(x) {
        return x instanceof SymbolValue ? 'symbol' : (typeof x === 'undefined' ? 'undefined' : $traceurRuntime.typeof(x));
      };
      global.$traceurRuntime = {
        checkObjectCoercible: checkObjectCoercible,
        createPrivateSymbol: createPrivateSymbol,
        deletePrivate: deletePrivate,
        exportStar: exportStar,
        getPrivate: getPrivate,
        hasNativeSymbol: hasNativeSymbolFunc,
        hasPrivate: hasPrivate,
        isObject: isObject,
        options: {},
        setPrivate: setPrivate,
        setupGlobals: setupGlobals,
        toObject: toObject,
        typeof: typeOf
      };
    })();
  })(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this);
  (function() {
    function buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
      var out = [];
      if (opt_scheme) {
        out.push(opt_scheme, ':');
      }
      if (opt_domain) {
        out.push('//');
        if (opt_userInfo) {
          out.push(opt_userInfo, '@');
        }
        out.push(opt_domain);
        if (opt_port) {
          out.push(':', opt_port);
        }
      }
      if (opt_path) {
        out.push(opt_path);
      }
      if (opt_queryData) {
        out.push('?', opt_queryData);
      }
      if (opt_fragment) {
        out.push('#', opt_fragment);
      }
      return out.join('');
    }
    var splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
    var ComponentIndex = {
      SCHEME: 1,
      USER_INFO: 2,
      DOMAIN: 3,
      PORT: 4,
      PATH: 5,
      QUERY_DATA: 6,
      FRAGMENT: 7
    };
    function split(uri) {
      return (uri.match(splitRe));
    }
    function removeDotSegments(path) {
      if (path === '/')
        return '/';
      var leadingSlash = path[0] === '/' ? '/' : '';
      var trailingSlash = path.slice(-1) === '/' ? '/' : '';
      var segments = path.split('/');
      var out = [];
      var up = 0;
      for (var pos = 0; pos < segments.length; pos++) {
        var segment = segments[pos];
        switch (segment) {
          case '':
          case '.':
            break;
          case '..':
            if (out.length)
              out.pop();
            else
              up++;
            break;
          default:
            out.push(segment);
        }
      }
      if (!leadingSlash) {
        while (up-- > 0) {
          out.unshift('..');
        }
        if (out.length === 0)
          out.push('.');
      }
      return leadingSlash + out.join('/') + trailingSlash;
    }
    function joinAndCanonicalizePath(parts) {
      var path = parts[ComponentIndex.PATH] || '';
      path = removeDotSegments(path);
      parts[ComponentIndex.PATH] = path;
      return buildFromEncodedParts(parts[ComponentIndex.SCHEME], parts[ComponentIndex.USER_INFO], parts[ComponentIndex.DOMAIN], parts[ComponentIndex.PORT], parts[ComponentIndex.PATH], parts[ComponentIndex.QUERY_DATA], parts[ComponentIndex.FRAGMENT]);
    }
    function canonicalizeUrl(url) {
      var parts = split(url);
      return joinAndCanonicalizePath(parts);
    }
    function resolveUrl(base, url) {
      var parts = split(url);
      var baseParts = split(base);
      if (parts[ComponentIndex.SCHEME]) {
        return joinAndCanonicalizePath(parts);
      } else {
        parts[ComponentIndex.SCHEME] = baseParts[ComponentIndex.SCHEME];
      }
      for (var i = ComponentIndex.SCHEME; i <= ComponentIndex.PORT; i++) {
        if (!parts[i]) {
          parts[i] = baseParts[i];
        }
      }
      if (parts[ComponentIndex.PATH][0] == '/') {
        return joinAndCanonicalizePath(parts);
      }
      var path = baseParts[ComponentIndex.PATH];
      var index = path.lastIndexOf('/');
      path = path.slice(0, index + 1) + parts[ComponentIndex.PATH];
      parts[ComponentIndex.PATH] = path;
      return joinAndCanonicalizePath(parts);
    }
    function isAbsolute(name) {
      if (!name)
        return false;
      if (name[0] === '/')
        return true;
      var parts = split(name);
      if (parts[ComponentIndex.SCHEME])
        return true;
      return false;
    }
    $traceurRuntime.canonicalizeUrl = canonicalizeUrl;
    $traceurRuntime.isAbsolute = isAbsolute;
    $traceurRuntime.removeDotSegments = removeDotSegments;
    $traceurRuntime.resolveUrl = resolveUrl;
  })();
  (function(global) {
    'use strict';
    var $__3 = $traceurRuntime,
        canonicalizeUrl = $__3.canonicalizeUrl,
        resolveUrl = $__3.resolveUrl,
        isAbsolute = $__3.isAbsolute;
    var moduleInstantiators = Object.create(null);
    var baseURL;
    if (global.location && global.location.href)
      baseURL = resolveUrl(global.location.href, './');
    else
      baseURL = '';
    function UncoatedModuleEntry(url, uncoatedModule) {
      this.url = url;
      this.value_ = uncoatedModule;
    }
    function ModuleEvaluationError(erroneousModuleName, cause) {
      this.message = this.constructor.name + ': ' + this.stripCause(cause) + ' in ' + erroneousModuleName;
      if (!(cause instanceof ModuleEvaluationError) && cause.stack)
        this.stack = this.stripStack(cause.stack);
      else
        this.stack = '';
    }
    ModuleEvaluationError.prototype = Object.create(Error.prototype);
    ModuleEvaluationError.prototype.constructor = ModuleEvaluationError;
    ModuleEvaluationError.prototype.stripError = function(message) {
      return message.replace(/.*Error:/, this.constructor.name + ':');
    };
    ModuleEvaluationError.prototype.stripCause = function(cause) {
      if (!cause)
        return '';
      if (!cause.message)
        return cause + '';
      return this.stripError(cause.message);
    };
    ModuleEvaluationError.prototype.loadedBy = function(moduleName) {
      this.stack += '\n loaded by ' + moduleName;
    };
    ModuleEvaluationError.prototype.stripStack = function(causeStack) {
      var stack = [];
      causeStack.split('\n').some(function(frame) {
        if (/UncoatedModuleInstantiator/.test(frame))
          return true;
        stack.push(frame);
      });
      stack[0] = this.stripError(stack[0]);
      return stack.join('\n');
    };
    function beforeLines(lines, number) {
      var result = [];
      var first = number - 3;
      if (first < 0)
        first = 0;
      for (var i = first; i < number; i++) {
        result.push(lines[i]);
      }
      return result;
    }
    function afterLines(lines, number) {
      var last = number + 1;
      if (last > lines.length - 1)
        last = lines.length - 1;
      var result = [];
      for (var i = number; i <= last; i++) {
        result.push(lines[i]);
      }
      return result;
    }
    function columnSpacing(columns) {
      var result = '';
      for (var i = 0; i < columns - 1; i++) {
        result += '-';
      }
      return result;
    }
    function UncoatedModuleInstantiator(url, func) {
      UncoatedModuleEntry.call(this, url, null);
      this.func = func;
    }
    UncoatedModuleInstantiator.prototype = Object.create(UncoatedModuleEntry.prototype);
    UncoatedModuleInstantiator.prototype.getUncoatedModule = function() {
      var $__2 = this;
      if (this.value_)
        return this.value_;
      try {
        var relativeRequire;
        if ((typeof $traceurRuntime === 'undefined' ? 'undefined' : $traceurRuntime.typeof($traceurRuntime)) !== undefined && $traceurRuntime.require) {
          relativeRequire = $traceurRuntime.require.bind(null, this.url);
        }
        return this.value_ = this.func.call(global, relativeRequire);
      } catch (ex) {
        if (ex instanceof ModuleEvaluationError) {
          ex.loadedBy(this.url);
          throw ex;
        }
        if (ex.stack) {
          var lines = this.func.toString().split('\n');
          var evaled = [];
          ex.stack.split('\n').some(function(frame, index) {
            if (frame.indexOf('UncoatedModuleInstantiator.getUncoatedModule') > 0)
              return true;
            var m = /(at\s[^\s]*\s).*>:(\d*):(\d*)\)/.exec(frame);
            if (m) {
              var line = parseInt(m[2], 10);
              evaled = evaled.concat(beforeLines(lines, line));
              if (index === 1) {
                evaled.push(columnSpacing(m[3]) + '^ ' + $__2.url);
              } else {
                evaled.push(columnSpacing(m[3]) + '^');
              }
              evaled = evaled.concat(afterLines(lines, line));
              evaled.push('= = = = = = = = =');
            } else {
              evaled.push(frame);
            }
          });
          ex.stack = evaled.join('\n');
        }
        throw new ModuleEvaluationError(this.url, ex);
      }
    };
    function getUncoatedModuleInstantiator(name) {
      if (!name)
        return;
      var url = ModuleStore.normalize(name);
      return moduleInstantiators[url];
    }
    ;
    var moduleInstances = Object.create(null);
    var liveModuleSentinel = {};
    function Module(uncoatedModule) {
      var isLive = arguments[1];
      var coatedModule = Object.create(null);
      Object.getOwnPropertyNames(uncoatedModule).forEach(function(name) {
        var getter,
            value;
        if (isLive === liveModuleSentinel) {
          var descr = Object.getOwnPropertyDescriptor(uncoatedModule, name);
          if (descr.get)
            getter = descr.get;
        }
        if (!getter) {
          value = uncoatedModule[name];
          getter = function() {
            return value;
          };
        }
        Object.defineProperty(coatedModule, name, {
          get: getter,
          enumerable: true
        });
      });
      Object.preventExtensions(coatedModule);
      return coatedModule;
    }
    var ModuleStore = {
      normalize: function(name, refererName, refererAddress) {
        if (typeof name !== 'string')
          throw new TypeError('module name must be a string, not ' + (typeof name === 'undefined' ? 'undefined' : $traceurRuntime.typeof(name)));
        if (isAbsolute(name))
          return canonicalizeUrl(name);
        if (/[^\.]\/\.\.\//.test(name)) {
          throw new Error('module name embeds /../: ' + name);
        }
        if (name[0] === '.' && refererName)
          return resolveUrl(refererName, name);
        return canonicalizeUrl(name);
      },
      get: function(normalizedName) {
        var m = getUncoatedModuleInstantiator(normalizedName);
        if (!m)
          return undefined;
        var moduleInstance = moduleInstances[m.url];
        if (moduleInstance)
          return moduleInstance;
        moduleInstance = Module(m.getUncoatedModule(), liveModuleSentinel);
        return moduleInstances[m.url] = moduleInstance;
      },
      set: function(normalizedName, module) {
        normalizedName = String(normalizedName);
        moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, function() {
          return module;
        });
        moduleInstances[normalizedName] = module;
      },
      get baseURL() {
        return baseURL;
      },
      set baseURL(v) {
        baseURL = String(v);
      },
      registerModule: function(name, deps, func) {
        var normalizedName = ModuleStore.normalize(name);
        if (moduleInstantiators[normalizedName])
          throw new Error('duplicate module named ' + normalizedName);
        moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, func);
      },
      bundleStore: Object.create(null),
      register: function(name, deps, func) {
        if (!deps || !deps.length && !func.length) {
          this.registerModule(name, deps, func);
        } else {
          this.bundleStore[name] = {
            deps: deps,
            execute: function() {
              var $__2 = arguments;
              var depMap = {};
              deps.forEach(function(dep, index) {
                return depMap[dep] = $__2[index];
              });
              var registryEntry = func.call(this, depMap);
              registryEntry.execute.call(this);
              return registryEntry.exports;
            }
          };
        }
      },
      getAnonymousModule: function(func) {
        return new Module(func.call(global), liveModuleSentinel);
      },
      setCompilerVersion: function(version) {
        ModuleStore.compilerVersion = version;
      },
      getCompilerVersion: function() {
        return ModuleStore.compilerVersion;
      }
    };
    var moduleStoreModule = new Module({ModuleStore: ModuleStore});
    ModuleStore.set('@traceur/src/runtime/ModuleStore.js', moduleStoreModule);
    var setupGlobals = $traceurRuntime.setupGlobals;
    $traceurRuntime.setupGlobals = function(global) {
      setupGlobals(global);
    };
    $traceurRuntime.ModuleStore = ModuleStore;
    global.System = {
      register: ModuleStore.register.bind(ModuleStore),
      registerModule: ModuleStore.registerModule.bind(ModuleStore),
      get: ModuleStore.get,
      set: ModuleStore.set,
      normalize: ModuleStore.normalize,
      setCompilerVersion: ModuleStore.setCompilerVersion,
      getCompilerVersion: ModuleStore.getCompilerVersion
    };
  })(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this);
  System.registerModule("traceur-runtime@0.0.93/src/runtime/async.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/async.js";
    if ((typeof $traceurRuntime === 'undefined' ? 'undefined' : $traceurRuntime.typeof($traceurRuntime)) !== 'object') {
      throw new Error('traceur runtime not found.');
    }
    var $__11 = $traceurRuntime,
        createPrivateSymbol = $__11.createPrivateSymbol,
        getPrivate = $__11.getPrivate,
        setPrivate = $__11.setPrivate;
    var $__12 = Object,
        create = $__12.create,
        defineProperty = $__12.defineProperty;
    var observeName = createPrivateSymbol();
    function AsyncGeneratorFunction() {}
    function AsyncGeneratorFunctionPrototype() {}
    AsyncGeneratorFunction.prototype = AsyncGeneratorFunctionPrototype;
    AsyncGeneratorFunctionPrototype.constructor = AsyncGeneratorFunction;
    defineProperty(AsyncGeneratorFunctionPrototype, 'constructor', {enumerable: false});
    var AsyncGeneratorContext = function() {
      function AsyncGeneratorContext(observer) {
        var $__2 = this;
        this.decoratedObserver = $traceurRuntime.createDecoratedGenerator(observer, function() {
          $__2.done = true;
        });
        this.done = false;
        this.inReturn = false;
      }
      return ($traceurRuntime.createClass)(AsyncGeneratorContext, {
        throw: function(error) {
          if (!this.inReturn) {
            throw error;
          }
        },
        yield: function(value) {
          if (this.done) {
            this.inReturn = true;
            throw undefined;
          }
          var result;
          try {
            result = this.decoratedObserver.next(value);
          } catch (e) {
            this.done = true;
            throw e;
          }
          if (result === undefined) {
            return;
          }
          if (result.done) {
            this.done = true;
            this.inReturn = true;
            throw undefined;
          }
          return result.value;
        },
        yieldFor: function(observable) {
          var ctx = this;
          return $traceurRuntime.observeForEach(observable[Symbol.observer].bind(observable), function(value) {
            if (ctx.done) {
              this.return();
              return;
            }
            var result;
            try {
              result = ctx.decoratedObserver.next(value);
            } catch (e) {
              ctx.done = true;
              throw e;
            }
            if (result === undefined) {
              return;
            }
            if (result.done) {
              ctx.done = true;
            }
            return result;
          });
        }
      }, {});
    }();
    AsyncGeneratorFunctionPrototype.prototype[Symbol.observer] = function(observer) {
      var observe = getPrivate(this, observeName);
      var ctx = new AsyncGeneratorContext(observer);
      $traceurRuntime.schedule(function() {
        return observe(ctx);
      }).then(function(value) {
        if (!ctx.done) {
          ctx.decoratedObserver.return(value);
        }
      }).catch(function(error) {
        if (!ctx.done) {
          ctx.decoratedObserver.throw(error);
        }
      });
      return ctx.decoratedObserver;
    };
    defineProperty(AsyncGeneratorFunctionPrototype.prototype, Symbol.observer, {enumerable: false});
    function initAsyncGeneratorFunction(functionObject) {
      functionObject.prototype = create(AsyncGeneratorFunctionPrototype.prototype);
      functionObject.__proto__ = AsyncGeneratorFunctionPrototype;
      return functionObject;
    }
    function createAsyncGeneratorInstance(observe, functionObject) {
      for (var args = [],
          $__10 = 2; $__10 < arguments.length; $__10++)
        args[$__10 - 2] = arguments[$__10];
      var object = create(functionObject.prototype);
      setPrivate(object, observeName, observe);
      return object;
    }
    function observeForEach(observe, next) {
      return new Promise(function(resolve, reject) {
        var generator = observe({
          next: function(value) {
            return next.call(generator, value);
          },
          throw: function(error) {
            reject(error);
          },
          return: function(value) {
            resolve(value);
          }
        });
      });
    }
    function schedule(asyncF) {
      return Promise.resolve().then(asyncF);
    }
    var generator = Symbol();
    var onDone = Symbol();
    var DecoratedGenerator = function() {
      function DecoratedGenerator(_generator, _onDone) {
        this[generator] = _generator;
        this[onDone] = _onDone;
      }
      return ($traceurRuntime.createClass)(DecoratedGenerator, {
        next: function(value) {
          var result = this[generator].next(value);
          if (result !== undefined && result.done) {
            this[onDone].call(this);
          }
          return result;
        },
        throw: function(error) {
          this[onDone].call(this);
          return this[generator].throw(error);
        },
        return: function(value) {
          this[onDone].call(this);
          return this[generator].return(value);
        }
      }, {});
    }();
    function createDecoratedGenerator(generator, onDone) {
      return new DecoratedGenerator(generator, onDone);
    }
    Array.prototype[Symbol.observer] = function(observer) {
      var done = false;
      var decoratedObserver = createDecoratedGenerator(observer, function() {
        return done = true;
      });
      var $__6 = true;
      var $__7 = false;
      var $__8 = undefined;
      try {
        for (var $__4 = void 0,
            $__3 = (this)[Symbol.iterator](); !($__6 = ($__4 = $__3.next()).done); $__6 = true) {
          var value = $__4.value;
          {
            decoratedObserver.next(value);
            if (done) {
              return;
            }
          }
        }
      } catch ($__9) {
        $__7 = true;
        $__8 = $__9;
      } finally {
        try {
          if (!$__6 && $__3.return != null) {
            $__3.return();
          }
        } finally {
          if ($__7) {
            throw $__8;
          }
        }
      }
      decoratedObserver.return();
      return decoratedObserver;
    };
    defineProperty(Array.prototype, Symbol.observer, {enumerable: false});
    $traceurRuntime.initAsyncGeneratorFunction = initAsyncGeneratorFunction;
    $traceurRuntime.createAsyncGeneratorInstance = createAsyncGeneratorInstance;
    $traceurRuntime.observeForEach = observeForEach;
    $traceurRuntime.schedule = schedule;
    $traceurRuntime.createDecoratedGenerator = createDecoratedGenerator;
    return {};
  });
  System.registerModule("traceur-runtime@0.0.93/src/runtime/classes.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/classes.js";
    var $Object = Object;
    var $TypeError = TypeError;
    var $__1 = Object,
        create = $__1.create,
        defineProperties = $__1.defineProperties,
        defineProperty = $__1.defineProperty,
        getOwnPropertyDescriptor = $__1.getOwnPropertyDescriptor,
        getOwnPropertyNames = $__1.getOwnPropertyNames,
        getOwnPropertySymbols = $__1.getOwnPropertySymbols,
        getPrototypeOf = $__1.getPrototypeOf;
    function superDescriptor(homeObject, name) {
      var proto = getPrototypeOf(homeObject);
      do {
        var result = getOwnPropertyDescriptor(proto, name);
        if (result)
          return result;
        proto = getPrototypeOf(proto);
      } while (proto);
      return undefined;
    }
    function superConstructor(ctor) {
      return ctor.__proto__;
    }
    function superGet(self, homeObject, name) {
      var descriptor = superDescriptor(homeObject, name);
      if (descriptor) {
        var value = descriptor.value;
        if (value)
          return value;
        if (!descriptor.get)
          return value;
        return descriptor.get.call(self);
      }
      return undefined;
    }
    function superSet(self, homeObject, name, value) {
      var descriptor = superDescriptor(homeObject, name);
      if (descriptor && descriptor.set) {
        descriptor.set.call(self, value);
        return value;
      }
      throw $TypeError(("super has no setter '" + name + "'."));
    }
    function forEachPropertyKey(object, f) {
      getOwnPropertyNames(object).forEach(f);
      getOwnPropertySymbols(object).forEach(f);
    }
    function getDescriptors(object) {
      var descriptors = {};
      forEachPropertyKey(object, function(key) {
        descriptors[key] = getOwnPropertyDescriptor(object, key);
        descriptors[key].enumerable = false;
      });
      return descriptors;
    }
    var nonEnum = {enumerable: false};
    function makePropertiesNonEnumerable(object) {
      forEachPropertyKey(object, function(key) {
        defineProperty(object, key, nonEnum);
      });
    }
    function createClass(ctor, object, staticObject, superClass) {
      defineProperty(object, 'constructor', {
        value: ctor,
        configurable: true,
        enumerable: false,
        writable: true
      });
      if (arguments.length > 3) {
        if (typeof superClass === 'function')
          ctor.__proto__ = superClass;
        ctor.prototype = create(getProtoParent(superClass), getDescriptors(object));
      } else {
        makePropertiesNonEnumerable(object);
        ctor.prototype = object;
      }
      defineProperty(ctor, 'prototype', {
        configurable: false,
        writable: false
      });
      return defineProperties(ctor, getDescriptors(staticObject));
    }
    function getProtoParent(superClass) {
      if (typeof superClass === 'function') {
        var prototype = superClass.prototype;
        if ($Object(prototype) === prototype || prototype === null)
          return superClass.prototype;
        throw new $TypeError('super prototype must be an Object or null');
      }
      if (superClass === null)
        return null;
      throw new $TypeError(("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : $traceurRuntime.typeof(superClass)) + "."));
    }
    $traceurRuntime.createClass = createClass;
    $traceurRuntime.superConstructor = superConstructor;
    $traceurRuntime.superGet = superGet;
    $traceurRuntime.superSet = superSet;
    return {};
  });
  System.registerModule("traceur-runtime@0.0.93/src/runtime/destructuring.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/destructuring.js";
    function iteratorToArray(iter) {
      var rv = [];
      var i = 0;
      var tmp;
      while (!(tmp = iter.next()).done) {
        rv[i++] = tmp.value;
      }
      return rv;
    }
    $traceurRuntime.iteratorToArray = iteratorToArray;
    return {};
  });
  System.registerModule("traceur-runtime@0.0.93/src/runtime/generators.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/generators.js";
    if ((typeof $traceurRuntime === 'undefined' ? 'undefined' : $traceurRuntime.typeof($traceurRuntime)) !== 'object') {
      throw new Error('traceur runtime not found.');
    }
    var $TypeError = TypeError;
    var $__1 = $traceurRuntime,
        createPrivateSymbol = $__1.createPrivateSymbol,
        getPrivate = $__1.getPrivate,
        setPrivate = $__1.setPrivate;
    var $__2 = Object,
        create = $__2.create,
        defineProperties = $__2.defineProperties,
        defineProperty = $__2.defineProperty;
    function nonEnum(value) {
      return {
        configurable: true,
        enumerable: false,
        value: value,
        writable: true
      };
    }
    var ST_NEWBORN = 0;
    var ST_EXECUTING = 1;
    var ST_SUSPENDED = 2;
    var ST_CLOSED = 3;
    var END_STATE = -2;
    var RETHROW_STATE = -3;
    function getInternalError(state) {
      return new Error('Traceur compiler bug: invalid state in state machine: ' + state);
    }
    var RETURN_SENTINEL = {};
    function GeneratorContext() {
      this.state = 0;
      this.GState = ST_NEWBORN;
      this.storedException = undefined;
      this.finallyFallThrough = undefined;
      this.sent_ = undefined;
      this.returnValue = undefined;
      this.oldReturnValue = undefined;
      this.tryStack_ = [];
    }
    GeneratorContext.prototype = {
      pushTry: function(catchState, finallyState) {
        if (finallyState !== null) {
          var finallyFallThrough = null;
          for (var i = this.tryStack_.length - 1; i >= 0; i--) {
            if (this.tryStack_[i].catch !== undefined) {
              finallyFallThrough = this.tryStack_[i].catch;
              break;
            }
          }
          if (finallyFallThrough === null)
            finallyFallThrough = RETHROW_STATE;
          this.tryStack_.push({
            finally: finallyState,
            finallyFallThrough: finallyFallThrough
          });
        }
        if (catchState !== null) {
          this.tryStack_.push({catch: catchState});
        }
      },
      popTry: function() {
        this.tryStack_.pop();
      },
      maybeUncatchable: function() {
        if (this.storedException === RETURN_SENTINEL) {
          throw RETURN_SENTINEL;
        }
      },
      get sent() {
        this.maybeThrow();
        return this.sent_;
      },
      set sent(v) {
        this.sent_ = v;
      },
      get sentIgnoreThrow() {
        return this.sent_;
      },
      maybeThrow: function() {
        if (this.action === 'throw') {
          this.action = 'next';
          throw this.sent_;
        }
      },
      end: function() {
        switch (this.state) {
          case END_STATE:
            return this;
          case RETHROW_STATE:
            throw this.storedException;
          default:
            throw getInternalError(this.state);
        }
      },
      handleException: function(ex) {
        this.GState = ST_CLOSED;
        this.state = END_STATE;
        throw ex;
      },
      wrapYieldStar: function(iterator) {
        var ctx = this;
        return {
          next: function(v) {
            return iterator.next(v);
          },
          throw: function(e) {
            var result;
            if (e === RETURN_SENTINEL) {
              if (iterator.return) {
                result = iterator.return(ctx.returnValue);
                if (!result.done) {
                  ctx.returnValue = ctx.oldReturnValue;
                  return result;
                }
                ctx.returnValue = result.value;
              }
              throw e;
            }
            if (iterator.throw) {
              return iterator.throw(e);
            }
            iterator.return && iterator.return();
            throw $TypeError('Inner iterator does not have a throw method');
          }
        };
      }
    };
    function nextOrThrow(ctx, moveNext, action, x) {
      switch (ctx.GState) {
        case ST_EXECUTING:
          throw new Error(("\"" + action + "\" on executing generator"));
        case ST_CLOSED:
          if (action == 'next') {
            return {
              value: undefined,
              done: true
            };
          }
          if (x === RETURN_SENTINEL) {
            return {
              value: ctx.returnValue,
              done: true
            };
          }
          throw x;
        case ST_NEWBORN:
          if (action === 'throw') {
            ctx.GState = ST_CLOSED;
            if (x === RETURN_SENTINEL) {
              return {
                value: ctx.returnValue,
                done: true
              };
            }
            throw x;
          }
          if (x !== undefined)
            throw $TypeError('Sent value to newborn generator');
        case ST_SUSPENDED:
          ctx.GState = ST_EXECUTING;
          ctx.action = action;
          ctx.sent = x;
          var value;
          try {
            value = moveNext(ctx);
          } catch (ex) {
            if (ex === RETURN_SENTINEL) {
              value = ctx;
            } else {
              throw ex;
            }
          }
          var done = value === ctx;
          if (done)
            value = ctx.returnValue;
          ctx.GState = done ? ST_CLOSED : ST_SUSPENDED;
          return {
            value: value,
            done: done
          };
      }
    }
    var ctxName = createPrivateSymbol();
    var moveNextName = createPrivateSymbol();
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    GeneratorFunction.prototype = GeneratorFunctionPrototype;
    defineProperty(GeneratorFunctionPrototype, 'constructor', nonEnum(GeneratorFunction));
    GeneratorFunctionPrototype.prototype = {
      constructor: GeneratorFunctionPrototype,
      next: function(v) {
        return nextOrThrow(getPrivate(this, ctxName), getPrivate(this, moveNextName), 'next', v);
      },
      throw: function(v) {
        return nextOrThrow(getPrivate(this, ctxName), getPrivate(this, moveNextName), 'throw', v);
      },
      return: function(v) {
        var ctx = getPrivate(this, ctxName);
        ctx.oldReturnValue = ctx.returnValue;
        ctx.returnValue = v;
        return nextOrThrow(ctx, getPrivate(this, moveNextName), 'throw', RETURN_SENTINEL);
      }
    };
    defineProperties(GeneratorFunctionPrototype.prototype, {
      constructor: {enumerable: false},
      next: {enumerable: false},
      throw: {enumerable: false},
      return: {enumerable: false}
    });
    Object.defineProperty(GeneratorFunctionPrototype.prototype, Symbol.iterator, nonEnum(function() {
      return this;
    }));
    function createGeneratorInstance(innerFunction, functionObject, self) {
      var moveNext = getMoveNext(innerFunction, self);
      var ctx = new GeneratorContext();
      var object = create(functionObject.prototype);
      setPrivate(object, ctxName, ctx);
      setPrivate(object, moveNextName, moveNext);
      return object;
    }
    function initGeneratorFunction(functionObject) {
      functionObject.prototype = create(GeneratorFunctionPrototype.prototype);
      functionObject.__proto__ = GeneratorFunctionPrototype;
      return functionObject;
    }
    function AsyncFunctionContext() {
      GeneratorContext.call(this);
      this.err = undefined;
      var ctx = this;
      ctx.result = new Promise(function(resolve, reject) {
        ctx.resolve = resolve;
        ctx.reject = reject;
      });
    }
    AsyncFunctionContext.prototype = create(GeneratorContext.prototype);
    AsyncFunctionContext.prototype.end = function() {
      switch (this.state) {
        case END_STATE:
          this.resolve(this.returnValue);
          break;
        case RETHROW_STATE:
          this.reject(this.storedException);
          break;
        default:
          this.reject(getInternalError(this.state));
      }
    };
    AsyncFunctionContext.prototype.handleException = function() {
      this.state = RETHROW_STATE;
    };
    function asyncWrap(innerFunction, self) {
      var moveNext = getMoveNext(innerFunction, self);
      var ctx = new AsyncFunctionContext();
      ctx.createCallback = function(newState) {
        return function(value) {
          ctx.state = newState;
          ctx.value = value;
          moveNext(ctx);
        };
      };
      ctx.errback = function(err) {
        handleCatch(ctx, err);
        moveNext(ctx);
      };
      moveNext(ctx);
      return ctx.result;
    }
    function getMoveNext(innerFunction, self) {
      return function(ctx) {
        while (true) {
          try {
            return innerFunction.call(self, ctx);
          } catch (ex) {
            handleCatch(ctx, ex);
          }
        }
      };
    }
    function handleCatch(ctx, ex) {
      ctx.storedException = ex;
      var last = ctx.tryStack_[ctx.tryStack_.length - 1];
      if (!last) {
        ctx.handleException(ex);
        return;
      }
      ctx.state = last.catch !== undefined ? last.catch : last.finally;
      if (last.finallyFallThrough !== undefined)
        ctx.finallyFallThrough = last.finallyFallThrough;
    }
    $traceurRuntime.asyncWrap = asyncWrap;
    $traceurRuntime.initGeneratorFunction = initGeneratorFunction;
    $traceurRuntime.createGeneratorInstance = createGeneratorInstance;
    return {};
  });
  System.registerModule("traceur-runtime@0.0.93/src/runtime/proper-tail-calls.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/proper-tail-calls.js";
    if ((typeof $traceurRuntime === 'undefined' ? 'undefined' : $traceurRuntime.typeof($traceurRuntime)) !== 'object') {
      throw new Error('traceur runtime not found.');
    }
    var $apply = Function.prototype.call.bind(Function.prototype.apply);
    var $__1 = $traceurRuntime,
        getPrivate = $__1.getPrivate,
        setPrivate = $__1.setPrivate,
        createPrivateSymbol = $__1.createPrivateSymbol;
    var CONTINUATION_TYPE = Object.create(null);
    var isTailRecursiveName = null;
    function createContinuation(operand, thisArg, argsArray) {
      return [CONTINUATION_TYPE, operand, thisArg, argsArray];
    }
    function isContinuation(object) {
      return object && object[0] === CONTINUATION_TYPE;
    }
    function $bind(operand, thisArg, args) {
      var argArray = [thisArg];
      for (var i = 0; i < args.length; i++) {
        argArray[i + 1] = args[i];
      }
      var func = $apply(Function.prototype.bind, operand, argArray);
      return func;
    }
    function $construct(func, argArray) {
      var object = new ($bind(func, null, argArray));
      return object;
    }
    function isTailRecursive(func) {
      return !!getPrivate(func, isTailRecursiveName);
    }
    function tailCall(func, thisArg, argArray) {
      var continuation = argArray[0];
      if (isContinuation(continuation)) {
        continuation = $apply(func, thisArg, continuation[3]);
        return continuation;
      }
      continuation = createContinuation(func, thisArg, argArray);
      while (true) {
        if (isTailRecursive(func)) {
          continuation = $apply(func, continuation[2], [continuation]);
        } else {
          continuation = $apply(func, continuation[2], continuation[3]);
        }
        if (!isContinuation(continuation)) {
          return continuation;
        }
        func = continuation[1];
      }
    }
    function construct() {
      var object;
      if (isTailRecursive(this)) {
        object = $construct(this, [createContinuation(null, null, arguments)]);
      } else {
        object = $construct(this, arguments);
      }
      return object;
    }
    function setupProperTailCalls() {
      isTailRecursiveName = createPrivateSymbol();
      Function.prototype.call = initTailRecursiveFunction(function call(thisArg) {
        var result = tailCall(function(thisArg) {
          var argArray = [];
          for (var i = 1; i < arguments.length; ++i) {
            argArray[i - 1] = arguments[i];
          }
          var continuation = createContinuation(this, thisArg, argArray);
          return continuation;
        }, this, arguments);
        return result;
      });
      Function.prototype.apply = initTailRecursiveFunction(function apply(thisArg, argArray) {
        var result = tailCall(function(thisArg, argArray) {
          var continuation = createContinuation(this, thisArg, argArray);
          return continuation;
        }, this, arguments);
        return result;
      });
    }
    function initTailRecursiveFunction(func) {
      if (isTailRecursiveName === null) {
        setupProperTailCalls();
      }
      setPrivate(func, isTailRecursiveName, true);
      return func;
    }
    $traceurRuntime.initTailRecursiveFunction = initTailRecursiveFunction;
    $traceurRuntime.call = tailCall;
    $traceurRuntime.continuation = createContinuation;
    $traceurRuntime.construct = construct;
    return {};
  });
  System.registerModule("traceur-runtime@0.0.93/src/runtime/relativeRequire.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/relativeRequire.js";
    var path;
    function relativeRequire(callerPath, requiredPath) {
      path = path || typeof require !== 'undefined' && require('path');
      function isDirectory(path) {
        return path.slice(-1) === '/';
      }
      function isAbsolute(path) {
        return path[0] === '/';
      }
      function isRelative(path) {
        return path[0] === '.';
      }
      if (isDirectory(requiredPath) || isAbsolute(requiredPath))
        return;
      return isRelative(requiredPath) ? require(path.resolve(path.dirname(callerPath), requiredPath)) : require(requiredPath);
    }
    $traceurRuntime.require = relativeRequire;
    return {};
  });
  System.registerModule("traceur-runtime@0.0.93/src/runtime/spread.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/spread.js";
    function spread() {
      var rv = [],
          j = 0,
          iterResult;
      for (var i = 0; i < arguments.length; i++) {
        var valueToSpread = $traceurRuntime.checkObjectCoercible(arguments[i]);
        if (typeof valueToSpread[Symbol.iterator] !== 'function') {
          throw new TypeError('Cannot spread non-iterable object.');
        }
        var iter = valueToSpread[Symbol.iterator]();
        while (!(iterResult = iter.next()).done) {
          rv[j++] = iterResult.value;
        }
      }
      return rv;
    }
    $traceurRuntime.spread = spread;
    return {};
  });
  System.registerModule("traceur-runtime@0.0.93/src/runtime/template.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/template.js";
    var $__1 = Object,
        defineProperty = $__1.defineProperty,
        freeze = $__1.freeze;
    var slice = Array.prototype.slice;
    var map = Object.create(null);
    function getTemplateObject(raw) {
      var cooked = arguments[1];
      var key = raw.join('${}');
      var templateObject = map[key];
      if (templateObject)
        return templateObject;
      if (!cooked) {
        cooked = slice.call(raw);
      }
      return map[key] = freeze(defineProperty(cooked, 'raw', {value: freeze(raw)}));
    }
    $traceurRuntime.getTemplateObject = getTemplateObject;
    return {};
  });
  System.registerModule("traceur-runtime@0.0.93/src/runtime/runtime-modules.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/runtime-modules.js";
    System.get("traceur-runtime@0.0.93/src/runtime/proper-tail-calls.js");
    System.get("traceur-runtime@0.0.93/src/runtime/relativeRequire.js");
    System.get("traceur-runtime@0.0.93/src/runtime/spread.js");
    System.get("traceur-runtime@0.0.93/src/runtime/destructuring.js");
    System.get("traceur-runtime@0.0.93/src/runtime/classes.js");
    System.get("traceur-runtime@0.0.93/src/runtime/async.js");
    System.get("traceur-runtime@0.0.93/src/runtime/generators.js");
    System.get("traceur-runtime@0.0.93/src/runtime/template.js");
    return {};
  });
  System.get("traceur-runtime@0.0.93/src/runtime/runtime-modules.js" + '');
  System.registerModule("traceur-runtime@0.0.93/src/runtime/frozen-data.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/frozen-data.js";
    function findIndex(arr, key) {
      for (var i = 0; i < arr.length; i += 2) {
        if (arr[i] === key) {
          return i;
        }
      }
      return -1;
    }
    function setFrozen(arr, key, val) {
      var i = findIndex(arr, key);
      if (i === -1) {
        arr.push(key, val);
      }
    }
    function getFrozen(arr, key) {
      var i = findIndex(arr, key);
      if (i !== -1) {
        return arr[i + 1];
      }
      return undefined;
    }
    function hasFrozen(arr, key) {
      return findIndex(arr, key) !== -1;
    }
    function deleteFrozen(arr, key) {
      var i = findIndex(arr, key);
      if (i !== -1) {
        arr.splice(i, 2);
        return true;
      }
      return false;
    }
    return {
      get setFrozen() {
        return setFrozen;
      },
      get getFrozen() {
        return getFrozen;
      },
      get hasFrozen() {
        return hasFrozen;
      },
      get deleteFrozen() {
        return deleteFrozen;
      }
    };
  });
  System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/utils.js";
    var $ceil = Math.ceil;
    var $floor = Math.floor;
    var $isFinite = isFinite;
    var $isNaN = isNaN;
    var $pow = Math.pow;
    var $min = Math.min;
    var toObject = $traceurRuntime.toObject;
    function toUint32(x) {
      return x >>> 0;
    }
    function isObject(x) {
      return x && ((typeof x === 'undefined' ? 'undefined' : $traceurRuntime.typeof(x)) === 'object' || typeof x === 'function');
    }
    function isCallable(x) {
      return typeof x === 'function';
    }
    function isNumber(x) {
      return typeof x === 'number';
    }
    function toInteger(x) {
      x = +x;
      if ($isNaN(x))
        return 0;
      if (x === 0 || !$isFinite(x))
        return x;
      return x > 0 ? $floor(x) : $ceil(x);
    }
    var MAX_SAFE_LENGTH = $pow(2, 53) - 1;
    function toLength(x) {
      var len = toInteger(x);
      return len < 0 ? 0 : $min(len, MAX_SAFE_LENGTH);
    }
    function checkIterable(x) {
      return !isObject(x) ? undefined : x[Symbol.iterator];
    }
    function isConstructor(x) {
      return isCallable(x);
    }
    function createIteratorResultObject(value, done) {
      return {
        value: value,
        done: done
      };
    }
    function maybeDefine(object, name, descr) {
      if (!(name in object)) {
        Object.defineProperty(object, name, descr);
      }
    }
    function maybeDefineMethod(object, name, value) {
      maybeDefine(object, name, {
        value: value,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
    function maybeDefineConst(object, name, value) {
      maybeDefine(object, name, {
        value: value,
        configurable: false,
        enumerable: false,
        writable: false
      });
    }
    function maybeAddFunctions(object, functions) {
      for (var i = 0; i < functions.length; i += 2) {
        var name = functions[i];
        var value = functions[i + 1];
        maybeDefineMethod(object, name, value);
      }
    }
    function maybeAddConsts(object, consts) {
      for (var i = 0; i < consts.length; i += 2) {
        var name = consts[i];
        var value = consts[i + 1];
        maybeDefineConst(object, name, value);
      }
    }
    function maybeAddIterator(object, func, Symbol) {
      if (!Symbol || !Symbol.iterator || object[Symbol.iterator])
        return;
      if (object['@@iterator'])
        func = object['@@iterator'];
      Object.defineProperty(object, Symbol.iterator, {
        value: func,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
    var polyfills = [];
    function registerPolyfill(func) {
      polyfills.push(func);
    }
    function polyfillAll(global) {
      polyfills.forEach(function(f) {
        return f(global);
      });
    }
    return {
      get toObject() {
        return toObject;
      },
      get toUint32() {
        return toUint32;
      },
      get isObject() {
        return isObject;
      },
      get isCallable() {
        return isCallable;
      },
      get isNumber() {
        return isNumber;
      },
      get toInteger() {
        return toInteger;
      },
      get toLength() {
        return toLength;
      },
      get checkIterable() {
        return checkIterable;
      },
      get isConstructor() {
        return isConstructor;
      },
      get createIteratorResultObject() {
        return createIteratorResultObject;
      },
      get maybeDefine() {
        return maybeDefine;
      },
      get maybeDefineMethod() {
        return maybeDefineMethod;
      },
      get maybeDefineConst() {
        return maybeDefineConst;
      },
      get maybeAddFunctions() {
        return maybeAddFunctions;
      },
      get maybeAddConsts() {
        return maybeAddConsts;
      },
      get maybeAddIterator() {
        return maybeAddIterator;
      },
      get registerPolyfill() {
        return registerPolyfill;
      },
      get polyfillAll() {
        return polyfillAll;
      }
    };
  });
  System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/Map.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/Map.js";
    var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
        isObject = $__0.isObject,
        registerPolyfill = $__0.registerPolyfill;
    var $__1 = System.get("traceur-runtime@0.0.93/src/runtime/frozen-data.js"),
        deleteFrozen = $__1.deleteFrozen,
        getFrozen = $__1.getFrozen,
        setFrozen = $__1.setFrozen;
    var $__11 = $traceurRuntime,
        createPrivateSymbol = $__11.createPrivateSymbol,
        getPrivate = $__11.getPrivate,
        hasNativeSymbol = $__11.hasNativeSymbol,
        setPrivate = $__11.setPrivate;
    var $__12 = Object,
        defineProperty = $__12.defineProperty,
        getOwnPropertyDescriptor = $__12.getOwnPropertyDescriptor,
        hasOwnProperty = $__12.hasOwnProperty,
        isExtensible = $__12.isExtensible;
    var deletedSentinel = {};
    var counter = 1;
    var hashCodeName = createPrivateSymbol();
    function getHashCodeForObject(obj) {
      return getPrivate(obj, hashCodeName);
    }
    function getOrSetHashCodeForObject(obj) {
      var hash = getHashCodeForObject(obj);
      if (!hash) {
        hash = counter++;
        setPrivate(obj, hashCodeName, hash);
      }
      return hash;
    }
    function lookupIndex(map, key) {
      if (typeof key === 'string') {
        return map.stringIndex_[key];
      }
      if (isObject(key)) {
        if (!isExtensible(key)) {
          return getFrozen(map.frozenData_, key);
        }
        var hc = getHashCodeForObject(key);
        if (hc === undefined) {
          return undefined;
        }
        return map.objectIndex_[hc];
      }
      return map.primitiveIndex_[key];
    }
    function initMap(map) {
      map.entries_ = [];
      map.objectIndex_ = Object.create(null);
      map.stringIndex_ = Object.create(null);
      map.primitiveIndex_ = Object.create(null);
      map.frozenData_ = [];
      map.deletedCount_ = 0;
    }
    var Map = function() {
      function Map() {
        var $__14,
            $__15;
        var iterable = arguments[0];
        if (!isObject(this))
          throw new TypeError('Map called on incompatible type');
        if (hasOwnProperty.call(this, 'entries_')) {
          throw new TypeError('Map can not be reentrantly initialised');
        }
        initMap(this);
        if (iterable !== null && iterable !== undefined) {
          var $__7 = true;
          var $__8 = false;
          var $__9 = undefined;
          try {
            for (var $__5 = void 0,
                $__4 = (iterable)[Symbol.iterator](); !($__7 = ($__5 = $__4.next()).done); $__7 = true) {
              var $__13 = $__5.value,
                  key = ($__14 = $__13[Symbol.iterator](), ($__15 = $__14.next()).done ? void 0 : $__15.value),
                  value = ($__15 = $__14.next()).done ? void 0 : $__15.value;
              {
                this.set(key, value);
              }
            }
          } catch ($__10) {
            $__8 = true;
            $__9 = $__10;
          } finally {
            try {
              if (!$__7 && $__4.return != null) {
                $__4.return();
              }
            } finally {
              if ($__8) {
                throw $__9;
              }
            }
          }
        }
      }
      return ($traceurRuntime.createClass)(Map, {
        get size() {
          return this.entries_.length / 2 - this.deletedCount_;
        },
        get: function(key) {
          var index = lookupIndex(this, key);
          if (index !== undefined) {
            return this.entries_[index + 1];
          }
        },
        set: function(key, value) {
          var index = lookupIndex(this, key);
          if (index !== undefined) {
            this.entries_[index + 1] = value;
          } else {
            index = this.entries_.length;
            this.entries_[index] = key;
            this.entries_[index + 1] = value;
            if (isObject(key)) {
              if (!isExtensible(key)) {
                setFrozen(this.frozenData_, key, index);
              } else {
                var hash = getOrSetHashCodeForObject(key);
                this.objectIndex_[hash] = index;
              }
            } else if (typeof key === 'string') {
              this.stringIndex_[key] = index;
            } else {
              this.primitiveIndex_[key] = index;
            }
          }
          return this;
        },
        has: function(key) {
          return lookupIndex(this, key) !== undefined;
        },
        delete: function(key) {
          var index = lookupIndex(this, key);
          if (index === undefined) {
            return false;
          }
          this.entries_[index] = deletedSentinel;
          this.entries_[index + 1] = undefined;
          this.deletedCount_++;
          if (isObject(key)) {
            if (!isExtensible(key)) {
              deleteFrozen(this.frozenData_, key);
            } else {
              var hash = getHashCodeForObject(key);
              delete this.objectIndex_[hash];
            }
          } else if (typeof key === 'string') {
            delete this.stringIndex_[key];
          } else {
            delete this.primitiveIndex_[key];
          }
          return true;
        },
        clear: function() {
          initMap(this);
        },
        forEach: function(callbackFn) {
          var thisArg = arguments[1];
          for (var i = 0; i < this.entries_.length; i += 2) {
            var key = this.entries_[i];
            var value = this.entries_[i + 1];
            if (key === deletedSentinel)
              continue;
            callbackFn.call(thisArg, value, key, this);
          }
        },
        entries: $traceurRuntime.initGeneratorFunction(function $__16() {
          var i,
              key,
              value;
          return $traceurRuntime.createGeneratorInstance(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  i = 0;
                  $ctx.state = 12;
                  break;
                case 12:
                  $ctx.state = (i < this.entries_.length) ? 8 : -2;
                  break;
                case 4:
                  i += 2;
                  $ctx.state = 12;
                  break;
                case 8:
                  key = this.entries_[i];
                  value = this.entries_[i + 1];
                  $ctx.state = 9;
                  break;
                case 9:
                  $ctx.state = (key === deletedSentinel) ? 4 : 6;
                  break;
                case 6:
                  $ctx.state = 2;
                  return [key, value];
                case 2:
                  $ctx.maybeThrow();
                  $ctx.state = 4;
                  break;
                default:
                  return $ctx.end();
              }
          }, $__16, this);
        }),
        keys: $traceurRuntime.initGeneratorFunction(function $__17() {
          var i,
              key,
              value;
          return $traceurRuntime.createGeneratorInstance(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  i = 0;
                  $ctx.state = 12;
                  break;
                case 12:
                  $ctx.state = (i < this.entries_.length) ? 8 : -2;
                  break;
                case 4:
                  i += 2;
                  $ctx.state = 12;
                  break;
                case 8:
                  key = this.entries_[i];
                  value = this.entries_[i + 1];
                  $ctx.state = 9;
                  break;
                case 9:
                  $ctx.state = (key === deletedSentinel) ? 4 : 6;
                  break;
                case 6:
                  $ctx.state = 2;
                  return key;
                case 2:
                  $ctx.maybeThrow();
                  $ctx.state = 4;
                  break;
                default:
                  return $ctx.end();
              }
          }, $__17, this);
        }),
        values: $traceurRuntime.initGeneratorFunction(function $__18() {
          var i,
              key,
              value;
          return $traceurRuntime.createGeneratorInstance(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  i = 0;
                  $ctx.state = 12;
                  break;
                case 12:
                  $ctx.state = (i < this.entries_.length) ? 8 : -2;
                  break;
                case 4:
                  i += 2;
                  $ctx.state = 12;
                  break;
                case 8:
                  key = this.entries_[i];
                  value = this.entries_[i + 1];
                  $ctx.state = 9;
                  break;
                case 9:
                  $ctx.state = (key === deletedSentinel) ? 4 : 6;
                  break;
                case 6:
                  $ctx.state = 2;
                  return value;
                case 2:
                  $ctx.maybeThrow();
                  $ctx.state = 4;
                  break;
                default:
                  return $ctx.end();
              }
          }, $__18, this);
        })
      }, {});
    }();
    defineProperty(Map.prototype, Symbol.iterator, {
      configurable: true,
      writable: true,
      value: Map.prototype.entries
    });
    function needsPolyfill(global) {
      var $__13 = global,
          Map = $__13.Map,
          Symbol = $__13.Symbol;
      if (!Map || !$traceurRuntime.hasNativeSymbol() || !Map.prototype[Symbol.iterator] || !Map.prototype.entries) {
        return true;
      }
      try {
        return new Map([[]]).size !== 1;
      } catch (e) {
        return false;
      }
    }
    function polyfillMap(global) {
      if (needsPolyfill(global)) {
        global.Map = Map;
      }
    }
    registerPolyfill(polyfillMap);
    return {
      get Map() {
        return Map;
      },
      get polyfillMap() {
        return polyfillMap;
      }
    };
  });
  System.get("traceur-runtime@0.0.93/src/runtime/polyfills/Map.js" + '');
  System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/Set.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/Set.js";
    var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
        isObject = $__0.isObject,
        registerPolyfill = $__0.registerPolyfill;
    var Map = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/Map.js").Map;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var Set = function() {
      function Set() {
        var iterable = arguments[0];
        if (!isObject(this))
          throw new TypeError('Set called on incompatible type');
        if (hasOwnProperty.call(this, 'map_')) {
          throw new TypeError('Set can not be reentrantly initialised');
        }
        this.map_ = new Map();
        if (iterable !== null && iterable !== undefined) {
          var $__8 = true;
          var $__9 = false;
          var $__10 = undefined;
          try {
            for (var $__6 = void 0,
                $__5 = (iterable)[Symbol.iterator](); !($__8 = ($__6 = $__5.next()).done); $__8 = true) {
              var item = $__6.value;
              {
                this.add(item);
              }
            }
          } catch ($__11) {
            $__9 = true;
            $__10 = $__11;
          } finally {
            try {
              if (!$__8 && $__5.return != null) {
                $__5.return();
              }
            } finally {
              if ($__9) {
                throw $__10;
              }
            }
          }
        }
      }
      return ($traceurRuntime.createClass)(Set, {
        get size() {
          return this.map_.size;
        },
        has: function(key) {
          return this.map_.has(key);
        },
        add: function(key) {
          this.map_.set(key, key);
          return this;
        },
        delete: function(key) {
          return this.map_.delete(key);
        },
        clear: function() {
          return this.map_.clear();
        },
        forEach: function(callbackFn) {
          var thisArg = arguments[1];
          var $__4 = this;
          return this.map_.forEach(function(value, key) {
            callbackFn.call(thisArg, key, key, $__4);
          });
        },
        values: $traceurRuntime.initGeneratorFunction(function $__14() {
          var $__15,
              $__16;
          return $traceurRuntime.createGeneratorInstance(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  $__15 = $ctx.wrapYieldStar(this.map_.keys()[Symbol.iterator]());
                  $ctx.sent = void 0;
                  $ctx.action = 'next';
                  $ctx.state = 12;
                  break;
                case 12:
                  $__16 = $__15[$ctx.action]($ctx.sentIgnoreThrow);
                  $ctx.state = 9;
                  break;
                case 9:
                  $ctx.state = ($__16.done) ? 3 : 2;
                  break;
                case 3:
                  $ctx.sent = $__16.value;
                  $ctx.state = -2;
                  break;
                case 2:
                  $ctx.state = 12;
                  return $__16.value;
                default:
                  return $ctx.end();
              }
          }, $__14, this);
        }),
        entries: $traceurRuntime.initGeneratorFunction(function $__17() {
          var $__18,
              $__19;
          return $traceurRuntime.createGeneratorInstance(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  $__18 = $ctx.wrapYieldStar(this.map_.entries()[Symbol.iterator]());
                  $ctx.sent = void 0;
                  $ctx.action = 'next';
                  $ctx.state = 12;
                  break;
                case 12:
                  $__19 = $__18[$ctx.action]($ctx.sentIgnoreThrow);
                  $ctx.state = 9;
                  break;
                case 9:
                  $ctx.state = ($__19.done) ? 3 : 2;
                  break;
                case 3:
                  $ctx.sent = $__19.value;
                  $ctx.state = -2;
                  break;
                case 2:
                  $ctx.state = 12;
                  return $__19.value;
                default:
                  return $ctx.end();
              }
          }, $__17, this);
        })
      }, {});
    }();
    Object.defineProperty(Set.prototype, Symbol.iterator, {
      configurable: true,
      writable: true,
      value: Set.prototype.values
    });
    Object.defineProperty(Set.prototype, 'keys', {
      configurable: true,
      writable: true,
      value: Set.prototype.values
    });
    function needsPolyfill(global) {
      var $__13 = global,
          Set = $__13.Set,
          Symbol = $__13.Symbol;
      if (!Set || !$traceurRuntime.hasNativeSymbol() || !Set.prototype[Symbol.iterator] || !Set.prototype.values) {
        return true;
      }
      try {
        return new Set([1]).size !== 1;
      } catch (e) {
        return false;
      }
    }
    function polyfillSet(global) {
      if (needsPolyfill(global)) {
        global.Set = Set;
      }
    }
    registerPolyfill(polyfillSet);
    return {
      get Set() {
        return Set;
      },
      get polyfillSet() {
        return polyfillSet;
      }
    };
  });
  System.get("traceur-runtime@0.0.93/src/runtime/polyfills/Set.js" + '');
  System.registerModule("traceur-runtime@0.0.93/node_modules/rsvp/lib/rsvp/asap.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/node_modules/rsvp/lib/rsvp/asap.js";
    var len = 0;
    function asap(callback, arg) {
      queue[len] = callback;
      queue[len + 1] = arg;
      len += 2;
      if (len === 2) {
        scheduleFlush();
      }
    }
    var $__default = asap;
    var browserGlobal = (typeof window !== 'undefined') ? window : {};
    var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
    var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
    function useNextTick() {
      return function() {
        process.nextTick(flush);
      };
    }
    function useMutationObserver() {
      var iterations = 0;
      var observer = new BrowserMutationObserver(flush);
      var node = document.createTextNode('');
      observer.observe(node, {characterData: true});
      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }
    function useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = flush;
      return function() {
        channel.port2.postMessage(0);
      };
    }
    function useSetTimeout() {
      return function() {
        setTimeout(flush, 1);
      };
    }
    var queue = new Array(1000);
    function flush() {
      for (var i = 0; i < len; i += 2) {
        var callback = queue[i];
        var arg = queue[i + 1];
        callback(arg);
        queue[i] = undefined;
        queue[i + 1] = undefined;
      }
      len = 0;
    }
    var scheduleFlush;
    if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
      scheduleFlush = useNextTick();
    } else if (BrowserMutationObserver) {
      scheduleFlush = useMutationObserver();
    } else if (isWorker) {
      scheduleFlush = useMessageChannel();
    } else {
      scheduleFlush = useSetTimeout();
    }
    return {get default() {
        return $__default;
      }};
  });
  System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/Promise.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/Promise.js";
    var async = System.get("traceur-runtime@0.0.93/node_modules/rsvp/lib/rsvp/asap.js").default;
    var registerPolyfill = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js").registerPolyfill;
    var promiseRaw = {};
    function isPromise(x) {
      return x && (typeof x === 'undefined' ? 'undefined' : $traceurRuntime.typeof(x)) === 'object' && x.status_ !== undefined;
    }
    function idResolveHandler(x) {
      return x;
    }
    function idRejectHandler(x) {
      throw x;
    }
    function chain(promise) {
      var onResolve = arguments[1] !== (void 0) ? arguments[1] : idResolveHandler;
      var onReject = arguments[2] !== (void 0) ? arguments[2] : idRejectHandler;
      var deferred = getDeferred(promise.constructor);
      switch (promise.status_) {
        case undefined:
          throw TypeError;
        case 0:
          promise.onResolve_.push(onResolve, deferred);
          promise.onReject_.push(onReject, deferred);
          break;
        case +1:
          promiseEnqueue(promise.value_, [onResolve, deferred]);
          break;
        case -1:
          promiseEnqueue(promise.value_, [onReject, deferred]);
          break;
      }
      return deferred.promise;
    }
    function getDeferred(C) {
      if (this === $Promise) {
        var promise = promiseInit(new $Promise(promiseRaw));
        return {
          promise: promise,
          resolve: function(x) {
            promiseResolve(promise, x);
          },
          reject: function(r) {
            promiseReject(promise, r);
          }
        };
      } else {
        var result = {};
        result.promise = new C(function(resolve, reject) {
          result.resolve = resolve;
          result.reject = reject;
        });
        return result;
      }
    }
    function promiseSet(promise, status, value, onResolve, onReject) {
      promise.status_ = status;
      promise.value_ = value;
      promise.onResolve_ = onResolve;
      promise.onReject_ = onReject;
      return promise;
    }
    function promiseInit(promise) {
      return promiseSet(promise, 0, undefined, [], []);
    }
    var Promise = function() {
      function Promise(resolver) {
        if (resolver === promiseRaw)
          return;
        if (typeof resolver !== 'function')
          throw new TypeError;
        var promise = promiseInit(this);
        try {
          resolver(function(x) {
            promiseResolve(promise, x);
          }, function(r) {
            promiseReject(promise, r);
          });
        } catch (e) {
          promiseReject(promise, e);
        }
      }
      return ($traceurRuntime.createClass)(Promise, {
        catch: function(onReject) {
          return this.then(undefined, onReject);
        },
        then: function(onResolve, onReject) {
          if (typeof onResolve !== 'function')
            onResolve = idResolveHandler;
          if (typeof onReject !== 'function')
            onReject = idRejectHandler;
          var that = this;
          var constructor = this.constructor;
          return chain(this, function(x) {
            x = promiseCoerce(constructor, x);
            return x === that ? onReject(new TypeError) : isPromise(x) ? x.then(onResolve, onReject) : onResolve(x);
          }, onReject);
        }
      }, {
        resolve: function(x) {
          if (this === $Promise) {
            if (isPromise(x)) {
              return x;
            }
            return promiseSet(new $Promise(promiseRaw), +1, x);
          } else {
            return new this(function(resolve, reject) {
              resolve(x);
            });
          }
        },
        reject: function(r) {
          if (this === $Promise) {
            return promiseSet(new $Promise(promiseRaw), -1, r);
          } else {
            return new this(function(resolve, reject) {
              reject(r);
            });
          }
        },
        all: function(values) {
          var deferred = getDeferred(this);
          var resolutions = [];
          try {
            var makeCountdownFunction = function(i) {
              return function(x) {
                resolutions[i] = x;
                if (--count === 0)
                  deferred.resolve(resolutions);
              };
            };
            var count = 0;
            var i = 0;
            var $__6 = true;
            var $__7 = false;
            var $__8 = undefined;
            try {
              for (var $__4 = void 0,
                  $__3 = (values)[Symbol.iterator](); !($__6 = ($__4 = $__3.next()).done); $__6 = true) {
                var value = $__4.value;
                {
                  var countdownFunction = makeCountdownFunction(i);
                  this.resolve(value).then(countdownFunction, function(r) {
                    deferred.reject(r);
                  });
                  ++i;
                  ++count;
                }
              }
            } catch ($__9) {
              $__7 = true;
              $__8 = $__9;
            } finally {
              try {
                if (!$__6 && $__3.return != null) {
                  $__3.return();
                }
              } finally {
                if ($__7) {
                  throw $__8;
                }
              }
            }
            if (count === 0) {
              deferred.resolve(resolutions);
            }
          } catch (e) {
            deferred.reject(e);
          }
          return deferred.promise;
        },
        race: function(values) {
          var deferred = getDeferred(this);
          try {
            for (var i = 0; i < values.length; i++) {
              this.resolve(values[i]).then(function(x) {
                deferred.resolve(x);
              }, function(r) {
                deferred.reject(r);
              });
            }
          } catch (e) {
            deferred.reject(e);
          }
          return deferred.promise;
        }
      });
    }();
    var $Promise = Promise;
    var $PromiseReject = $Promise.reject;
    function promiseResolve(promise, x) {
      promiseDone(promise, +1, x, promise.onResolve_);
    }
    function promiseReject(promise, r) {
      promiseDone(promise, -1, r, promise.onReject_);
    }
    function promiseDone(promise, status, value, reactions) {
      if (promise.status_ !== 0)
        return;
      promiseEnqueue(value, reactions);
      promiseSet(promise, status, value);
    }
    function promiseEnqueue(value, tasks) {
      async(function() {
        for (var i = 0; i < tasks.length; i += 2) {
          promiseHandle(value, tasks[i], tasks[i + 1]);
        }
      });
    }
    function promiseHandle(value, handler, deferred) {
      try {
        var result = handler(value);
        if (result === deferred.promise)
          throw new TypeError;
        else if (isPromise(result))
          chain(result, deferred.resolve, deferred.reject);
        else
          deferred.resolve(result);
      } catch (e) {
        try {
          deferred.reject(e);
        } catch (e) {}
      }
    }
    var thenableSymbol = '@@thenable';
    function isObject(x) {
      return x && ((typeof x === 'undefined' ? 'undefined' : $traceurRuntime.typeof(x)) === 'object' || typeof x === 'function');
    }
    function promiseCoerce(constructor, x) {
      if (!isPromise(x) && isObject(x)) {
        var then;
        try {
          then = x.then;
        } catch (r) {
          var promise = $PromiseReject.call(constructor, r);
          x[thenableSymbol] = promise;
          return promise;
        }
        if (typeof then === 'function') {
          var p = x[thenableSymbol];
          if (p) {
            return p;
          } else {
            var deferred = getDeferred(constructor);
            x[thenableSymbol] = deferred.promise;
            try {
              then.call(x, deferred.resolve, deferred.reject);
            } catch (r) {
              deferred.reject(r);
            }
            return deferred.promise;
          }
        }
      }
      return x;
    }
    function polyfillPromise(global) {
      if (!global.Promise)
        global.Promise = Promise;
    }
    registerPolyfill(polyfillPromise);
    return {
      get Promise() {
        return Promise;
      },
      get polyfillPromise() {
        return polyfillPromise;
      }
    };
  });
  System.get("traceur-runtime@0.0.93/src/runtime/polyfills/Promise.js" + '');
  System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/StringIterator.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/StringIterator.js";
    var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
        createIteratorResultObject = $__0.createIteratorResultObject,
        isObject = $__0.isObject;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var iteratedString = Symbol('iteratedString');
    var stringIteratorNextIndex = Symbol('stringIteratorNextIndex');
    var StringIterator = function() {
      var $__3;
      function StringIterator() {}
      return ($traceurRuntime.createClass)(StringIterator, ($__3 = {}, Object.defineProperty($__3, "next", {
        value: function() {
          var o = this;
          if (!isObject(o) || !hasOwnProperty.call(o, iteratedString)) {
            throw new TypeError('this must be a StringIterator object');
          }
          var s = o[iteratedString];
          if (s === undefined) {
            return createIteratorResultObject(undefined, true);
          }
          var position = o[stringIteratorNextIndex];
          var len = s.length;
          if (position >= len) {
            o[iteratedString] = undefined;
            return createIteratorResultObject(undefined, true);
          }
          var first = s.charCodeAt(position);
          var resultString;
          if (first < 0xD800 || first > 0xDBFF || position + 1 === len) {
            resultString = String.fromCharCode(first);
          } else {
            var second = s.charCodeAt(position + 1);
            if (second < 0xDC00 || second > 0xDFFF) {
              resultString = String.fromCharCode(first);
            } else {
              resultString = String.fromCharCode(first) + String.fromCharCode(second);
            }
          }
          o[stringIteratorNextIndex] = position + resultString.length;
          return createIteratorResultObject(resultString, false);
        },
        configurable: true,
        enumerable: true,
        writable: true
      }), Object.defineProperty($__3, Symbol.iterator, {
        value: function() {
          return this;
        },
        configurable: true,
        enumerable: true,
        writable: true
      }), $__3), {});
    }();
    function createStringIterator(string) {
      var s = String(string);
      var iterator = Object.create(StringIterator.prototype);
      iterator[iteratedString] = s;
      iterator[stringIteratorNextIndex] = 0;
      return iterator;
    }
    return {get createStringIterator() {
        return createStringIterator;
      }};
  });
  System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/String.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/String.js";
    var createStringIterator = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/StringIterator.js").createStringIterator;
    var $__1 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
        maybeAddFunctions = $__1.maybeAddFunctions,
        maybeAddIterator = $__1.maybeAddIterator,
        registerPolyfill = $__1.registerPolyfill;
    var $toString = Object.prototype.toString;
    var $indexOf = String.prototype.indexOf;
    var $lastIndexOf = String.prototype.lastIndexOf;
    function startsWith(search) {
      var string = String(this);
      if (this == null || $toString.call(search) == '[object RegExp]') {
        throw TypeError();
      }
      var stringLength = string.length;
      var searchString = String(search);
      var searchLength = searchString.length;
      var position = arguments.length > 1 ? arguments[1] : undefined;
      var pos = position ? Number(position) : 0;
      if (isNaN(pos)) {
        pos = 0;
      }
      var start = Math.min(Math.max(pos, 0), stringLength);
      return $indexOf.call(string, searchString, pos) == start;
    }
    function endsWith(search) {
      var string = String(this);
      if (this == null || $toString.call(search) == '[object RegExp]') {
        throw TypeError();
      }
      var stringLength = string.length;
      var searchString = String(search);
      var searchLength = searchString.length;
      var pos = stringLength;
      if (arguments.length > 1) {
        var position = arguments[1];
        if (position !== undefined) {
          pos = position ? Number(position) : 0;
          if (isNaN(pos)) {
            pos = 0;
          }
        }
      }
      var end = Math.min(Math.max(pos, 0), stringLength);
      var start = end - searchLength;
      if (start < 0) {
        return false;
      }
      return $lastIndexOf.call(string, searchString, start) == start;
    }
    function includes(search) {
      if (this == null) {
        throw TypeError();
      }
      var string = String(this);
      if (search && $toString.call(search) == '[object RegExp]') {
        throw TypeError();
      }
      var stringLength = string.length;
      var searchString = String(search);
      var searchLength = searchString.length;
      var position = arguments.length > 1 ? arguments[1] : undefined;
      var pos = position ? Number(position) : 0;
      if (pos != pos) {
        pos = 0;
      }
      var start = Math.min(Math.max(pos, 0), stringLength);
      if (searchLength + start > stringLength) {
        return false;
      }
      return $indexOf.call(string, searchString, pos) != -1;
    }
    function repeat(count) {
      if (this == null) {
        throw TypeError();
      }
      var string = String(this);
      var n = count ? Number(count) : 0;
      if (isNaN(n)) {
        n = 0;
      }
      if (n < 0 || n == Infinity) {
        throw RangeError();
      }
      if (n == 0) {
        return '';
      }
      var result = '';
      while (n--) {
        result += string;
      }
      return result;
    }
    function codePointAt(position) {
      if (this == null) {
        throw TypeError();
      }
      var string = String(this);
      var size = string.length;
      var index = position ? Number(position) : 0;
      if (isNaN(index)) {
        index = 0;
      }
      if (index < 0 || index >= size) {
        return undefined;
      }
      var first = string.charCodeAt(index);
      var second;
      if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
        second = string.charCodeAt(index + 1);
        if (second >= 0xDC00 && second <= 0xDFFF) {
          return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
        }
      }
      return first;
    }
    function raw(callsite) {
      var raw = callsite.raw;
      var len = raw.length >>> 0;
      if (len === 0)
        return '';
      var s = '';
      var i = 0;
      while (true) {
        s += raw[i];
        if (i + 1 === len)
          return s;
        s += arguments[++i];
      }
    }
    function fromCodePoint(_) {
      var codeUnits = [];
      var floor = Math.floor;
      var highSurrogate;
      var lowSurrogate;
      var index = -1;
      var length = arguments.length;
      if (!length) {
        return '';
      }
      while (++index < length) {
        var codePoint = Number(arguments[index]);
        if (!isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || floor(codePoint) != codePoint) {
          throw RangeError('Invalid code point: ' + codePoint);
        }
        if (codePoint <= 0xFFFF) {
          codeUnits.push(codePoint);
        } else {
          codePoint -= 0x10000;
          highSurrogate = (codePoint >> 10) + 0xD800;
          lowSurrogate = (codePoint % 0x400) + 0xDC00;
          codeUnits.push(highSurrogate, lowSurrogate);
        }
      }
      return String.fromCharCode.apply(null, codeUnits);
    }
    function stringPrototypeIterator() {
      var o = $traceurRuntime.checkObjectCoercible(this);
      var s = String(o);
      return createStringIterator(s);
    }
    function polyfillString(global) {
      var String = global.String;
      maybeAddFunctions(String.prototype, ['codePointAt', codePointAt, 'endsWith', endsWith, 'includes', includes, 'repeat', repeat, 'startsWith', startsWith]);
      maybeAddFunctions(String, ['fromCodePoint', fromCodePoint, 'raw', raw]);
      maybeAddIterator(String.prototype, stringPrototypeIterator, Symbol);
    }
    registerPolyfill(polyfillString);
    return {
      get startsWith() {
        return startsWith;
      },
      get endsWith() {
        return endsWith;
      },
      get includes() {
        return includes;
      },
      get repeat() {
        return repeat;
      },
      get codePointAt() {
        return codePointAt;
      },
      get raw() {
        return raw;
      },
      get fromCodePoint() {
        return fromCodePoint;
      },
      get stringPrototypeIterator() {
        return stringPrototypeIterator;
      },
      get polyfillString() {
        return polyfillString;
      }
    };
  });
  System.get("traceur-runtime@0.0.93/src/runtime/polyfills/String.js" + '');
  System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/ArrayIterator.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/ArrayIterator.js";
    var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
        toObject = $__0.toObject,
        toUint32 = $__0.toUint32,
        createIteratorResultObject = $__0.createIteratorResultObject;
    var ARRAY_ITERATOR_KIND_KEYS = 1;
    var ARRAY_ITERATOR_KIND_VALUES = 2;
    var ARRAY_ITERATOR_KIND_ENTRIES = 3;
    var ArrayIterator = function() {
      var $__3;
      function ArrayIterator() {}
      return ($traceurRuntime.createClass)(ArrayIterator, ($__3 = {}, Object.defineProperty($__3, "next", {
        value: function() {
          var iterator = toObject(this);
          var array = iterator.iteratorObject_;
          if (!array) {
            throw new TypeError('Object is not an ArrayIterator');
          }
          var index = iterator.arrayIteratorNextIndex_;
          var itemKind = iterator.arrayIterationKind_;
          var length = toUint32(array.length);
          if (index >= length) {
            iterator.arrayIteratorNextIndex_ = Infinity;
            return createIteratorResultObject(undefined, true);
          }
          iterator.arrayIteratorNextIndex_ = index + 1;
          if (itemKind == ARRAY_ITERATOR_KIND_VALUES)
            return createIteratorResultObject(array[index], false);
          if (itemKind == ARRAY_ITERATOR_KIND_ENTRIES)
            return createIteratorResultObject([index, array[index]], false);
          return createIteratorResultObject(index, false);
        },
        configurable: true,
        enumerable: true,
        writable: true
      }), Object.defineProperty($__3, Symbol.iterator, {
        value: function() {
          return this;
        },
        configurable: true,
        enumerable: true,
        writable: true
      }), $__3), {});
    }();
    function createArrayIterator(array, kind) {
      var object = toObject(array);
      var iterator = new ArrayIterator;
      iterator.iteratorObject_ = object;
      iterator.arrayIteratorNextIndex_ = 0;
      iterator.arrayIterationKind_ = kind;
      return iterator;
    }
    function entries() {
      return createArrayIterator(this, ARRAY_ITERATOR_KIND_ENTRIES);
    }
    function keys() {
      return createArrayIterator(this, ARRAY_ITERATOR_KIND_KEYS);
    }
    function values() {
      return createArrayIterator(this, ARRAY_ITERATOR_KIND_VALUES);
    }
    return {
      get entries() {
        return entries;
      },
      get keys() {
        return keys;
      },
      get values() {
        return values;
      }
    };
  });
  System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/Array.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/Array.js";
    var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/ArrayIterator.js"),
        entries = $__0.entries,
        keys = $__0.keys,
        jsValues = $__0.values;
    var $__1 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
        checkIterable = $__1.checkIterable,
        isCallable = $__1.isCallable,
        isConstructor = $__1.isConstructor,
        maybeAddFunctions = $__1.maybeAddFunctions,
        maybeAddIterator = $__1.maybeAddIterator,
        registerPolyfill = $__1.registerPolyfill,
        toInteger = $__1.toInteger,
        toLength = $__1.toLength,
        toObject = $__1.toObject;
    function from(arrLike) {
      var mapFn = arguments[1];
      var thisArg = arguments[2];
      var C = this;
      var items = toObject(arrLike);
      var mapping = mapFn !== undefined;
      var k = 0;
      var arr,
          len;
      if (mapping && !isCallable(mapFn)) {
        throw TypeError();
      }
      if (checkIterable(items)) {
        arr = isConstructor(C) ? new C() : [];
        var $__6 = true;
        var $__7 = false;
        var $__8 = undefined;
        try {
          for (var $__4 = void 0,
              $__3 = (items)[Symbol.iterator](); !($__6 = ($__4 = $__3.next()).done); $__6 = true) {
            var item = $__4.value;
            {
              if (mapping) {
                arr[k] = mapFn.call(thisArg, item, k);
              } else {
                arr[k] = item;
              }
              k++;
            }
          }
        } catch ($__9) {
          $__7 = true;
          $__8 = $__9;
        } finally {
          try {
            if (!$__6 && $__3.return != null) {
              $__3.return();
            }
          } finally {
            if ($__7) {
              throw $__8;
            }
          }
        }
        arr.length = k;
        return arr;
      }
      len = toLength(items.length);
      arr = isConstructor(C) ? new C(len) : new Array(len);
      for (; k < len; k++) {
        if (mapping) {
          arr[k] = typeof thisArg === 'undefined' ? mapFn(items[k], k) : mapFn.call(thisArg, items[k], k);
        } else {
          arr[k] = items[k];
        }
      }
      arr.length = len;
      return arr;
    }
    function of() {
      for (var items = [],
          $__10 = 0; $__10 < arguments.length; $__10++)
        items[$__10] = arguments[$__10];
      var C = this;
      var len = items.length;
      var arr = isConstructor(C) ? new C(len) : new Array(len);
      for (var k = 0; k < len; k++) {
        arr[k] = items[k];
      }
      arr.length = len;
      return arr;
    }
    function fill(value) {
      var start = arguments[1] !== (void 0) ? arguments[1] : 0;
      var end = arguments[2];
      var object = toObject(this);
      var len = toLength(object.length);
      var fillStart = toInteger(start);
      var fillEnd = end !== undefined ? toInteger(end) : len;
      fillStart = fillStart < 0 ? Math.max(len + fillStart, 0) : Math.min(fillStart, len);
      fillEnd = fillEnd < 0 ? Math.max(len + fillEnd, 0) : Math.min(fillEnd, len);
      while (fillStart < fillEnd) {
        object[fillStart] = value;
        fillStart++;
      }
      return object;
    }
    function find(predicate) {
      var thisArg = arguments[1];
      return findHelper(this, predicate, thisArg);
    }
    function findIndex(predicate) {
      var thisArg = arguments[1];
      return findHelper(this, predicate, thisArg, true);
    }
    function findHelper(self, predicate) {
      var thisArg = arguments[2];
      var returnIndex = arguments[3] !== (void 0) ? arguments[3] : false;
      var object = toObject(self);
      var len = toLength(object.length);
      if (!isCallable(predicate)) {
        throw TypeError();
      }
      for (var i = 0; i < len; i++) {
        var value = object[i];
        if (predicate.call(thisArg, value, i, object)) {
          return returnIndex ? i : value;
        }
      }
      return returnIndex ? -1 : undefined;
    }
    function polyfillArray(global) {
      var $__11 = global,
          Array = $__11.Array,
          Object = $__11.Object,
          Symbol = $__11.Symbol;
      var values = jsValues;
      if (Symbol && Symbol.iterator && Array.prototype[Symbol.iterator]) {
        values = Array.prototype[Symbol.iterator];
      }
      maybeAddFunctions(Array.prototype, ['entries', entries, 'keys', keys, 'values', values, 'fill', fill, 'find', find, 'findIndex', findIndex]);
      maybeAddFunctions(Array, ['from', from, 'of', of]);
      maybeAddIterator(Array.prototype, values, Symbol);
      maybeAddIterator(Object.getPrototypeOf([].values()), function() {
        return this;
      }, Symbol);
    }
    registerPolyfill(polyfillArray);
    return {
      get from() {
        return from;
      },
      get of() {
        return of;
      },
      get fill() {
        return fill;
      },
      get find() {
        return find;
      },
      get findIndex() {
        return findIndex;
      },
      get polyfillArray() {
        return polyfillArray;
      }
    };
  });
  System.get("traceur-runtime@0.0.93/src/runtime/polyfills/Array.js" + '');
  System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/Object.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/Object.js";
    var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
        maybeAddFunctions = $__0.maybeAddFunctions,
        registerPolyfill = $__0.registerPolyfill;
    var $__2 = Object,
        defineProperty = $__2.defineProperty,
        getOwnPropertyDescriptor = $__2.getOwnPropertyDescriptor,
        getOwnPropertyNames = $__2.getOwnPropertyNames,
        keys = $__2.keys;
    function is(left, right) {
      if (left === right)
        return left !== 0 || 1 / left === 1 / right;
      return left !== left && right !== right;
    }
    function assign(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        var props = source == null ? [] : keys(source);
        var p = void 0,
            length = props.length;
        for (p = 0; p < length; p++) {
          var name = props[p];
          target[name] = source[name];
        }
      }
      return target;
    }
    function mixin(target, source) {
      var props = getOwnPropertyNames(source);
      var p,
          descriptor,
          length = props.length;
      for (p = 0; p < length; p++) {
        var name = props[p];
        descriptor = getOwnPropertyDescriptor(source, props[p]);
        defineProperty(target, props[p], descriptor);
      }
      return target;
    }
    function polyfillObject(global) {
      var Object = global.Object;
      maybeAddFunctions(Object, ['assign', assign, 'is', is, 'mixin', mixin]);
    }
    registerPolyfill(polyfillObject);
    return {
      get is() {
        return is;
      },
      get assign() {
        return assign;
      },
      get mixin() {
        return mixin;
      },
      get polyfillObject() {
        return polyfillObject;
      }
    };
  });
  System.get("traceur-runtime@0.0.93/src/runtime/polyfills/Object.js" + '');
  System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/Number.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/Number.js";
    var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
        isNumber = $__0.isNumber,
        maybeAddConsts = $__0.maybeAddConsts,
        maybeAddFunctions = $__0.maybeAddFunctions,
        registerPolyfill = $__0.registerPolyfill,
        toInteger = $__0.toInteger;
    var $abs = Math.abs;
    var $isFinite = isFinite;
    var $isNaN = isNaN;
    var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
    var MIN_SAFE_INTEGER = -Math.pow(2, 53) + 1;
    var EPSILON = Math.pow(2, -52);
    function NumberIsFinite(number) {
      return isNumber(number) && $isFinite(number);
    }
    function isInteger(number) {
      return NumberIsFinite(number) && toInteger(number) === number;
    }
    function NumberIsNaN(number) {
      return isNumber(number) && $isNaN(number);
    }
    function isSafeInteger(number) {
      if (NumberIsFinite(number)) {
        var integral = toInteger(number);
        if (integral === number)
          return $abs(integral) <= MAX_SAFE_INTEGER;
      }
      return false;
    }
    function polyfillNumber(global) {
      var Number = global.Number;
      maybeAddConsts(Number, ['MAX_SAFE_INTEGER', MAX_SAFE_INTEGER, 'MIN_SAFE_INTEGER', MIN_SAFE_INTEGER, 'EPSILON', EPSILON]);
      maybeAddFunctions(Number, ['isFinite', NumberIsFinite, 'isInteger', isInteger, 'isNaN', NumberIsNaN, 'isSafeInteger', isSafeInteger]);
    }
    registerPolyfill(polyfillNumber);
    return {
      get MAX_SAFE_INTEGER() {
        return MAX_SAFE_INTEGER;
      },
      get MIN_SAFE_INTEGER() {
        return MIN_SAFE_INTEGER;
      },
      get EPSILON() {
        return EPSILON;
      },
      get isFinite() {
        return NumberIsFinite;
      },
      get isInteger() {
        return isInteger;
      },
      get isNaN() {
        return NumberIsNaN;
      },
      get isSafeInteger() {
        return isSafeInteger;
      },
      get polyfillNumber() {
        return polyfillNumber;
      }
    };
  });
  System.get("traceur-runtime@0.0.93/src/runtime/polyfills/Number.js" + '');
  System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/fround.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/fround.js";
    var $isFinite = isFinite;
    var $isNaN = isNaN;
    var $__1 = Math,
        LN2 = $__1.LN2,
        abs = $__1.abs,
        floor = $__1.floor,
        log = $__1.log,
        min = $__1.min,
        pow = $__1.pow;
    function packIEEE754(v, ebits, fbits) {
      var bias = (1 << (ebits - 1)) - 1,
          s,
          e,
          f,
          ln,
          i,
          bits,
          str,
          bytes;
      function roundToEven(n) {
        var w = floor(n),
            f = n - w;
        if (f < 0.5)
          return w;
        if (f > 0.5)
          return w + 1;
        return w % 2 ? w + 1 : w;
      }
      if (v !== v) {
        e = (1 << ebits) - 1;
        f = pow(2, fbits - 1);
        s = 0;
      } else if (v === Infinity || v === -Infinity) {
        e = (1 << ebits) - 1;
        f = 0;
        s = (v < 0) ? 1 : 0;
      } else if (v === 0) {
        e = 0;
        f = 0;
        s = (1 / v === -Infinity) ? 1 : 0;
      } else {
        s = v < 0;
        v = abs(v);
        if (v >= pow(2, 1 - bias)) {
          e = min(floor(log(v) / LN2), 1023);
          f = roundToEven(v / pow(2, e) * pow(2, fbits));
          if (f / pow(2, fbits) >= 2) {
            e = e + 1;
            f = 1;
          }
          if (e > bias) {
            e = (1 << ebits) - 1;
            f = 0;
          } else {
            e = e + bias;
            f = f - pow(2, fbits);
          }
        } else {
          e = 0;
          f = roundToEven(v / pow(2, 1 - bias - fbits));
        }
      }
      bits = [];
      for (i = fbits; i; i -= 1) {
        bits.push(f % 2 ? 1 : 0);
        f = floor(f / 2);
      }
      for (i = ebits; i; i -= 1) {
        bits.push(e % 2 ? 1 : 0);
        e = floor(e / 2);
      }
      bits.push(s ? 1 : 0);
      bits.reverse();
      str = bits.join('');
      bytes = [];
      while (str.length) {
        bytes.push(parseInt(str.substring(0, 8), 2));
        str = str.substring(8);
      }
      return bytes;
    }
    function unpackIEEE754(bytes, ebits, fbits) {
      var bits = [],
          i,
          j,
          b,
          str,
          bias,
          s,
          e,
          f;
      for (i = bytes.length; i; i -= 1) {
        b = bytes[i - 1];
        for (j = 8; j; j -= 1) {
          bits.push(b % 2 ? 1 : 0);
          b = b >> 1;
        }
      }
      bits.reverse();
      str = bits.join('');
      bias = (1 << (ebits - 1)) - 1;
      s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
      e = parseInt(str.substring(1, 1 + ebits), 2);
      f = parseInt(str.substring(1 + ebits), 2);
      if (e === (1 << ebits) - 1) {
        return f !== 0 ? NaN : s * Infinity;
      } else if (e > 0) {
        return s * pow(2, e - bias) * (1 + f / pow(2, fbits));
      } else if (f !== 0) {
        return s * pow(2, -(bias - 1)) * (f / pow(2, fbits));
      } else {
        return s < 0 ? -0 : 0;
      }
    }
    function unpackF32(b) {
      return unpackIEEE754(b, 8, 23);
    }
    function packF32(v) {
      return packIEEE754(v, 8, 23);
    }
    function fround(x) {
      if (x === 0 || !$isFinite(x) || $isNaN(x)) {
        return x;
      }
      return unpackF32(packF32(Number(x)));
    }
    return {get fround() {
        return fround;
      }};
  });
  System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/Math.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/Math.js";
    var jsFround = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/fround.js").fround;
    var $__1 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
        maybeAddFunctions = $__1.maybeAddFunctions,
        registerPolyfill = $__1.registerPolyfill,
        toUint32 = $__1.toUint32;
    var $isFinite = isFinite;
    var $isNaN = isNaN;
    var $__3 = Math,
        abs = $__3.abs,
        ceil = $__3.ceil,
        exp = $__3.exp,
        floor = $__3.floor,
        log = $__3.log,
        pow = $__3.pow,
        sqrt = $__3.sqrt;
    function clz32(x) {
      x = toUint32(+x);
      if (x == 0)
        return 32;
      var result = 0;
      if ((x & 0xFFFF0000) === 0) {
        x <<= 16;
        result += 16;
      }
      ;
      if ((x & 0xFF000000) === 0) {
        x <<= 8;
        result += 8;
      }
      ;
      if ((x & 0xF0000000) === 0) {
        x <<= 4;
        result += 4;
      }
      ;
      if ((x & 0xC0000000) === 0) {
        x <<= 2;
        result += 2;
      }
      ;
      if ((x & 0x80000000) === 0) {
        x <<= 1;
        result += 1;
      }
      ;
      return result;
    }
    function imul(x, y) {
      x = toUint32(+x);
      y = toUint32(+y);
      var xh = (x >>> 16) & 0xffff;
      var xl = x & 0xffff;
      var yh = (y >>> 16) & 0xffff;
      var yl = y & 0xffff;
      return xl * yl + (((xh * yl + xl * yh) << 16) >>> 0) | 0;
    }
    function sign(x) {
      x = +x;
      if (x > 0)
        return 1;
      if (x < 0)
        return -1;
      return x;
    }
    function log10(x) {
      return log(x) * 0.434294481903251828;
    }
    function log2(x) {
      return log(x) * 1.442695040888963407;
    }
    function log1p(x) {
      x = +x;
      if (x < -1 || $isNaN(x)) {
        return NaN;
      }
      if (x === 0 || x === Infinity) {
        return x;
      }
      if (x === -1) {
        return -Infinity;
      }
      var result = 0;
      var n = 50;
      if (x < 0 || x > 1) {
        return log(1 + x);
      }
      for (var i = 1; i < n; i++) {
        if ((i % 2) === 0) {
          result -= pow(x, i) / i;
        } else {
          result += pow(x, i) / i;
        }
      }
      return result;
    }
    function expm1(x) {
      x = +x;
      if (x === -Infinity) {
        return -1;
      }
      if (!$isFinite(x) || x === 0) {
        return x;
      }
      return exp(x) - 1;
    }
    function cosh(x) {
      x = +x;
      if (x === 0) {
        return 1;
      }
      if ($isNaN(x)) {
        return NaN;
      }
      if (!$isFinite(x)) {
        return Infinity;
      }
      if (x < 0) {
        x = -x;
      }
      if (x > 21) {
        return exp(x) / 2;
      }
      return (exp(x) + exp(-x)) / 2;
    }
    function sinh(x) {
      x = +x;
      if (!$isFinite(x) || x === 0) {
        return x;
      }
      return (exp(x) - exp(-x)) / 2;
    }
    function tanh(x) {
      x = +x;
      if (x === 0)
        return x;
      if (!$isFinite(x))
        return sign(x);
      var exp1 = exp(x);
      var exp2 = exp(-x);
      return (exp1 - exp2) / (exp1 + exp2);
    }
    function acosh(x) {
      x = +x;
      if (x < 1)
        return NaN;
      if (!$isFinite(x))
        return x;
      return log(x + sqrt(x + 1) * sqrt(x - 1));
    }
    function asinh(x) {
      x = +x;
      if (x === 0 || !$isFinite(x))
        return x;
      if (x > 0)
        return log(x + sqrt(x * x + 1));
      return -log(-x + sqrt(x * x + 1));
    }
    function atanh(x) {
      x = +x;
      if (x === -1) {
        return -Infinity;
      }
      if (x === 1) {
        return Infinity;
      }
      if (x === 0) {
        return x;
      }
      if ($isNaN(x) || x < -1 || x > 1) {
        return NaN;
      }
      return 0.5 * log((1 + x) / (1 - x));
    }
    function hypot(x, y) {
      var length = arguments.length;
      var args = new Array(length);
      var max = 0;
      for (var i = 0; i < length; i++) {
        var n = arguments[i];
        n = +n;
        if (n === Infinity || n === -Infinity)
          return Infinity;
        n = abs(n);
        if (n > max)
          max = n;
        args[i] = n;
      }
      if (max === 0)
        max = 1;
      var sum = 0;
      var compensation = 0;
      for (var i = 0; i < length; i++) {
        var n = args[i] / max;
        var summand = n * n - compensation;
        var preliminary = sum + summand;
        compensation = (preliminary - sum) - summand;
        sum = preliminary;
      }
      return sqrt(sum) * max;
    }
    function trunc(x) {
      x = +x;
      if (x > 0)
        return floor(x);
      if (x < 0)
        return ceil(x);
      return x;
    }
    var fround,
        f32;
    if (typeof Float32Array === 'function') {
      f32 = new Float32Array(1);
      fround = function(x) {
        f32[0] = Number(x);
        return f32[0];
      };
    } else {
      fround = jsFround;
    }
    function cbrt(x) {
      x = +x;
      if (x === 0)
        return x;
      var negate = x < 0;
      if (negate)
        x = -x;
      var result = pow(x, 1 / 3);
      return negate ? -result : result;
    }
    function polyfillMath(global) {
      var Math = global.Math;
      maybeAddFunctions(Math, ['acosh', acosh, 'asinh', asinh, 'atanh', atanh, 'cbrt', cbrt, 'clz32', clz32, 'cosh', cosh, 'expm1', expm1, 'fround', fround, 'hypot', hypot, 'imul', imul, 'log10', log10, 'log1p', log1p, 'log2', log2, 'sign', sign, 'sinh', sinh, 'tanh', tanh, 'trunc', trunc]);
    }
    registerPolyfill(polyfillMath);
    return {
      get clz32() {
        return clz32;
      },
      get imul() {
        return imul;
      },
      get sign() {
        return sign;
      },
      get log10() {
        return log10;
      },
      get log2() {
        return log2;
      },
      get log1p() {
        return log1p;
      },
      get expm1() {
        return expm1;
      },
      get cosh() {
        return cosh;
      },
      get sinh() {
        return sinh;
      },
      get tanh() {
        return tanh;
      },
      get acosh() {
        return acosh;
      },
      get asinh() {
        return asinh;
      },
      get atanh() {
        return atanh;
      },
      get hypot() {
        return hypot;
      },
      get trunc() {
        return trunc;
      },
      get fround() {
        return fround;
      },
      get cbrt() {
        return cbrt;
      },
      get polyfillMath() {
        return polyfillMath;
      }
    };
  });
  System.get("traceur-runtime@0.0.93/src/runtime/polyfills/Math.js" + '');
  System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/WeakMap.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/WeakMap.js";
    var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/frozen-data.js"),
        deleteFrozen = $__0.deleteFrozen,
        getFrozen = $__0.getFrozen,
        hasFrozen = $__0.hasFrozen,
        setFrozen = $__0.setFrozen;
    var $__1 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
        isObject = $__1.isObject,
        registerPolyfill = $__1.registerPolyfill;
    var $__4 = Object,
        defineProperty = $__4.defineProperty,
        getOwnPropertyDescriptor = $__4.getOwnPropertyDescriptor,
        isExtensible = $__4.isExtensible;
    var $__5 = $traceurRuntime,
        createPrivateSymbol = $__5.createPrivateSymbol,
        deletePrivate = $__5.deletePrivate,
        getPrivate = $__5.getPrivate,
        hasNativeSymbol = $__5.hasNativeSymbol,
        hasPrivate = $__5.hasPrivate,
        setPrivate = $__5.setPrivate;
    var $TypeError = TypeError;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var sentinel = {};
    var WeakMap = function() {
      function WeakMap() {
        this.name_ = createPrivateSymbol();
        this.frozenData_ = [];
      }
      return ($traceurRuntime.createClass)(WeakMap, {
        set: function(key, value) {
          if (!isObject(key))
            throw new $TypeError('key must be an object');
          if (!isExtensible(key)) {
            setFrozen(this.frozenData_, key, value);
          } else {
            setPrivate(key, this.name_, value);
          }
          return this;
        },
        get: function(key) {
          if (!isObject(key))
            return undefined;
          if (!isExtensible(key)) {
            return getFrozen(this.frozenData_, key);
          }
          return getPrivate(key, this.name_);
        },
        delete: function(key) {
          if (!isObject(key))
            return false;
          if (!isExtensible(key)) {
            return deleteFrozen(this.frozenData_, key);
          }
          return deletePrivate(key, this.name_);
        },
        has: function(key) {
          if (!isObject(key))
            return false;
          if (!isExtensible(key)) {
            return hasFrozen(this.frozenData_, key);
          }
          return hasPrivate(key, this.name_);
        }
      }, {});
    }();
    function needsPolyfill(global) {
      var $__7 = global,
          WeakMap = $__7.WeakMap,
          Symbol = $__7.Symbol;
      if (!WeakMap || !hasNativeSymbol()) {
        return true;
      }
      try {
        var o = {};
        var wm = new WeakMap([[o, false]]);
        return wm.get(o);
      } catch (e) {
        return false;
      }
    }
    function polyfillWeakMap(global) {
      if (needsPolyfill(global)) {
        global.WeakMap = WeakMap;
      }
    }
    registerPolyfill(polyfillWeakMap);
    return {
      get WeakMap() {
        return WeakMap;
      },
      get polyfillWeakMap() {
        return polyfillWeakMap;
      }
    };
  });
  System.get("traceur-runtime@0.0.93/src/runtime/polyfills/WeakMap.js" + '');
  System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/WeakSet.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/WeakSet.js";
    var $__0 = System.get("traceur-runtime@0.0.93/src/runtime/frozen-data.js"),
        deleteFrozen = $__0.deleteFrozen,
        getFrozen = $__0.getFrozen,
        setFrozen = $__0.setFrozen;
    var $__1 = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js"),
        isObject = $__1.isObject,
        registerPolyfill = $__1.registerPolyfill;
    var $__4 = Object,
        defineProperty = $__4.defineProperty,
        isExtensible = $__4.isExtensible;
    var $__5 = $traceurRuntime,
        createPrivateSymbol = $__5.createPrivateSymbol,
        deletePrivate = $__5.deletePrivate,
        getPrivate = $__5.getPrivate,
        hasNativeSymbol = $__5.hasNativeSymbol,
        hasPrivate = $__5.hasPrivate,
        setPrivate = $__5.setPrivate;
    var $TypeError = TypeError;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var WeakSet = function() {
      function WeakSet() {
        this.name_ = createPrivateSymbol();
        this.frozenData_ = [];
      }
      return ($traceurRuntime.createClass)(WeakSet, {
        add: function(value) {
          if (!isObject(value))
            throw new $TypeError('value must be an object');
          if (!isExtensible(value)) {
            setFrozen(this.frozenData_, value, value);
          } else {
            setPrivate(value, this.name_, true);
          }
          return this;
        },
        delete: function(value) {
          if (!isObject(value))
            return false;
          if (!isExtensible(value)) {
            return deleteFrozen(this.frozenData_, value);
          }
          return deletePrivate(value, this.name_);
        },
        has: function(value) {
          if (!isObject(value))
            return false;
          if (!isExtensible(value)) {
            return getFrozen(this.frozenData_, value) === value;
          }
          return hasPrivate(value, this.name_);
        }
      }, {});
    }();
    function needsPolyfill(global) {
      var $__7 = global,
          WeakSet = $__7.WeakSet,
          Symbol = $__7.Symbol;
      if (!WeakSet || !hasNativeSymbol()) {
        return true;
      }
      try {
        var o = {};
        var wm = new WeakSet([[o]]);
        return !wm.has(o);
      } catch (e) {
        return false;
      }
    }
    function polyfillWeakSet(global) {
      if (needsPolyfill(global)) {
        global.WeakSet = WeakSet;
      }
    }
    registerPolyfill(polyfillWeakSet);
    return {
      get WeakSet() {
        return WeakSet;
      },
      get polyfillWeakSet() {
        return polyfillWeakSet;
      }
    };
  });
  System.get("traceur-runtime@0.0.93/src/runtime/polyfills/WeakSet.js" + '');
  System.registerModule("traceur-runtime@0.0.93/src/runtime/polyfills/polyfills.js", [], function() {
    "use strict";
    var __moduleName = "traceur-runtime@0.0.93/src/runtime/polyfills/polyfills.js";
    var polyfillAll = System.get("traceur-runtime@0.0.93/src/runtime/polyfills/utils.js").polyfillAll;
    polyfillAll(Reflect.global);
    var setupGlobals = $traceurRuntime.setupGlobals;
    $traceurRuntime.setupGlobals = function(global) {
      setupGlobals(global);
      polyfillAll(global);
    };
    return {};
  });
  System.get("traceur-runtime@0.0.93/src/runtime/polyfills/polyfills.js" + '');
  return {};
}.call(Reflect.global);

"use strict";
require('traceur/bin/traceur-runtime');
var fcnGreeting = function(msg, name) {
  return msg + ', ' + name;
};
var arrowGreeting = function(msg, name) {
  return msg + ', ' + name;
};
console.log('fcn: ', fcnGreeting('ohai', 'phil'));
console.log('arrow: ', arrowGreeting('ohai', 'phil'));

"use strict";
function greet(greeting, name) {
  console.log(greeting + ', ' + name);
}
greet();
function greet2(greeting) {
  var name = arguments[1] !== (void 0) ? arguments[1] : 'dude';
  console.log(greeting + ', ' + name);
}
greet2();
greet2('ohai');
greet2('hey', 'holmes');
function fcn1(cb) {
  cb();
}
function fcn2() {
  var cb = arguments[0] !== (void 0) ? arguments[0] : function() {
    console.log('ohai you forgot callback');
  };
  cb();
}
fcn2();
function fcn3() {
  var cb = arguments[0] !== (void 0) ? arguments[0] : function() {
    return console.log('ohai this way cleaner');
  };
  cb();
}
fcn3();
var fcn4 = function() {
  var cb = arguments[0] !== (void 0) ? arguments[0] : function() {
    return console.log('ohai wat ru doing?!?');
  };
  return cb();
};
fcn4();

"use strict";
var $__6,
    $__7;
var obj = {color: "blue"};
console.log(obj.color);
var color = {color: "red"}.color;
console.log(color);
var $__2 = {
  color: "red",
  position: "Center"
},
    color = $__2.color,
    position = $__2.position;
console.log(color, position);
function generateObject() {
  return {
    color: "blue",
    name: "joe",
    state: "michigan",
    position: "center"
  };
}
var $__3 = generateObject(),
    color = $__3.color,
    position = $__3.position;
console.log(color, position);
var $__4 = generateObject(),
    TeamName = $__4.name,
    TeamColor = $__4.color;
console.log(TeamName, TeamColor);
var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
var $__5 = colors,
    first = ($__6 = $__5[Symbol.iterator](), ($__7 = $__6.next()).done ? void 0 : $__7.value),
    fifth = ($__6.next(), $__6.next(), $__6.next(), ($__7 = $__6.next()).done ? void 0 : $__7.value);
console.log(first, fifth);
var people = [{
  "_id": "566deee23dbe9a2bc733f292",
  "index": 0,
  "guid": "4fb2e1a5-2549-43c8-b762-19542cfb8a41",
  "isActive": false,
  "balance": "$3,660.04",
  "picture": "http://placehold.it/32x32",
  "age": 29,
  "eyeColor": "blue",
  "name": {
    "first": "Myrna",
    "last": "Perkins"
  },
  "company": "ZILLATIDE",
  "phone": "+1 (938) 544-2329",
  "address": "444 Aster Court, Boling, Kansas, 5818",
  "registered": "Sunday, December 28, 2014 1:02 PM",
  "latitude": "-66.962599",
  "longitude": "-25.871188"
}, {
  "_id": "566deee2f705db6c3504bb4e",
  "index": 1,
  "guid": "12ca1c8e-8ffd-4f1c-a701-c3e892d39b34",
  "isActive": false,
  "balance": "$2,973.35",
  "picture": "http://placehold.it/32x32",
  "age": 39,
  "eyeColor": "blue",
  "name": {
    "first": "Gena",
    "last": "Walton"
  },
  "company": "KIDSTOCK",
  "phone": "+1 (829) 478-2673",
  "address": "179 Conduit Boulevard, Fresno, Federated States Of Micronesia, 2820",
  "registered": "Wednesday, November 25, 2015 9:54 AM",
  "latitude": "52.657522",
  "longitude": "-77.772599"
}, {
  "_id": "566deee2261ed17524922b12",
  "index": 2,
  "guid": "319b383c-e84b-4fbf-9ee8-ca60fee5c6f2",
  "isActive": false,
  "balance": "$1,658.53",
  "picture": "http://placehold.it/32x32",
  "age": 22,
  "eyeColor": "brown",
  "name": {
    "first": "Green",
    "last": "Lawson"
  },
  "company": "SPHERIX",
  "phone": "+1 (899) 408-3503",
  "address": "930 Union Street, Echo, Indiana, 8430",
  "registered": "Saturday, November 7, 2015 5:06 AM",
  "latitude": "-74.860241",
  "longitude": "-45.086113"
}, {
  "_id": "566deee262044bd862f54d9a",
  "index": 3,
  "guid": "8c7db322-af41-49c8-b3c1-ce9046cca68b",
  "isActive": true,
  "balance": "$2,776.69",
  "picture": "http://placehold.it/32x32",
  "age": 31,
  "eyeColor": "blue",
  "name": {
    "first": "Martin",
    "last": "Cohen"
  },
  "company": "MEMORA",
  "phone": "+1 (888) 514-3185",
  "address": "722 Poplar Street, Welch, Missouri, 7052",
  "registered": "Wednesday, June 17, 2015 7:19 PM",
  "latitude": "-80.277991",
  "longitude": "17.293162"
}, {
  "_id": "566deee2c7561c8f39145937",
  "index": 4,
  "guid": "978d5647-a804-4dac-a10b-8f17113abc2b",
  "isActive": false,
  "balance": "$3,421.15",
  "picture": "http://placehold.it/32x32",
  "age": 29,
  "eyeColor": "green",
  "name": {
    "first": "Estrada",
    "last": "Clay"
  },
  "company": "ZERBINA",
  "phone": "+1 (915) 555-3718",
  "address": "893 Chapel Street, Sims, Tennessee, 140",
  "registered": "Wednesday, March 5, 2014 1:18 AM",
  "latitude": "-7.507345",
  "longitude": "169.312539"
}];
people.forEach(function($__8) {
  var $__9 = $__8,
      personId = $__9._id,
      guid = $__9.guid;
  return console.log(personId, guid);
});

"use strict";
var $__8 = $traceurRuntime.initGeneratorFunction(greet),
    $__9 = $traceurRuntime.initGeneratorFunction(greet2),
    $__10 = $traceurRuntime.initGeneratorFunction(greet3),
    $__11 = $traceurRuntime.initGeneratorFunction(graph);
function greet() {
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          console.log("You called 'next()'");
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return "hello";
        case 2:
          $ctx.maybeThrow();
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__8, this);
}
var greeter = greet();
console.log(greeter);
var next = greeter.next();
console.log(next);
var done = greeter.next();
console.log(done);
function greet2() {
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          console.log("generators are lazy");
          $ctx.state = 14;
          break;
        case 14:
          $ctx.state = 2;
          return "how";
        case 2:
          $ctx.maybeThrow();
          $ctx.state = 4;
          break;
        case 4:
          console.log("I'm not called until the second next()");
          $ctx.state = 16;
          break;
        case 16:
          $ctx.state = 6;
          return "are";
        case 6:
          $ctx.maybeThrow();
          $ctx.state = 8;
          break;
        case 8:
          console.log("Now the third next()");
          $ctx.state = 18;
          break;
        case 18:
          $ctx.state = 10;
          return "you?";
        case 10:
          $ctx.maybeThrow();
          $ctx.state = 12;
          break;
        case 12:
          console.log("called when done");
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__9, this);
}
var greeter2 = greet2();
console.log(greeter2.next().value);
console.log(greeter2.next().value);
console.log(greeter2.next().value);
console.log(greeter2.next().value);
greeter2 = greet2();
var $__4 = true;
var $__5 = false;
var $__6 = undefined;
try {
  for (var $__2 = void 0,
      $__1 = (greeter2)[Symbol.iterator](); !($__4 = ($__2 = $__1.next()).done); $__4 = true) {
    var word = $__2.value;
    {
      console.log(word);
    }
  }
} catch ($__7) {
  $__5 = true;
  $__6 = $__7;
} finally {
  try {
    if (!$__4 && $__1.return != null) {
      $__1.return();
    }
  } finally {
    if ($__5) {
      throw $__6;
    }
  }
}
console.log('two way comms');
function greet3() {
  var yieldParam1,
      yieldParam2;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $ctx.state = 2;
          return "How";
        case 2:
          yieldParam1 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $ctx.state = 6;
          return yieldParam1 + " are";
        case 6:
          yieldParam2 = $ctx.sent;
          $ctx.state = 8;
          break;
        case 8:
          $ctx.state = 10;
          return yieldParam2 + " you?";
        case 10:
          $ctx.maybeThrow();
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__10, this);
}
var greeter3 = greet3();
console.log(greeter3.next().value);
console.log(greeter3.next('the heck').value);
console.log(greeter3.next('you fricken doing').value);
console.log(greeter3.next().value);
function graph() {
  var x,
      y,
      addNext,
      incrementer;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          x = 0;
          y = 0;
          $ctx.state = 9;
          break;
        case 9:
          $ctx.state = (true) ? 1 : -2;
          break;
        case 1:
          $ctx.state = 2;
          return {
            x: x,
            y: y
          };
        case 2:
          addNext = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          incrementer = (addNext === undefined) ? {
            x: 1,
            y: 2
          } : addNext;
          x += incrementer.x;
          y += incrementer.y;
          $ctx.state = 9;
          break;
        default:
          return $ctx.end();
      }
  }, $__11, this);
}
var grapher = graph();
console.log(grapher.next().value);
console.log(grapher.next({
  x: 1,
  y: 4
}).value);
console.log(grapher.next({
  x: 1,
  y: 2
}).value);
console.log(grapher.next().value);
console.log(grapher.next({
  x: -6,
  y: -9
}).value);
console.log(grapher.next({
  x: 1,
  y: 4
}).value);
console.log(grapher.next({
  x: 8,
  y: 4
}).value);
console.log(grapher.next().value);
console.log(grapher.next({
  x: 1,
  y: 2
}).value);
console.log(grapher.next().value);

"use strict";
var msg = 'ohai';
{
  var msg = 'lolgtfo';
}
console.log(msg);
var msg2 = 'ohai';
{
  var msg2$__0 = 'lolgtfo';
}
console.log(msg2);
var fs = [];
for (var i = 0; i < 10; i++) {
  fs.push(function() {
    console.log(i);
  });
}
fs.forEach(function(f) {
  f();
});
var fs = [];
var $__2 = function(i) {
  fs.push(function() {
    console.log(i);
  });
};
for (var i$__1 = 0; i$__1 < 10; i$__1++) {
  $__2(i$__1);
}
fs.forEach(function(f) {
  f();
});
function varFunc(n) {
  var previous = 0;
  var current = 1;
  var i;
  var tmp;
  for (i = 0; i < n; i += 1) {
    tmp = previous;
    previous = current;
    current = tmp + current;
  }
  return current;
}
function letFunc(n) {
  var previous = 0;
  var current = 1;
  for (var i = 0; i < n; i += 1) {
    var tmp = previous;
    previous = current;
    current = tmp + current;
  }
  return current;
}
console.log('varFunc(5)', varFunc(5));
console.log('letFunc(5)', letFunc(5));

"use strict";
var fname = 'joe';
var lname = 'momma';
var person = {
  fname: fname,
  lname: lname
};
console.log(person);
var mascot = 'moose';
var team = {
  person: person,
  mascot: mascot
};
console.log(team);

"use strict";
var str1 = 'ohai';
var str2 = str1 + ' yall';
console.log(str2);
str2 = (str1 + " yall");
console.log(str2);
str2 = ("\n\n    " + str1 + "\n\n      yall\n");
console.log(str2);
str2 = ("" + str1.toUpperCase());
console.log(str2);
var x = 1;
var y = 2;
var eq = (x + " + " + y + " = " + (x + y));
console.log(eq);
var msg = ("It's " + new Date().getHours() + ", I'm sleepy");
console.log(msg);
function doSomeParsing(strings) {
  for (var values = [],
      $__0 = 1; $__0 < arguments.length; $__0++)
    values[$__0 - 1] = arguments[$__0];
  console.log(strings, values);
  values[1] = (values[0] <= 20) ? 'awake' : 'sleepy';
  return (strings[0] + " " + values[0] + " " + strings[1] + " " + values[1] + " ");
}
var msg2 = doSomeParsing($traceurRuntime.getTemplateObject(["It's ", ", I'm ", ""]), new Date().getHours(), "");
console.log(msg2);

//# sourceMappingURL=all.js.map