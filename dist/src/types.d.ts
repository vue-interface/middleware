import type { ComponentPublicInstance } from 'vue';
import type { NavigationGuardNext, RouteLocationRaw } from '../../../../../../../node_modules/vue-router/dist/vue-router.cjs';

export declare type Alias = string;
export declare type Aliases = Alias[];
export declare type Validator = (to, from, next, ...args) => void;
export declare type Validators = (string|Validator)[];
export declare type RouteRecordProps = boolean | Record<string, any> | ((to: RouteLocationRaw) => Record<string, any>);
export declare type ValidatorResponse = void | Error | RouteLocationRaw | boolean | ((vm: ComponentPublicInstance) => any) | string;
export declare type NavigationGuardReturn = void | Error | RouteLocationRaw | boolean | NavigationGuardNext;
export declare type MiddlewarePromiseCallbackPayload = {
    status?: ValidatorResponse,
    error?: Error,
    to: RouteLocationRaw,
    from: RouteLocationRaw,
    next: NavigationGuardNext
}
export declare type MiddlewarePromiseCallback = (promise: Promise<ValidatorResponse>, payload: MiddlewarePromiseCallbackPayload) => void;
export declare type PromiseCallbacks = MiddlewarePromiseCallback[]
export declare type Group = (string|Validator)[];