import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
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
  const artworks = await prisma.presaleArtwork.findMany({
    where: {
      isTopArtwork: true,
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      price: true,
      isSold: true,
      width: true,
      height: true,
      order: true,
      artist: {
        select: {
          name: true,
          surname: true,
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  })

  const items: CatalogArtworkItem[] = artworks.map(a => ({
    id: a.id,
    name: a.name,
    imageUrl: a.imageUrl,
    price: a.price,
    isSold: a.isSold,
    artistName: `${a.artist.name ?? ''} ${a.artist.surname ?? ''}`.trim(),
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
