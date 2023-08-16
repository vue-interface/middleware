import type { RouteRecordRaw } from 'vue-router';
import Middleware from './src/Middleware';
import MiddlewareRegistry, { Group } from './src/MiddlewareRegistry';
import { MiddlewareRouteMultipleViews, MiddlewareRouteRecord, MiddlewareRouteSingleView, Validator, ValidatorCallback } from './src/MiddlewareRoute';

export {
    Middleware,
    MiddlewareRegistry
};

export const registrar = new MiddlewareRegistry;

export function alias(key: string, value: ValidatorCallback): MiddlewareRegistry {
    return registrar.alias(key, value);        
}

export function group(key: string, value: Group): MiddlewareRegistry {
    return registrar.group(key, value);          
}

export function middleware(value: Middleware): MiddlewareRegistry {
    return registrar.middleware(value);          
}

export function priority(priority: Validator[]): MiddlewareRegistry {
    return registrar.priority(priority);  
}

export function route(route: RouteRecordRaw) {
    if(route.component) {
        return new MiddlewareRouteSingleView(registrar, route);
    }
    
    if(route.components) {
        return new MiddlewareRouteMultipleViews(registrar, route);
    }

    return new MiddlewareRouteRecord(registrar, route);
}