export default class Iterator {
    
    constructor(items, options) {
        this.options = Object.assign({}, options || {});
        this.registrar = this.options.registrar;
        this.items = items || [];
    }

    [Symbol.iterator]() {
        return this.items.values();
    }

    cast(value) {
        return this.options.cast ? this.options.cast(value) : value;
    }

    indexOf(middleware) {
        return this.items.indexOf(middleware);
    }

    contains(middleware) {
        return this.indexOf(middleware) > -1;
    }

    get(index) {
        return this.items[index];
    }

    set(index, value) {
        this.items[index] = this.cast(value);

        return this;
    }

    fill(value, start, end) {
        this.items.fill(this.cast(value), start, end);

        return this;
    }

    prioritize(priority) {
        if(typeof priority === 'function') {
            return this.items.sort(priority);
        }

        return this.items.sort((a, b) => {
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

    push(...args) {
        this.items.push(...args.map(arg => this.cast(arg)));

        return this;
    }

    splice(start, end, ...args) {
        this.items.splice(
            start, end, ...args.map(arg => this.cast(arg))
        );

        return this;
    }

    unshift(...args) {
        this.items.unshift(...args.map(arg => this.cast(arg)));

        return this;
    }
    
    remove(index) {
        const matching = this.indexOf(index);

        index = matching > -1 ? matching : index;
        
        if(this.items[index]) {
            this.items.splice(index, 1);
        }

        return this;
    }

    validate(to, from, next) {
        return new Promise((resolve, reject) => {
            const promises = this.items.map(item => {
                return item.validate(to, from, next);
            });
    
            Promise.all(promises).then(resolve, reject);
        });
    }
    

    get length() {
        return this.items && this.items.length;
    }

    get items() {
        return this.$items;
    }

    set items(items) {
        if(!(items instanceof Array)) {
            items = [items];
        }

        this.$items = items.map(item => this.cast(item));
    }

    static make(subject, ...args) {
        if(subject instanceof this) {
            return subject;
        }

        return new this(subject, ...args);
    }
}

Object.getOwnPropertyNames(Array.prototype)
    .filter(prop => typeof Array.prototype[prop] === 'function')
    .filter(prop => !Iterator.prototype[prop])
    .map(prop => {
        Iterator.prototype[prop] = function(...args) {
            return this.items[prop](...args);
        };
    });