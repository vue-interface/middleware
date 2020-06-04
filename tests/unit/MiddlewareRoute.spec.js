import route from "../../src/route";
import MiddlewareRoute from "../../src/MiddlewareRoute";
import MiddlewareRegistry from "../../src/MiddlewareRegistry";

describe('MiddlewareRoute.js', () => {
    it('instantiates with string or object', () => {
        expect(route('/')).toBeInstanceOf(MiddlewareRoute);
        expect(route('/').beforeEnter).toBeInstanceOf(Function);
        expect(route({path: '/'})).toBeInstanceOf(MiddlewareRoute);
        expect(route({path: '/about', name: 'about'}).name).toBe('about');

        expect(route({
            path: '/',
            middleware: () => true,
        }).middlewares).toHaveLength(1);

        expect(route({
            path: '/',
            middleware: [() => true, () => true]
        }).middlewares).toHaveLength(2);

        expect(route({
            path: '/',
            onValid() {
                //
            }
        }).callbacks.valid).toHaveLength(1);

        expect(() => route()).toThrowError();
    });

    it('allows chaining methods', () => {
        const instance = route('/')
            .middleware(() => true)
            .middleware(() => true, () => true)
            .onError(() => {})
            .onValid(() => {})
            .onValid(() => {});

        expect(instance.middlewares).toHaveLength(3);
        expect(instance.callbacks.error).toHaveLength(1);
        expect(instance.callbacks.valid).toHaveLength(2);
    });

    it('emits valid', done => {
        let count = 0;

        route('/')
            .onValid((to, from, next) => {
                count++;

                expect(to).toBeInstanceOf(Object);

                if(count > 1) {
                    done();
                }
            })
            .emit('valid', {}, {}, () => {})
            .emit('onValid', {}, {}, () => {});        
    });

    it('emits error', done => {
        route('/')
            .onError(e => {
                expect(e).toBeInstanceOf(Error);

                done();
            })
            .emit('onError', new Error('test'));        
    });

    it('emits throws an error if callback is invalid', () => {
        expect(() => route('/').callback('onError', false)).toThrowError();     
    });

    it('throws an error', done => {
        const instance = route('/')
            .middleware(() => {
                return Promise.reject(new Error('test'));
            });

        instance.on('error', e => {
            done();
        });

        instance.beforeEnter(); 
    });

    it('throws an error once', done => {
        expect.assertions(5);
        
        let count = 0;

        const instance = route('/')
            .middleware(() => {
                return Promise.reject(new Error('test'));
            });

        instance.on('error', e => {
            expect(e).toBeInstanceOf(Error);
        }); 
            
        instance.once('error', e => {
            expect(e).toBeInstanceOf(Error);
        }); 

        instance.on('error', e => {
            expect(e).toBeInstanceOf(Error);
        });
        

        instance.beforeEnter();
        instance.beforeEnter();

        done();
    });

    it('binds the beforeEnter event', done => {
        const instance = route({
            path: '/',
            beforeEnter() {
                done();
            }
        });

        instance.beforeEnter(); 

        done();
    });

    it('has a static factory', () => {
        expect(MiddlewareRoute.make('/')).toBeInstanceOf(MiddlewareRoute);
        
        const instance = new MiddlewareRoute('/');

        expect(MiddlewareRoute.make(instance)).toBe(instance);
        expect(new MiddlewareRoute('/')).not.toBe(instance);
    });

    it('it includes the registrar middleware', () => {
        const registrar = new MiddlewareRegistry({
            middleware: () => true,
            group: {
                a: () => true,
                b: [() => true, () => true]
            },
            alias: {
                c: () => true
            }
        });

        const route = new MiddlewareRoute('/', {
            registrar
        }).middleware([() => true, 'a', 'b']);
        
        expect(route.middlewaresWithGlobal).toHaveLength(4);
    });

});