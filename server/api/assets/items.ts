// import markdownIt from 'markdown-it';
// import fs from 'fs'

import items from "../../game/assets/items"

// @ts-ignore
export default defineEventHandler((event) => {

    // const md = new markdownIt();
    // const readme = md.render(fs.readFileSync("readme.md", "utf8"))

    return items

})

