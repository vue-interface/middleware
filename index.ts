import Middleware from "./src/Middleware";
import MiddlewareRegistry from "./src/MiddlewareRegistry";
import MiddlewareRoute from './src/MiddlewareRoute';

export {
    Middleware,
    MiddlewareRegistry,
    MiddlewareRoute
};

export let registrar = new MiddlewareRegistry;

export function alias(...args) {
    return registrar.alias(...args);        
}

export function group(...args) {
    return registrar.group(...args);          
}

export function middleware(...args) {
    return registrar.middleware(...args);          
}

export function priority(...args) {
    return registrar.priority(...args);  
}

export function route(route) {
    return new MiddlewareRoute(registrar, route);
}