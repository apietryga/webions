<template>
    <div>
        {{ stat_name }}
    </div>
</template>

<script setup lang="ts">

    import { useRoute } from 'nuxt/app'

    const route = useRoute()
    const stat_name = route.params.stat_name

</script>