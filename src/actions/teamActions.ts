'use server'

import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/cloufare/r2/url'

export interface TeamMemberData {
    id: number
    firstName: string
    lastName: string
    role: string
    photoUrl1: string | undefined
    description: string | null
    intro: string | null
    linkedinUrl: string | null
    instagramUrl: string | null
    facebookUrl: string | null
    githubUrl: string | null
    twitterUrl: string | null
    websiteUrl: string | null
    translations?: {
        role?: Record<string, string>
        description?: Record<string, string>
        intro?: Record<string, string>
    }
}

export async function getTeamMembers(): Promise<TeamMemberData[]> {
    try {
        const teamMembers = await prisma.team.findMany({
            where: {
                visible: true
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                photoUrl1: true,
                description: true,
                intro: true,
                linkedinUrl: true,
                instagramUrl: true,
                facebookUrl: true,
                githubUrl: true,
                twitterUrl: true,
                websiteUrl: true
            },
            orderBy: {
                order: 'asc'
            }
        })

        // Récupérer toutes les traductions en une seule requête
        const memberIds = teamMembers.map(m => m.id)
        const allTranslations = await prisma.translation.findMany({
            where: {
                entityType: 'Team',
                entityId: { in: memberIds }
            },
            include: {
                language: true
            }
        })

        const result = teamMembers.map(member => {
            const translations = allTranslations.filter(t => t.entityId === member.id)
            const formattedTranslations: { role: Record<string, string>, description: Record<string, string>, intro: Record<string, string> } = {
                role: {},
                description: {},
                intro: {}
            }

            translations.forEach(t => {
                if ((t.field === 'role' || t.field === 'description' || t.field === 'intro') && t.value != null) {
                    formattedTranslations[t.field as keyof typeof formattedTranslations] = {
                        ...formattedTranslations[t.field as keyof typeof formattedTranslations],
                        [t.language.code]: t.value
                    }
                }
            })

            return {
                ...member,
                translations: formattedTranslations
            }
        })

        return result.map(member => ({
            ...member,
            photoUrl1: getImageUrl(member.photoUrl1) ?? undefined
        })) as TeamMemberData[]
    } catch (error) {
        console.error('Erreur lors de la récupération des membres de l\'équipe:', error)
        throw new Error('Impossible de récupérer les membres de l\'équipe')
    }
} 