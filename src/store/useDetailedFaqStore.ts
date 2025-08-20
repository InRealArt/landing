import { create } from 'zustand'
import { GridItem } from '@/components/common/annexe/ContentGrid'
import { getTranslatedDetailedFaq, getFaqHeaders, getTranslatedDetailedFaqByPage, getDetailedFaqPageData, DetailedFaqPageData } from '@/actions/detailedFaqActions'
import { useLanguageStore } from './languageStore'

interface DetailedFaqState {
    faqItems: GridItem[]
    faqTabs: string[]
    rawFaqData: DetailedFaqPageData | null
    isLoading: boolean
    hasError: boolean
    errorMessage: string | null
    fetchDetailedFaqs: (languageCode?: string) => Promise<void>
    fetchDetailedFaqsByPage: (pageName: string, languageCode?: string) => Promise<void>
    fetchDetailedFaqPageData: (pageName: string) => Promise<void>
    getTranslatedFaqItems: () => GridItem[]
}

export const useDetailedFaqStore = create<DetailedFaqState>((set, get) => ({
    faqItems: [],
    faqTabs: [],
    rawFaqData: null,
    isLoading: false,
    hasError: false,
    errorMessage: null,

    fetchDetailedFaqs: async (languageCode = 'fr') => {
        set({ isLoading: true, hasError: false, errorMessage: null })

        try {
            // Récupérer les tabs et FAQs détaillées via le server action
            const [faqData, headerNames] = await Promise.all([
                getTranslatedDetailedFaq(languageCode),
                getFaqHeaders(languageCode)
            ])

            set({
                faqItems: faqData,
                faqTabs: headerNames,
                isLoading: false
            })
        } catch (error) {
            console.error('Erreur lors de la récupération des FAQ détaillées:', error)
            set({
                hasError: true,
                errorMessage: error instanceof Error ? error.message : 'Erreur inconnue',
                isLoading: false
            })
        }
    },

    fetchDetailedFaqsByPage: async (pageName: string, languageCode = 'fr') => {
        set({ isLoading: true, hasError: false, errorMessage: null })

        try {
            // Récupérer les FAQs détaillées pour une page spécifique
            const faqData = await getTranslatedDetailedFaqByPage(pageName, languageCode)

            set({
                faqItems: faqData,
                faqTabs: [],
                isLoading: false
            })
        } catch (error) {
            console.error('Erreur lors de la récupération des FAQ détaillées par page:', error)
            set({
                hasError: true,
                errorMessage: error instanceof Error ? error.message : 'Erreur inconnue',
                isLoading: false
            })
        }
    },

    fetchDetailedFaqPageData: async (pageName: string) => {
        set({ isLoading: true, hasError: false, errorMessage: null })

        try {
            // Récupérer les données brutes avec toutes les traductions
            const faqPageData = await getDetailedFaqPageData(pageName)

            set({
                rawFaqData: faqPageData,
                isLoading: false
            })
        } catch (error) {
            console.error('Erreur lors de la récupération des données FAQ par page:', error)
            set({
                hasError: true,
                errorMessage: error instanceof Error ? error.message : 'Erreur inconnue',
                isLoading: false
            })
        }
    },

    getTranslatedFaqItems: () => {
        const { rawFaqData } = get()
        const { language } = useLanguageStore.getState()

        if (!rawFaqData) {
            return []
        }

        // Transformer les données brutes en items traduits
        const translatedItems: GridItem[] = rawFaqData.faqItems.map(item => {
            // Récupérer les valeurs traduites ou utiliser les valeurs par défaut
            const question = item.translations?.question?.[language.toLowerCase()] || item.question
            const answer = item.translations?.answer?.[language.toLowerCase()] || item.answer

            return {
                title: question,
                content: answer,
                categories: [rawFaqData.name]
            }
        })

        return translatedItems
    }
})) 