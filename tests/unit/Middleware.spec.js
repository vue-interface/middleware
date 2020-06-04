import Middleware from "../../src/Middleware";
import MiddlewareRegistry from "../../src/MiddlewareRegistry";
import MiddlewareIterator from "../../src/MiddlewareIterator";
import route from "../../src/route";

describe('Middleware.js', () => {
    it('can be instantiated with a function', () => {
        expect(Middleware.make(() => true)).toBeInstanceOf(Middleware);
    });

    it('will throw an error without a function', () => {
        expect(() => Middleware.make('test')).toThrowError();
    });

    it('has a setter/getter for the validator property', () => {
        class MyMiddleware extends Middleware { 
            constructor(validates = true) {
                super(() => validates);
            }           
        }

        const instance = new MyMiddleware;

        expect(instance.validator).toBeInstanceOf(Function);

        instance.validator = () => true;

        expect(instance.validator).toBeInstanceOf(Function);
        expect(() => instance.validator = true).toThrowError();
    });

    it('can validate', async() => {
        const passes = Middleware.make(() => true);
        const fails = Middleware.make(() => false);
        const promises = Middleware.make(() => Promise.resolve(true));

        expect(passes.validate()).toBeInstanceOf(Promise);

        await expect(passes.validate()).resolves.not.toBeFalsy();
        await expect(fails.validate()).rejects.toThrowError();
        await expect(promises.validate()).resolves.toBeTruthy();
    });

    it('it can resolve groups and aliases', () => {
        const registrar = new MiddlewareRegistry({
            alias: {
                a: () => true
            },
            group: {
                b: [() => true, () => true]
            }
        });

        const options = {
            registrar
        };

        const a = Middleware.make('a', options);
        
        expect(a).toBeInstanceOf(Middleware);

        const b = Middleware.make('b', options);

        expect(b).toBeInstanceOf(Middleware);

        const iterator = MiddlewareIterator.make([
            'a', 'b'
        ], options);

        expect(iterator).toBeInstanceOf(MiddlewareIterator);
        expect(iterator).toHaveLength(2);
    });

    it('works with globals', () => {
        const registrar = new MiddlewareRegistry({
            middleware: () => true
        });
        
        const instance = route('/', {
            registrar
        });

        expect(instance.middlewares).toHaveLength(0);
        expect(instance.middlewaresWithGlobal).toHaveLength(1);
    });

    it('works without registrar', () => {
        const instance = route('/', {
            registrar: undefined
        });

        console.log(instance.registrar);

        expect(instance.middlewares).toHaveLength(0);
        expect(instance.middlewaresWithGlobal).toHaveLength(0);
    });
});