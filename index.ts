import type { RouteRecordRaw } from 'vue-router';
import Middleware from "./src/Middleware";
import MiddlewareRegistry from "./src/MiddlewareRegistry";
import MiddlewareRoute from './src/MiddlewareRoute';
import { Group, Validator } from "./src/types";

export {
    Middleware,
    MiddlewareRegistry,
    MiddlewareRoute
};

export let registrar = new MiddlewareRegistry;

export function alias(key: string, value: Validator): MiddlewareRegistry {
    return registrar.alias(key, value);        
}

export function group(key: string, value: Group): MiddlewareRegistry {
    return registrar.group(key, value);          
}

export function middleware(value: Middleware): MiddlewareRegistry {
    return registrar.middleware(value);          
}

export function priority(...args): MiddlewareRegistry {
    return registrar.priority(...args);  
}

export function route(route: RouteRecordRaw): MiddlewareRoute {
    return new MiddlewareRoute(registrar, route);
}