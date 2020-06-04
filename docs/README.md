# Middleware

An extendible middleware plugin for VueRouter.

[[toc]]

## Installation

NPM

    npm i @vue-interface/middleware --save

Yarn

    yard add @vue-interface/middleware

## Defining Routes

Creating `MiddlewareRoute` instances can be instantiated or created with the
`route` helper method. All the standard route params are supported.
`MiddlewareRouter` merely wraps standard route  object and adds the validation.

``` js
// router.js
import VueRouter from 'vue-router';
import { route } from '@vue-interface/middleware';

return new VueRouter({
    routes: [
        route({
            name: 'home',
            path: '/'
        })
    ]
});
```

## Defining Routes with Middleware

Route with one middleware...

``` js
import { route } from '@vue-interface/middleware';

route({
    name: 'home',
    path: '/',
    middleware: (to, from, next) => {
        // do something and return `true` or `false`
        return true;
    }
})
```

Route with multiple middleware...

``` js
import { route } from '@vue-interface/middleware';

route({
    name: 'home',
    path: 'home',
    middleware: [(to, from, next) => {
        // do something

        return true;
    }, (to, from, next) => {
        // do something

        return true;
    }]
})
```

## Chainable Syntax

``` js
import { route } from '@vue-interface/middleware';

route({
    name: 'home',
    path: 'home'
})
    .middleware((to, from, next) => {
        // do something
        return true;
    })
    .middleware((to, from, next) => {
        // do something
        return true;
    })
```

## Route Middelware

Route middelware can be assigned to a single route or groups.

``` js
import { regis } from '@vue-interface/middleware';

route('global', (to, from, next) => {
    // do something
    return true;
});

route({
    name: 'home',
    path: 'home',
    middleware: ['global', (to, from, next) => {
        // do something
        return true;
    }]
})
```

## Middleware Classes

You may also pass `Middleware` instances directly.`Function`'s are cast as
`Middleware` instances automatically, so extending `Middleware` to make your own
classes adds even more power.

``` js
// CustomMiddleware.js

import { Middleware } from '@vue-interface/middleware';

class CustomMiddleware extends Middleware {

    constructor(date) {
        super(() => {
            // Only show this route on saturday
            return this.date.getDay() === 6 ;
        });

        this.date = date;
    }

}
```

``` js
// router.js

import { route } from '@vue-interface/middleware';

route({
    name: 'home',
    path: 'home',
    middleware: [
        new CustomMiddleware(new Date()),
    ]
})
```

## Callbacks

### onValid

This callback is triggered anytime a route has passed all the Middleware
validators.

``` js
import { route } from '@vue-interface/middleware';

route({
    path: '/',
    alias: '',
    name: 'home',
    component: Home,
    middleware: ['global'],
    onValid(to, from, next) {
        // do something
    }
})
```

### onError

This callback is triggered anytime a route has failed one of the Middleware
validators. A `MiddlewareError` instance is passed which extends `Error` and has
a couple extra properties: `middleware`, `response`, `to`, `from`, `next`, and
`msg`.

``` js
import { route } from '@vue-interface/middleware';

route({
    path: '/',
    alias: '',
    name: 'home',
    component: Home,
    middleware: ['global'],
    onError(e) {
        console.log(e);
    }
})
```

## Chaining Callbacks

Alternative chaining syntax is supported. Use this to keep code organized or if you need to bind multiple callbacks for whatever reason.

``` js
import { route } from '@vue-interface/middleware';

route({
    path: '/',
    alias: '',
    name: 'home',
    component: Home,
    middleware: ['global']
})
    .onValid((to, from, next) => {
        // do something
    })
    .onValid((to, from, next) => {
        // do something
    })
    .onError(e => {
        // do something
    })
    .onError(e => {
        // do something
    });
```

