import type { RouteLocationNormalized } from 'vue-router';
import type { ValidatorResponse } from './types';
import Middleware from './Middleware';
export declare function qualifyCallbackFunction(key: string): string;
export declare function qualifyCallbackKey(key: string): string;
export declare function prioritize(priority: any, ...args: any[]): any[];
export declare function validate(middlewares: Middleware[], to: RouteLocationNormalized, from: RouteLocationNormalized): Promise<ValidatorResponse>;
