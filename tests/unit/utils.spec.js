import { qualifyCallbackFunction, qualifyCallbackKey } from "../../src/utils";
import MiddlewareRoute from "../../src/MiddlewareRoute";
import route from "../../src/route";

describe('utils.js', () => {
    it('instantiates a route', () => {
        expect(route('/')).toBeInstanceOf(MiddlewareRoute);
    });

    it('qualifies callback function', () => {
        expect(qualifyCallbackFunction('valid')).toBe('onValid');
        expect(qualifyCallbackFunction('onValid')).toBe('onValid');
        expect(qualifyCallbackFunction('on_valid')).toBe('onValid');
    });

    it('qualifies callback key', () => {
        expect(qualifyCallbackKey('valid')).toBe('valid');
        expect(qualifyCallbackKey('onValid')).toBe('valid');
        expect(qualifyCallbackKey('on_valid')).toBe('valid');
    });
});