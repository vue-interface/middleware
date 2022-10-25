import type { ComponentPublicInstance } from 'vue';
import type { NavigationGuardNext, RouteLocationRaw, RouteLocationNormalized } from 'vue-router';

export declare type Alias = string;
export declare type Aliases = Alias[];
export declare type Validator = (to, from, next, ...args) => Promise<boolean>;
export declare type Validators = Validator[];
export declare type RouteRecordProps = boolean | Record<string, any> | ((to: RouteLocationNormalized) => Record<string, any>);
export declare type ValidatorResponse = void | Error | RouteLocationRaw | boolean | ((vm: ComponentPublicInstance) => any) | string;
export declare type NavigationGuardReturn = void | Error | RouteLocationRaw | boolean | NavigationGuardNext;
export declare type MiddlewarePromiseCallbackPayload = {
    status?: ValidatorResponse,
    error?: Error,
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
}
export declare type MiddlewarePromiseCallback = (promise: Promise<ValidatorResponse>, payload: MiddlewarePromiseCallbackPayload) => void;
export declare type PromiseCallbacks = MiddlewarePromiseCallback[]