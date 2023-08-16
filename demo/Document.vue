<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
<template>
    <router-link :to="{name: 'home'}">
        &larr; Back to Home
    </router-link>

    <h1>Document {{ route.params.document }}</h1>

    <ul>
        <li>
            <router-link :to="{name: 'view-document', params: {document: route.params.document}}">
                Document Root
            </router-link>
        </li>
        <li>
            <router-link :to="{name: 'view-document-links', params: {document: route.params.document}}">
                Links
            </router-link>
        </li>
        <li>
            <router-link :to="{name: 'view-document-images', params: {document: route.params.document}}">
                Images
            </router-link>
        </li>
    </ul>

    <RouterView />
</template>