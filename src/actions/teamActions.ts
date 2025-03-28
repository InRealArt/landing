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

        return teamMembers
    } catch (error) {
        console.error('Erreur lors de la récupération des membres de l\'équipe:', error)
        throw new Error('Impossible de récupérer les membres de l\'équipe')
    }
} 