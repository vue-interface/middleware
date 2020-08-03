import { registrar } from './registry';
import MiddlewareRoute from './MiddlewareRoute';

export default function route(component, route, options) {
    if(!options) {
        options = route;
        route = component;
        component = null;
    }

    return new MiddlewareRoute(route, Object.assign({
        registrar
    }, options));
}