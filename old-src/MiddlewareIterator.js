import Middleware from './Middleware';
import Iterator from './Iterator';

export default class MiddlewareIterator extends Iterator {
    
    constructor(items, options) {
        super(items, Object.assign({
            cast: value => Middleware.make(value, {
                registrar: options && options.registrar
            })
        }, options));
    }
}