import MiddlewareMap from "../../src/MiddlewareMap";
import MiddlewareIterator from "../../src/MiddlewareIterator";

describe('MiddlewareMap.js', () => {
    it('can be instantiated from object', () => {
        const map = new MiddlewareMap({
            a: () => true,
            b: [
                () => true,
                () => true
            ]
        });

        expect(map.get('a')).toBeInstanceOf(Function);
        expect(map.get('b')).toBeInstanceOf(Array);
        expect(map.get('b')).toHaveLength(2);
    });

    it('can be instantiated from array', () => {
        const map = new MiddlewareMap([
            ['a', () => true],
            ['b', [
                () => true,
                () => true
            ]]
        ]);

        expect(map.get('a')).toBeInstanceOf(Function);
        expect(map.get('b')).toBeInstanceOf(Array);
        expect(map.get('b')).toHaveLength(2);
    });

    it('can get and set new key/value pairs', () => {
        const map = new MiddlewareMap();
        
        map.set('a', () => 1);

        expect(map.get('a')).toBeInstanceOf(Function);

        map.set('b', [
            () => true,
            () => true
        ]);

        expect(map.get('b')).toHaveLength(2);
    });

    it('throws an error with invalid payload', () => {
        expect(() => new MiddlewareMap('test')).toThrowError();
    });

    it('has a static factory', () => {
        expect(MiddlewareMap.make()).toBeInstanceOf(MiddlewareMap);
        
        const map = new MiddlewareMap([['a', 1]]);

        expect(MiddlewareMap.make(map)).toBe(map);
        expect(new MiddlewareMap([['a', 1]])).not.toBe(map);
    });
});