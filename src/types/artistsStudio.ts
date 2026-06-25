export type ArtistMedium = 'peinture' | 'sculpture' | 'photographie' | 'dessin' | 'autre'

export type ArtistStudio = {
  id: number
  name: string
  medium: ArtistMedium
  mediumLabel: string
  city: string
  region: string
  lat: number
  lng: number
  openPublic: boolean
  tagline: string
  bio: string
  photo: string
  gallery: string[]
  hours: string
  color: string // hex, used for map marker and badge
}
