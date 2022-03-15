import MiddlewareRegistry from "./src/MiddlewareRegistry";
import MiddlewareRoute from './src/MiddlewareRoute';

export {
    MiddlewareRegistry,
    MiddlewareRoute
};

export let registrar = new MiddlewareRegistry;

export function alias(...args) {
    return registrar.alias( ...args);        
}

export function group(...args) {
    return registrar.group( ...args);          
}

export function middleware(...args) {
    return registrar.middleware( ...args);          
}

export function priority(...args) {
    return registrar.priority(...args);  
}

export function route(route, options) {
    return new MiddlewareRoute(route, Object.assign({
        registrar
    }, options));
}

// import Middleware from './src/Middleware';
// import MiddlewareError from './src/MiddlewareError';
// import MiddlewareIterator from './src/MiddlewareIterator';
// import MiddlewareRoute from './src/MiddlewareRoute';
// import route from './src/route';
// import { registrar, alias, group, middleware, priority } from './src/registry';

// export {
//     registrar,
//     alias,
//     group,
//     middleware,
//     priority,
//     route,
//     Middleware,
//     MiddlewareError,
//     MiddlewareIterator,
//     MiddlewareRoute
// };