<template>
    <header>
        <div class="logo">
            <nuxt-link to="/">
                <img :src="'/apple-touch-icon.png?v=' + version" 
                    :alt="name + ' Game Logo'" />
                <p>{{name}}</p>
                <small>v.{{ version }}</small>
            </nuxt-link>
        </div>
        <div class="play">
            <nuxt-link to="/game">
                PLAY !
            </nuxt-link>
        </div>
    </header>
</template>

<script setup>
    const name = 'WEBIONS'
    const version = '1.0.0'
</script>