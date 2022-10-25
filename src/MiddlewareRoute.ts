import type { NavigationGuardWithThis, RouteRecordRaw } from "vue-router";
import MiddlewareRegistry from "./MiddlewareRegistry";
import { MiddlewarePromiseCallback, MiddlewarePromiseCallbackPayload, Validator, Validators } from './types';
import { validate } from "./utils";

export default class MiddlewareRoute {

    /**
     * Before Enter guard specific to this record. Note `beforeEnter` has no
     * effect if the record has a `redirect` property.
     */
    public beforeEnter?: NavigationGuardWithThis<undefined> | NavigationGuardWithThis<undefined>[];

    /**
     * The validators that should be ran before the route can resolve.
     */

    readonly validators: Validators = [];

    /**
     * The promise callbacks for the route resolver.
     */
    readonly callbacks: MiddlewarePromiseCallback[] = []

    /**
     * Create the new middleware route instance.
     */
    constructor(
        readonly registry: MiddlewareRegistry,
        readonly rawRoute: RouteRecordRaw
    ) {
        for(const [key, value] of Object.entries(rawRoute)) {
            this[key] = value;
        }

        this.beforeEnter = async(to, from, next) => {
            const promise = validate(this.middlewares, to, from);

            for(const method of this.callbacks) {
                method(promise, { to, from, next});
            }

            await promise.then(next).catch(e => {
                // Ignore the error by default.
            });
        }
    }

    get middlewares() {
        return this.registry.prioritized(this.validators);
    }

    /**
     * Add a middleware to the route.
     */
    middleware(validator: Validator): this {
        this.validators.push(validator);

        return this;
    }

    /**
     * Add a then handler to promise resolver.
     */
    catch(fn: (payload: MiddlewarePromiseCallbackPayload) => void): this {
        this.callbacks.push((promise, { to, from, next }) => {
            promise.catch(fn && (error => fn({ error, to, from, next })))
        });

        return this;
    }

    /**
     * Add a then handler to promise resolver.
     */
    then(fn: (payload: MiddlewarePromiseCallbackPayload) => void, catchFn?: (payload: MiddlewarePromiseCallbackPayload) => void): this {
        this.callbacks.push((promise, { to, from, next }) => {
            promise.then(
                fn && (status => fn({ status, to, from, next })),
                catchFn && (error => catchFn({ error, to, from, next }))
            )
        });

        return this;
    }

    /**
     * Add a finally handler to promise resolver.
     */
    finally(fn: (payload: MiddlewarePromiseCallbackPayload) => void): this {
        this.callbacks.push((promise, { to, from, next }) => {
            promise.finally(fn && (() => fn({ to, from, next })))
        });

        return this;
    }
}