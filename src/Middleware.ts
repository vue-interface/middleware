import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { ValidatorCallback } from './MiddlewareRoute';

export default class Middleware {    
    readonly args: string|any[];
    
    constructor(
        readonly validator: ValidatorCallback, readonly key?: string, args?: string|any[]) {
        this.validator = validator;
        this.args = typeof args === 'string'
            ? args.split(',')
            : [].concat(...args || []);
    }

    async validate(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
        return await this.validator(to, from, next, ...this.args);
    }
}