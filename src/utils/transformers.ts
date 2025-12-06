import { PresaleArtworkData } from '@/actions/presaleArtworkActions'
import { ArtWork, Lang } from '@/types/types'

export function transformPresaleArtworkToArtwork(artwork: PresaleArtworkData): ArtWork {
    // Helper to create multi-lang object
    const createMultiLangObject = (value: string, translations?: Record<string, string>): Record<Lang, string> => {
        const result: Record<Lang, string> = {
            FR: value,
            EN: value,
            CN: value
        }

        if (translations) {
            if (translations['fr']) result.FR = translations['fr']
            if (translations['en']) result.EN = translations['en']
            if (translations['cn']) result.CN = translations['cn']
        }

        return result
    }

    // Process mockups
    let mockups: string[] = []
    if (artwork.mockupUrls) {
        if (Array.isArray(artwork.mockupUrls)) {
            if (artwork.mockupUrls.length > 0 && typeof artwork.mockupUrls[0] === 'object' && (artwork.mockupUrls[0] as any).url) {
                mockups = artwork.mockupUrls
                    .filter((mockup: any) => mockup && mockup.url)
                    .map((mockup: any) => mockup.url)
            } else {
                mockups = artwork.mockupUrls as string[]
            }
        }
    }

    return {
        id: artwork.id.toString(),
        artistId: artwork.artistId,
        artistName: `${artwork.artist.name} ${artwork.artist.surname}`,
        name: createMultiLangObject(artwork.name, artwork.translations?.name),
        description: createMultiLangObject(artwork.description || '', artwork.translations?.description),
        image: artwork.imageUrl,
        image2: artwork.imageUrl,
        url: artwork.imageUrl,
        url2: artwork.imageUrl,
        price: artwork.price,
        size: createMultiLangObject(''),
        order: artwork.order || 0,
        mockups: mockups,
        noBorder: false,
        desactivate: false,
        width: artwork.width,
        height: artwork.height
    }
}

