<template>
    <div>
        {{ library_asset }}
    </div>
</template>

<script setup lang="ts">

    import { useRoute } from 'nuxt/app'

    const route = useRoute()
    const library_asset = route.params.library_asset

</script>