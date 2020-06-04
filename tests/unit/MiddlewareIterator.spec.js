import MiddlewareIterator from "../../src/MiddlewareIterator";
import Middleware from "../../src/Middleware";
import Iterator from "../../src/Iterator";
import MiddlewareError from "../../src/MiddlewareError";

describe('MiddlewareIterator.js', () => {
    it('can be instantiated', () => {
        const a = new Middleware(() => true);
        
        expect(new MiddlewareIterator).toBeInstanceOf(MiddlewareIterator);
        expect(new MiddlewareIterator([() => true, a])).toBeInstanceOf(MiddlewareIterator);
        expect(MiddlewareIterator.make(() => true)).toBeInstanceOf(MiddlewareIterator);
        expect(() => new MiddlewareIterator([1])).toThrowError();
    });

    it('has a valid length property', () => {
        const instance = new MiddlewareIterator([
            () => true,
            () => false
        ]);

        expect(instance).toHaveLength(2);
    });

    it('is iterable', () => {
        let instance = new MiddlewareIterator;
        
        expect([...instance]).toHaveLength(0);

        instance = new MiddlewareIterator([
            () => true
        ]);
        
        expect([...instance]).toHaveLength(1);
    });

    it('inherits the array prototype methods', async() => {
        const instance = new MiddlewareIterator([
            () => true,
            () => false
        ]);

        expect(instance.slice(0, 1)).toBeInstanceOf(Array);
        
        instance.splice(0, 2);
        
        expect(instance).toHaveLength(0);

        instance.splice(0, 0, () => true);

        instance.push(() => true);
        
        expect(instance).toHaveLength(2);

        instance.unshift(() => true);
        
        expect(instance).toHaveLength(3);

        await expect(instance.get(0).validate()).resolves.not.toBeFalsy();

        instance.fill(() => false, 0, 2);

        await expect(instance.get(0).validate()).rejects.toThrowError();
    });

    it('can get/set items', () => {
        const instance = new MiddlewareIterator;

        const a = new Middleware(() => true);
        const b = new Middleware(() => true);
        const c = new Middleware(() => false);

        instance.items = () => true;

        expect(instance).toHaveLength(1);

        instance.items = [a, b];

        expect(instance.get(0)).toBe(a);
        expect(instance.get(1)).toBe(b);
        expect(instance.get(2)).toBeUndefined();
        
        instance.set(2, c);

        expect(instance.get(2)).toBe(c);

        instance.remove(2);
        instance.remove(b);
        
        expect(instance.get(1)).toBeUndefined();
        expect(instance.get(2)).toBeUndefined();
        expect(instance.contains(a)).toBeTruthy();  
        expect(instance.contains(c)).toBeFalsy();  

        instance.push(c); 

        expect(instance.contains(c)).toBeTruthy();
    });

    it('can add/remove items', () => {
        const instance = new MiddlewareIterator;
        
        expect(instance.items).toHaveLength(0);

        instance.push(() => false);

        expect(instance.items).toHaveLength(1);
        expect(() => instance.push(true)).toThrowError();
        expect(() => instance.items = true).toThrowError();

        instance.remove(0);

        expect(instance.items).toHaveLength(0);
    });

    it('has a static factory', () => {
        expect(MiddlewareIterator.make()).toBeInstanceOf(MiddlewareIterator);
        
        const instance = new MiddlewareIterator(() => true);

        expect(MiddlewareIterator.make(instance)).toBe(instance);
        expect(new MiddlewareIterator(() => true)).not.toBe(instance);
    });

    it('can be cast', () => {
        const a = new MiddlewareIterator(() => true, {
            cast: value => Middleware.make(value)
        });

        expect(a.get(0)).toBeInstanceOf(Middleware);

        const b = new Iterator(() => true);

        expect(b.get(0)).toBeInstanceOf(Function);
    });

    it('can be prioritized', () => {
        const instance = new Iterator([1, 2, 3], {
            prioritize: (a, b) => {
                return a - b;
            }
        });

        expect(instance.prioritize([2, 1])).toStrictEqual([2, 1, 3]);
        expect(instance.prioritize((a, b) => {
            return b - a;
        })).toStrictEqual([3, 2, 1]);
    });

    it('validates', async() => {
        await expect(new MiddlewareIterator(() => null).validate()).rejects.toThrowError();
        await expect(new MiddlewareIterator(() => false).validate()).rejects.toThrowError();
        await expect(new MiddlewareIterator(() => Promise.reject(new Error('test'))).validate()).rejects.toThrowError();
        await expect(new MiddlewareIterator(() => Promise.resolve(true)).validate()).resolves.toBeTruthy();
    });
});