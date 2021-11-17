import MiddlewareError from "./MiddlewareError";

export default class Middleware {

    constructor(validator, options) {
        this.options = Object.assign({}, options || {});
        this.registrar = this.options.registrar;
        this.validator = validator;
    }

    get validator() {
        return this.$validator;
    }

    set validator(validator) {
        const resolved = (
            this.resolveAlias(validator) ||
            this.resolveGroup(validator)
        ) || validator;

        if(typeof resolved !== 'function') {
            throw new Error(
                'The middleware validator must a `Function`.'
            );
        }

        this.$validator = resolved;
    }

    resolveAlias(value) {
        if(!this.registrar) {
            return;
        }

        const match = this.registrar.registry.alias.get(value);

        return match && match.validator;
    }

    resolveGroup(value) {
        if(!this.registrar) {
            return;
        }

        const match = this.registrar.registry.group.get(value);

        return match && match.validator;
    }


    validate(to, from, next) {
        const promise = new Promise((resolve, reject) => {
            const resolver = response => {
                if(response === true) {
                    return resolve(response);
                }
    
                return rejecter(response);
            };
    
            const rejecter = response => {
                return reject(new MiddlewareError(this, {to, from, next}, response));
            };
    
            const response = this.validator(to, from, next);

            if(response instanceof Promise) {
                return response.then(resolver, rejecter);
            }

            resolver(response);
        });

        promise.then(response => {
            this.onValid(to, from, next); 
        }, e => {
            this.onError(e);
        });
        
        return promise;
    }

    onValid(to, from, next) {
        //
    }

    onError(e) {
        //
    }

    static make(subject, ...args) {
        if(subject instanceof this) {
            return subject;
        }

        return new this(subject, ...args);
    }

}