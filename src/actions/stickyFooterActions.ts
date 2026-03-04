'use server'

import { prisma } from '@/lib/prisma'

export interface StickyFooterData {
    id: number
    activeOnAllPages: boolean
    activeOnSpecificPages: boolean
    specificPages: string[]
    endValidityDate: string | null
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

        const stickyFooters = await prisma.stickyFooter.findMany({
            where: {
                OR: [
                    { endValidityDate: null },
                    { endValidityDate: { gte: now } }
                ]
            },
            orderBy: { id: 'desc' }
        })

        if (stickyFooters.length === 0) return null

        const match =
            stickyFooters.find(f => f.activeOnAllPages) ??
            (currentPage
                ? stickyFooters.find(f => f.activeOnSpecificPages && f.specificPages.includes(currentPage))
                : undefined) ??
            null

        if (!match) return null

        return {
            ...match,
            endValidityDate: match.endValidityDate?.toISOString() ?? null,
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du sticky footer:', error)
        return null
    }
}

/**
 * Récupère tous les sticky footers (pour l'administration)
 * @returns Liste de tous les sticky footers
 */
export async function getAllStickyFooters(): Promise<StickyFooterData[]> {
    try {
        const stickyFooters = await prisma.stickyFooter.findMany({
            orderBy: { id: 'desc' }
        })

        return stickyFooters.map(f => ({
            ...f,
            endValidityDate: f.endValidityDate?.toISOString() ?? null,
        }))
    } catch (error) {
        console.error('Erreur lors de la récupération de tous les sticky footers:', error)
        return []
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
                endValidityDate: data.endValidityDate ? new Date(data.endValidityDate) : null,
                title: data.title,
                text: data.text,
                textButton: data.textButton,
                buttonUrl: data.buttonUrl
            }
        })

        return {
            ...stickyFooter,
            endValidityDate: stickyFooter.endValidityDate?.toISOString() ?? null,
        }
    } catch (error) {
        console.error('Erreur lors de la création du sticky footer:', error)
        return null
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
                endValidityDate: data.endValidityDate ? new Date(data.endValidityDate) : null,
                title: data.title,
                text: data.text,
                textButton: data.textButton,
                buttonUrl: data.buttonUrl
            }
        })

        return {
            ...stickyFooter,
            endValidityDate: stickyFooter.endValidityDate?.toISOString() ?? null,
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du sticky footer:', error)
        return null
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
    }
}
