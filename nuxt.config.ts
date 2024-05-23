export default defineNuxtConfig({
    modules: [
      '@nuxthub/core'
    ],
    // @ts-ignore
    hub:{
        database: true
    }
})