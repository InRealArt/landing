'use server'

import { PrismaClient } from '@prisma/client'
import { LandingPage } from '@prisma/client'

const prisma = new PrismaClient()

export interface StickyFooterData {
    id: number
    activeOnAllPages: boolean
    activeOnSpecificPages: boolean
    specificPages: string[]
    endValidityDate: Date | null
    title: string | null
    text: string | null
    textButton: string | null
    buttonUrl: string | null
}

/**
 * Récupère le sticky footer actif pour une page donnée
 * @param currentPage - La page actuelle (optionnel)
 * @returns Les données du sticky footer ou null si aucun n'est actif
 */
export async function getActiveStickyFooter(currentPage?: string): Promise<StickyFooterData | null> {
    try {
        const now = new Date()

        // Récupère tous les sticky footers actifs (non expirés)
        const stickyFooters = await prisma.stickyFooter.findMany({
            where: {
                OR: [
                    { endValidityDate: null }, // Pas de date de fin
                    { endValidityDate: { gte: now } } // Date de fin dans le futur
                ]
            },
            orderBy: {
                id: 'desc' // Prendre le plus récent en premier
            }
        })

        if (stickyFooters.length === 0) {
            return null
        }

        // Cherche d'abord un sticky footer actif sur toutes les pages
        const globalStickyFooter = stickyFooters.find(footer => footer.activeOnAllPages)
        if (globalStickyFooter) {
            return globalStickyFooter
        }

        // Si une page spécifique est fournie, cherche un sticky footer pour cette page
        if (currentPage) {
            const pageSpecificStickyFooter = stickyFooters.find(footer =>
                footer.activeOnSpecificPages &&
                footer.specificPages.includes(currentPage)
            )
            if (pageSpecificStickyFooter) {
                return pageSpecificStickyFooter
            }
        }

        return null
    } catch (error) {
        console.error('Erreur lors de la récupération du sticky footer:', error)
        return null
    } finally {
        await prisma.$disconnect()
    }
}

/**
 * Récupère tous les sticky footers (pour l'administration)
 * @returns Liste de tous les sticky footers
 */
export async function getAllStickyFooters(): Promise<StickyFooterData[]> {
    try {
        const stickyFooters = await prisma.stickyFooter.findMany({
            orderBy: {
                id: 'desc'
            }
        })

        return stickyFooters
    } catch (error) {
        console.error('Erreur lors de la récupération de tous les sticky footers:', error)
        return []
    } finally {
        await prisma.$disconnect()
    }
}

/**
 * Crée un nouveau sticky footer
 * @param data - Les données du sticky footer
 * @returns Le sticky footer créé
 */
export async function createStickyFooter(data: Omit<StickyFooterData, 'id'>): Promise<StickyFooterData | null> {
    try {
        const stickyFooter = await prisma.stickyFooter.create({
            data: {
                activeOnAllPages: data.activeOnAllPages,
                activeOnSpecificPages: data.activeOnSpecificPages,
                specificPages: data.specificPages,
                endValidityDate: data.endValidityDate,
                title: data.title,
                text: data.text,
                textButton: data.textButton,
                buttonUrl: data.buttonUrl
            }
        })

        return stickyFooter
    } catch (error) {
        console.error('Erreur lors de la création du sticky footer:', error)
        return null
    } finally {
        await prisma.$disconnect()
    }
}

/**
 * Met à jour un sticky footer existant
 * @param id - L'ID du sticky footer à mettre à jour
 * @param data - Les nouvelles données
 * @returns Le sticky footer mis à jour
 */
export async function updateStickyFooter(id: number, data: Partial<Omit<StickyFooterData, 'id'>>): Promise<StickyFooterData | null> {
    try {
        const stickyFooter = await prisma.stickyFooter.update({
            where: { id },
            data: {
                activeOnAllPages: data.activeOnAllPages,
                activeOnSpecificPages: data.activeOnSpecificPages,
                specificPages: data.specificPages,
                endValidityDate: data.endValidityDate,
                title: data.title,
                text: data.text,
                textButton: data.textButton,
                buttonUrl: data.buttonUrl
            }
        })

        return stickyFooter
    } catch (error) {
        console.error('Erreur lors de la mise à jour du sticky footer:', error)
        return null
    } finally {
        await prisma.$disconnect()
    }
}

/**
 * Supprime un sticky footer
 * @param id - L'ID du sticky footer à supprimer
 * @returns true si supprimé avec succès
 */
export async function deleteStickyFooter(id: number): Promise<boolean> {
    try {
        await prisma.stickyFooter.delete({
            where: { id }
        })

        return true
    } catch (error) {
        console.error('Erreur lors de la suppression du sticky footer:', error)
        return false
    } finally {
        await prisma.$disconnect()
    }
}
