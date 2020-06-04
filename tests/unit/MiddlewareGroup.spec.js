import Middleware from "../../src/Middleware";
import { registrar } from "../../src/registry";
import MiddlewareGroup from "../../src/MiddlewareGroup";

describe('MiddlewareGroup.js', () => {
    it('validates', async() => {
        const instance = MiddlewareGroup.make([
            () => true,
            () => true
        ]);

        await expect(instance.validator()).toBeTruthy();
    });

    it('won\'t instantiate with invalid Middleware', () => {
        expect(() => MiddlewareGroup.make([
            true,
            () => true
        ])).toThrowError();
    });

    it('has a static factory', () => {
        expect(MiddlewareGroup.make()).toBeInstanceOf(MiddlewareGroup);
        
        const map = new MiddlewareGroup([() => true]);

        expect(MiddlewareGroup.make(map)).toBe(map);
        expect(new MiddlewareGroup([() => true])).not.toBe(map);
    });
});