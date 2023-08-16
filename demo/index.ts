import { createApp } from 'vue';
import { RouterView } from 'vue-router';
import { router } from './routes';

// alias('is', (to, from, next, name) => {
//     next(to.name === name);
// });

// alias('id', (to, from, next, id, name) => {
//     if(parseInt(to.query.id) === parseInt(id)) {
//         next(); 
//     }
//     else {
//         next({ name });
//     }
// });

// group('restricted', [
//     'is:restricted',
//     'id:1,unrestricted'
// ]);

createApp(RouterView)
    .use(router)
    .mount('#app');