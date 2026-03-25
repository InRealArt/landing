'use server'

import { prisma } from '@/lib/prisma'

export interface ExhibitionArtistData {
  id: number
  slug: string
  name: string
  surname: string
  imageUrl: string
}

export interface ExhibitionData {
  id: number
  name: string
  startDate: string   // ISO string — serializable across server/client boundary
  endDate: string
  address: string
  imageUrl: string | null
  artists: ExhibitionArtistData[]
}

/**
 * Returns upcoming and ongoing exhibitions ordered by startDate desc.
 * Only exhibitions that have at least one associated LandingArtist are returned.
 */
export async function getExhibitions(): Promise<ExhibitionData[]> {
  try {
    const exhibitions = await prisma.exhibition.findMany({
      orderBy: { startDate: 'desc' },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        address: true,
        imageUrl: true,
        artists: {
          select: {
            landingArtist: {
              select: {
                id: true,
                slug: true,
                imageUrl: true,
                artist: {
                  select: {
                    name: true,
                    surname: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return exhibitions.map((expo) => ({
      id: expo.id,
      name: expo.name,
      startDate: expo.startDate.toISOString(),
      endDate: expo.endDate.toISOString(),
      address: expo.address,
      imageUrl: expo.imageUrl ?? null,
      artists: expo.artists.map((ea) => ({
        id: ea.landingArtist.id,
        slug: ea.landingArtist.slug,
        name: ea.landingArtist.artist.name ?? '',
        surname: ea.landingArtist.artist.surname ?? '',
        imageUrl: ea.landingArtist.imageUrl,
      })),
    }))
  } catch (error) {
    console.error('Erreur lors de la récupération des expositions:', error)
    return []
  }
}
