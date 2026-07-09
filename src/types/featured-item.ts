export type FeaturedArtist = {
  kind: 'artist'
  id: number
  name: string
  surname: string
  slug: string
  imageUrl: string
  speciality: string | null
}

export type FeaturedArtwork = {
  kind: 'artwork'
  id: number
  title: string
  slug: string
  imageUrl: string
  price: number | null
}

export type FeaturedPost = {
  kind: 'post'
  id: number
  title: string
  slug: string
  imageUrl: string | null
  categoryName: string | null
}

export type FeaturedExhibition = {
  kind: 'exhibition'
  id: number
  title: string
  imageUrl: string | null
  location: string | null
  startDate: string
  endDate: string
  linkToEvent: string | null
}

export type FeaturedItem =
  | FeaturedArtist
  | FeaturedArtwork
  | FeaturedPost
  | FeaturedExhibition
