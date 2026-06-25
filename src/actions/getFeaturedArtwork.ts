'use server'

import { prisma } from '@/lib/prisma'
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
      },
    })

    if (!artwork) return null

    return {
      kind: 'artwork',
      id: artwork.id,
      title: artwork.name,
      slug: '', // No slug for artworks in this context
      imageUrl: artwork.imageUrl,
      price: artwork.price,
    }
  } catch (error) {
    console.error('Error fetching featured artwork:', error)
    return null
  }
}
