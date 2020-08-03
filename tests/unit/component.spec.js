
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import component from '../../src/component';

let vm;
    
beforeAll(() => {
    const localVue = createLocalVue();
    
    localVue.use(VueRouter);

    const router = new VueRouter({
        routes: [
            component(require('../demo/views/Home'), {
                path: '/',
                name: 'home'
            })
        ]
    });
    
    const wrapper = shallowMount(require('../demo/App'), {
        localVue,
        router
    });

    vm = wrapper.vm;
});

describe('router.spec.js', () => {
    
    it('can redirect to unrestricted route', async() => {
        expect(vm.$route.name).toBe('home');
    });

});