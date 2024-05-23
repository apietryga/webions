<template>
    <div>
        <h1>Game</h1>
        <nuxt-link to="/">
            Index
        </nuxt-link>
    </div>
</template>

<script setup lang="ts">

    // @ts-nocheck
    definePageMeta({ layout: 'game' })

    navigateTo('/auth')

</script>