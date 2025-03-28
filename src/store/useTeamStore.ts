import { create } from 'zustand'
import { Lang, TeamMemberData as AppTeamMemberData } from '@/types/types'
import { getTeamMembers, TeamMemberData as PrismaTeamMemberData } from '@/actions/teamActions'

export interface TeamMember {
    photo: string
    name: string
    role: Record<Lang, string>
    socials: any[] // À définir plus précisément selon les besoins
}

interface TeamState {
    members: AppTeamMemberData
    isLoading: boolean
    hasError: boolean
    errorMessage: string | null
    fetchTeamMembers: () => Promise<void>
}

// Interface pour les données retournées par Prisma
interface TeamMemberPrisma {
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

// Fonction pour créer un objet avec les langues
const createLangObject = (value: string): Record<Lang, string> => {
    return {
        FR: value,
        EN: value,
        CN: value
    }
}

export const useTeamStore = create<TeamState>((set, get) => ({
    members: [],
    isLoading: false,
    hasError: false,
    errorMessage: null,

    fetchTeamMembers: async () => {
        set({ isLoading: true, hasError: false, errorMessage: null })

        try {
            // Récupérer les membres de l'équipe via le server action
            const teamMembers = await getTeamMembers()

            // Transformer les données au format attendu par l'application
            const formattedMembers: AppTeamMemberData = teamMembers.map((member: PrismaTeamMemberData) => ({
                name: `${member.firstName} ${member.lastName}`,
                photo: member.photoUrl1 || '',
                role: createLangObject(member.role),
                text1: createLangObject(member.intro || ''),
                text2: createLangObject(member.description || ''),
                linkedinUrl: member.linkedinUrl || undefined,
                instagramUrl: member.instagramUrl || undefined,
                facebookUrl: member.facebookUrl || undefined,
                githubUrl: member.githubUrl || undefined,
                twitterUrl: member.twitterUrl || undefined,
                websiteUrl: member.websiteUrl || undefined
            }))

            set({ members: formattedMembers, isLoading: false })
        } catch (error) {
            console.error('Erreur lors de la récupération des membres de l\'équipe:', error)
            set({
                hasError: true,
                errorMessage: error instanceof Error ? error.message : 'Erreur inconnue',
                isLoading: false
            })
        }
    },
})) 