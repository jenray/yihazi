// src/i18n/types.ts
export type Language = 'zh' | 'en' | 'ja' | 'es' | 'pt' | 'fr'

export interface ToolTranslation {
  title: string
  pageTitle: string
  description: string
  shortDescription: string
  inputPlaceholder?: string
  seoContent: string
}

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
  tools: Record<string, ToolTranslation>
}
