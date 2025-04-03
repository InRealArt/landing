'use server'

import { prisma } from '@/lib/prisma'

export interface TeamMemberData {
    id: number
    firstName: string
    lastName: string
    role: string
    photoUrl1: string | null
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
            }
        })

        // Récupérer les traductions pour chaque membre
        const result = await Promise.all(teamMembers.map(async (member) => {
            const translations = await prisma.translation.findMany({
                where: {
                    entityType: 'Team',
                    entityId: member.id
                },
                include: {
                    language: true
                }
            })

            // Organiser les traductions par champ et par langue
            const formattedTranslations = {
                role: {},
                description: {},
                intro: {}
            }

            translations.forEach(t => {
                if (t.field === 'role' || t.field === 'description' || t.field === 'intro') {
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
        }))

        return result
    } catch (error) {
        console.error('Erreur lors de la récupération des membres de l\'équipe:', error)
        throw new Error('Impossible de récupérer les membres de l\'équipe')
    }
} 