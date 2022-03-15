
import { camelCase } from 'camel-case';

const MATCH_PATTERN = /^on_?([A-Z]?[a-z]+)?/;

export function qualifyCallbackFunction(key) {
    return camelCase(key.match(MATCH_PATTERN) ? key : `on_${key}`);
}

export function qualifyCallbackKey(key) {
    const matches = key.match(MATCH_PATTERN);

    return (matches && matches[1] ? matches[1] : key).toLowerCase();
}