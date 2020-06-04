import MiddlewareRegistry from "../../src/MiddlewareRegistry";
import MiddlewareMap from "../../src/MiddlewareMap";
import MiddlewareIteratorMap from "../../src/MiddlewareIteratorMap";
import Middleware from "../../src/Middleware";
import MiddlewareIterator from "../../src/MiddlewareIterator";
import Iterator from "../../src/Iterator";

class Order1 extends Middleware {
    constructor() {
        super(() => true);
    }
}

class Order2 extends Order1 {
    //
}

class Order3 extends Order1 {
    //
}

class Unordered extends Middleware {
    constructor(order) {
        super(() => true);

        this.order = order;
    }
}

describe('MiddlewareRegistry.js', () => {
    it('instantiates', () => {
        const instance = new MiddlewareRegistry({
            middleware: [() => true, () => true],
            priority: [Middleware],
            aliases: {
                'a': () => true
            },
            groups: {
                a: [() => true]
            }
        });

        expect(instance.registry.middleware).toBeInstanceOf(MiddlewareIterator);
        expect(instance.registry.priority).toBeInstanceOf(Iterator);
        expect(instance.registry.alias).toBeInstanceOf(MiddlewareMap);
        expect(instance.registry.group).toBeInstanceOf(MiddlewareIteratorMap);
    });

    it('prioritizes the middleware', () => {
        const instance = new MiddlewareRegistry({
            middleware: [
                new Unordered(1),
                new Unordered(2),
                new Order1,
                new Unordered(3),
                new Unordered(4),
                new Order3,
                new Order2,
                new Unordered(5)
            ],
            priority: [
                Order1,
                Order2,
                Order3
            ]
        });

        const priority = instance.registry.middleware.prioritize(
            instance.registry.priority
        );

        expect(priority[0]).toBeInstanceOf(Order1);
        expect(priority[1]).toBeInstanceOf(Order2);
        expect(priority[2]).toBeInstanceOf(Order3);
        expect(priority[3].order).toBe(1);
        expect(priority[4].order).toBe(2);
        expect(priority[5].order).toBe(3);
        expect(priority[6].order).toBe(4);
        expect(priority[7].order).toBe(5);
    });
});