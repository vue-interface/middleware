import MiddlewareRoute from "../../src/MiddlewareRoute";
import route from "../../src/route";
import MiddlewareRegistry from "../../src/MiddlewareRegistry";

describe('route.js', () => {
    it('instantiates a route', () => {
        expect(route('/')).toBeInstanceOf(MiddlewareRoute);
    });

    it('works with global event emitter', () => {
        expect.assertions(2);
        
        const registrar = new MiddlewareRegistry;

        registrar.on('valid', a => {
            expect(a).toBeTruthy();
        });

        route('/', {
            registrar
        }).on('valid', a => {
            expect(a).toBeTruthy();
        }).emit('valid', true);
    });
});