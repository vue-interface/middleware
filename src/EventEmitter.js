import { qualifyCallbackKey } from "./utils";

export default class EventEmitter {

    set callbacks(callbacks) {
        this.$callbacks = callbacks;
    }

    get callbacks() {
        if(!this.$callbacks) {
            this.callbacks = {};
        }

        return this.$callbacks;
    }

    on(key, fn) {
        if(typeof fn !== 'function') {
            throw new Error('Callback must be an instance of a `Function`.');
        }
        
        key = qualifyCallbackKey(key);

        if(this.callbacks[key] === undefined) {
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

        if(index > -1) {
            this.callbacks[key].splice(index, 1);
        }

        return this;
    }
    
    emit(key, ...args) {
        key = qualifyCallbackKey(key);

        if(this.callbacks[key]) {
            [].concat(this.callbacks[key]).forEach(fn => fn(...args));
        }

        return this;
    }

}