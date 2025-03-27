import { create } from 'zustand'
import { collection, getDocs } from 'firebase/firestore'
import { db, storage } from '@/utils/firebase'
import { getDownloadURL, ref } from 'firebase/storage'
import { Lang, TeamMemberData } from '@/types/types'
import { transformMemberPhotos } from '@/utils/functions'

export interface TeamMember {
    photo: string
    name: string
    role: Record<Lang, string>
    socials: any[] // À définir plus précisément selon les besoins
}

interface TeamState {
    members: TeamMemberData
    isLoading: boolean
    hasError: boolean
    errorMessage: string | null
    fetchTeamMembers: () => Promise<void>
}

const getUrl = async (image: string) => {
    const imageRef = ref(storage, `team/${image}`)
    return await getDownloadURL(imageRef)
}

export const useTeamStore = create<TeamState>((set, get) => ({
    members: [],
    isLoading: false,
    hasError: false,
    errorMessage: null,

    fetchTeamMembers: async () => {
        set({ isLoading: true, hasError: false, errorMessage: null })

        try {
            const teamCollection = collection(db, 'Team')
            const teamSnapshot = await getDocs(teamCollection)

            let allMembers: TeamMember[] = []

            const teamData = teamSnapshot.docs.map(doc => doc.data());
            let members_ = teamData[0]['members'] as TeamMemberData
            const members_tmp = await transformMemberPhotos(members_)
            const title_ = teamData[0]['title'] as Record<Lang, string>

            console.log('members_tmp : ', members_tmp)
            set({ members: members_tmp, isLoading: false })
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