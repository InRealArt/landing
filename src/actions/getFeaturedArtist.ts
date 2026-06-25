'use server'

import { prisma } from '@/lib/prisma'
import type { FeaturedArtist } from '@/types/featured-item'

export async function getFeaturedArtist(): Promise<FeaturedArtist | null> {
  try {
    const artist = await prisma.landingArtist.findFirst({
      where: { isFeatured: true },
      select: {
        id: true,
        slug: true,
        imageUrl: true,
        artworkStyle: true,
        artist: {
          select: {
            name: true,
            surname: true,
          },
        },
      },
    })

    if (!artist) return null

    return {
      kind: 'artist',
      id: artist.id,
      name: artist.artist.name || '',
      surname: artist.artist.surname || '',
      slug: artist.slug,
      imageUrl: artist.imageUrl,
      speciality: artist.artworkStyle,
    }
  } catch (error) {
    console.error('Error fetching featured artist:', error)
    return null
  }
}
