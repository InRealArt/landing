'use server'

import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/cloufare/r2/url'
import type { FeaturedArtwork } from '@/types/featured-item'

export async function getFeaturedArtwork(): Promise<FeaturedArtwork | null> {
  try {
    const artwork = await prisma.presaleArtwork.findFirst({
      where: { isFeatured: true },
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        artist: {
          select: {
            name: true,
            surname: true,
            pseudo: true,
          },
        },
      },
    })

    if (!artwork) return null

    const artistName = `${artwork.artist.name ?? ''} ${artwork.artist.surname ?? ''}`.trim() || artwork.artist.pseudo || ''

    return {
      kind: 'artwork',
      id: artwork.id,
      title: artwork.name,
      slug: '', // No slug for artworks in this context
      imageUrl: getImageUrl(artwork.imageUrl) || '',
      price: artwork.price,
      artistName,
    }
  } catch (error) {
    console.error('Error fetching featured artwork:', error)
    return null
  }
}
