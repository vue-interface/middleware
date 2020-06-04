import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import { route } from '../..';

const router = new VueRouter({
    routes: [
        route({
            path: '/',
            alias: '',
            name: 'home',
            component: () => import('./views/Home')
        }),

        route({
            path: '/restricted',
            name: 'restricted',
            component: () => import('./views/Restricted'),
            onError: (e) => {
                router.push({name: 'unrestricted'});
            },
            middleware(to, from, next) {
                return !!to.query.id;
            }
        }),

        route({
            path: '/unrestricted',
            name: 'unrestricted',
            component: ()=> import('./views/Unrestricted')
        })
    ]
});

export default router;