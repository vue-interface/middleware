<script setup lang="ts">
import { ref } from 'vue';

const isAuthenticated = ref(!!window.localStorage.getItem('auth'));

function loggout() {
    isAuthenticated.value = false;

    window.localStorage.removeItem('auth');
}
</script>
<template>
    <div>
        <h1 class="text-4xl mb-5">
            Vue Route Demo
        </h1>

        <p>This demo provides various examples for how to use the middleware. You must be logged in to view the document.</p>

        <h2>Auth Status</h2>
        
        <template v-if="!isAuthenticated">
            <p>
                You are not logged in.
            </p>

            <router-link :to="{name: 'login'}">
                Login
            </router-link>
        </template>
        <template v-else>
            Logged in. <button @click="loggout">
                Logout
            </button>
        </template>

        <h2>Routes with children</h2>

        <p>Try to navigate to a route if you are not logged in.</p>

        <ul>
            <li>
                <router-link :to="{name: 'view-document', params: {document: 1}}">
                    Document 1 (restricted access)
                </router-link>
                <ul>
                    <li>
                        <router-link :to="{name: 'view-document-links', params: {document: 1}}">
                            Links
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{name: 'view-document-images', params: {document: 1}}">
                            Images
                        </router-link>
                    </li>
                </ul>
            </li>
            <li>
                <router-link :to="{name: 'view-document', params: {document: 2}}">
                    Document 2 (restricted access)
                </router-link>
                <ul>
                    <li>
                        <router-link :to="{name: 'view-document-links', params: {document: 2}}">
                            Links (restricted to document id 1)
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{name: 'view-document-images', params: {document: 2}}">
                            Images (restricted to document id 1)
                        </router-link>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>