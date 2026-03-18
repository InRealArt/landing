/**
 * Représentation transformée d'un artiste côté client.
 * Produite à partir de ArtistData (Prisma) avec les champs combinés/renommés
 * pour les composants UI (name = prénom+nom, photo = imageUrl, role = artworkStyle traduit).
 */
export interface TransformedArtistData {
    id: number
    name: string
    role: string
    photo: string
    intro: string
    description: string
    secondaryImageUrl: string
    slug: string
    artistId?: number
    countryCode?: string | null
    countryName?: string | null
    mediumTags?: string[]
    birthYear?: number | null
    quoteFromInRealArt?: string | null
    biographyHeader1?: string | null
    biographyText1?: string | null
    biographyHeader2?: string | null
    biographyText2?: string | null
    biographyHeader3?: string | null
    biographyText3?: string | null
    biographyHeader4?: string | null
    biographyText4?: string | null
    imageArtistStudio?: string | null
    artworkImages: {
        image: string
        name: string
        price?: number
        url: string
    }[]
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  intro: string;
  description: string;
  photo: string;
  artworks: Artwork[];
}

export interface Artwork {
  id: string;
  name: string;
  url: string;
  price: number;
  artistId: string;
} 