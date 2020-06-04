import MiddlewareIteratorMap from "../../src/MiddlewareIteratorMap";
import MiddlewareIterator from "../../src/MiddlewareIterator";

describe('MiddlewareIteratorMap.js', () => {
    it('can be instantiated from object', () => {
        const map = new MiddlewareIteratorMap({
            a: () => true,
            b: [
                () => true,
                () => true
            ]
        });

        expect(map.get('a')).toBeInstanceOf(MiddlewareIterator);
        expect(map.get('a')).toHaveLength(1);
        expect(map.get('b')).toHaveLength(2);
    });

    it('can be instantiated from array', () => {
        const map = new MiddlewareIteratorMap([
            ['a', () => true],
            ['b', [
                () => true,
                () => true
            ]]
        ]);

        expect(map.get('a')).toBeInstanceOf(MiddlewareIterator);
        expect(map.get('a')).toHaveLength(1);
        expect(map.get('b')).toHaveLength(2);
    });

    it('proxy the iterable properties using the same methods as array\'', () => {
        const map = new MiddlewareIteratorMap();
        
        map.set('a', () => 1);

        expect(map.get('a')).toHaveLength(1);

        map.push('a', () => true, () => true);

        expect(map.get('a')).toHaveLength(3);

        map.splice('a', 0, 2);
        
        expect(map.get('a')).toHaveLength(1);
        
        map.set('b', [
            () => true,
            () => true
        ]);

        expect(map.get('b')).toHaveLength(2);
    });

    it('works with a non existing key', () => {
        const map = new MiddlewareIteratorMap();

        map.push('a', () => true, () => true);

        expect(map.get('a')).toHaveLength(2);
    });
});