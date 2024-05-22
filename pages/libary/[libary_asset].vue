<template>
    <div>
        {{ libary_asset }}
    </div>
</template>

<script setup lang="ts">

    import { useRoute } from 'nuxt/app'

    const route = useRoute()
    const libary_asset = route.params.libary_asset

</script>