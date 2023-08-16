import type { RouteLocationNormalized } from '../../../../../../../node_modules/vue-router/dist/vue-router.cjs';
import Middleware from './Middleware';
import { ValidatorResponse } from './MiddlewareRoute';
export declare function qualifyCallbackFunction(key: string): string;
export declare function qualifyCallbackKey(key: string): string;
export declare function validate(middlewares: Middleware[], to: RouteLocationNormalized, from: RouteLocationNormalized): Promise<ValidatorResponse>;
