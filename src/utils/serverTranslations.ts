import frTranslations from '@/locales/fr.json'
import enTranslations from '@/locales/en.json'

type Language = 'fr' | 'en'

const translations = {
    fr: frTranslations,
    en: enTranslations
}

export function getServerTranslation(key: string, language: Language = 'fr'): string {
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

export function getServerTranslations(language: Language = 'fr') {
    return {
        t: (key: string) => getServerTranslation(key, language)
    }
}
