var p = Object.defineProperty;
var g = (e, i, r) => i in e ? p(e, i, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[i] = r;
var a = (e, i, r) => (g(e, typeof i != "symbol" ? i + "" : i, r), r);
class u {
  constructor(i, r, t) {
    a(this, "validator");
    a(this, "key");
    a(this, "args");
    this.validator = i, this.key = r, this.args = typeof t == "string" ? t.split(",") : [].concat(...t || []);
  }
  static make(i, r, t) {
    return i instanceof this ? i : new this(i, r, t);
  }
  async validate(i, r, t) {
    return await this.validator(i, r, t, ...this.args);
  }
}
function w(e) {
  var i = [];
  return f(e, i), i;
}
function f(e, i) {
  for (var r = 0; r < e.length; r++) {
    var t = e[r];
    Array.isArray(t) ? f(t, i) : i.push(t);
  }
}
class y {
  constructor() {
    a(this, "aliases");
    a(this, "groups");
    a(this, "middlewares", []);
    a(this, "priorities", []);
    this.aliases = /* @__PURE__ */ new Map(), this.middlewares = [], this.groups = /* @__PURE__ */ new Map(), this.priorities = [];
  }
  alias(i, r) {
    return this.aliases.set(i, r), this;
  }
  group(i, r) {
    return this.groups.set(i, r), this;
  }
  middleware(i) {
    return this.middlewares.push(i), this;
  }
  priority(...i) {
    return this.priorities = [].concat(...i), this;
  }
  prioritize(...i) {
    return [].concat(...i).sort((r, t) => {
      let s = this.priorities.indexOf(r.key || r.validator), n = this.priorities.indexOf(t.key || t.validator);
      return s > -1 && n > -1 ? s < n ? -1 : 1 : s > -1 ? -1 : 1;
    });
  }
  resolve(...i) {
    return w([].concat(...i).map((r) => {
      if (Array.isArray(r))
        return this.resolve(r);
      if (typeof r == "function")
        return u.make(r);
      const [t, s] = this.definition(r);
      if (this.aliases.has(t))
        return u.make(this.aliases.get(t), t, s);
      if (this.groups.has(t))
        return this.resolve(this.groups.get(t));
    }));
  }
  definition(i) {
    const [r, t] = String(i).split(":");
    return [
      r,
      t ? t.split(".") : []
    ];
  }
  prioritized(...i) {
    return this.prioritize(this.resolve([
      ...this.middlewares,
      ...i
    ]).filter((r) => r instanceof u));
  }
}
function m(e, i, r) {
  return new Promise(async (t, s) => {
    const n = [...e];
    return function o(h) {
      const d = n.shift();
      return d ? d.validate(i, r, (l) => {
        l instanceof Error ? s(l) : l === !1 ? s(new Error(`Cancelling navigation to ${i.path}!`)) : [!0, void 0].includes(l) ? o(l) : t(l);
      }) : t(h);
    }();
  });
}
class k {
  constructor(i, r) {
    a(this, "beforeEnter");
    a(this, "validators", []);
    a(this, "callbacks", []);
    this.registry = i, this.rawRoute = r;
    for (const [t, s] of Object.entries(r))
      this[t] = s;
    this.beforeEnter = async (t, s, n) => {
      const o = m(this.middlewares, t, s);
      for (const h of this.callbacks)
        h(o, { to: t, from: s, next: n });
      await o.then(n).catch((h) => {
      });
    };
  }
  get middlewares() {
    return this.registry.prioritized(this.validators);
  }
  middleware(i) {
    return this.validators.push(i), this;
  }
  catch(i) {
    return this.callbacks.push((r, { to: t, from: s, next: n }) => {
      r.catch(i && ((o) => i({ error: o, to: t, from: s, next: n })));
    }), this;
  }
  then(i, r) {
    return this.callbacks.push((t, { to: s, from: n, next: o }) => {
      t.then(
        i && ((h) => i({ status: h, to: s, from: n, next: o })),
        r && ((h) => r({ error: h, to: s, from: n, next: o }))
      );
    }), this;
  }
  finally(i) {
    return this.callbacks.push((r, { to: t, from: s, next: n }) => {
      r.finally(i && (() => i({ to: t, from: s, next: n })));
    }), this;
  }
}
let c = new y();
function b(e, i) {
  return c.alias(e, i);
}
function M(e, i) {
  return c.group(e, i);
}
function z(e) {
  return c.middleware(e);
}
function A(...e) {
  return c.priority(...e);
}
function E(e) {
  return new k(c, e);
}
export {
  u as Middleware,
  y as MiddlewareRegistry,
  k as MiddlewareRoute,
  b as alias,
  M as group,
  z as middleware,
  A as priority,
  c as registrar,
  E as route
};
