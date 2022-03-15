function flatten(array) {
  var result = [];
  $flatten(array, result);
  return result;
}
function $flatten(array, result) {
  for (var i = 0; i < array.length; i++) {
    var value = array[i];
    if (Array.isArray(value)) {
      $flatten(value, result);
    } else {
      result.push(value);
    }
  }
}
const MATCH_PATTERN = /^on_?([A-Z]?[a-z]+)?/;
function qualifyCallbackKey(key) {
  const matches = key.match(MATCH_PATTERN);
  return (matches && matches[1] ? matches[1] : key).toLowerCase();
}
function validate(middlewares, to, from, next) {
  return new Promise(async (resolve, reject) => {
    let stopped = false;
    while (!stopped && middlewares.length) {
      const middleware2 = middlewares.shift();
      await middleware2.validate(to, from, (...args) => {
        stopped = true;
        next(...args);
        resolve(false);
      }).catch((e) => {
        stopped = true;
        reject(e);
      });
    }
    resolve(true);
  });
}
class EventEmitter {
  set callbacks(callbacks) {
    this.$callbacks = callbacks;
  }
  get callbacks() {
    if (!this.$callbacks) {
      this.callbacks = {};
    }
    return this.$callbacks;
  }
  on(key, fn) {
    if (typeof fn !== "function") {
      throw new Error("Callback must be an instance of a `Function`.");
    }
    key = qualifyCallbackKey(key);
    if (this.callbacks[key] === void 0) {
      this.callbacks[key] = [];
    }
    this.callbacks[key].push(fn);
    return this;
  }
  once(key, fn) {
    key = qualifyCallbackKey(key);
    const wrapper = (...args) => {
      this.off(key, wrapper);
      fn(...args);
    };
    return this.on(key, wrapper);
  }
  off(key, fn) {
    key = qualifyCallbackKey(key);
    const index = this.callbacks[key] && this.callbacks[key].indexOf(fn);
    if (index > -1) {
      this.callbacks[key].splice(index, 1);
    }
    return this;
  }
  emit(key, ...args) {
    key = qualifyCallbackKey(key);
    if (this.callbacks[key]) {
      [].concat(this.callbacks[key]).forEach((fn) => fn(...args));
    }
    return this;
  }
}
class Middleware {
  constructor(validator, key, args) {
    this.validator = validator;
    this.key = key;
    this.args = typeof args === "string" ? args.split(",") : [].concat(...args || []);
  }
  static make(subject, ...args) {
    if (subject instanceof this) {
      return subject;
    }
    return new this(subject, ...args);
  }
  async validate(to, from, next) {
    return await this.validator(to, from, next, ...this.args);
  }
}
class MiddlewareRegistry extends EventEmitter {
  constructor() {
    super();
    this.aliases = /* @__PURE__ */ new Map();
    this.middlewares = [];
    this.groups = /* @__PURE__ */ new Map();
    this.priorities = [];
  }
  alias(key, value) {
    this.aliases.set(key, value);
    return this;
  }
  group(key, value) {
    this.groups.set(key, value);
    return this;
  }
  middleware(value) {
    this.middlewares.push(value);
    return this;
  }
  priority(...args) {
    this.priorities = [].concat(...args);
    return this;
  }
  prioritize(...args) {
    return [].concat(...args).sort((a, b) => {
      let aIndex = this.priorities.indexOf(a.key || a.validator), bIndex = this.priorities.indexOf(b.key || b.validator);
      if (aIndex > -1 && bIndex > -1) {
        return aIndex < bIndex ? -1 : 1;
      }
      return aIndex > -1 ? -1 : 1;
    });
  }
  resolve(...args) {
    return flatten([].concat(...args).map((value) => {
      if (Array.isArray(value)) {
        return this.resolve(value);
      }
      if (typeof value === "function") {
        return Middleware.make(value);
      }
      const [key, args2] = this.definition(value);
      if (this.aliases.has(key)) {
        return Middleware.make(this.aliases.get(key), key, ...args2);
      }
      if (this.groups.has(key)) {
        return this.resolve(this.groups.get(key));
      }
    }));
  }
  definition(value) {
    const [key, args] = String(value).split(":");
    return [key, args ? args.split(".") : []].filter((value2) => !!value2);
  }
  prioritized(...args) {
    return this.prioritize(this.resolve([...this.middlewares, ...args]).filter((value) => value instanceof Middleware));
  }
}
class MiddlewareRoute extends EventEmitter {
  constructor(route2, options) {
    super();
    this.options = Object.assign({
      catch: [],
      middleware: [],
      registrar: new MiddlewareRegistry(),
      then: []
    }, options);
    if (!(this.registrar instanceof MiddlewareRegistry)) {
      throw Error("The `registrar` property must be an instance of MiddlewareRegistry");
    }
    this.intializeBeforeEnter();
    this.initializeRoute(route2);
  }
  intializeBeforeEnter() {
    this.beforeEnter = async (to, from, next) => {
      const promise = validate(this.middlewares, to, from, next).then((response) => {
        next();
        if (response && this.options.then.length) {
          this.options.then.reduce((promise2, fn) => {
            return promise2.then(() => fn(to, from, next));
          }, promise);
        }
      });
      if (this.options.catch.length) {
        this.options.catch.reduce((promise2, fn) => {
          return promise2.catch((e) => fn(e, to, from, next));
        }, promise);
      }
    };
  }
  initializeRoute(route2) {
    if (typeof route2 === "string") {
      route2 = {
        path: route2
      };
    }
    for (const [key, value] of Object.entries(route2)) {
      Object.defineProperty(this, key, {
        value,
        writable: true
      });
    }
  }
  catch(fn) {
    this.options.catch.push(fn);
    return this;
  }
  emit(...args) {
    if (this.registrar) {
      this.registrar.emit(...args);
    }
    return super.emit(...args);
  }
  middleware(value, callback) {
    this.options.middleware.push(value);
    return this;
  }
  then(fn) {
    this.options.then.push(fn);
    return this;
  }
  get middlewares() {
    return this.registrar.prioritized(this.options.middleware);
  }
  get registrar() {
    return this.options.registrar || new MiddlewareRegistry();
  }
}
let registrar = new MiddlewareRegistry();
function alias(...args) {
  return registrar.alias(...args);
}
function group(...args) {
  return registrar.group(...args);
}
function middleware(...args) {
  return registrar.middleware(...args);
}
function priority(...args) {
  return registrar.priority(...args);
}
function route(route2, options) {
  return new MiddlewareRoute(route2, Object.assign({
    registrar
  }, options));
}
export { MiddlewareRegistry, MiddlewareRoute, alias, group, middleware, priority, registrar, route };
