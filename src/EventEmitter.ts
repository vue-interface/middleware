import { qualifyCallbackKey } from "./utils";

export default class EventEmitter {

    protected $callbacks: Map<string,((...args) => void)[]>

    set callbacks(callbacks: Map<string,((...args) => void)[]>) {
        this.$callbacks = callbacks;
    }

    get callbacks(): Map<string,((...args) => void)[]> {
        if(!this.$callbacks) {
            this.callbacks = new Map;
        }

        return this.$callbacks;
    }

    on(key: string, fn: (...args) => void) {
        if(typeof fn !== 'function') {
            throw new Error('Callback must be an instance of a `Function`.');
        }
        
        key = qualifyCallbackKey(key);

        if(this.callbacks.has(key)) {
            this.callbacks.set(key, [])
        }

        this.callbacks.get(key).push(fn);

        return this;
    }

    once(key, fn: (...args) => void) {
        key = qualifyCallbackKey(key);

        const wrapper = (...args) => {
            this.off(key, wrapper);

            fn(...args);
        };

        return this.on(key, wrapper);
    }

    off(key: string, fn: (...args) => void) {
        key = qualifyCallbackKey(key);

        const index = this.callbacks.has(key) && this.callbacks.get(key).indexOf(fn);

        if(index > -1) {
            this.callbacks.get(key).splice(index, 1);
        }

        return this;
    }
    
    emit(key: string, ...args) {
        key = qualifyCallbackKey(key);

        if(this.callbacks.has(key)) {
            [].concat(this.callbacks.get(key)).forEach(fn => fn(...args));
        }

        return this;
    }

}