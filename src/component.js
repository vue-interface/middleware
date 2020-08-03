import { registrar } from './registry';
import MiddlewareRoute from './MiddlewareRoute';

export default function component(component, route, options) {
    return new MiddlewareRoute(Object.assign({
        component
    }, route), Object.assign({
        registrar
    }, options));
}