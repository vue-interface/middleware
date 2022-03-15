import EventEmitter from "../../src/EventEmitter";

describe('EventEmitter.js', () => {

    it('binds events', () => {
        expect.assertions(8);
        
        const e = new EventEmitter;

        expect(() => e.on('invalid', true)).toThrowError();

        e.once('test', a => {
            expect(a).toBe(1);
        });

        e.on('test', (a, b, c) => {
            expect(a).toBe(1);
            expect(b).toBe(2);
            expect(c).toBe(3);
        });

        e.emit('test', 1, 2, 3);
        e.emit('test', 1, 2, 3);
    });

});