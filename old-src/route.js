import { registrar } from './registry';
import MiddlewareRoute from './MiddlewareRoute';

export default function route(route, options) {
    return new MiddlewareRoute(route, Object.assign({
        registrar
    }, options));
}