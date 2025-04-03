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
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set, get) => ({
            language: 'fr',
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
            }
        }),
        {
            name: 'language-storage',
            skipHydration: typeof window === 'undefined'
        }
    )
) 