import { Component, ComponentPublicInstance } from 'vue';
import type { NavigationGuardNext, RouteLocationNormalized, RouteLocationRaw, RouteRecordRaw, RouteRecordRedirectOption, _RouteRecordBase } from '../../../../../../../node_modules/vue-router/dist/vue-router.cjs';
import MiddlewareRegistry from './MiddlewareRegistry';
export type RouteRecordName = string | symbol;
export type ValidatorCallback = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext, ...args: (string | undefined)[]) => void;
export type ValidatorString = string;
export type Validator = ValidatorCallback | ValidatorString;
export type NavigationGuardReturn = void | Error | RouteLocationRaw | boolean | NavigationGuardNext;
export interface NavigationGuardWithThis<T> {
    (this: T, to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): NavigationGuardReturn | Promise<NavigationGuardReturn>;
}
export type ValidatorResponse = void | Error | RouteLocationRaw | boolean | ((vm: ComponentPublicInstance) => any) | string;
export type MiddlewarePromiseCallback = (promise: Promise<ValidatorResponse>, payload: MiddlewarePromiseCallbackPayload) => void;
export declare type MiddlewarePromiseCallbackPayload = {
    status?: ValidatorResponse;
    error?: Error;
    to: RouteLocationRaw;
    from: RouteLocationRaw;
    next: NavigationGuardNext;
};
export type RouteRecordProps = boolean | Record<string, any> | ((to: RouteLocationNormalized) => Record<string, any>);
type Lazy<T> = () => Promise<T>;
type RawRouteComponent = RouteComponent | Lazy<RouteComponent>;
export type RouteComponent = Component;
declare abstract class MiddlewareRoute {
    readonly registry: MiddlewareRegistry;
    /**
     * Path of the record. Should start with `/` unless the record is the child of
     * another record.
     *
     * @example `/users/:id` matches `/users/1` as well as `/users/posva`.
     */
    path: string;
    /**
     * Aliases for the record. Allows defining extra paths that will behave like a
     * copy of the record. Allows having paths shorthands like `/users/:id` and
     * `/u/:id`. All `alias` and `path` values must share the same params.
     */
    alias?: RouteRecordRaw['alias'];
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
    readonly validators: Validator[];
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
    middleware(...validators: Validator[]): this;
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
/**
 * Route Record defining one single component with the `component` option.
 */
export interface RouteRecordSingleView extends _RouteRecordBase {
    /**
     * Component to display when the URL matches this route.
     */
    component: RawRouteComponent;
    components?: never;
    children?: never;
    redirect?: never;
    /**
     * Allow passing down params as props to the component rendered by `router-view`.
     */
    props?: RouteRecordProps;
}
export declare class MiddlewareRouteSingleView extends MiddlewareRoute implements RouteRecordSingleView {
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
    constructor(registry: MiddlewareRegistry, rawRoute: RouteRecordSingleView);
}
/**
 * Route Record defining one single component with a nested view.
 */
export interface RouteRecordSingleViewWithChildren extends _RouteRecordBase {
    /**
     * Component to display when the URL matches this route.
     */
    component?: RawRouteComponent | null | undefined;
    components?: never;
    children: RouteRecordRaw[];
    /**
     * Allow passing down params as props to the component rendered by `router-view`.
     */
    props?: RouteRecordProps;
}
export declare class MiddlewareRouteSingleViewWithChildren extends MiddlewareRoute implements RouteRecordSingleViewWithChildren {
    /**
     * Component to display when the URL matches this route.
     */
    component?: RawRouteComponent | null | undefined;
    /**
     * Nested route records.
     */
    children: RouteRecordRaw[];
    /**
     * Allow passing down params as props to the component rendered by `router-view`.
     */
    props?: RouteRecordProps;
    /**
     * Create the new middleware route instance.
     */
    constructor(registry: MiddlewareRegistry, rawRoute: RouteRecordSingleViewWithChildren);
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
    redirect?: never;
    /**
     * Allow passing down params as props to the component rendered by
     * `router-view`. Should be an object with the same keys as `components` or a
     * boolean to be applied to every component.
     */
    props?: Record<string, RouteRecordProps> | boolean;
}
export declare class MiddlewareRouteMultipleViews extends MiddlewareRoute implements RouteRecordMultipleViews {
    readonly registry: MiddlewareRegistry;
    readonly rawRoute: RouteRecordMultipleViews;
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
    constructor(registry: MiddlewareRegistry, rawRoute: RouteRecordMultipleViews);
}
/**
 * Route Record defining multiple named components with the `components` option and children.
 */
export interface RouteRecordMultipleViewsWithChildren extends _RouteRecordBase {
    /**
     * Components to display when the URL matches this route. Allow using named views.
     */
    components?: Record<string, RawRouteComponent> | null | undefined;
    component?: never;
    children: RouteRecordRaw[];
    /**
     * Allow passing down params as props to the component rendered by
     * `router-view`. Should be an object with the same keys as `components` or a
     * boolean to be applied to every component.
     */
    props?: Record<string, RouteRecordProps> | boolean;
}
export declare class MiddlewareRouteMultipleViewsWithChildren extends MiddlewareRoute implements RouteRecordMultipleViewsWithChildren {
    readonly registry: MiddlewareRegistry;
    readonly rawRoute: RouteRecordMultipleViewsWithChildren;
    /**
     * Components to display when the URL matches this route. Allow using named views.
     */
    components?: Record<string, RawRouteComponent> | null | undefined;
    component?: never;
    children: RouteRecordRaw[];
    /**
     * Allow passing down params as props to the component rendered by
     * `router-view`. Should be an object with the same keys as `components` or a
     * boolean to be applied to every component.
     */
    props?: Record<string, RouteRecordProps> | boolean;
    /**
     * Create the new middleware route instance.
     */
    constructor(registry: MiddlewareRegistry, rawRoute: RouteRecordMultipleViewsWithChildren);
}
/**
 * Route Record that defines a redirect. Cannot have `component` or `components`
 * as it is never rendered.
 */
export interface RouteRecordRedirect extends _RouteRecordBase {
    redirect: RouteRecordRedirectOption;
    component?: never;
    components?: never;
    props?: never;
}
export declare class MiddlewareRouteRedirect extends MiddlewareRoute implements RouteRecordRedirect {
    readonly registry: MiddlewareRegistry;
    readonly rawRoute: RouteRecordRedirect;
    redirect: RouteRecordRedirectOption;
    /**
     * Create the new middleware route instance.
     */
    constructor(registry: MiddlewareRegistry, rawRoute: RouteRecordRedirect);
}
export {};
