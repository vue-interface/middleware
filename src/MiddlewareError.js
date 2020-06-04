import Middleware from './Middleware';

const DEFAULT_MESSAGE = 'Middleware failed to validate.';

export default class MiddlewareError extends Error {

    constructor(middleware, route = {}, response, msg, ...args) {
        if(!(middleware instanceof Middleware)) {
            throw new Error('The first argument must be an instance of Middleware.');
        }

        const { to, from, next } = route;

        super(msg || DEFAULT_MESSAGE, ...args);

        this.to = to;
        this.from = from;
        this.next = next;
        this.response = response;
        this.middleware = middleware;

        Error.captureStackTrace(this, MiddlewareError);
    }

}