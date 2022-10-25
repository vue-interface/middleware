import type { NavigationGuardNext, RouteRecord } from "vue-router";
import type { Validator } from "./types";
export default class Middleware {
    readonly validator: Validator;
    readonly key: string;
    readonly args: string | any[];
    constructor(validator: Validator, key: string, args: string | any[]);
    static make(validator: Validator, key?: string, args?: any[]): Middleware;
    validate(to: RouteRecord, from: RouteRecord, next: NavigationGuardNext): Promise<boolean>;
}
