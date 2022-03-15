
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import route from '../../src/route';

let vm;
    
beforeAll(() => {
    const localVue = createLocalVue();
    
    localVue.use(VueRouter);

    const router = new VueRouter({
        routes: [
            route({
                path: '/home',
                name: 'home'
            }),
            route({
                path: '/unrestricted',
                name: 'unrestricted'
            }),
            route({
                path: '/unauthorized',
                name: 'unauthorized'
            }),
            route({
                path: '/restricted',
                name: 'restricted',
                async onError(e, next) {
                    await router.push('/unauthorized');

                    next(e);

                },
                middleware: to => !!to.query.id
            })
        ]
    });
    
    const wrapper = shallowMount(require('../demo/App'), {
        localVue,
        router
    });

    vm = wrapper.vm;
});

beforeEach(() => {
    vm.$router.push({name: 'home'});
});

describe('router.spec.js', () => {
    
    it('can redirect to unrestricted route', async() => {
        expect(vm.$route.name).toBe('home');

        await vm.$router.push({name: 'unrestricted'});

        expect(vm.$route.name).toBe('unrestricted');
    });
    
    it('cannot redirect to restricted routes', async() => {
        await expect(vm.$router.push('/restricted')).rejects.toThrowError();

        expect(vm.$route.name).toBe('unauthorized');
    });   

});