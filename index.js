import Middleware from './src/Middleware';
import MiddlewareError from './src/MiddlewareError';
import MiddlewareIterator from './src/MiddlewareIterator';
import MiddlewareRoute from './src/MiddlewareRoute';
import route from './src/route';
import component from './src/component';
import { registrar, alias, group, middleware, priority } from './src/registry';

export {
    registrar,
    alias,
    group,
    middleware,
    priority,
    route,
    component,
    Middleware,
    MiddlewareError,
    MiddlewareIterator,
    MiddlewareRoute
};