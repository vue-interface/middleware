import MiddlewareIterator from "./MiddlewareIterator";

export default class MiddlewareGroup {

    constructor(middlewares, options) {
        this.options = Object.assign({}, options || {});
        this.registrar = this.options.registrar;
        this.middlewares = middlewares;
    }

    get middlewares() {
        return this.$middlewares;
    }

    set middlewares(value) {
        this.$middlewares = MiddlewareIterator.make(value, {
            registrar: this.registrar
        });;
    }

    get length() {
        return this.middlewares.length;
    }

    get validator() {
        return (...args) => this.validate(...args);
    }

    validate(to, from, next) {
        return this.middlewares.validate(to, from, next).then(() => true);
    }

    static make(subject, ...args) {
        if(subject instanceof this) {
            return subject;
        }

        return new this(subject, ...args);
    }

}