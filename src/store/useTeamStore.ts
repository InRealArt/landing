import { create } from 'zustand'
import { Lang, TeamMemberData as AppTeamMemberData } from '@/types/types'
import { getTeamMembers, TeamMemberData as PrismaTeamMemberData } from '@/actions/teamActions'
import { useLanguageStore } from './languageStore'

export interface TeamMember {
    id: number
    photo: string
    name: string
    role: string
    intro: string
    description: string
    linkedinUrl?: string
    instagramUrl?: string
    facebookUrl?: string
    githubUrl?: string
    twitterUrl?: string
    websiteUrl?: string
}

interface TeamState {
    members: TeamMember[]
    rawMembers: PrismaTeamMemberData[]
    isLoading: boolean
    hasError: boolean
    errorMessage: string | null
    fetchTeamMembers: () => Promise<void>
    getTranslatedField: (memberId: number, field: string, defaultValue: string) => string
    getTranslatedMembers: () => TeamMember[]
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

export const useTeamStore = create<TeamState>((set, get) => ({
    members: [],
    rawMembers: [],
    isLoading: false,
    hasError: false,
    errorMessage: null,

    fetchTeamMembers: async () => {
        set({ isLoading: true, hasError: false, errorMessage: null })

        try {
            // Récupérer les membres de l'équipe via le server action
            const teamMembers = await getTeamMembers()

            // Stocker les données brutes
            set({ rawMembers: teamMembers })

            // Obtenir la langue courante
            const { language } = useLanguageStore.getState()

            // Transformer les données au format attendu par l'application
            const formattedMembers = get().getTranslatedMembers()

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

    // Méthode utilitaire pour récupérer un champ traduit
    getTranslatedField: (memberId: number, field: string, defaultValue: string) => {
        const { rawMembers } = get()
        const { language } = useLanguageStore.getState()

        const member = rawMembers.find(m => m.id === memberId)
        if (!member || !member.translations) return defaultValue

        const fieldTranslations = member.translations[field as keyof typeof member.translations]
        if (!fieldTranslations) return defaultValue

        return fieldTranslations[language.toLowerCase()] || defaultValue
    },

    // Méthode pour obtenir tous les membres avec leurs champs traduits
    getTranslatedMembers: () => {
        const { rawMembers } = get()
        const { language } = useLanguageStore.getState()

        const membersTranslated = rawMembers.map(member => {
            // Récupérer les valeurs traduites ou utiliser les valeurs par défaut
            const role = member.translations?.role?.[language.toLowerCase()] || member.role
            const intro = member.translations?.intro?.[language.toLowerCase()] || member.intro || ''
            const description = member.translations?.description?.[language.toLowerCase()] || member.description || ''

            return {
                id: member.id,
                name: `${member.firstName} ${member.lastName}`,
                photo: member.photoUrl1 || '',
                role,
                intro,
                description,
                linkedinUrl: member.linkedinUrl || undefined,
                instagramUrl: member.instagramUrl || undefined,
                facebookUrl: member.facebookUrl || undefined,
                githubUrl: member.githubUrl || undefined,
                twitterUrl: member.twitterUrl || undefined,
                websiteUrl: member.websiteUrl || undefined
            }
        })
        set({ members: membersTranslated })

        return membersTranslated
    }
})) 