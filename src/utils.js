
import { camelCase } from 'camel-case';

const MATCH_PATTERN = /^on_?([A-Z]?[a-z]+)?/;

export function qualifyCallbackFunction(key) {
    return camelCase(key.match(MATCH_PATTERN) ? key : `on_${key}`);
}

export function qualifyCallbackKey(key) {
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

export function validate(middlewares, to, from, next) {
    return new Promise(async(resolve, reject) => {
        let stopped = false;

        while(!stopped && middlewares.length) {
            const middleware = middlewares.shift();
            
            await middleware.validate(to, from, (...args) => {
                stopped = true;
                    
                next(...args);

                resolve(false);
            }).catch(e => {
                stopped = true;
                
                reject(e);
            });
        }

        resolve(true);
    });
}