export type ArtWork = {
    id: string
    artistName: string
    description: Record<Lang, string>
    image: string
    image2: string
    url: string
    url2: string
    price: number
    size: Record<Lang, string>
    name: Record<Lang, string>
    order: number
    mockups: string[]
    noBorder: boolean
    desactivate: boolean
}

export type Lang = 'CN' | 'EN' | 'FR'

export type TeamMemberData = {
    text1: Record<Lang, string>
    text2: Record<Lang, string>
    role: Record<Lang, string>
    name: string
    photo: string
    linkedinUrl?: string
    instagramUrl?: string
    facebookUrl?: string
    githubUrl?: string
    twitterUrl?: string
    websiteUrl?: string
}[];

