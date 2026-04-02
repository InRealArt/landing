import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import frTranslations from '@/locales/fr.json'

type Language = 'fr' | 'en'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TranslationMap = Record<string, any>

interface LanguageState {
    language: Language
    _hasHydrated: boolean
    setHasHydrated: (value: boolean) => void
    setLanguage: (language: Language) => Promise<void>
    translations: Record<Language, TranslationMap>
    t: (key: string) => string
    tHtml: (key: string) => string
}

// Fonction pour sanitiser le HTML de manière sûre
async function sanitizeHtml(content: string): Promise<string> {
    if (typeof window === 'undefined') {
        // Côté serveur : retourner le contenu sans sanitisation (ou avec une sanitisation basique)
        return content.replace(/<(?!br\s*\/?>)[^>]+>/g, '') // Garde seulement les balises <br>
    }

    try {
        const DOMPurify = (await import('dompurify')).default
        return DOMPurify.sanitize(content, {
            ALLOWED_TAGS: ['br'],
            ALLOWED_ATTR: []
        })
    } catch (error) {
        console.error('Error loading DOMPurify:', error)
        return content.replace(/<(?!br\s*\/?>)[^>]+>/g, '') // Fallback
    }
}

// On définit la langue par défaut côté serveur pour éviter les problèmes d'hydration
const DEFAULT_LANGUAGE: Language = 'fr'

// Cache pour éviter de recharger en.json plusieurs fois
let enTranslationsCache: TranslationMap | null = null

async function loadEnTranslations(): Promise<TranslationMap> {
    if (enTranslationsCache) return enTranslationsCache
    const mod = await import('@/locales/en.json')
    enTranslationsCache = mod.default
    return enTranslationsCache
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set, get) => ({
            language: DEFAULT_LANGUAGE,
            _hasHydrated: false,
            setHasHydrated: (value) => set({ _hasHydrated: value }),
            setLanguage: async (language) => {
                if (language === 'en') {
                    const { translations } = get()
                    // Charger en.json dynamiquement uniquement si pas encore chargé
                    if (!translations.en || Object.keys(translations.en).length === 0) {
                        const enTranslations = await loadEnTranslations()
                        set({
                            language,
                            translations: { ...translations, en: enTranslations }
                        })
                    } else {
                        set({ language })
                    }
                } else {
                    set({ language })
                }
            },
            translations: {
                fr: frTranslations,
                en: {} // en.json chargé dynamiquement au premier setLanguage('en')
            },
            t: (key) => {
                const { language, translations } = get()
                const keys = key.split('.')
                let current: TranslationMap | string = translations[language]

                for (const k of keys) {
                    if (!current || typeof current !== 'object' || !(k in current)) {
                        return key
                    }
                    current = (current as TranslationMap)[k]
                }

                return typeof current === 'string' ? current : key
            },
            tHtml: (key) => {
                const { language, translations } = get()
                const keys = key.split('.')
                let current: TranslationMap | string = translations[language]

                for (const k of keys) {
                    if (!current || typeof current !== 'object' || !(k in current)) {
                        return key
                    }
                    current = (current as TranslationMap)[k]
                }

                if (typeof current === 'string') {
                    // Pour tHtml, on retourne le contenu brut pour éviter les problèmes SSR
                    // La sanitisation sera faite côté client dans TranslatedText
                    return current
                }

                return key
            }
        }),
        {
            name: 'language-storage',
            skipHydration: true,
            partialize: (state) => ({ language: state.language }),
            onRehydrateStorage: () => () => {
                useLanguageStore.getState().setHasHydrated(true)
            },
        }
    )
)
