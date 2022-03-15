import EventEmitter from "./EventEmitter";
import Middleware from "./Middleware";
import MiddlewareRegistry from "./MiddlewareRegistry";
import { validate } from "./utils";

export default class MiddlewareRoute extends EventEmitter {

    constructor(route, options) {
        super();
        
        this.options = Object.assign({
            catch: [],
            middleware: [],
            registrar: new MiddlewareRegistry,
            then: []
        }, options);     

        if(!(this.registrar instanceof MiddlewareRegistry)) {
            throw Error('The `registrar` property must be an instance of MiddlewareRegistry');
        }

        this.intializeBeforeEnter();
        this.initializeRoute(route);
    }

    intializeBeforeEnter() {
        this.beforeEnter = async(to, from, next) => {
            const promise = validate(
                this.middlewares, to, from, next
            ).then(response => {
                next();
                
                if(response && this.options.then.length) {
                    this.options.then.reduce((promise, fn) => {
                        return promise.then(() => fn(to, from, next));
                    }, promise);
                }
            });

            if(this.options.catch.length) {
                this.options.catch.reduce((promise, fn) => {
                    return promise.catch(e => fn(e, to, from, next));
                }, promise);
            }
        };   
    }

    initializeRoute(route) {
        if(typeof route === 'string') {
            route = {path: route};
        }

        for(const [key, value] of Object.entries(route)) {
            Object.defineProperty(this, key, {
                value,
                writable: true
            });
        }
    }

    catch(fn) {
        this.options.catch.push(fn);

        return this;
    }

    emit(...args) {
        if(this.registrar) {
            this.registrar.emit(...args);
        }
        
        return super.emit(...args);
    }

    middleware(value, callback) {
        this.options.middleware.push(value);

        return this;
    }

    then(fn) {
        this.options.then.push(fn);

        return this;
    }

    get middlewares() {
        return this.registrar.prioritized(this.options.middleware);
    }

    get registrar() {
        return this.options.registrar || new MiddlewareRegistry();
    }
    
}