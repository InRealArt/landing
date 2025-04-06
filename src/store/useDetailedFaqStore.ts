import { create } from 'zustand'
import { GridItem } from '@/components/common/annexe/ContentGrid'
import { getTranslatedDetailedFaq, getFaqHeaders } from '@/actions/detailedFaqActions'

interface DetailedFaqState {
    faqItems: GridItem[]
    faqTabs: string[]
    isLoading: boolean
    hasError: boolean
    errorMessage: string | null
    fetchDetailedFaqs: (languageCode?: string) => Promise<void>
}

export const useDetailedFaqStore = create<DetailedFaqState>((set) => ({
    faqItems: [],
    faqTabs: [],
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
            console.error('Erreur lors de la récupération des FAQs détaillées:', error)
            set({
                hasError: true,
                errorMessage: error instanceof Error ? error.message : 'Erreur inconnue',
                isLoading: false
            })
        }
    },
})) 