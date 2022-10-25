var p = Object.defineProperty;
var g = (e, t, r) => t in e ? p(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var a = (e, t, r) => (g(e, typeof t != "symbol" ? t + "" : t, r), r);
class u {
  constructor(t, r, i) {
    a(this, "validator");
    a(this, "key");
    a(this, "args");
    this.validator = t, this.key = r, this.args = typeof i == "string" ? i.split(",") : [].concat(...i || []);
  }
  static make(t, r, i) {
    return t instanceof this ? t : new this(t, r, i);
  }
  async validate(t, r, i) {
    return await this.validator(t, r, i, ...this.args);
  }
}
function w(e) {
  var t = [];
  return f(e, t), t;
}
function f(e, t) {
  for (var r = 0; r < e.length; r++) {
    var i = e[r];
    Array.isArray(i) ? f(i, t) : t.push(i);
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
  alias(t, r) {
    return this.aliases.set(t, r), this;
  }
  group(t, r) {
    return this.groups.set(t, r), this;
  }
  middleware(t) {
    return this.middlewares.push(t), this;
  }
  priority(...t) {
    return this.priorities = [].concat(...t), this;
  }
  prioritize(...t) {
    return [].concat(...t).sort((r, i) => {
      let s = this.priorities.indexOf(r.key || r.validator), n = this.priorities.indexOf(i.key || i.validator);
      return s > -1 && n > -1 ? s < n ? -1 : 1 : s > -1 ? -1 : 1;
    });
  }
  resolve(...t) {
    return w([].concat(...t).map((r) => {
      if (Array.isArray(r))
        return this.resolve(r);
      if (typeof r == "function")
        return u.make(r);
      const [i, s] = this.definition(r);
      if (this.aliases.has(i))
        return u.make(this.aliases.get(i), i, ...s);
      if (this.groups.has(i))
        return this.resolve(this.groups.get(i));
    }));
  }
  definition(t) {
    const [r, i] = String(t).split(":");
    return [
      r,
      i ? i.split(".") : []
    ].filter((s) => !!s);
  }
  prioritized(...t) {
    return this.prioritize(this.resolve([
      ...this.middlewares,
      ...t
    ]).filter((r) => r instanceof u));
  }
}
function m(e, t, r) {
  return new Promise(async (i, s) => {
    const n = [...e];
    return function o(h) {
      const d = n.shift();
      return d ? d.validate(t, r, (c) => {
        c instanceof Error ? s(c) : c === !1 ? s(new Error(`Cancelling navigation to ${t.path}!`)) : o(c);
      }) : i(h);
    }();
  });
}
class k {
  constructor(t, r) {
    a(this, "beforeEnter");
    a(this, "validators", []);
    a(this, "callbacks", []);
    this.registry = t, this.rawRoute = r;
    for (const [i, s] of Object.entries(r))
      this[i] = s;
    this.beforeEnter = async (i, s, n) => {
      const o = m(this.middlewares, i, s);
      for (const h of this.callbacks)
        h(o, { to: i, from: s, next: n });
      await o.then(n).catch((h) => {
      });
    };
  }
  get middlewares() {
    return this.registry.prioritized(this.validators);
  }
  middleware(t) {
    return this.validators.push(t), this;
  }
  catch(t) {
    return this.callbacks.push((r, { to: i, from: s, next: n }) => {
      r.catch(t && ((o) => t({ error: o, to: i, from: s, next: n })));
    }), this;
  }
  then(t, r) {
    return this.callbacks.push((i, { to: s, from: n, next: o }) => {
      i.then(
        t && ((h) => t({ status: h, to: s, from: n, next: o })),
        r && ((h) => r({ error: h, to: s, from: n, next: o }))
      );
    }), this;
  }
  finally(t) {
    return this.callbacks.push((r, { to: i, from: s, next: n }) => {
      r.finally(t && (() => t({ to: i, from: s, next: n })));
    }), this;
  }
}
let l = new y();
function b(...e) {
  return l.alias(...e);
}
function M(...e) {
  return l.group(...e);
}
function z(...e) {
  return l.middleware(...e);
}
function A(...e) {
  return l.priority(...e);
}
function E(e) {
  return new k(l, e);
}
export {
  u as Middleware,
  y as MiddlewareRegistry,
  k as MiddlewareRoute,
  b as alias,
  M as group,
  z as middleware,
  A as priority,
  l as registrar,
  E as route
};
