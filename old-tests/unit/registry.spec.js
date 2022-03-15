import { middleware, registrar, alias, group, priority } from "../../src/registry";
import Middleware from "../../src/Middleware";
import MiddlewareIterator from "../../src/MiddlewareIterator";
import Iterator from "../../src/Iterator";

class Restricted extends Middleware {
    constructor() {
        super(() => true);
    }
}

describe('router.spec.js', () => {
    
    it('can register middleware', () => {
        middleware(() => true);

        expect(registrar.registry.middleware).toHaveLength(1);
    });
    
    it('can register alias', () => {
        alias('test', () => true);

        expect(registrar.registry.alias.get('test')).toBeInstanceOf(Middleware);
    });
    
    it('can register group', () => {
        group('a', () => true);
        group('b', [() => true, () => true]);

        expect(registrar.registry.group.get('a')).toHaveLength(1);
        expect(registrar.registry.group.get('b')).toHaveLength(2);
    });
    
    it('can register priority', () => {
        priority([Restricted]);

        expect(registrar.registry.priority).toBeInstanceOf(Iterator);
        expect(registrar.registry.priority).toHaveLength(1);
    });

});