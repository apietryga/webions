import markdownIt from 'markdown-it';
import fs from 'fs'

// @ts-ignore
export default defineEventHandler((event) => {

    const md = new markdownIt();
    const readme = md.render(fs.readFileSync("readme.md", "utf8"))

    return {
        readme
    }

})

