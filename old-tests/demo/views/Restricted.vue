<template>
    <div>
        <h1>Restricted</h1>

        <router-link :to="{name: 'home'}">
            Back to Home
        </router-link><br>
        <router-link :to="{name: 'unrestricted'}">
            Unrestricted
        </router-link>
    </div>
</template>