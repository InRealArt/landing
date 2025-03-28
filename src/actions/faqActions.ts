'use server'

import { prisma } from '@/lib/prisma'

export interface FaqData {
    id: number
    question: string
    answer: string
    order: number
}

export async function getFaqs(): Promise<FaqData[]> {
    try {
        const faqs = await prisma.faq.findMany({
            select: {
                id: true,
                question: true,
                answer: true,
                order: true
            },
            orderBy: {
                order: 'asc'
            }
        })

        return faqs
    } catch (error) {
        console.error('Erreur lors de la récupération des FAQs:', error)
        throw new Error('Impossible de récupérer les FAQs')
    }
} 