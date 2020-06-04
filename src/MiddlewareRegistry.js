import MiddlewareIterator from './MiddlewareIterator';
import MiddlewareMap from './MiddlewareMap';
import MiddlewareIteratorMap from './MiddlewareIteratorMap';
import Middleware from './Middleware';
import Iterator from './Iterator';
import MiddlewareGroup from './MiddlewareGroup';
import EventEmitter from './EventEmitter';

export default class MiddlewareRegistry extends EventEmitter {

    constructor(options = {}) {
        super();
        
        this.registry = {};
        this.reset(options);
    }
    
    reset(options = {}) {
        this.priority(options.priority || options.priorities);

        this.defineRegistry('middleware', options.middleware || options.middlewares, MiddlewareIterator, {
            prioritize: this.prioritize
        });
                
        this.defineRegistry('group', options.group || options.groups, MiddlewareIteratorMap, {
            cast: value => MiddlewareGroup.make(value)
        });

        this.defineRegistry('alias', options.alias || options.aliases, MiddlewareMap, {
            cast: value => Middleware.make(value)
        });
    }

    defineRegistry(key, value, cast, ...args) {
        this.registry[key] = new cast(value, ...args);

        return this;
    }

    middleware(...args) {
        return this.registry.middleware.push(...args);
    }

    alias(...args) {
        return this.registry.alias.set(...args);
    }

    group(...args) {
        return this.registry.group.set(...args);
    }

    priority(value) {
        return this.defineRegistry('priority', value, Iterator);
    }
    
}