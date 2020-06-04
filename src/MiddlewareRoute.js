import MiddlewareIterator from './MiddlewareIterator';
import EventEmitter from './EventEmitter';

export default class Route extends EventEmitter {

    constructor(route, options) {
        super();
        
        this.options = Object.assign({}, options || {});
        this.registrar = this.options.registrar;
        this.middlewares = [];

        if(typeof route === 'string') {
            route = {path: route};
        }

        if(typeof route !== 'object') {
            throw Error('Must be instantiated with a string or object.');
        }

        this.intializeBeforeEnter(route);
        this.initializeRoute(route);
    }

    initializeRoute(route) {
        for(const [key, value] of Object.entries(route)) {
            if(typeof this[key] === 'function') {
                this[key](...(Array.isArray(value) ? value : [value]));
            }
            else {
                Object.defineProperty(this, key, {
                    value,
                    writable: true
                });
            }
        }
    }

    intializeBeforeEnter(route) {
        this.beforeEnter = (to, from, next) => {
            this.middlewaresWithGlobal.validate(to, from, next)
                .then(() => {
                    if(typeof route.beforeEnter === 'function') {
                        return route.beforeEnter(to, from, next);
                    }

                    this.emit('valid', to, from, next);
                
                    next();
                }, e => {
                    this.emit('error', e, next);
                });
        };   
    }

    set middlewares(value) {
        if(!(value instanceof MiddlewareIterator)) {
            value = new MiddlewareIterator(value, {
                registrar: this.registrar
            });
        }

        this.$middlewares = value;
    }

    get middlewares() {
        return this.$middlewares;        
    }
    
    get middlewaresWithGlobal() {
        const middlewares = [
            ...this.$middlewares,
            ...this.registrar ? this.registrar.registry.middleware : []
        ];

        const iterator = new MiddlewareIterator(middlewares, {
            registrar: this.registrar
        });
        
        const prioritized = iterator.prioritize(
            Array.from(this.registrar ? this.registrar.registry.priority : [])
        );

        return new MiddlewareIterator(prioritized, {
            registrar: this.registrar
        });
    }

    emit(...args) {
        if(this.registrar) {
            this.registrar.emit(...args);
        }
        
        return super.emit(...args);
    }

    middleware(...values) {
        values.forEach(value => {
            if(!Array.isArray(value)) {
                value = [value];
            }
        
            value.forEach(value => this.middlewares.push(value));
        });
        
        return this;
    }
    
    onValid(fn) {
        return this.on('valid', fn);
    }
    
    onError(fn) {
        return this.on('error', fn);
    }

    static make(subject, ...args) {
        if(subject instanceof this) {
            return subject;
        }

        return new this(subject, ...args);
    }
}