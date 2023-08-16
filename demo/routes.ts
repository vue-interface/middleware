import { createRouter, createWebHashHistory } from 'vue-router';
import { alias, group, priority, route } from '../index';
import DocumentVue from './Document.vue';
import DocumentImagesVue from './DocumentImages.vue';
import DocumentLinksVue from './DocumentLinks.vue';
import DocumentRestrictedVue from './DocumentRestricted.vue';
import HomeVue from './Home.vue';
import LoginVue from './Login.vue';

priority([
    '1',
    '2'
]);

alias('1', (_to, _from, next) => {
    console.log('Sequence Order: 2');

    next();
});

alias('2', (_to, _from, next) => {
    console.log('Sequence Order: 1');

    next();
});

alias('4', (_to, _from, next) => {
    console.log('Sequence Order: 4');

    next();
});

alias('5', (_to, _from, next) => {
    console.log('Sequence Order: 5');

    next();
});

group('4&5', ['4', '5']);

group('1&2', ['4&5', '1', '2']);

alias('auth', (_to, _from, next) => {
    if(window.localStorage.getItem('auth')) {
        next(); 
    }
    
    next({ name: 'login' });
});

alias('force-id', (to, _, next, id) => {
    if(to.params.document === id) {
        next();
    }

    next({ name: 'restricted', params: to.params });
});

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        route({
            path: '/',
            name: 'home',
            component: HomeVue
        }).middleware((_to, _from, next) => {
            console.log('Sequence Order: 3');

            next();
        }, '1&2'),

        route({
            path: '/',
            name: 'login',
            component: LoginVue
        }),

        route({
            path: '/documents/:document',
            name: 'view-document',
            component: DocumentVue,
            children: [             
                route({
                    path: 'links',
                    name: 'view-document-links',
                    component: DocumentLinksVue
                }).middleware('force-id:1'), 
                           
                route({
                    path: 'images',
                    name: 'view-document-images',
                    component: DocumentImagesVue
                }).middleware('force-id:1'), 
                           
                route({
                    path: 'restricted',
                    name: 'restricted',
                    component: DocumentRestrictedVue
                }),
            ]
        }).middleware('auth'),
    ]
});