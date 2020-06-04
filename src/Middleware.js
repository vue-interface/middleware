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
        return new Promise((resolve, reject) => {
            const response = this.validator(to, from, next);

            if(response instanceof Promise) {
                return response.then(resolve, reject);
            }

            if(response === true) {
                resolve(response);
            }

            return reject(new MiddlewareError(this, {to, from, next}, response));
        });
    }

    static make(subject, ...args) {
        if(subject instanceof this) {
            return subject;
        }

        return new this(subject, ...args);
    }

}