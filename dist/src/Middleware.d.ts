import type { NavigationGuardNext, RouteLocationNormalized } from '../../../../../../../node_modules/vue-router/dist/vue-router.cjs';
import { ValidatorCallback } from './MiddlewareRoute';
export default class Middleware {
    readonly validator: ValidatorCallback;
    readonly key?: string | undefined;
    readonly args: string | any[];
    constructor(validator: ValidatorCallback, key?: string | undefined, args?: string | any[]);
    validate(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void>;
}
