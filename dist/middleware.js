var u = Object.defineProperty;
var m = (t, e, i) => e in t ? u(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i;
var r = (t, e, i) => (m(t, typeof e != "symbol" ? e + "" : e, i), i);
class d {
  constructor(e, i, s) {
    r(this, "args");
    this.validator = e, this.key = i, this.validator = e, this.args = typeof s == "string" ? s.split(",") : [].concat(...s || []);
  }
  async validate(e, i, s) {
    return await this.validator(e, i, s, ...this.args);
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
  alias(e, i) {
    return this.aliases.set(e, i), this;
  }
  group(e, i) {
    return this.groups.set(e, i), this;
  }
  middleware(e) {
    return this.middlewares.push(e), this;
  }
  priority(e) {
    return this.priorities = e, this;
  }
  prioritize(e) {
    return e.sort((i, s) => {
      const n = this.priorities.indexOf(i.key || i.validator), o = this.priorities.indexOf(s.key || s.validator);
      return n > -1 && o > -1 ? n < o ? -1 : 1 : n > -1 ? -1 : 1;
    });
  }
  resolve(e) {
    return e.map((i) => {
      if (i instanceof d)
        return i;
      if (typeof i == "function")
        return new d(i);
      const [s, n] = this.definition(i), o = this.aliases.get(s);
      return o ? new d(o, s, n) : this.resolve(this.groups.get(s));
    }).flat(1);
  }
  definition(e) {
    const [i, s] = e.split(":");
    return [
      i,
      s ? s.split(".") : []
    ];
  }
  prioritized(e) {
    const i = this.resolve([
      ...this.middlewares,
      ...e
    ]).filter((s) => s instanceof d);
    return this.prioritize(i);
  }
}
function w(t, e, i) {
  return new Promise(async (s, n) => {
    const o = [...t];
    return function a(l) {
      const f = o.shift();
      return f ? f.validate(e, i, (h) => {
        h instanceof Error ? n(h) : h === !1 ? n(new Error(`Cancelling navigation to ${e.path}!`)) : [!0, void 0].includes(h) ? a(h) : s(h);
      }) : s(l);
    }();
  });
}
class p {
  /**
   * Create the new middleware route instance.
   */
  constructor(e, i) {
    /**
     * Path of the record. Should start with `/` unless the record is the child of
     * another record.
     *
     * @example `/users/:id` matches `/users/1` as well as `/users/posva`.
     */
    r(this, "path");
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
    this.registry = e, i.alias && (this.alias = Array.isArray(i.alias) ? i.alias : [i.alias]), this.path = i.path, this.name = i.name, this.beforeEnter = i.beforeEnter, this.meta = i.meta, this.beforeEnter = async (s, n, o) => {
      const a = w(this.middlewares, s, n);
      for (const l of this.callbacks)
        l(a, { to: s, from: n, next: o });
      await a.then(o).catch((l) => {
      });
    };
  }
  get middlewares() {
    return this.registry.prioritized(this.validators);
  }
  /**
   * Add a middleware to the route.
   */
  middleware(...e) {
    for (const i of e.flat(1))
      this.validators.push(i);
    return this;
  }
  /**
   * Add a then handler to promise resolver.
   */
  catch(e) {
    return this.callbacks.push((i, { to: s, from: n, next: o }) => {
      i.catch(e && ((a) => e({ error: a, to: s, from: n, next: o })));
    }), this;
  }
  /**
   * Add a then handler to promise resolver.
   */
  then(e, i) {
    return this.callbacks.push((s, { to: n, from: o, next: a }) => {
      s.then(
        e && ((l) => e({ status: l, to: n, from: o, next: a })),
        i && ((l) => i({ error: l, to: n, from: o, next: a }))
      );
    }), this;
  }
  /**
   * Add a finally handler to promise resolver.
   */
  finally(e) {
    return this.callbacks.push((i, { to: s, from: n, next: o }) => {
      i.finally(e && (() => e({ to: s, from: n, next: o })));
    }), this;
  }
}
class y extends p {
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
    this.component = s.component, this.props = s.props;
  }
}
class v extends p {
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
     * Nested route records.
     */
    r(this, "children");
    /**
     * Allow passing down params as props to the component rendered by `router-view`.
     */
    r(this, "props");
    this.component = s.component, this.children = s.children, this.props = s.props;
  }
}
class M extends p {
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
    this.registry = i, this.rawRoute = s, this.components = s.components, this.props = s.props;
  }
}
class b extends p {
  /**
   * Create the new middleware route instance.
   */
  constructor(i, s) {
    super(i, s);
    /**
     * Components to display when the URL matches this route. Allow using named views.
     */
    r(this, "components");
    r(this, "component");
    r(this, "children");
    /**
     * Allow passing down params as props to the component rendered by
     * `router-view`. Should be an object with the same keys as `components` or a
     * boolean to be applied to every component.
     */
    r(this, "props");
    this.registry = i, this.rawRoute = s, this.components = s.components, this.children = s.children, this.props = s.props;
  }
}
class k extends p {
  /**
   * Create the new middleware route instance.
   */
  constructor(i, s) {
    super(i, s);
    r(this, "redirect");
    this.registry = i, this.rawRoute = s, this.redirect = s.redirect;
  }
}
const c = new g();
function E(t, e) {
  return c.alias(t, e);
}
function z(t, e) {
  return c.group(t, e);
}
function V(t) {
  return c.middleware(t);
}
function C(t) {
  return c.priority(t);
}
function I(t) {
  if (t.children && t.components)
    return new b(c, t);
  if (t.children && t.component)
    return new v(c, t);
  if (!t.children && t.components)
    return new M(c, t);
  if (!t.children && t.component)
    return new y(c, t);
  if (!t.children && t.redirect)
    return new k(c, t);
  throw new Error("Invalid route!");
}
export {
  d as Middleware,
  g as MiddlewareRegistry,
  E as alias,
  z as group,
  V as middleware,
  C as priority,
  c as registrar,
  I as route
};
//# sourceMappingURL=middleware.js.map
