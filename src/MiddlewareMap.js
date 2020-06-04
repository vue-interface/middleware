import Middleware from "./Middleware";

export default class MiddlewareMap extends Map {

    constructor(iterable, options) {
        super();
        
        this.options = Object.assign({}, options || {});
        
        if(iterable === undefined) {
            iterable = [];
        }
        else if(Symbol.iterator in Object(iterable)) {
            iterable = Array.from(iterable);
        }
        else if(typeof iterable === 'object') {
            iterable = Object.entries(iterable);
        }

        if(!Array.isArray(iterable) || iterable.length && !Array.isArray(iterable[0])) {
            throw new Error('Must pass an iterable or object of key/value pairs.');
        }

        iterable.forEach(([key, value]) => {
            this.set(key, value);
        });
    }

    set(key, value) {
        value = this.options.cast ? this.options.cast(value) : value;

        return super.set(key, value);
    }

    static make(subject, ...args) {
        if(subject instanceof this) {
            return subject;
        }

        return new this(subject, ...args);
    }

}
    