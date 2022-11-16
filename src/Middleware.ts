import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import type { Validator } from "./types";

export default class Middleware {
    readonly validator: Validator;

    readonly key: string;
    
    readonly args: string|any[];
    
    constructor(validator: Validator, key: string, args: string|any[]) {
        this.validator = validator;
        this.key = key;
        this.args = typeof args === 'string'
            ? args.split(',')
            : [].concat(...args || []);
    }

    static make(validator: Validator, key?: string, args?: any[]) {
        if(validator instanceof this) {
            return validator;
        }

        return new this(validator, key, args);
    }

    async validate(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
        return await this.validator(to, from, next, ...this.args);
    }
}