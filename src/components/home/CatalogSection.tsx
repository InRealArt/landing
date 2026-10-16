import { Suspense } from 'react'
import { getTopArtworks } from '@/actions/presaleArtworkActions'
import { stringToSlug } from '@/utils/functions'
import CatalogSectionClient from './CatalogSectionClient'
import { getArtistDisplayName } from '@/utils/artistDisplayName'

export interface CatalogArtworkItem {
  id: number
  name: string
  slug: string
  imageUrl: string
  price: number | null
  isSold: boolean
  artistName: string
  width: number | null
  height: number | null
}

async function CatalogSectionContent() {
  const artworks = await getTopArtworks()

  const items: CatalogArtworkItem[] = artworks.map(a => ({
    id: a.id,
    name: a.name,
    slug: stringToSlug(a.name),
    imageUrl: a.imageUrl,
    price: a.price,
    isSold: a.isSold,
    artistName: getArtistDisplayName(a.artist),
    width: a.width,
    height: a.height,
  }))

  return <CatalogSectionClient artworks={items} />
}

export default function CatalogSection() {
  return (
    <Suspense fallback={<div className="w-full h-[800px] animate-pulse bg-cardBackground rounded-lg" />}>
      <CatalogSectionContent />
    </Suspense>
  )
}
