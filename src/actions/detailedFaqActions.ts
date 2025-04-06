'use server'

import { prisma } from '@/lib/prisma'
import { GridItem } from '@/components/common/annexe/ContentGrid'

// Interface pour les résultats traduits
interface TranslatedFaqItem extends GridItem {
    title: string
    content: string
    categories: string[]
}

// Interface pour les headers traduits
export interface TranslatedFaqHeader {
    id: number
    name: string
}

// Fonction pour récupérer les headers de FAQ traduits
export async function getFaqHeaders(languageCode: string = 'fr'): Promise<string[]> {
    try {
        // 1. Récupérer l'ID de la langue
        const language = await prisma.language.findUnique({
            where: {
                code: languageCode
            }
        })

        if (!language) {
            throw new Error(`Langue avec code ${languageCode} non trouvée`)
        }

        // 2. Récupérer tous les headers de FAQ
        const detailedFaqHeaders = await prisma.detailedFaqHeader.findMany({
            select: {
                id: true,
                name: true
            }
        })

        // 3. Récupérer les traductions des headers
        const headerTranslations = await prisma.translation.findMany({
            where: {
                entityType: 'DetailedFaqHeader',
                languageId: language.id,
                field: 'name'
            }
        })

        // 4. Organiser les traductions par ID
        const headerTranslationsMap = new Map()
        headerTranslations.forEach(t => {
            headerTranslationsMap.set(t.entityId, t.value)
        })

        // 5. Construire le tableau des noms de headers traduits
        const headerNames = detailedFaqHeaders.map(header => {
            // Utiliser la traduction si disponible, sinon utiliser le nom par défaut
            return headerTranslationsMap.get(header.id) || header.name
        })

        return headerNames
    } catch (error) {
        console.error('Erreur lors de la récupération des headers de FAQ:', error)
        return []
    }
}

export async function getTranslatedDetailedFaq(languageCode: string = 'fr'): Promise<TranslatedFaqItem[]> {
    try {
        // 1. Récupérer l'ID de la langue
        const language = await prisma.language.findUnique({
            where: {
                code: languageCode
            }
        })

        if (!language) {
            throw new Error(`Langue avec code ${languageCode} non trouvée`)
        }

        // 2. Récupérer tous les headers de FAQ
        const detailedFaqHeaders = await prisma.detailedFaqHeader.findMany({
            include: {
                faqItems: true
            }
        })

        // 3. Récupérer toutes les traductions pertinentes
        const headerTranslations = await prisma.translation.findMany({
            where: {
                entityType: 'DetailedFaqHeader',
                languageId: language.id
            }
        })

        const itemTranslations = await prisma.translation.findMany({
            where: {
                entityType: 'DetailedFaqItem',
                languageId: language.id
            }
        })

        // 4. Organiser les traductions par entité et champ
        const headerTranslationsMap = new Map()
        headerTranslations.forEach(t => {
            headerTranslationsMap.set(`${t.entityId}_${t.field}`, t.value)
        })

        const itemTranslationsMap = new Map()
        itemTranslations.forEach(t => {
            itemTranslationsMap.set(`${t.entityId}_${t.field}`, t.value)
        })

        // 5. Construire le tableau faqItems avec les traductions
        const translatedFaqItems: TranslatedFaqItem[] = []

        detailedFaqHeaders.forEach(header => {
            // Récupérer le nom traduit du header ou utiliser le nom par défaut
            const headerName = headerTranslationsMap.get(`${header.id}_name`) || header.name

            // Pour chaque item de ce header
            header.faqItems.forEach(item => {
                // Récupérer la question et la réponse traduites ou utiliser les valeurs par défaut
                const question = itemTranslationsMap.get(`${item.id}_question`) || item.question
                const answer = itemTranslationsMap.get(`${item.id}_answer`) || item.answer

                // Ajouter l'item traduit au tableau de résultats
                translatedFaqItems.push({
                    title: question,
                    content: answer,
                    categories: [headerName]
                })
            })
        })

        return translatedFaqItems
    } catch (error) {
        console.error('Erreur lors de la récupération des FAQ détaillées:', error)
        throw new Error('Impossible de récupérer les FAQ détaillées avec traductions')
    }
} 