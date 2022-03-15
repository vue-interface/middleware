<template>
    <div>
        <h1>Home</h1>

        <router-link :to="{name: 'unrestricted'}">
            Unrestricted
        </router-link><br>
        <router-link :to="{name: 'restricted'}">
            Restricted (without ID)
        </router-link><br>
        <router-link :to="{name: 'restricted', query: {id: 1}}">
            Restricted (with ID)
        </router-link>
    </div>
</template>