// src/i18n/index.ts
import { zh } from './zh'
import { en } from './en'
import type { Translation, Locale } from './types'

const translations: Record<Locale, Translation> = { zh, en }

export function getTranslation(locale: Locale): Translation {
  return translations[locale] ?? translations.zh
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
