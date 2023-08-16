import vue from '@vitejs/plugin-vue';
import { pascalCase } from 'change-case';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import pkg from './package.json';

const fileName = pkg.name.split('/')[1];

const external = [
    ...(pkg.dependencies ? Object.keys(pkg.dependencies) : []),
    ...(pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : [])
];

export default ({ command }) => defineConfig({
    resolve: {
        alias: {
            'vue-router': '/node_modules/vue-router/dist/vue-router.cjs'
        }
    },
    build: {
        sourcemap: command === 'build',
        lib: {
            entry: path.resolve(__dirname, 'index.ts'),
            name: pascalCase(fileName),
            fileName,
        },
        rollupOptions: {
            external,
            output: {
                globals: external.reduce((carry, dep) => {
                    return Object.assign(carry, {
                        [dep]: pascalCase(dep)
                    });
                }, {}),
            }
        },
        watch: !process.env.NODE_ENV && {
            include: [
                './tailwindcss/**/*.js'
            ]
        }
    },
    plugins: [
        vue(),
        dts()
    ],
});