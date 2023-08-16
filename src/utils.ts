import { camelCase } from 'camel-case';
import type { RouteLocationNormalized } from 'vue-router';
import Middleware from './Middleware';
import { ValidatorResponse } from './MiddlewareRoute';

const MATCH_PATTERN = /^on_?([A-Z]?[a-z]+)?/;

export function qualifyCallbackFunction(key: string) {
    return camelCase(key.match(MATCH_PATTERN) ? key : `on_${key}`);
}

export function qualifyCallbackKey(key: string) {
    const matches = key.match(MATCH_PATTERN);

    return (matches && matches[1] ? matches[1] : key).toLowerCase();
}

export function validate(middlewares: Middleware[], to: RouteLocationNormalized, from: RouteLocationNormalized): Promise<ValidatorResponse> {
    return new Promise(async(resolve, reject) => {
        const subjects = [...middlewares];
    
        return function run(status: ValidatorResponse) {
            const middleware = subjects.shift();

            if(!middleware) {
                return resolve(status);
            }
            
            return middleware.validate(to, from, (status: ValidatorResponse) => {
                if(status instanceof Error) {
                    reject(status);
                }
                else if(status === false) {
                    reject(new Error(`Cancelling navigation to ${to.path}!`));
                }
                else if([true, undefined].includes(<any> status)) {
                    run(status);
                }
                else {
                    resolve(status);
                }
            });
        }();
    });
}