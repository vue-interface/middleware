<script setup lang="ts">
import { router } from './routes';

function login() {
    window.localStorage.setItem('auth', 'true');

    router.push({ name: 'home' });
}
</script>
<template>
    <div>
        <h1 class="text-4xl mb-5">
            Login
        </h1>
        
        <p>Click the button to simulate a login.</p>

        <button @click="login">
            Login
        </button>
    </div>
</template>