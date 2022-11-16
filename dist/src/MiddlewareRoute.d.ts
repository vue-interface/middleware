import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router";
import MiddlewareRegistry from "./MiddlewareRegistry";
import { MiddlewarePromiseCallback, MiddlewarePromiseCallbackPayload, Validator, Validators } from './types';
export default class MiddlewareRoute {
    readonly registry: MiddlewareRegistry;
    readonly rawRoute: RouteRecordRaw;
    /**
     * Before Enter guard specific to this record. Note `beforeEnter` has no
     * effect if the record has a `redirect` property.
     */
    beforeEnter?: NavigationGuardWithThis<undefined> | NavigationGuardWithThis<undefined>[];
    /**
     * The validators that should be ran before the route can resolve.
     */
    readonly validators: Validators;
    /**
     * The promise callbacks for the route resolver.
     */
    readonly callbacks: MiddlewarePromiseCallback[];
    /**
     * Create the new middleware route instance.
     */
    constructor(registry: MiddlewareRegistry, rawRoute: RouteRecordRaw);
    get middlewares(): import("./Middleware").default[];
    /**
     * Add a middleware to the route.
     */
    middleware(validator: string | Validator): this;
    /**
     * Add a then handler to promise resolver.
     */
    catch(fn: (payload: MiddlewarePromiseCallbackPayload) => void): this;
    /**
     * Add a then handler to promise resolver.
     */
    then(fn: (payload: MiddlewarePromiseCallbackPayload) => void, catchFn?: (payload: MiddlewarePromiseCallbackPayload) => void): this;
    /**
     * Add a finally handler to promise resolver.
     */
    finally(fn: (payload: MiddlewarePromiseCallbackPayload) => void): this;
}
