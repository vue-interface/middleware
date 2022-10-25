import { flatten } from "array-flatten";
import Middleware from "./Middleware";

export default class MiddlewareRegistry {

    protected aliases: Map<string,any>;

    protected groups: Map<string,any>;

    protected middlewares = [];

    protected priorities = [];

    constructor() {
        this.aliases = new Map;
        this.middlewares = [];
        this.groups = new Map;
        this.priorities = [];
    }

    alias(key: string, value) {
        this.aliases.set(key, value);

        return this;
    }

    group(key: string, value) {
        this.groups.set(key, value);

        return this;
    }

    middleware(value) {
        this.middlewares.push(value);

        return this;
    }

    priority(...args) {
        this.priorities = [].concat(...args);

        return this;
    }
    
    prioritize(...args) {
        return [].concat(...args).sort((a, b) => {
            let aIndex = this.priorities.indexOf(a.key || a.validator),
                bIndex = this.priorities.indexOf(b.key || b.validator);

            if(aIndex > -1 && bIndex > -1) {
                return aIndex < bIndex ? -1 : 1;
            }
    
            return aIndex > -1 ? -1 : 1;
        }); 
    }

    resolve(...args) {
        return flatten([].concat(...args).map(value => {
            if(Array.isArray(value)) {
                return this.resolve(value);
            }

            if(typeof value === 'function') {
                return Middleware.make(value);
            }
        
            const [ key, args ] = this.definition(value);
        
            if(this.aliases.has(key)) {
                return Middleware.make(this.aliases.get(key), key, ...args);
            }
        
            if(this.groups.has(key)) {
                return this.resolve(this.groups.get(key));
            }
        }));
    }

    definition(value) {
        const [ key, args ] = String(value).split(':');

        return [
            key, args ? args.split('.') : []
        ].filter(value => !!value);
    }

    prioritized(...args) {
        return this.prioritize(this.resolve([
            ...this.middlewares,
            ...args,
        ]).filter(value => value instanceof Middleware));
    }

}