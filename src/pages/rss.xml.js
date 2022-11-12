import rss from '@astrojs/rss'
import path from 'node:path'

const postImportResult = import.meta.glob('../posts/**/*.{md,mdx}', { eager: true })
const posts = Object.values(postImportResult)

export const get = () => rss({
    title: "Sorashi",
    description: "Sorashi's blog: coding, software, the Japanese language, and some math",
    site: import.meta.env.SITE,
    stylesheet: './rss/styles.xsl',
    items: posts.map((post) => {
        const slug = path.parse(post.file).name
        return {
            link: post.frontmatter.slug || slug,
            title: post.frontmatter.title,
            pubDate: post.frontmatter.date,
        }
    })
})
