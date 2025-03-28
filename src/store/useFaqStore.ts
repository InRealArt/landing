import { create } from 'zustand'
import { FaqData, getFaqs } from '@/actions/faqActions'

interface FaqState {
    faqs: FaqData[]
    isLoading: boolean
    hasError: boolean
    errorMessage: string | null
    fetchFaqs: () => Promise<void>
}

export const useFaqStore = create<FaqState>((set) => ({
    faqs: [],
    isLoading: false,
    hasError: false,
    errorMessage: null,

    fetchFaqs: async () => {
        set({ isLoading: true, hasError: false, errorMessage: null })

        try {
            // Récupérer les FAQs via le server action
            const faqData = await getFaqs()
            set({ faqs: faqData, isLoading: false })
        } catch (error) {
            console.error('Erreur lors de la récupération des FAQs:', error)
            set({
                hasError: true,
                errorMessage: error instanceof Error ? error.message : 'Erreur inconnue',
                isLoading: false
            })
        }
    },
})) 