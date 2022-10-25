export default class MiddlewareRegistry {
    protected aliases: Map<string, any>;
    protected groups: Map<string, any>;
    protected middlewares: any[];
    protected priorities: any[];
    constructor();
    alias(key: string, value: any): this;
    group(key: string, value: any): this;
    middleware(value: any): this;
    priority(...args: any[]): this;
    prioritize(...args: any[]): any[];
    resolve(...args: any[]): any;
    definition(value: any): (string | string[])[];
    prioritized(...args: any[]): any[];
}
