import Middleware from './Middleware';
import { Validator, ValidatorCallback } from './MiddlewareRoute';

export declare type Alias = string;
export declare type Group = (string|Validator)[];

export default class MiddlewareRegistry {

    protected aliases: Map<string,ValidatorCallback>;

    protected groups: Map<string,any>;

    protected middlewares: Middleware[] = [];

    protected priorities: Validator[] = [];

    constructor() {
        this.aliases = new Map;
        this.middlewares = [];
        this.groups = new Map;
        this.priorities = [];
    }

    alias(key: string, value: ValidatorCallback) {
        this.aliases.set(key, value);

        return this;
    }

    group(key: string, value: Group) {
        this.groups.set(key, value);

        return this;
    }

    middleware(value: Middleware): this {
        this.middlewares.push(value);

        return this;
    }

    priority(priority: Validator[]): this {
        this.priorities = priority;

        return this;
    }
    
    prioritize(subject: Middleware[]): Middleware[] {
        return subject.sort((a, b) => {
            const aIndex = this.priorities.indexOf(a.key || a.validator),
                bIndex = this.priorities.indexOf(b.key || b.validator);

            if(aIndex > -1 && bIndex > -1) {
                return aIndex < bIndex ? -1 : 1;
            }
    
            return aIndex > -1 ? -1 : 1;
        }); 
    }

    resolve(subjects: (Middleware|Validator)[]): Middleware[] {
        return subjects.map(value => {
            if(value instanceof Middleware) {
                return value;
            }
            
            if(typeof value === 'function') {
                return new Middleware(value);
            }

            const [ key, args ] = this.definition(value);
        
            const alias = this.aliases.get(key);

            if(alias) {
                return new Middleware(alias, key, args);
            }
            
            return this.resolve(this.groups.get(key));
        }).flat(1);
    }

    definition(value: string): [string, string[]] {
        const [ key, args ] = value.split(':');

        return [
            key, args ? args.split('.') : []
        ];
    }

    prioritized(validators: Validator[]): Middleware[] {
        const resolved = this.resolve([
            ...this.middlewares,
            ...validators
        ]).filter(value => value instanceof Middleware);

        return this.prioritize(resolved);
    }

}