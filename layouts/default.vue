<template>
    <div class="layout__default">
        <page-header></page-header>
        <div class="wrapper">
            <nav>
                <nuxt-link to="/">Home</nuxt-link>
                <nuxt-link to="/library">Library</nuxt-link>
                <nuxt-link to="/players/level">Players</nuxt-link>
                <nuxt-link to="/4devs">4devs</nuxt-link>
            </nav>
            <main>
                <h1 v-if="page_assets[page]?.title">
                    <nuxt-link v-if="page_assets[page]?.to"
                        :to="page_assets[page]?.to">
                        {{ page_assets[page]?.title }}
                    </nuxt-link>
                    <span v-else>
                        {{ page_assets[page]?.title }}
                    </span>
                </h1>
                <div class="content">
                    <slot></slot>
                </div>
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
    const page = ref('index')

    const get_root_path = () => {
        const path = route.fullPath.split('/')?.[1]
        return page.value = path ? path : 'index'
    }    

    const page_assets = {
        index: {
            items: [
                {
                    href: '/players/online',
                    label: 'Online list'
                },
                {
                    href: '/players/lastdeaths',
                    label: 'Last deaths'
                },
            ],
        },
        players:{
            items: [
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
        },
        library:{
            title: 'Library',
            to: '/library',
            items: [
                {
                    href: '/library/install',
                    label: 'Install'
                },
                {
                    href: '/library/controls',
                    label: 'Controls'
                },
                {
                    href: '/library/monsters',
                    label: 'Monsters'
                },
                {
                    href: '/library/Items',
                    label: 'Items'
                },
                {
                    href: '/library/about',
                    label: 'About'
                },
            ],
        },
        '4devs': {
            items:[
                {
                    href: 'https://github.com/apietryga/webions',
                    label: 'GITHUB',
                    blank: true,
                },
            ]
        },
    }

    aside.value = page_assets[get_root_path()]?.items

    watch(() => route.fullPath, e => {
        aside.value = page_assets[get_root_path()]?.items
    })

</script>

<style lang="scss">
    @use '@@/assets/css/default.scss';
</style>