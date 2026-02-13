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

// Interface pour les données brutes des FAQ par page
export interface DetailedFaqPageData {
    id: number
    name: string
    faqItems: {
        id: number
        question: string
        answer: string
        detailedFaqPageId: number
        order: number
        translations?: {
            question?: Record<string, string>
            answer?: Record<string, string>
        }
    }[]
}

// Nouvelle fonction pour récupérer les FAQ détaillées par page spécifique avec toutes les traductions
export async function getDetailedFaqPageData(pageName: string): Promise<DetailedFaqPageData | null> {
    try {
        // 1. Récupérer la page FAQ spécifique
        const detailedFaqPage = await prisma.detailedFaqPage.findFirst({
            where: {
                name: pageName as any // Cast temporaire pour éviter les erreurs de type
            },
            include: {
                faqItems: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        })

        if (!detailedFaqPage) {
            return null
        }

        // 2. Récupérer toutes les traductions pour tous les items
        const itemIds = detailedFaqPage.faqItems.map(item => item.id)
        const allTranslations = await prisma.translation.findMany({
            where: {
                entityType: 'DetailedFaqPageItem',
                entityId: {
                    in: itemIds
                }
            },
            include: {
                language: true
            }
        })

        // 3. Organiser les traductions par item et par langue de manière plus simple
        const translationsByItem: Record<number, Record<string, Record<string, string>>> = {}

        allTranslations.forEach(t => {
            if (t.entityId === null || t.field === null || t.value == null) return

            if (!translationsByItem[t.entityId]) {
                translationsByItem[t.entityId] = {}
            }
            if (!translationsByItem[t.entityId][t.field]) {
                translationsByItem[t.entityId][t.field] = {}
            }
            translationsByItem[t.entityId][t.field][t.language.code] = t.value
        })

        // 4. Construire le résultat avec les traductions organisées
        const result: DetailedFaqPageData = {
            id: detailedFaqPage.id,
            name: detailedFaqPage.name as string,
            faqItems: detailedFaqPage.faqItems.map(item => ({
                ...item,
                translations: translationsByItem[item.id] || {}
            }))
        }

        return result
    } catch (error) {
        console.error('Erreur lors de la récupération des données FAQ par page:', error)
        throw new Error('Impossible de récupérer les données FAQ par page')
    }
}

// Nouvelle fonction pour récupérer les FAQ détaillées par page spécifique
export async function getTranslatedDetailedFaqByPage(pageName: string, languageCode: string = 'fr'): Promise<TranslatedFaqItem[]> {
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

        // 2. Récupérer la page FAQ spécifique
        const detailedFaqPage = await prisma.detailedFaqPage.findFirst({
            where: {
                name: pageName as any // Cast temporaire pour éviter les erreurs de type
            },
            include: {
                faqItems: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        })

        if (!detailedFaqPage) {
            return []
        }

        // 3. Récupérer les traductions des items
        const itemIds = detailedFaqPage.faqItems.map(item => item.id)
        const itemTranslations = await prisma.translation.findMany({
            where: {
                entityType: 'DetailedFaqPageItem',
                entityId: {
                    in: itemIds
                },
                languageId: language.id
            }
        })

        // 4. Organiser les traductions par entité et champ
        const itemTranslationsMap = new Map()
        itemTranslations.forEach(t => {
            itemTranslationsMap.set(`${t.entityId}_${t.field}`, t.value)
        })

        // 5. Construire le tableau faqItems avec les traductions
        const translatedFaqItems: TranslatedFaqItem[] = detailedFaqPage.faqItems.map(item => {
            // Récupérer la question et la réponse traduites ou utiliser les valeurs par défaut
            const question = itemTranslationsMap.get(`${item.id}_question`) || item.question
            const answer = itemTranslationsMap.get(`${item.id}_answer`) || item.answer

            return {
                title: question,
                content: answer,
                categories: [detailedFaqPage.name as string]
            }
        })

        return translatedFaqItems
    } catch (error) {
        console.error('Erreur lors de la récupération des FAQ détaillées par page:', error)
        throw new Error('Impossible de récupérer les FAQ détaillées par page avec traductions')
    }
} 