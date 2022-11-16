import Middleware from "./Middleware";
import { Group, Validator } from "./types";
export default class MiddlewareRegistry {
    protected aliases: Map<string, any>;
    protected groups: Map<string, any>;
    protected middlewares: any[];
    protected priorities: any[];
    constructor();
    alias(key: string, value: Validator): this;
    group(key: string, value: Group): this;
    middleware(value: Middleware): this;
    priority(...args: any[]): this;
    prioritize(...args: any[]): Middleware[];
    resolve(...args: any[]): Middleware[];
    definition(value: any): [string, string[]];
    prioritized(...args: any[]): Middleware[];
}
