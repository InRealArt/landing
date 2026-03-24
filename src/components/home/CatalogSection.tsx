import { Suspense } from 'react'
import { getTopArtworks } from '@/actions/presaleArtworkActions'
import CatalogSectionClient from './CatalogSectionClient'

export interface CatalogArtworkItem {
  id: number
  name: string
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
    imageUrl: a.imageUrl,
    price: a.price,
    isSold: a.isSold,
    artistName: `${a.artist.name} ${a.artist.surname}`.trim(),
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
