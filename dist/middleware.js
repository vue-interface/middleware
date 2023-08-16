var f = Object.defineProperty;
var m = (e, t, i) => t in e ? f(e, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[t] = i;
var r = (e, t, i) => (m(e, typeof t != "symbol" ? t + "" : t, i), i);
import "camel-case";
class p {
  constructor(t, i, s) {
    r(this, "args");
    this.validator = t, this.key = i, this.validator = t, this.args = typeof s == "string" ? s.split(",") : [].concat(...s || []);
  }
  async validate(t, i, s) {
    return await this.validator(t, i, s, ...this.args);
  }
}
class g {
  constructor() {
    r(this, "aliases");
    r(this, "groups");
    r(this, "middlewares", []);
    r(this, "priorities", []);
    this.aliases = /* @__PURE__ */ new Map(), this.middlewares = [], this.groups = /* @__PURE__ */ new Map(), this.priorities = [];
  }
  alias(t, i) {
    return this.aliases.set(t, i), this;
  }
  group(t, i) {
    return this.groups.set(t, i), this;
  }
  middleware(t) {
    return this.middlewares.push(t), this;
  }
  priority(t) {
    return this.priorities = t, this;
  }
  prioritize(t) {
    return t.sort((i, s) => {
      const n = this.priorities.indexOf(i.key || i.validator), a = this.priorities.indexOf(s.key || s.validator);
      return n > -1 && a > -1 ? n < a ? -1 : 1 : n > -1 ? -1 : 1;
    });
  }
  resolve(t) {
    return t.map((i) => {
      if (i instanceof p)
        return i;
      if (typeof i == "function")
        return new p(i);
      const [s, n] = this.definition(i), a = this.aliases.get(s);
      return a ? new p(a, s, n) : this.resolve(this.groups.get(s));
    }).flat(1);
  }
  definition(t) {
    const [i, s] = t.split(":");
    return [
      i,
      s ? s.split(".") : []
    ];
  }
  prioritized(t) {
    const i = this.resolve([
      ...this.middlewares,
      ...t
    ]).filter((s) => s instanceof p);
    return this.prioritize(i);
  }
}
function y(e, t, i) {
  return new Promise(async (s, n) => {
    const a = [...e];
    return function o(h) {
      const u = a.shift();
      return u ? u.validate(t, i, (c) => {
        c instanceof Error ? n(c) : c === !1 ? n(new Error(`Cancelling navigation to ${t.path}!`)) : [!0, void 0].includes(c) ? o(c) : s(c);
      }) : s(h);
    }();
  });
}
class d {
  /**
   * Create the new middleware route instance.
   */
  constructor(t, i) {
    /**
     * Path of the record. Should start with `/` unless the record is the child of
     * another record.
     *
     * @example `/users/:id` matches `/users/1` as well as `/users/posva`.
     */
    r(this, "path");
    /**
     * Array of nested routes.
     */
    r(this, "children");
    /**
     * Aliases for the record. Allows defining extra paths that will behave like a
     * copy of the record. Allows having paths shorthands like `/users/:id` and
     * `/u/:id`. All `alias` and `path` values must share the same params.
     */
    r(this, "alias", []);
    /**
     * Name for the route record.
     */
    r(this, "name");
    /**
     * Before Enter guard specific to this record. Note `beforeEnter` has no
     * effect if the record has a `redirect` property.
     */
    r(this, "beforeEnter");
    /**
     * Arbitrary data attached to the record.
     */
    r(this, "meta");
    /**
     * The validators that should be ran before the route can resolve.
     */
    r(this, "validators", []);
    /**
     * The promise callbacks for the route resolver.
     */
    r(this, "callbacks", []);
    this.registry = t, i.alias && (this.alias = Array.isArray(i.alias) ? i.alias : [i.alias]), this.path = i.path, this.children = i.children, this.name = i.name, this.beforeEnter = i.beforeEnter, this.meta = i.meta, this.beforeEnter = async (s, n, a) => {
      const o = y(this.middlewares, s, n);
      for (const h of this.callbacks)
        h(o, { to: s, from: n, next: a });
      await o.then(a).catch((h) => {
      });
    };
  }
  get middlewares() {
    return this.registry.prioritized(this.validators);
  }
  /**
   * Add a middleware to the route.
   */
  middleware(...t) {
    for (const i of t.flat(1))
      this.validators.push(i);
    return this;
  }
  /**
   * Add a then handler to promise resolver.
   */
  catch(t) {
    return this.callbacks.push((i, { to: s, from: n, next: a }) => {
      i.catch(t && ((o) => t({ error: o, to: s, from: n, next: a })));
    }), this;
  }
  /**
   * Add a then handler to promise resolver.
   */
  then(t, i) {
    return this.callbacks.push((s, { to: n, from: a, next: o }) => {
      s.then(
        t && ((h) => t({ status: h, to: n, from: a, next: o })),
        i && ((h) => i({ error: h, to: n, from: a, next: o }))
      );
    }), this;
  }
  /**
   * Add a finally handler to promise resolver.
   */
  finally(t) {
    return this.callbacks.push((i, { to: s, from: n, next: a }) => {
      i.finally(t && (() => t({ to: s, from: n, next: a })));
    }), this;
  }
}
class w extends d {
  /**
   * Create the new middleware route instance.
   */
  constructor(i, s) {
    super(i, s);
    /**
     * Component to display when the URL matches this route.
     */
    r(this, "component");
    /**
     * Allow passing down params as props to the component rendered by `router-view`.
     */
    r(this, "props");
    this.component = s.component, this.props = s.props, this.path = s.path, this.name = s.name;
  }
}
class v extends d {
  /**
   * Create the new middleware route instance.
   */
  constructor(i, s) {
    super(i, s);
    /**
     * Components to display when the URL matches this route. Allow using named views.
     */
    r(this, "component");
    r(this, "components");
    /**
     * Allow passing down params as props to the component rendered by
     * `router-view`. Should be an object with the same keys as `components` or a
     * boolean to be applied to every component.
     */
    r(this, "props");
    this.registry = i, this.rawRoute = s, this.components = s.components, this.props = s.props, this.path = s.path, this.name = s.name;
  }
}
class b extends d {
  /**
   * Create the new middleware route instance.
   */
  constructor(i, s) {
    super(i, s);
    r(this, "redirect");
    r(this, "component");
    r(this, "components");
    this.registry = i, this.rawRoute = s, this.redirect = s.redirect;
  }
}
const l = new g();
function x(e, t) {
  return l.alias(e, t);
}
function E(e, t) {
  return l.group(e, t);
}
function z(e) {
  return l.middleware(e);
}
function A(e) {
  return l.priority(e);
}
function I(e) {
  return e.component ? new w(l, e) : e.components ? new v(l, e) : new b(l, e);
}
export {
  p as Middleware,
  g as MiddlewareRegistry,
  x as alias,
  E as group,
  z as middleware,
  A as priority,
  l as registrar,
  I as route
};
//# sourceMappingURL=middleware.js.map
