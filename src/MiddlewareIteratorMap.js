import MiddlewareIterator from "./MiddlewareIterator";
import MiddlewareMap from "./MiddlewareMap";

export default class MiddlewareIteratorMap extends MiddlewareMap {

    set(key, values) {
        return super.set(key, new MiddlewareIterator(values, this.options));
    }
    
}
    
Object.getOwnPropertyNames(Array.prototype)
    .filter(prop => typeof Array.prototype[prop] === 'function')
    .filter(prop => MiddlewareIteratorMap.prototype[prop] === undefined)
    .map(prop => {
        MiddlewareIteratorMap.prototype[prop] = function(key, ...args) {
            if(!this.get(key)) {
                this.set(key);
            }

            return this.get(key)[prop](...args);
        };
    });