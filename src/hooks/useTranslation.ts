'use client'

import { useLanguageStore } from '@/store/languageStore'
import frTranslations from '@/locales/fr.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TranslationMap = Record<string, any>

/**
 * Lookup a translation key in the FR translations statically.
 * Used as SSR-safe fallback before Zustand rehydration completes.
 */
function lookupFr(key: string): string {
    const keys = key.split('.')
    let current: TranslationMap | string = frTranslations as TranslationMap

    for (const k of keys) {
        if (!current || typeof current !== 'object' || !(k in current)) {
            return key
        }
        current = (current as TranslationMap)[k]
    }

    return typeof current === 'string' ? current : key
}

/**
 * Drop-in replacement for `useLanguageStore()` that is hydration-safe.
 *
 * During the server render and the initial client render (before Zustand
 * rehydrates from localStorage), `t` and `tHtml` always return the French
 * value — exactly what the server rendered.  Once Zustand has finished
 * rehydrating, they switch to the real persisted language.
 *
 * This eliminates hydration mismatches across the entire codebase without
 * needing `suppressHydrationWarning` on every translated node.
 *
 * Migration: replace `useLanguageStore()` with `useTranslation()` in any
 * component that only needs `t`, `tHtml`, and `language`.
 * Components that also need `setLanguage` or store internals should keep
 * importing `useLanguageStore` directly.
 */
export function useTranslation() {
    const { t, tHtml, language, _hasHydrated, setLanguage } = useLanguageStore()

    const tSafe = (key: string): string => {
        if (!_hasHydrated) return lookupFr(key)
        return t(key)
    }

    const tHtmlSafe = (key: string): string => {
        if (!_hasHydrated) return lookupFr(key)
        return tHtml(key)
    }

    return {
        t: tSafe,
        tHtml: tHtmlSafe,
        language: (_hasHydrated ? language : 'fr') as 'fr' | 'en',
        setLanguage,
    }
}
