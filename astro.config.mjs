import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://yihazi.com',
  output: 'static',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // 使用自定义 global.css 控制 base 样式
    }),
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: {
          zh: 'zh-CN',
          en: 'en-US',
          ja: 'ja-JP',
          es: 'es-ES',
          pt: 'pt-BR',
          fr: 'fr-FR',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en', 'ja', 'es', 'pt', 'fr'],
    routing: {
      prefixDefaultLocale: false, // 中文不加前缀，英文加 /en/
    },
  },
})
