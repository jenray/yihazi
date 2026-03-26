import { zh } from './zh'
import { en } from './en'
import { ja } from './ja'
import { es } from './es'
import { pt } from './pt'
import { fr } from './fr'
import type { Language, Translation } from './types'

export const translations: Record<Language, Translation> = {
  zh,
  en,
  ja,
  es,
  pt,
  fr,
}

export function getTranslation(locale: string): Translation {
  return translations[locale as Language] ?? translations.zh
}


export function getLocaleFromUrl(url: URL): Language {
  const pathname = url.pathname
  if (pathname.startsWith('/en')) return 'en'
  if (pathname.startsWith('/ja')) return 'ja'
  if (pathname.startsWith('/es')) return 'es'
  if (pathname.startsWith('/pt')) return 'pt'
  if (pathname.startsWith('/fr')) return 'fr'
  return 'zh'
}

export function getToolPath(toolSlug: string, locale: Language): string {
  if (locale === 'zh') return `/tools/${toolSlug}`
  return `/${locale}/tools/${toolSlug}`
}
