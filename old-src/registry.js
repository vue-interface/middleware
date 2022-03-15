import MiddlewareRegistry from "./MiddlewareRegistry";

export const registrar = new MiddlewareRegistry;

export function alias(...args) {
    return registrar.alias( ...args);        
}

export function group(...args) {
    return registrar.group( ...args);          
}

export function middleware(...args) {
    return registrar.middleware( ...args);          
}

export function priority(...args) {
    return registrar.priority(...args);  
}