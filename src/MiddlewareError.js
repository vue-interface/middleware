import Middleware from './Middleware';

const DEFAULT_MESSAGE = 'Middleware failed to validate.';

export default class MiddlewareError extends Error {

    constructor(middleware, route = {}, response, msg) {
        if(!(middleware instanceof Middleware)) {
            throw new Error(
                'The first argument must be an instance of Middleware.'
            );
        }

        if(response instanceof Error) {
            msg = response.message;
        }

        const { to, from, next } = route;

        super(msg || DEFAULT_MESSAGE);

        this.to = to;
        this.from = from;
        this.next = next;
        this.response = response;
        this.middleware = middleware;

        Error.captureStackTrace(this, MiddlewareError);
    }

}