import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import type { Validator } from "./types";
export default class Middleware {
    readonly validator: Validator;
    readonly key: string;
    readonly args: string | any[];
    constructor(validator: Validator, key: string, args: string | any[]);
    static make(validator: Validator, key?: string, args?: any[]): Middleware;
    validate(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void>;
}
