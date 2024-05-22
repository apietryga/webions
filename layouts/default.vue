<template>
    <div class="layout__default">
        <page-header></page-header>
        <div class="wrapper">
            <nav>
                NAV
            </nav>
            <main>
                <slot></slot>
            </main>
            <aside>
                ASIDE
            </aside>
        </div>
        <page-footer></page-footer>
    </div>
</template>

<style lang="scss">
    @use '@@/assets/css/default.scss';
</style>