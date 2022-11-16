import type { RouteLocationNormalized } from 'vue-router';
import { camelCase } from 'camel-case';
import type { ValidatorResponse } from './types';
import Middleware from './Middleware';

const MATCH_PATTERN = /^on_?([A-Z]?[a-z]+)?/;

export function qualifyCallbackFunction(key: string) {
    return camelCase(key.match(MATCH_PATTERN) ? key : `on_${key}`);
}

export function qualifyCallbackKey(key: string) {
    const matches = key.match(MATCH_PATTERN);

    return (matches && matches[1] ? matches[1] : key).toLowerCase();
}

export function prioritize(priority, ...args) {
    return [].concat(...args).sort((a, b) => {
        let aIndex = priority.indexOf(a),
            bIndex = priority.indexOf(b);
        
        aIndex = aIndex > -1 ? aIndex : priority.indexOf(a.constructor);
        bIndex = bIndex > -1 ? bIndex : priority.indexOf(b.constructor);

        if(aIndex > -1 && bIndex > -1) {
            return aIndex < bIndex ? -1 : 1;
        }

        return aIndex > -1 ? -1 : 1;
    }); 
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