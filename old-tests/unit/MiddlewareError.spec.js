import MiddlewareError from "../../src/MiddlewareError";
import Middleware from "../../src/Middleware";

describe('MiddlewareError.js', () => {
    it('instantiates', () => {
        new MiddlewareError(Middleware.make(() => true));
    });

    it('throws an error', () => {
        expect(() => new MiddlewareError(true)).toThrowError();
    });
});