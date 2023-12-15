import { defineConfig } from 'astro/config';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import mdx from "@astrojs/mdx";
import rehypePresetMinify from 'rehype-preset-minify';
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import {rehypeHeadingIds} from '@astrojs/markdown-remark'
import {h} from 'hastscript'
import { remarkReadingTime } from './src/remark-plugins/remark-reading-time.mjs';
import remarkMath from 'remark-math';
import remarkEmoji from 'remark-emoji';
import mocha from './src/shiki-themes/mocha.json';
// import latte from './src/shiki-themes/latte.json'
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
import preact from "@astrojs/preact";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";
import robotsTxt from 'astro-robots-txt';

// https://astro.build/config
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  site: 'https://sorashi.github.io',
  integrations: [tailwind(), mdx(), preact(), sitemap(), robotsTxt(), compress()],
  markdown: {
    remarkPlugins: [remarkReadingTime, remarkMath, remarkEmoji],
    rehypePlugins: [...rehypePresetMinify.plugins, [rehypeKatex, {
      // katex options
    }], rehypeHeadingIds,
        [rehypeAutolinkHeadings,
                {behavior:'prepend', content(node) {
                        return h('span.heading-anchor', '#'.repeat(node.tagName.substr(1)))
                    }
                }]
        ],
    // preserve GFmd and Smartypants
    extendDefaultPlugins: true,
    shikiConfig: {
      langs: [],
      theme: mocha,
      // multiple themes are not supported in astro, although they are in shiki
      // themes: [mocha, latte],
      wrap: false
    }
  }
});
