import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import frTranslations from '@/locales/fr.json'
import enTranslations from '@/locales/en.json'

type Language = 'fr' | 'en'

interface LanguageState {
    language: Language
    setLanguage: (language: Language) => void
    translations: Record<Language, Record<string, any>>
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

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set, get) => ({
            language: DEFAULT_LANGUAGE,
            setLanguage: (language) => set({ language }),
            translations: {
                fr: frTranslations,
                en: enTranslations
            },
            t: (key) => {
                const { language, translations } = get()
                const keys = key.split('.')
                let current: any = translations[language]

                for (const k of keys) {
                    if (!current || typeof current !== 'object' || !(k in current)) {
                        return key
                    }
                    current = current[k]
                }

                return typeof current === 'string' ? current : key
            },
            tHtml: (key) => {
                const { language, translations } = get()
                const keys = key.split('.')
                let current: any = translations[language]

                for (const k of keys) {
                    if (!current || typeof current !== 'object' || !(k in current)) {
                        return key
                    }
                    current = current[k]
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
            // Désactiver l'hydration côté serveur pour éviter les différences
            skipHydration: true
        }
    )
) 