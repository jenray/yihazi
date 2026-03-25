
# 📋 Yihazi.com 技术实现方案（AI 开发参考文档）

> **文档用途**：作为 AI 编程工具（Cursor / Copilot / Claude 等）的上下文输入，指导完整项目开发。
> **最后更新**：2026-03-25

---

## 1. 项目概述

### 1.1 产品定义

```yaml
项目名称: Yihazi（一哈子）
域名: yihazi.com
定位: 多语言在线效率工具合集网站
中文 Slogan: "一哈子，搞定！"
英文 Slogan: "Get it done in a snap!"
目标用户: 开发者、设计师、内容创作者、普通用户
支持语言: 中文（默认）、英文
设计风格: 简洁、现代、功能优先、类似 shadcn/ui 风格
```

### 1.2 核心原则

```yaml
- 所有工具尽量在浏览器端（客户端）处理，不上传用户数据到服务器
- 页面默认零 JS（Astro Islands），仅工具交互区域加载 React
- 每个工具页面都是独立的、可被搜索引擎索引的页面
- SEO 优先：每个页面有独立的 title、description、结构化数据
- 支持中英文双语，通过路由前缀区分（/ 中文, /en/ 英文）
- 移动端优先响应式设计
- 无需登录即可使用所有基础功能
```

---

## 2. 技术栈

### 2.1 核心依赖

```json
{
  "framework": "Astro 5.x",
  "ui_library": "React 19.x（仅用于交互组件）",
  "styling": "Tailwind CSS 4.x",
  "ui_components": "shadcn/ui（手动复制所需组件）",
  "icons": "lucide-react",
  "deployment": "Cloudflare Pages",
  "dns_cdn": "Cloudflare",
  "package_manager": "pnpm",
  "language": "TypeScript"
}
```

### 2.2 工具相关依赖

```json
{
  "qrcode": "二维码生成",
  "crypto-js": "哈希计算（MD5/SHA）",
  "uuid": "UUID 生成",
  "diff": "文本对比",
  "prettier": "代码格式化（JS/CSS/HTML/JSON）",
  "shiki": "代码语法高亮",
  "fflate": "浏览器端压缩/解压",
  "html-to-image": "DOM 转图片",
  "cronstrue": "Cron 表达式人类可读描述"
}
```

### 2.3 不使用的技术

```yaml
- 不使用数据库（初期）
- 不使用后端服务器 / API 服务
- 不使用 Docker
- 不使用 Redux / Zustand 等状态管理
- 不使用 CSS-in-JS
- 不使用 SSR（全部静态生成 SSG）
```

---

## 3. 项目结构

```
yihazi/
├── public/
│   ├── favicon.svg
│   ├── og-image.png                    # 默认社交分享图
│   └── robots.txt
├── src/
│   ├── components/                     # Astro 通用组件（无 JS）
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ToolCard.astro              # 首页工具卡片
│   │   ├── Breadcrumb.astro
│   │   ├── SEOHead.astro               # SEO meta 标签
│   │   └── LanguageSwitcher.astro      # 中英文切换
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro            # 基础 HTML 布局
│   │   └── ToolLayout.astro            # 工具页专用布局（带面包屑、SEO 文案区）
│   │
│   ├── tools/                          # React 交互组件（每个工具一个文件夹）
│   │   ├── json-formatter/
│   │   │   ├── JsonFormatter.tsx        # 主组件
│   │   │   ├── useJsonFormatter.ts      # 逻辑 hook
│   │   │   └── index.ts                # 导出
│   │   ├── image-compressor/
│   │   │   ├── ImageCompressor.tsx
│   │   │   ├── useImageCompressor.ts
│   │   │   └── index.ts
│   │   ├── qr-code-generator/
│   │   │   └── ...
│   │   └── ...
│   │
│   ├── ui/                             # shadcn/ui 基础组件
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Tabs.tsx
│   │   ├── Select.tsx
│   │   ├── Slider.tsx
│   │   ├── Toast.tsx
│   │   ├── CopyButton.tsx              # 复制到剪贴板按钮
│   │   └── FileDropzone.tsx            # 文件拖拽上传区域
│   │
│   ├── pages/
│   │   ├── index.astro                 # 中文首页
│   │   ├── tools/                      # 中文工具页
│   │   │   ├── index.astro             # 工具列表页
│   │   │   ├── json-formatter.astro
│   │   │   ├── image-compressor.astro
│   │   │   ├── qr-code-generator.astro
│   │   │   ├── base64-codec.astro
│   │   │   ├── hash-generator.astro
│   │   │   ├── password-generator.astro
│   │   │   ├── word-counter.astro
│   │   │   ├── case-converter.astro
│   │   │   ├── color-converter.astro
│   │   │   ├── timestamp-converter.astro
│   │   │   ├── uuid-generator.astro
│   │   │   ├── url-codec.astro
│   │   │   ├── markdown-preview.astro
│   │   │   ├── regex-tester.astro
│   │   │   ├── diff-checker.astro
│   │   │   ├── css-gradient-generator.astro
│   │   │   ├── jwt-decoder.astro
│   │   │   ├── slug-generator.astro
│   │   │   ├── unit-converter.astro
│   │   │   └── lorem-ipsum-generator.astro
│   │   └── en/                         # 英文版（镜像结构）
│   │       ├── index.astro
│   │       └── tools/
│   │           ├── index.astro
│   │           ├── json-formatter.astro
│   │           └── ...
│   │
│   ├── i18n/
│   │   ├── zh.ts                       # 中文文案
│   │   ├── en.ts                       # 英文文案
│   │   ├── types.ts                    # 类型定义
│   │   └── index.ts                    # 工具函数
│   │
│   ├── data/
│   │   └── tools.ts                    # 工具元数据（分类、图标、路由等）
│   │
│   ├── lib/
│   │   ├── utils.ts                    # 通用工具函数（cn、formatBytes 等）
│   │   └── clipboard.ts               # 剪贴板操作封装
│   │
│   └── styles/
│       └── global.css                  # Tailwind 入口 + 全局样式
│
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. 核心文件实现

### 4.1 Astro 配置

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://yihazi.com',
  output: 'static',
  integrations: [
    react(),
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: { zh: 'zh-CN', en: 'en-US' },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false, // 中文不加前缀，英文加 /en/
    },
  },
})
```

### 4.2 Tailwind 配置

```javascript
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

### 4.3 全局样式

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-bg: #ffffff;
    --color-bg-secondary: #f9fafb;
    --color-border: #e5e7eb;
    --color-text: #111827;
    --color-text-secondary: #6b7280;
  }

  body {
    @apply bg-[var(--color-bg)] text-[var(--color-text)] antialiased;
  }
}

@layer components {
  .tool-container {
    @apply max-w-4xl mx-auto px-4 py-8;
  }

  .tool-title {
    @apply text-2xl font-bold text-gray-900 mb-1;
  }

  .tool-description {
    @apply text-gray-500 mb-6;
  }

  .tool-panel {
    @apply bg-white border border-gray-200 rounded-xl p-6 shadow-sm;
  }

  .tool-textarea {
    @apply w-full min-h-[200px] p-4 border border-gray-200 rounded-lg
           font-mono text-sm resize-y
           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent;
  }

  .tool-btn-primary {
    @apply px-4 py-2 bg-brand-600 text-white rounded-lg
           hover:bg-brand-700 transition-colors text-sm font-medium;
  }

  .tool-btn-secondary {
    @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-lg
           hover:bg-gray-200 transition-colors text-sm font-medium;
  }

  .tool-output {
    @apply w-full p-4 bg-gray-900 text-green-400 rounded-lg
           overflow-auto text-sm font-mono whitespace-pre;
  }

  .tool-seo-section {
    @apply mt-16 pt-8 border-t border-gray-100 prose prose-gray max-w-none prose-sm;
  }
}
```

---

## 5. 布局组件实现

### 5.1 BaseLayout.astro

```astro
---
// src/layouts/BaseLayout.astro
import Header from '../components/Header.astro'
import Footer from '../components/Footer.astro'
import '../styles/global.css'

interface Props {
  title: string
  description: string
  lang?: 'zh' | 'en'
  canonical?: string
  ogImage?: string
}

const {
  title,
  description,
  lang = 'zh',
  canonical,
  ogImage = '/og-image.png',
} = Astro.props

const siteUrl = 'https://yihazi.com'
const canonicalUrl = canonical || new URL(Astro.url.pathname, siteUrl).toString()
---

<!doctype html>
<html lang={lang === 'zh' ? 'zh-CN' : 'en-US'}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={`${siteUrl}${ogImage}`} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:type" content="website" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

  <!-- 多语言替代链接 -->
  {lang === 'zh' && (
    <link rel="alternate" hreflang="en" href={`${siteUrl}/en${Astro.url.pathname}`} />
    <link rel="alternate" hreflang="zh" href={canonicalUrl} />
  )}
  {lang === 'en' && (
    <link rel="alternate" hreflang="zh" href={`${siteUrl}${Astro.url.pathname.replace('/en', '')}`} />
    <link rel="alternate" hreflang="en" href={canonicalUrl} />
  )}

  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet" />
</head>
<body class="min-h-screen flex flex-col">
  <Header lang={lang} />
  <main class="flex-1">
    <slot />
  </main>
  <Footer lang={lang} />

  <!-- 简单的页面访问统计（可选，后期替换为 Umami / Plausible） -->
  <script is:inline>
    // 本地存储最近使用的工具
    if (window.location.pathname.includes('/tools/')) {
      const toolPath = window.location.pathname
      const recent = JSON.parse(localStorage.getItem('recentTools') || '[]')
      const updated = [toolPath, ...recent.filter(p => p !== toolPath)].slice(0, 10)
      localStorage.setItem('recentTools', JSON.stringify(updated))
    }
  </script>
</body>
</html>
```

### 5.2 ToolLayout.astro

```astro
---
// src/layouts/ToolLayout.astro
import BaseLayout from './BaseLayout.astro'
import Breadcrumb from '../components/Breadcrumb.astro'

interface Props {
  title: string
  pageTitle: string
  description: string
  pageDescription: string
  lang?: 'zh' | 'en'
  category: string
  seoContent?: string
}

const {
  title,
  pageTitle,
  description,
  pageDescription,
  lang = 'zh',
  category,
} = Astro.props

const breadcrumbItems = lang === 'zh'
  ? [
      { label: '首页', href: '/' },
      { label: '全部工具', href: '/tools' },
      { label: pageTitle },
    ]
  : [
      { label: 'Home', href: '/en' },
      { label: 'All Tools', href: '/en/tools' },
      { label: pageTitle },
    ]
---

<BaseLayout title={title} description={description} lang={lang}>
  <div class="tool-container">
    <Breadcrumb items={breadcrumbItems} />
    <h1 class="tool-title">{pageTitle}</h1>
    <p class="tool-description">{pageDescription}</p>

    <div class="tool-panel">
      <slot />
    </div>

    <!-- SEO 内容区 -->
    <div class="tool-seo-section">
      <slot name="seo-content" />
    </div>
  </div>
</BaseLayout>
```

### 5.3 Header.astro

```astro
---
// src/components/Header.astro
interface Props {
  lang?: 'zh' | 'en'
}

const { lang = 'zh' } = Astro.props
const isZh = lang === 'zh'
---

<header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
  <nav class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
    <a href={isZh ? '/' : '/en'} class="flex items-center gap-2 text-lg font-bold text-gray-900">
      <span class="text-2xl">⚡</span>
      <span>{isZh ? '一哈子' : 'Yihazi'}</span>
    </a>

    <div class="flex items-center gap-6 text-sm">
      <a
        href={isZh ? '/tools' : '/en/tools'}
        class="text-gray-600 hover:text-gray-900 transition-colors"
      >
        {isZh ? '全部工具' : 'All Tools'}
      </a>

      <!-- 语言切换 -->
      <a
        href={isZh ? '/en' : '/'}
        class="px-2 py-1 text-xs border border-gray-200 rounded-md text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors"
      >
        {isZh ? 'EN' : '中文'}
      </a>

      <!-- GitHub 链接（可选） -->
      <a
        href="https://github.com/jenray/yihazi"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
        </svg>
      </a>
    </div>
  </nav>
</header>
```

### 5.4 Footer.astro

```astro
---
// src/components/Footer.astro
interface Props {
  lang?: 'zh' | 'en'
}

const { lang = 'zh' } = Astro.props
const isZh = lang === 'zh'
const year = new Date().getFullYear()
---

<footer class="border-t border-gray-100 bg-gray-50">
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
      <p>© {year} yihazi.com — {isZh ? '一哈子，搞定！' : 'Get it done in a snap!'}</p>
      <div class="flex gap-4">
        <a href={isZh ? '/about' : '/en/about'} class="hover:text-gray-900">
          {isZh ? '关于' : 'About'}
        </a>
        <a href={isZh ? '/privacy' : '/en/privacy'} class="hover:text-gray-900">
          {isZh ? '隐私政策' : 'Privacy'}
        </a>
        <a href="mailto:hi@yihazi.com" class="hover:text-gray-900">
          {isZh ? '联系' : 'Contact'}
        </a>
      </div>
    </div>
  </div>
</footer>
```

### 5.5 Breadcrumb.astro

```astro
---
// src/components/Breadcrumb.astro
interface BreadcrumbItem {
  label: string
  href?: string
}

interface Props {
  items: BreadcrumbItem[]
}

const { items } = Astro.props
---

<nav class="mb-4 text-sm text-gray-400" aria-label="Breadcrumb">
  <ol class="flex items-center gap-1.5" itemscope itemtype="https://schema.org/BreadcrumbList">
    {items.map((item, index) => (
      <li
        class="flex items-center gap-1.5"
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
      >
        {index > 0 && <span>/</span>}
        {item.href ? (
          <a href={item.href} class="hover:text-gray-700 transition-colors" itemprop="item">
            <span itemprop="name">{item.label}</span>
          </a>
        ) : (
          <span class="text-gray-600" itemprop="name">{item.label}</span>
        )}
        <meta itemprop="position" content={String(index + 1)} />
      </li>
    ))}
  </ol>
</nav>
```

---

## 6. 国际化 (i18n) 实现

### 6.1 类型定义

```typescript
// src/i18n/types.ts
export type Locale = 'zh' | 'en'

export interface Translation {
  // 网站通用
  site: {
    name: string
    slogan: string
    allTools: string
    home: string
    search: string
    searchPlaceholder: string
    recentlyUsed: string
    popular: string
    noResults: string
  }

  // 工具分类名称
  categories: {
    text: string
    image: string
    developer: string
    generator: string
    converter: string
    calculator: string
  }

  // 通用按钮文案
  actions: {
    copy: string
    copied: string
    clear: string
    download: string
    upload: string
    format: string
    minify: string
    encode: string
    decode: string
    generate: string
    convert: string
    reset: string
    swap: string
    paste: string
  }

  // 通用提示
  messages: {
    copySuccess: string
    invalidInput: string
    processingLocally: string
    dropFileHere: string
    orClickToUpload: string
  }

  // 每个工具的文案
  tools: Record<string, {
    title: string
    pageTitle: string       // HTML <title>
    description: string     // meta description
    shortDescription: string // 首页卡片描述
    inputPlaceholder?: string
    seoContent: string      // SEO 文案（HTML）
  }>
}
```

### 6.2 中文翻译

```typescript
// src/i18n/zh.ts
import type { Translation } from './types'

export const zh: Translation = {
  site: {
    name: '一哈子',
    slogan: '一哈子，搞定！',
    allTools: '全部工具',
    home: '首页',
    search: '搜索',
    searchPlaceholder: '搜索工具...',
    recentlyUsed: '最近使用',
    popular: '热门工具',
    noResults: '没有找到相关工具',
  },
  categories: {
    text: '文本工具',
    image: '图片工具',
    developer: '开发工具',
    generator: '生成工具',
    converter: '转换工具',
    calculator: '计算工具',
  },
  actions: {
    copy: '复制',
    copied: '已复制！',
    clear: '清空',
    download: '下载',
    upload: '上传',
    format: '格式化',
    minify: '压缩',
    encode: '编码',
    decode: '解码',
    generate: '生成',
    convert: '转换',
    reset: '重置',
    swap: '交换',
    paste: '粘贴',
  },
  messages: {
    copySuccess: '已复制到剪贴板',
    invalidInput: '输入格式有误，请检查',
    processingLocally: '所有处理均在本地完成，数据不会上传到服务器',
    dropFileHere: '拖拽文件到这里',
    orClickToUpload: '或点击选择文件',
  },
  tools: {
    'json-formatter': {
      title: 'JSON 格式化',
      pageTitle: 'JSON 格式化工具 - 在线美化/压缩/校验 | 一哈子',
      description: '免费在线 JSON 格式化工具，支持 JSON 美化、压缩、校验。无需安装，一哈子搞定。',
      shortDescription: 'JSON 美化、压缩、校验',
      inputPlaceholder: '在此粘贴 JSON...',
      seoContent: `<h2>什么是 JSON 格式化？</h2><p>JSON 格式化是将紧凑的 JSON 字符串转换为带缩进的易读格式的过程。本工具支持 JSON 美化（添加缩进和换行）、JSON 压缩（移除空白字符）以及 JSON 校验（检查语法是否正确）。</p><h2>如何使用？</h2><p>1. 将 JSON 文本粘贴到输入框中<br/>2. 点击"格式化"按钮进行美化，或点击"压缩"按钮进行压缩<br/>3. 结果会即时显示，可一键复制。</p>`,
    },
    'image-compressor': {
      title: '图片压缩',
      pageTitle: '在线图片压缩 - 免费压缩 PNG/JPG/WebP | 一哈子',
      description: '免费在线图片压缩工具，支持 PNG、JPG、WebP 格式，浏览器本地处理，不上传服务器。',
      shortDescription: '压缩图片体积，保持画质',
      seoContent: `<h2>为什么需要压缩图片？</h2><p>较小的图片文件可以加快网页加载速度，节省存储空间和带宽。本工具直接在浏览器中处理图片，您的文件不会被上传到任何服务器。</p>`,
    },
    // ... 其他工具的文案
  },
}
```

### 6.3 英文翻译

```typescript
// src/i18n/en.ts
import type { Translation } from './types'

export const en: Translation = {
  site: {
    name: 'Yihazi',
    slogan: 'Get it done in a snap!',
    allTools: 'All Tools',
    home: 'Home',
    search: 'Search',
    searchPlaceholder: 'Search tools...',
    recentlyUsed: 'Recently Used',
    popular: 'Popular Tools',
    noResults: 'No tools found',
  },
  categories: {
    text: 'Text Tools',
    image: 'Image Tools',
    developer: 'Developer Tools',
    generator: 'Generators',
    converter: 'Converters',
    calculator: 'Calculators',
  },
  actions: {
    copy: 'Copy',
    copied: 'Copied!',
    clear: 'Clear',
    download: 'Download',
    upload: 'Upload',
    format: 'Format',
    minify: 'Minify',
    encode: 'Encode',
    decode: 'Decode',
    generate: 'Generate',
    convert: 'Convert',
    reset: 'Reset',
    swap: 'Swap',
    paste: 'Paste',
  },
  messages: {
    copySuccess: 'Copied to clipboard',
    invalidInput: 'Invalid input, please check',
    processingLocally: 'All processing is done locally. Your data never leaves your browser.',
    dropFileHere: 'Drop file here',
    orClickToUpload: 'or click to upload',
  },
  tools: {
    'json-formatter': {
      title: 'JSON Formatter',
      pageTitle: 'JSON Formatter - Online JSON Beautifier & Validator | Yihazi',
      description: 'Free online JSON formatter and validator. Beautify, minify, and validate JSON data instantly. No installation required.',
      shortDescription: 'Beautify, minify & validate JSON',
      inputPlaceholder: 'Paste your JSON here...',
      seoContent: `<h2>What is JSON Formatting?</h2><p>JSON formatting transforms compact JSON strings into a human-readable format with proper indentation. This tool supports JSON beautification, minification, and validation.</p><h2>How to use?</h2><p>1. Paste your JSON into the input field<br/>2. Click "Format" to beautify or "Minify" to compress<br/>3. Results appear instantly. Click "Copy" to copy to clipboard.</p>`,
    },
    'image-compressor': {
      title: 'Image Compressor',
      pageTitle: 'Online Image Compressor - Compress PNG/JPG/WebP Free | Yihazi',
      description: 'Free online image compression tool. Compress PNG, JPG, and WebP images directly in your browser. Your files never leave your device.',
      shortDescription: 'Reduce image size while keeping quality',
      seoContent: `<h2>Why compress images?</h2><p>Smaller image files improve page load speed, save storage space, and reduce bandwidth. This tool processes everything locally in your browser — your files are never uploaded to any server.</p>`,
    },
    // ... other tools
  },
}
```

### 6.4 i18n 工具函数

```typescript
// src/i18n/index.ts
import { zh } from './zh'
import { en } from './en'
import type { Translation, Locale } from './types'

const translations: Record<Locale, Translation> = { zh, en }

export function getTranslation(locale: Locale): Translation {
  return translations[locale] || translations.zh
}

export function getLocaleFromUrl(url: URL): Locale {
  const pathname = url.pathname
  if (pathname.startsWith('/en')) return 'en'
  return 'zh'
}

export function getToolPath(toolSlug: string, locale: Locale): string {
  if (locale === 'en') return `/en/tools/${toolSlug}`
  return `/tools/${toolSlug}`
}
```

---

## 7. 工具元数据

```typescript
// src/data/tools.ts
export type ToolCategory = 'text' | 'image' | 'developer' | 'generator' | 'converter' | 'calculator'

export interface ToolMeta {
  slug: string
  icon: string           // emoji 图标
  category: ToolCategory
  tags: string[]         // 搜索用标签
  isNew?: boolean
  isPopular?: boolean
}

export const tools: ToolMeta[] = [
  // === 文本工具 ===
  {
    slug: 'json-formatter',
    icon: '📋',
    category: 'developer',
    tags: ['json', 'format', 'beautify', 'validate', '格式化', '美化'],
    isPopular: true,
  },
  {
    slug: 'word-counter',
    icon: '🔢',
    category: 'text',
    tags: ['word', 'count', 'character', '字数', '统计'],
    isPopular: true,
  },
  {
    slug: 'case-converter',
    icon: '🔤',
    category: 'text',
    tags: ['case', 'uppercase', 'lowercase', 'camel', '大小写'],
  },
  {
    slug: 'diff-checker',
    icon: '🔍',
    category: 'text',
    tags: ['diff', 'compare', 'text', '对比', '差异'],
  },
  {
    slug: 'slug-generator',
    icon: '🔗',
    category: 'text',
    tags: ['slug', 'url', 'seo', 'permalink'],
  },
  {
    slug: 'lorem-ipsum-generator',
    icon: '📝',
    category: 'text',
    tags: ['lorem', 'ipsum', 'placeholder', '占位文本'],
  },
  {
    slug: 'markdown-preview',
    icon: '📑',
    category: 'text',
    tags: ['markdown', 'preview', 'editor', '预览'],
  },

  // === 图片工具 ===
  {
    slug: 'image-compressor',
    icon: '🖼️',
    category: 'image',
    tags: ['image', 'compress', 'png', 'jpg', 'webp', '图片', '压缩'],
    isPopular: true,
  },
  {
    slug: 'color-converter',
    icon: '🎨',
    category: 'converter',
    tags: ['color', 'hex', 'rgb', 'hsl', '颜色', '转换'],
  },
  {
    slug: 'css-gradient-generator',
    icon: '🌈',
    category: 'developer',
    tags: ['css', 'gradient', '渐变', '生成'],
    isNew: true,
  },

  // === 开发工具 ===
  {
    slug: 'base64-codec',
    icon: '🔐',
    category: 'developer',
    tags: ['base64', 'encode', 'decode', '编码', '解码'],
    isPopular: true,
  },
  {
    slug: 'url-codec',
    icon: '🌐',
    category: 'developer',
    tags: ['url', 'encode', 'decode', 'percent', '编码'],
  },
  {
    slug: 'hash-generator',
    icon: '🔒',
    category: 'developer',
    tags: ['hash', 'md5', 'sha', 'sha256', '哈希'],
  },
  {
    slug: 'regex-tester',
    icon: '🧪',
    category: 'developer',
    tags: ['regex', 'regular expression', 'test', '正则'],
  },
  {
    slug: 'jwt-decoder',
    icon: '🎫',
    category: 'developer',
    tags: ['jwt', 'token', 'decode', 'json web token'],
  },
  {
    slug: 'timestamp-converter',
    icon: '⏱️',
    category: 'converter',
    tags: ['timestamp', 'unix', 'epoch', 'date', '时间戳'],
    isPopular: true,
  },

  // === 生成工具 ===
  {
    slug: 'qr-code-generator',
    icon: '📱',
    category: 'generator',
    tags: ['qr', 'qrcode', 'barcode', '二维码'],
    isPopular: true,
  },
  {
    slug: 'password-generator',
    icon: '🔑',
    category: 'generator',
    tags: ['password', 'random', 'secure', '密码', '随机'],
    isPopular: true,
  },
  {
    slug: 'uuid-generator',
    icon: '🆔',
    category: 'generator',
    tags: ['uuid', 'guid', 'unique id'],
  },

  // === 转换工具 ===
  {
    slug: 'unit-converter',
    icon: '📐',
    category: 'converter',
    tags: ['unit', 'length', 'weight', 'temperature', '单位', '转换'],
  },
]

// 按分类分组的工具函数
export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return tools.filter((t) => t.category === category)
}

export function getPopularTools(): ToolMeta[] {
  return tools.filter((t) => t.isPopular)
}

export function searchTools(query: string): ToolMeta[] {
  const q = query.toLowerCase()
  return tools.filter(
    (t) =>
      t.slug.includes(q) ||
      t.tags.some((tag) => tag.includes(q))
  )
}
```

---

## 8. 页面实现

### 8.1 首页 index.astro

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro'
import ToolCard from '../components/ToolCard.astro'
import { getTranslation } from '../i18n'
import { tools, getPopularTools } from '../data/tools'

const t = getTranslation('zh')
const popular = getPopularTools()
const categories = ['text', 'developer', 'generator', 'converter', 'image', 'calculator'] as const
---

<BaseLayout
  title="一哈子在线工具箱 - 免费效率工具合集 | yihazi.com"
  description="一哈子工具箱提供免费在线工具：JSON格式化、图片压缩、二维码生成、Base64编码、密码生成等。浏览器本地处理，保护隐私。"
  lang="zh"
>
  <!-- Hero -->
  <section class="text-center py-16 px-4">
    <h1 class="text-4xl font-bold mb-3">
      <span class="text-3xl mr-2">⚡</span>{t.site.name}
    </h1>
    <p class="text-gray-500 text-lg mb-8">{t.site.slogan} 免费在线效率工具集</p>

    <!-- 搜索框 -->
    <div class="max-w-md mx-auto relative" id="search-container">
      <input
        type="text"
        id="tool-search"
        placeholder={t.site.searchPlaceholder}
        class="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl text-sm
               focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      />
      <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <p class="text-xs text-gray-400 mt-3">
      {t.messages.processingLocally}
    </p>
  </section>

  <!-- 热门工具 -->
  <section class="max-w-5xl mx-auto px-4 mb-12">
    <h2 class="text-lg font-semibold mb-4">🔥 {t.site.popular}</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {popular.map((tool) => (
        <ToolCard tool={tool} lang="zh" t={t} />
      ))}
    </div>
  </section>

  <!-- 按分类展示 -->
  {categories.map((cat) => {
    const catTools = tools.filter((t) => t.category === cat)
    if (catTools.length === 0) return null
    return (
      <section class="max-w-5xl mx-auto px-4 mb-10">
        <h2 class="text-lg font-semibold mb-4">{t.categories[cat]}</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {catTools.map((tool) => (
            <ToolCard tool={tool} lang="zh" t={t} />
          ))}
        </div>
      </section>
    )
  })}
</BaseLayout>

<!-- 搜索功能（轻量 inline JS，无需 React） -->
<script is:inline>
  document.getElementById('tool-search')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase()
    document.querySelectorAll('[data-tool-tags]').forEach((card) => {
      const tags = card.getAttribute('data-tool-tags') || ''
      card.style.display = tags.includes(query) || query === '' ? '' : 'none'
    })
  })
</script>
```

### 8.2 ToolCard.astro

```astro
---
// src/components/ToolCard.astro
import type { ToolMeta } from '../data/tools'
import type { Translation, Locale } from '../i18n/types'

interface Props {
  tool: ToolMeta
  lang: Locale
  t: Translation
}

const { tool, lang, t } = Astro.props
const toolT = t.tools[tool.slug]
const href = lang === 'en' ? `/en/tools/${tool.slug}` : `/tools/${tool.slug}`
---

<a
  href={href}
  class="group flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl
         hover:border-brand-200 hover:shadow-sm transition-all"
  data-tool-tags={tool.tags.join(',')}
>
  <span class="text-2xl">{tool.icon}</span>
  <div class="min-w-0">
    <div class="font-medium text-sm text-gray-900 group-hover:text-brand-600 transition-colors flex items-center gap-1.5">
      {toolT?.title || tool.slug}
      {tool.isNew && <span class="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">NEW</span>}
    </div>
    <div class="text-xs text-gray-400 truncate">
      {toolT?.shortDescription || ''}
    </div>
  </div>
</a>
```

### 8.3 工具页面示例（JSON Formatter）

```astro
---
// src/pages/tools/json-formatter.astro
import ToolLayout from '../../layouts/ToolLayout.astro'
import JsonFormatter from '../../tools/json-formatter/JsonFormatter'
import { getTranslation } from '../../i18n'

const t = getTranslation('zh')
const toolT = t.tools['json-formatter']
---

<ToolLayout
  title={toolT.pageTitle}
  pageTitle={toolT.title}
  description={toolT.description}
  pageDescription="粘贴 JSON，一哈子格式化"
  lang="zh"
  category="developer"
>
  <JsonFormatter client:load lang="zh" />

  <Fragment slot="seo-content" set:html={toolT.seoContent} />
</ToolLayout>
```

---

## 9. React 工具组件实现

### 9.1 通用 UI 组件

```tsx
// src/ui/CopyButton.tsx
import { useState } from 'react'

interface Props {
  text: string
  label?: string
  copiedLabel?: string
}

export function CopyButton({ text, label = 'Copy', copiedLabel = 'Copied!' }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={handleCopy} className="tool-btn-secondary">
      {copied ? `✅ ${copiedLabel}` : `📋 ${label}`}
    </button>
  )
}
```

```tsx
// src/ui/FileDropzone.tsx
import { useState, useRef, type ReactNode } from 'react'

interface Props {
  accept?: string
  onFile: (file: File) => void
  children?: ReactNode
  dropText?: string
  clickText?: string
}

export function FileDropzone({
  accept = 'image/*',
  onFile,
  dropText = '拖拽文件到这里',
  clickText = '或点击选择文件',
}: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
        ${isDragging ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}
      `}
    >
      <p class="text-gray-500">{dropText}</p>
      <p class="text-sm text-gray-400 mt-1">{clickText}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => { if (e.target.files?.[0]) onFile(e.target.files[0]) }}
        className="hidden"
      />
    </div>
  )
}
```

### 9.2 JSON Formatter

```tsx
// src/tools/json-formatter/JsonFormatter.tsx
import { useState } from 'react'
import { CopyButton } from '../../ui/CopyButton'

interface Props {
  lang: 'zh' | 'en'
}

export default function JsonFormatter({ lang }: Props) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indentSize, setIndentSize] = useState(2)

  const isZh = lang === 'zh'

  const format = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indentSize))
      setError('')
    } catch {
      setError(isZh ? 'JSON 格式有误，请检查' : 'Invalid JSON. Please check your input.')
      setOutput('')
    }
  }

  const minify = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch {
      setError(isZh ? 'JSON 格式有误，请检查' : 'Invalid JSON. Please check your input.')
      setOutput('')
    }
  }

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText()
    setInput(text)
  }

  const clear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <div className="space-y-4">
      {/* 输入区 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">
            {isZh ? '输入' : 'Input'}
          </label>
          <div className="flex gap-2">
            <button onClick={handlePaste} className="text-xs text-gray-500 hover:text-gray-700">
              📋 {isZh ? '粘贴' : 'Paste'}
            </button>
            <button onClick={clear} className="text-xs text-gray-500 hover:text-gray-700">
              🗑️ {isZh ? '清空' : 'Clear'}
            </button>
          </div>
        </div>
        <textarea
          className="tool-textarea"
          placeholder={isZh ? '在此粘贴 JSON...' : 'Paste your JSON here...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={format} className="tool-btn-primary">
          {isZh ? '格式化' : 'Format'}
        </button>
        <button onClick={minify} className="tool-btn-secondary">
          {isZh ? '压缩' : 'Minify'}
        </button>

        <div className="flex items-center gap-2 ml-auto text-sm text-gray-500">
          <label>{isZh ? '缩进' : 'Indent'}:</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="border border-gray-200 rounded px-2 py-1 text-sm"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 tab</option>
          </select>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* 输出区 */}
      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              {isZh ? '结果' : 'Result'}
            </label>
            <CopyButton
              text={output}
              label={isZh ? '复制' : 'Copy'}
              copiedLabel={isZh ? '已复制！' : 'Copied!'}
            />
          </div>
          <pre className="tool-output max-h-[400px]">{output}</pre>
        </div>
      )}
    </div>
  )
}
```

### 9.3 Image Compressor

```tsx
// src/tools/image-compressor/ImageCompressor.tsx
import { useState } from 'react'
import { FileDropzone } from '../../ui/FileDropzone'

interface Props {
  lang: 'zh' | 'en'
}

interface CompressResult {
  originalSize: number
  compressedSize: number
  originalUrl: string
  compressedUrl: string
  fileName: string
}

export default function ImageCompressor({ lang }: Props) {
  const [quality, setQuality] = useState(0.7)
  const [result, setResult] = useState<CompressResult | null>(null)
  const [processing, setProcessing] = useState(false)

  const isZh = lang === 'zh'

  const compressImage = (file: File) => {
    setProcessing(true)
    const img = new Image()
    const originalUrl = URL.createObjectURL(file)
    img.src = originalUrl

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)

      const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setResult({
              originalSize: file.size,
              compressedSize: blob.size,
              originalUrl,
              compressedUrl: URL.createObjectURL(blob),
              fileName: file.name.replace(/\.[^.]+$/, '') + '_compressed.jpg',
            })
          }
          setProcessing(false)
        },
        outputType,
        quality
      )
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const savingsPercent = result
    ? ((1 - result.compressedSize / result.originalSize) * 100).toFixed(1)
    : '0'

  return (
    <div className="space-y-6">
      {/* 质量滑块 */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          {isZh ? '压缩质量' : 'Quality'}: {Math.round(quality * 100)}%
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
          className="flex-1"
        />
      </div>

      {/* 上传区域 */}
      <FileDropzone
        accept="image/png,image/jpeg,image/webp"
        onFile={compressImage}
        dropText={isZh ? '拖拽图片到这里' : 'Drop image here'}
        clickText={isZh ? '或点击选择图片（PNG/JPG/WebP）' : 'or click to select (PNG/JPG/WebP)'}
      />

      {processing && (
        <div className="text-center text-gray-500 py-4">
          ⏳ {isZh ? '处理中...' : 'Processing...'}
        </div>
      )}

      {/* 结果展示 */}
      {result && !processing && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-gray-500">{isZh ? '压缩前' : 'Before'}</p>
              <p className="font-semibold text-lg">{formatBytes(result.originalSize)}</p>
            </div>
            <div>
              <p className="text-gray-500">{isZh ? '压缩后' : 'After'}</p>
              <p className="font-semibold text-lg">{formatBytes(result.compressedSize)}</p>
            </div>
            <div>
              <p className="text-gray-500">{isZh ? '节省' : 'Saved'}</p>
              <p className="font-bold text-lg text-green-600">{savingsPercent}%</p>
            </div>
          </div>

          {/* 对比预览 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">{isZh ? '原图' : 'Original'}</p>
              <img src={result.originalUrl} alt="Original" className="rounded-lg border max-h-48 w-full object-contain" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{isZh ? '压缩后' : 'Compressed'}</p>
              <img src={result.compressedUrl} alt="Compressed" className="rounded-lg border max-h-48 w-full object-contain" />
            </div>
          </div>

          <a
            href={result.compressedUrl}
            download={result.fileName}
            className="tool-btn-primary inline-block text-center w-full"
          >
            ⬇️ {isZh ? '下载压缩后图片' : 'Download Compressed Image'}
          </a>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        🔒 {isZh
          ? '所有处理均在本地浏览器完成，图片不会上传到服务器'
          : 'All processing is done locally in your browser. Your images never leave your device.'}
      </p>
    </div>
  )
}
```

### 9.4 QR Code Generator

```tsx
// src/tools/qr-code-generator/QrCodeGenerator.tsx
import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface Props {
  lang: 'zh' | 'en'
}

export default function QrCodeGenerator({ lang }: Props) {
  const [text, setText] = useState('')
  const [size, setSize] = useState(256)
  const [color, setColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const isZh = lang === 'zh'

  useEffect(() => {
    if (!text || !canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      color: { dark: color, light: bgColor },
      margin: 2,
    })
  }, [text, size, color, bgColor])

  const download = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-4">
      <textarea
        className="tool-textarea"
        placeholder={isZh ? '输入文本或网址...' : 'Enter text or URL...'}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <label>{isZh ? '尺寸' : 'Size'}:</label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={128}>128px</option>
            <option value={256}>256px</option>
            <option value={512}>512px</option>
            <option value={1024}>1024px</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label>{isZh ? '颜色' : 'Color'}:</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
        </div>
        <div className="flex items-center gap-2">
          <label>{isZh ? '背景' : 'Background'}:</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
        </div>
      </div>

      {text && (
        <div className="flex flex-col items-center gap-4 py-4">
          <canvas ref={canvasRef} className="rounded-lg border" />
          <button onClick={download} className="tool-btn-primary">
            ⬇️ {isZh ? '下载二维码' : 'Download QR Code'}
          </button>
        </div>
      )}
    </div>
  )
}
```

### 9.5 Password Generator

```tsx
// src/tools/password-generator/PasswordGenerator.tsx
import { useState, useCallback } from 'react'
import { CopyButton } from '../../ui/CopyButton'

interface Props {
  lang: 'zh' | 'en'
}

const CHARSETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

export default function PasswordGenerator({ lang }: Props) {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  })
  const [password, setPassword] = useState('')
  const [count, setCount] = useState(1)

  const isZh = lang === 'zh'

  const generate = useCallback(() => {
    let charset = ''
    if (options.lowercase) charset += CHARSETS.lowercase
    if (options.uppercase) charset += CHARSETS.uppercase
    if (options.numbers) charset += CHARSETS.numbers
    if (options.symbols) charset += CHARSETS.symbols

    if (!charset) {
      setPassword(isZh ? '请至少选择一种字符类型' : 'Please select at least one character type')
      return
    }

    const passwords: string[] = []
    for (let j = 0; j < count; j++) {
      const array = new Uint32Array(length)
      crypto.getRandomValues(array)
      let pw = ''
      for (let i = 0; i < length; i++) {
        pw += charset[array[i] % charset.length]
      }
      passwords.push(pw)
    }
    setPassword(passwords.join('\n'))
  }, [length, options, count, isZh])

  const strengthLabel = (): { text: string; color: string } => {
    let entropy = 0
    let poolSize = 0
    if (options.lowercase) poolSize += 26
    if (options.uppercase) poolSize += 26
    if (options.numbers) poolSize += 10
    if (options.symbols) poolSize += 30
    entropy = length * Math.log2(poolSize || 1)

    if (entropy < 40) return { text: isZh ? '弱' : 'Weak', color: 'text-red-500' }
    if (entropy < 60) return { text: isZh ? '一般' : 'Fair', color: 'text-yellow-500' }
    if (entropy < 80) return { text: isZh ? '强' : 'Strong', color: 'text-green-500' }
    return { text: isZh ? '非常强' : 'Very Strong', color: 'text-green-700' }
  }

  const strength = strengthLabel()

  return (
    <div className="space-y-4">
      {/* 长度 */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium w-20">{isZh ? '长度' : 'Length'}: {length}</label>
        <input
          type="range" min="4" max="128" value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="flex-1"
        />
      </div>

      {/* 选项 */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(options).map(([key, val]) => (
          <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={val}
              onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
              className="rounded"
            />
            {{
              lowercase: isZh ? '小写字母 (a-z)' : 'Lowercase (a-z)',
              uppercase: isZh ? '大写字母 (A-Z)' : 'Uppercase (A-Z)',
              numbers: isZh ? '数字 (0-9)' : 'Numbers (0-9)',
              symbols: isZh ? '符号 (!@#$...)' : 'Symbols (!@#$...)',
            }[key]}
          </label>
        ))}
      </div>

      {/* 数量 */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">{isZh ? '生成数量' : 'Count'}:</label>
        <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="border rounded px-2 py-1 text-sm">
          {[1, 5, 10, 20].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <button onClick={generate} className="tool-btn-primary w-full">
        🔑 {isZh ? '生成密码' : 'Generate Password'}
      </button>

      {password && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${strength.color}`}>
              {isZh ? '强度' : 'Strength'}: {strength.text}
            </span>
            <CopyButton
              text={password}
              label={isZh ? '复制' : 'Copy'}
              copiedLabel={isZh ? '已复制！' : 'Copied!'}
            />
          </div>
          <pre className="tool-output select-all">{password}</pre>
        </div>
      )}
    </div>
  )
}
```

### 9.6 Base64 Codec

```tsx
// src/tools/base64-codec/Base64Codec.tsx
import { useState } from 'react'
import { CopyButton } from '../../ui/CopyButton'

interface Props {
  lang: 'zh' | 'en'
}

export default function Base64Codec({ lang }: Props) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')

  const isZh = lang === 'zh'

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))))
      } else {
        setOutput(decodeURIComponent(escape(atob(input))))
      }
      setError('')
    } catch {
      setError(isZh ? '输入内容无法解码，请检查' : 'Unable to decode input. Please check.')
      setOutput('')
    }
  }

  const swap = () => {
    setInput(output)
    setOutput('')
    setMode(mode === 'encode' ? 'decode' : 'encode')
  }

  return (
    <div className="space-y-4">
      {/* 模式切换 */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encode')}
          className={mode === 'encode' ? 'tool-btn-primary' : 'tool-btn-secondary'}
        >
          {isZh ? '编码' : 'Encode'}
        </button>
        <button
          onClick={() => setMode('decode')}
          className={mode === 'decode' ? 'tool-btn-primary' : 'tool-btn-secondary'}
        >
          {isZh ? '解码' : 'Decode'}
        </button>
      </div>

      <textarea
        className="tool-textarea"
        placeholder={mode === 'encode'
          ? (isZh ? '输入要编码的文本...' : 'Enter text to encode...')
          : (isZh ? '输入要解码的 Base64...' : 'Enter Base64 to decode...')
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="flex gap-3">
        <button onClick={process} className="tool-btn-primary">
          {mode === 'encode' ? (isZh ? '编码' : 'Encode') : (isZh ? '解码' : 'Decode')}
        </button>
        {output && (
          <button onClick={swap} className="tool-btn-secondary">
            🔄 {isZh ? '交换输入输出' : 'Swap'}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">⚠️ {error}</p>}

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">{isZh ? '结果' : 'Result'}</label>
            <CopyButton text={output} label={isZh ? '复制' : 'Copy'} copiedLabel={isZh ? '已复制！' : 'Copied!'} />
          </div>
          <pre className="tool-output max-h-[300px]">{output}</pre>
        </div>
      )}
    </div>
  )
}
```

### 9.7 Word Counter

```tsx
// src/tools/word-counter/WordCounter.tsx
import { useState, useMemo } from 'react'

interface Props {
  lang: 'zh' | 'en'
}

export default function WordCounter({ lang }: Props) {
  const [text, setText] = useState('')
  const isZh = lang === 'zh'

  const stats = useMemo(() => {
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const sentences = text.trim() ? text.split(/[.!?。！？]+/).filter(Boolean).length : 0
    const paragraphs = text.trim() ? text.split(/\n\n+/).filter(Boolean).length : 0
    const lines = text.trim() ? text.split('\n').length : 0

    // 中文字符数
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length

    // 阅读时间（英文 200 词/分钟，中文 300 字/分钟）
    const readingTimeMin = Math.max(1, Math.ceil((words + chineseChars) / 250))

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      chineseChars,
      readingTimeMin,
    }
  }, [text])

  const statItems = isZh
    ? [
        { label: '字符数', value: stats.characters },
        { label: '字符数（无空格）', value: stats.charactersNoSpaces },
        { label: '单词数', value: stats.words },
        { label: '中文字数', value: stats.chineseChars },
        { label: '句子数', value: stats.sentences },
        { label: '段落数', value: stats.paragraphs },
        { label: '行数', value: stats.lines },
        { label: '阅读时间', value: `≈ ${stats.readingTimeMin} 分钟` },
      ]
    : [
        { label: 'Characters', value: stats.characters },
        { label: 'Characters (no spaces)', value: stats.charactersNoSpaces },
        { label: 'Words', value: stats.words },
        { label: 'Chinese Characters', value: stats.chineseChars },
        { label: 'Sentences', value: stats.sentences },
        { label: 'Paragraphs', value: stats.paragraphs },
        { label: 'Lines', value: stats.lines },
        { label: 'Reading Time', value: `≈ ${stats.readingTimeMin} min` },
      ]

  return (
    <div className="space-y-4">
      {/* 统计面板 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statItems.map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-xs text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* 输入区 */}
      <textarea
        className="tool-textarea min-h-[300px]"
        placeholder={isZh ? '在此输入或粘贴文本...' : 'Type or paste your text here...'}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  )
}
```

### 9.8 Timestamp Converter

```tsx
// src/tools/timestamp-converter/TimestampConverter.tsx
import { useState, useEffect } from 'react'
import { CopyButton } from '../../ui/CopyButton'

interface Props {
  lang: 'zh' | 'en'
}

export default function TimestampConverter({ lang }: Props) {
  const [timestamp, setTimestamp] = useState('')
  const [datetime, setDatetime] = useState('')
  const [now, setNow] = useState(Date.now())

  const isZh = lang === 'zh'

  // 实时更新当前时间戳
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timestampToDate = () => {
    const ts = Number(timestamp)
    if (isNaN(ts)) return
    // 自动识别秒级/毫秒级
    const ms = ts > 1e12 ? ts : ts * 1000
    const date = new Date(ms)
    setDatetime(date.toISOString().slice(0, 19))
  }

  const dateToTimestamp = () => {
    const date = new Date(datetime)
    if (isNaN(date.getTime())) return
    setTimestamp(String(Math.floor(date.getTime() / 1000)))
  }

  const nowDate = new Date(now)

  return (
    <div className="space-y-6">
      {/* 当前时间 */}
      <div className="bg-gray-50 rounded-xl p-4 text-center space-y-1">
        <p className="text-sm text-gray-500">{isZh ? '当前时间戳' : 'Current Timestamp'}</p>
        <div className="flex items-center justify-center gap-2">
          <p className="text-3xl font-mono font-bold">{Math.floor(now / 1000)}</p>
          <CopyButton
            text={String(Math.floor(now / 1000))}
            label={isZh ? '复制' : 'Copy'}
            copiedLabel={isZh ? '已复制！' : 'Copied!'}
          />
        </div>
        <p className="text-sm text-gray-500">{nowDate.toLocaleString()}</p>
      </div>

      {/* 时间戳 → 日期 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isZh ? '时间戳 → 日期时间' : 'Timestamp → Date'}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-lg text-sm font-mono"
            placeholder={isZh ? '输入时间戳（秒或毫秒）' : 'Enter timestamp (seconds or ms)'}
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
          />
          <button onClick={timestampToDate} className="tool-btn-primary">
            {isZh ? '转换' : 'Convert'} →
          </button>
        </div>
      </div>

      {/* 日期 → 时间戳 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isZh ? '日期时间 → 时间戳' : 'Date → Timestamp'}
        </label>
        <div className="flex gap-2">
          <input
            type="datetime-local"
            className="flex-1 px-4 py-2 border rounded-lg text-sm"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
          />
          <button onClick={dateToTimestamp} className="tool-btn-primary">
            {isZh ? '转换' : 'Convert'} →
          </button>
        </div>
      </div>

      {/* 结果 */}
      {(timestamp || datetime) && (
        <div className="bg-blue-50 rounded-xl p-4 font-mono text-sm space-y-1">
          <p>{isZh ? '秒级时间戳' : 'Unix (seconds)'}: {timestamp}</p>
          <p>{isZh ? '毫秒级时间戳' : 'Unix (milliseconds)'}: {Number(timestamp) * 1000}</p>
          <p>ISO 8601: {datetime ? new Date(datetime).toISOString() : '-'}</p>
          <p>{isZh ? '本地时间' : 'Local'}: {datetime ? new Date(datetime).toLocaleString() : '-'}</p>
          <p>UTC: {datetime ? new Date(datetime).toUTCString() : '-'}</p>
        </div>
      )}
    </div>
  )
}
```

---

## 10. 工具通用开发模式

以下是 **新增一个工具的标准流程**，可作为 AI 工具生成代码的 prompt 模板：

### 10.1 新增工具 Prompt 模板

```markdown
请为 yihazi.com 在线工具网站新增一个工具：[工具名称]

## 技术要求
- 使用 React + TypeScript 实现交互组件
- 使用 Astro 实现页面（.astro 文件）
- 样式使用 Tailwind CSS，复用已有的 tool-* class
- 支持 lang prop（'zh' | 'en'），所有文案根据语言切换
- 所有处理在浏览器端完成，不依赖后端 API
- 组件放在 src/tools/[tool-slug]/ 目录下
- 页面放在 src/pages/tools/[tool-slug].astro 和 src/pages/en/tools/[tool-slug].astro

## 组件结构
- 主组件：[ToolName].tsx（接收 lang prop）
- 逻辑 hook：use[ToolName].ts（可选，复杂工具时拆分）
- 复用 src/ui/CopyButton.tsx 和 src/ui/FileDropzone.tsx

## 页面结构
使用 ToolLayout.astro 布局，包含：
- SEO 元数据（title, description）
- 面包屑导航
- 工具组件（client:load 指令）
- SEO 文案区域（纯 HTML）

## 样式规范
- 输入框使用 class="tool-textarea"
- 主按钮使用 class="tool-btn-primary"
- 次按钮使用 class="tool-btn-secondary"
- 输出区使用 class="tool-output"
- 面板区使用 class="tool-panel"

## 在 src/data/tools.ts 中添加工具元数据
## 在 src/i18n/zh.ts 和 src/i18n/en.ts 中添加文案
```

### 10.2 每个工具需要新增/修改的文件清单

```
新增一个工具需要操作的文件：

1. [新增] src/tools/[slug]/[ToolName].tsx         → React 交互组件
2. [新增] src/pages/tools/[slug].astro             → 中文页面
3. [新增] src/pages/en/tools/[slug].astro          → 英文页面
4. [修改] src/data/tools.ts                         → 添加工具元数据
5. [修改] src/i18n/zh.ts                            → 添加中文文案
6. [修改] src/i18n/en.ts                            → 添加英文文案
```

---

## 11. 部署配置

### 11.1 Cloudflare Pages 部署

```yaml
# 在 Cloudflare Pages Dashboard 中设置：
构建命令: pnpm build
输出目录: dist
Node 版本: 20
```

### 11.2 robots.txt

```
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://yihazi.com/sitemap-index.xml
```

### 11.3 重定向规则

```
# public/_redirects（Cloudflare Pages 格式）
/tool/*    /tools/:splat    301
/en/tool/* /en/tools/:splat 301
```

---

## 12. SEO 检查清单

```markdown
每个工具页面上线前检查：

□ HTML title 包含核心关键词，格式：「[工具名] - [功能描述] | 一哈子」
□ meta description 在 120-160 字符之间，包含核心关键词
□ H1 标签只有一个，包含工具名称
□ 面包屑导航使用 Schema.org 结构化数据
□ 英文版有 hreflang 标签指向中文版，反之亦然
□ canonical URL 正确设置
□ 图片有 alt 属性
□ 页面底部有 300+ 字的 SEO 文案内容
□ 内部链接到相关工具
□ 页面加载时间 < 2 秒
□ 移动端布局正常
□ Open Graph 和 Twitter Card meta 标签完整
```

---

## 13. 第一期上线工具清单及优先级

```
优先级 P0（第 1-2 周上线）：
  1. JSON Formatter         ← 搜索量大，实现简单
  2. Base64 Encode/Decode   ← 实现简单
  3. URL Encode/Decode      ← 实现简单
  4. Word Counter           ← 英文搜索量大
  5. Password Generator     ← 实现简单，搜索量稳定

优先级 P1（第 3-4 周上线）：
  6. QR Code Generator      ← 全球通用
  7. Hash Generator (MD5/SHA)
  8. UUID Generator
  9. Timestamp Converter
  10. Case Converter

优先级 P2（第 5-6 周上线）：
  11. Image Compressor       ← 流量大，实现稍复杂
  12. Color Converter
  13. Regex Tester
  14. Markdown Preview
  15. CSS Gradient Generator

优先级 P3（第 7-8 周上线）：
  16. Diff Checker
  17. JWT Decoder
  18. Slug Generator
  19. Lorem Ipsum Generator
  20. Unit Converter
```

---

## 14. 后续扩展路线图

```yaml
Phase 2 - 用户体系（上线 2 个月后）:
  - Cloudflare D1 数据库存储用户数据
  - 简单的邮箱注册/登录
  - 收藏工具、使用历史云同步
  - 会员系统（Stripe / LemonSqueezy 支付）

Phase 3 - AI 工具（上线 3 个月后）:
  - 接入 OpenAI / Claude API
  - AI JSON 修复
  - AI 正则生成
  - AI 文本改写 / 翻译
  - 限免费次数，会员无限制

Phase 4 - 生态扩展（上线 6 个月后）:
  - Chrome 浏览器插件
  - VS Code 扩展
  - API 开放平台
  - 工具嵌入（iframe embed）功能
```

---

> **使用方式**：将本文档整体或分段作为上下文提供给 AI 编程工具（Cursor / Claude / Copilot），结合第 10 节的 Prompt 模板，即可快速生成每个工具的完整代码。