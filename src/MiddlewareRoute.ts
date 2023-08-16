import { Component, ComponentPublicInstance } from 'vue';
import type { NavigationGuardNext, RouteLocation, RouteLocationNormalized, RouteLocationRaw, RouteRecordRaw, _RouteRecordBase } from 'vue-router';
import MiddlewareRegistry from './MiddlewareRegistry';
import { validate } from './utils';

export type RouteRecordName = string | symbol;
export type ValidatorCallback = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext, ...args: (string|undefined)[]) => void;
export type ValidatorString = string;
export type Validator = ValidatorCallback | ValidatorString;

export type NavigationGuardReturn = void | Error | RouteLocationRaw | boolean | NavigationGuardNext;

export interface NavigationGuardWithThis<T> {
    (this: T, to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): NavigationGuardReturn | Promise<NavigationGuardReturn>;
}

export type ValidatorResponse = void | Error | RouteLocationRaw | boolean | ((vm: ComponentPublicInstance) => any) | string;

export type MiddlewarePromiseCallback = (promise: Promise<ValidatorResponse>, payload: MiddlewarePromiseCallbackPayload) => void;

export declare type MiddlewarePromiseCallbackPayload = {
    status?: ValidatorResponse,
    error?: Error,
    to: RouteLocationRaw,
    from: RouteLocationRaw,
    next: NavigationGuardNext
}

export type RouteRecordProps = boolean | Record<string, any> | ((to: RouteLocationNormalized) => Record<string, any>);

type Lazy<T> = () => Promise<T>;

type RawRouteComponent = RouteComponent | Lazy<RouteComponent>;

export type RouteComponent = Component;

abstract class MiddlewareRoute  {
    /**
     * Path of the record. Should start with `/` unless the record is the child of
     * another record.
     *
     * @example `/users/:id` matches `/users/1` as well as `/users/posva`.
     */
    path: string;

    /**
     * Array of nested routes.
     */
    children?: RouteRecordRaw['children'];

    /**
     * Aliases for the record. Allows defining extra paths that will behave like a
     * copy of the record. Allows having paths shorthands like `/users/:id` and
     * `/u/:id`. All `alias` and `path` values must share the same params.
     */
    alias?: RouteRecordRaw['alias'] = [];

    /**
     * Name for the route record.
     */
    name?: RouteRecordRaw['name'];

    /**
     * Before Enter guard specific to this record. Note `beforeEnter` has no
     * effect if the record has a `redirect` property.
     */
    beforeEnter?: RouteRecordRaw['beforeEnter'];
    
    /**
     * Arbitrary data attached to the record.
     */
    meta?: RouteRecordRaw['meta'];

    /**
     * The validators that should be ran before the route can resolve.
     */

    readonly validators: Validator[] = [];

    /**
     * The promise callbacks for the route resolver.
     */
    readonly callbacks: MiddlewarePromiseCallback[] = [];

    /**
     * Create the new middleware route instance.
     */
    constructor(
        readonly registry: MiddlewareRegistry,
        rawRoute: RouteRecordRaw
    ) {
        if(rawRoute.alias) {
            this.alias = Array.isArray(rawRoute.alias) ? rawRoute.alias : [rawRoute.alias];
        }

        this.path = rawRoute.path;
        this.children = rawRoute.children;
        this.name = rawRoute.name;
        this.beforeEnter = rawRoute.beforeEnter;
        this.meta = rawRoute.meta;

        this.beforeEnter = async(to, from, next) => {
            const promise = validate(this.middlewares, to, from);

            for(const method of this.callbacks) {
                method(promise, { to, from, next });
            }

            await promise.then(next).catch(e => {
                // Ignore the error by default.
            });
        };
    }

    get middlewares() {
        return this.registry.prioritized(this.validators);
    }

    /**
     * Add a middleware to the route.
     */
    middleware(...validators: Validator[]): this {
        for(const validator of validators.flat(1)) {
            this.validators.push(validator);
        }

        return this;
    }

    /**
     * Add a then handler to promise resolver.
     */
    catch(fn: (payload: MiddlewarePromiseCallbackPayload) => void): this {
        this.callbacks.push((promise, { to, from, next }) => {
            promise.catch(fn && (error => fn({ error, to, from, next })));
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
            );
        });

        return this;
    }

    /**
     * Add a finally handler to promise resolver.
     */
    finally(fn: (payload: MiddlewarePromiseCallbackPayload) => void): this {
        this.callbacks.push((promise, { to, from, next }) => {
            promise.finally(fn && (() => fn({ to, from, next })));
        });

        return this;
    }
}

/**
 * Route Record defining one single component with the `component` option.
 */
export interface RouteRecordSingleView extends _RouteRecordBase {
    /**
     * Component to display when the URL matches this route.
     */
    component: RawRouteComponent;
    components?: never;
    /**
     * Allow passing down params as props to the component rendered by `router-view`.
     */
    props?: RouteRecordProps;
}

export class MiddlewareRouteSingleView extends MiddlewareRoute implements RouteRecordSingleView {
    /**
     * Component to display when the URL matches this route.
     */
    component: RawRouteComponent;
    
    /**
     * Allow passing down params as props to the component rendered by `router-view`.
     */
    props?: RouteRecordProps;

    /**
     * Create the new middleware route instance.
     */
    constructor(
        registry: MiddlewareRegistry,
        rawRoute: RouteRecordSingleView
    ) {
        super(registry, rawRoute);

        this.component = rawRoute.component;
        this.props = rawRoute.props;
        this.path = rawRoute.path;
        this.name = rawRoute.name;
    }
}

/**
 * Route Record defining multiple named components with the `components` option.
 */
export interface RouteRecordMultipleViews extends _RouteRecordBase {
    /**
     * Components to display when the URL matches this route. Allow using named views.
     */
    components: Record<string, RawRouteComponent>;
    component?: never;

    /**
     * Allow passing down params as props to the component rendered by
     * `router-view`. Should be an object with the same keys as `components` or a
     * boolean to be applied to every component.
     */
    props?: Record<string, RouteRecordProps> | boolean;
}

export class MiddlewareRouteMultipleViews extends MiddlewareRoute implements RouteRecordMultipleViews {
    /**
     * Components to display when the URL matches this route. Allow using named views.
     */
    component?: never;
    components: Record<string, RawRouteComponent>;
    
    /**
     * Allow passing down params as props to the component rendered by
     * `router-view`. Should be an object with the same keys as `components` or a
     * boolean to be applied to every component.
     */
    props?: Record<string, RouteRecordProps> | boolean;

    /**
     * Create the new middleware route instance.
     */
    constructor(
        readonly registry: MiddlewareRegistry,
        readonly rawRoute: RouteRecordMultipleViews
    ) {
        super(registry, rawRoute);

        this.components = rawRoute.components;
        this.props = rawRoute.props;
        this.path = rawRoute.path;
        this.name = rawRoute.name;
    }
}

/**
 * Route Record that defines a redirect. Cannot have `component` or `components`
 * as it is never rendered.
 */
declare interface RouteRecordRedirect extends _RouteRecordBase {
    redirect: RouteRecordRedirectOption;
    component?: never;
    components?: never;
}

declare type RouteRecordRedirectOption = RouteLocationRaw | ((to: RouteLocation) => RouteLocationRaw);

export class MiddlewareRouteRecord extends MiddlewareRoute implements RouteRecordRedirect {
    redirect: RouteRecordRedirectOption;
    component?: never;
    components?: never;

    /**
     * Create the new middleware route instance.
     */
    constructor(
        readonly registry: MiddlewareRegistry,
        readonly rawRoute: RouteRecordRedirect
    ) {
        super(registry, rawRoute);

        this.redirect = rawRoute.redirect;
    }
}
