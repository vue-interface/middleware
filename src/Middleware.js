export default class Middleware {

    constructor(validator, key, args) {
        this.validator = validator;
        this.key = key;
        this.args = typeof args === 'string'
            ? args.split(',')
            : [].concat(...args || []);
    }

    static make(subject, ...args) {
        if(subject instanceof this) {
            return subject;
        }

        return new this(subject, ...args);
    }

    async validate(to, from, next) {
        return await this.validator(
            to, from, next, ...this.args
        );
    }
}