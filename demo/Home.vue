<template>
    <div>
        <h1 class="text-4xl mb-5">
            Home
        </h1>

        <router-link :to="{name: 'unrestricted'}">
            Unrestricted
        </router-link><br>
        <router-link :to="{name: 'restricted'}">
            Restricted (without ID)
        </router-link><br>
        <router-link :to="{name: 'restricted', query: {id: 1}}">
            Restricted (with valid ID)
        </router-link><br>
        <router-link :to="{name: 'restricted', query: {id: 2}}">
            Restricted (with invalid ID)
        </router-link><br>
        <router-link :to="{name: 'restricted', query: {id: 3}}">
            Restricted (with exception)
        </router-link>
    </div>
</template>