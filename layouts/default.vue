<template>
    <div class="layout__default">
        <page-header></page-header>
        <div class="wrapper">
            <nav>
                <nuxt-link to="/">Home</nuxt-link>
                <nuxt-link to="/libary">Libary</nuxt-link>
                <nuxt-link to="/players/level">Players</nuxt-link>
                <nuxt-link to="/4devs">4devs</nuxt-link>
            </nav>
            <main>
                <slot></slot>
            </main>
            <aside>
                <template v-for="item of aside">
                    <nuxt-link v-if="!item.blank"
                        :to="item.href">
                        {{ item.label }}
                    </nuxt-link>
                    <a v-else :href="item.href"
                        target="_blank">
                        {{ item.label }}
                    </a>
                </template>
            </aside>
        </div>
        <page-footer></page-footer>
    </div>
</template>

<script setup lang="ts">

    import { useRoute } from 'nuxt/app'
    import { watch, ref } from 'vue'

    const route = useRoute()
    const aside = ref([])

    const get_root_path = () => {
        const path = route.fullPath.split('/')?.[1]
        return path ? path : 'index'
    }    

    const aside_vals = {
        index: [
            {
                href: '/players/online',
                label: 'Online list'
            },
            {
                href: '/players/lastdeaths',
                label: 'Last deaths'
            },
        ],
        players: [
            {
                href: '/players/level',
                label: 'Level'
            },
            {
                href: '/players/fist',
                label: 'Fist'
            },
            {
                href: '/players/dist',
                label: 'Dist'
            },
            {
                href: '/players/def',
                label: 'Def'
            },
            {
                href: '/players/magic',
                label: 'Magic'
            },
            {
                href: '/players/online',
                label: 'Online'
            },
            {
                href: '/players/lastdeaths',
                label: 'Last Deaths'
            },
        ],
        libary: [
            {
                href: '/libary/install',
                label: 'Install'
            },
            {
                href: '/libary/controls',
                label: 'Controls'
            },
            {
                href: '/libary/monsters',
                label: 'Monsters'
            },
            {
                href: '/libary/Items',
                label: 'Items'
            },
            {
                href: '/libary/about',
                label: 'About'
            },
        ],
        '4devs': [
            {
                href: 'https://github.com/apietryga/webions',
                label: 'GITHUB',
                blank: true,
            },
        ]
    }

    aside.value = aside_vals[get_root_path()]

    watch(() => route.fullPath, e => {
        aside.value = aside_vals[get_root_path()]
    })

</script>

<style lang="scss">
    @use '@@/assets/css/default.scss';
</style>