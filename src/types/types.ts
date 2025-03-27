export type ArtWork = {
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
