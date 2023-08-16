import Middleware from './Middleware';
import { Validator, ValidatorCallback } from './MiddlewareRoute';
export declare type Alias = string;
export declare type Group = (string | Validator)[];
export default class MiddlewareRegistry {
    protected aliases: Map<string, ValidatorCallback>;
    protected groups: Map<string, any>;
    protected middlewares: Middleware[];
    protected priorities: Validator[];
    constructor();
    alias(key: string, value: ValidatorCallback): this;
    group(key: string, value: Group): this;
    middleware(value: Middleware): this;
    priority(priority: Validator[]): this;
    prioritize(subject: Middleware[]): Middleware[];
    resolve(subjects: (Middleware | Validator)[]): Middleware[];
    definition(value: string): [string, string[]];
    prioritized(validators: Validator[]): Middleware[];
}
