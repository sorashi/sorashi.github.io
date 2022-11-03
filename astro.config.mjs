import { defineConfig } from 'astro/config';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
import mdx from "@astrojs/mdx";
import rehypePresetMinify from 'rehype-preset-minify';
import { remarkReadingTime } from './src/remark-plugins/remark-reading-time.mjs';
import remarkMath from 'remark-math';
import mocha from './src/shiki-themes/mocha.json'
// import latte from './src/shiki-themes/latte.json'
import rehypeKatex from 'rehype-katex';


// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), image({
    serviceEntryPoint: '@astrojs/image/sharp'
  }), mdx()],
  markdown: {
    remarkPlugins: [remarkReadingTime, remarkMath],
    rehypePlugins: [
      ...rehypePresetMinify.plugins,
      [rehypeKatex, {
        // katex options
      }]
    ],
    // preserve GFmd and Smartypants
    extendDefaultPlugins: true,
    shikiConfig: {
      langs: [],
      theme: mocha,
      // multiple themes are not supported in astro, although they are in shiki
      // themes: [mocha, latte],
      wrap: false,
    }
  }
});