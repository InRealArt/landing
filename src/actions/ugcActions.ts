'use server'

import { prisma } from '@/lib/prisma'

export interface UgcTopArtistData {
  id: number
  order: number
  profile: {
    id: number
    name: string | null
    surname: string | null
    pseudo: string | null
    profileImageUrl: string | null
    title: string | null
    tags: string[]
    landingArtistSlug: string | null
  }
}

export async function getTopUgcArtists(limit = 4): Promise<UgcTopArtistData[]> {
  try {
    const rows = await prisma.landingUgcTopArtists.findMany({
      take: limit,
      orderBy: { order: 'asc' },
      where: {
        landingUgcArtistProfile: { isNot: null },
      },
      include: {
        landingUgcArtistProfile: {
          include: {
            landingArtist: {
              select: { slug: true },
            },
          },
        },
      },
    })

    return rows
      .filter((row) => row.landingUgcArtistProfile !== null)
      .map((row) => {
        const profile = row.landingUgcArtistProfile!
        return {
          id: row.id,
          order: row.order,
          profile: {
            id: profile.id,
            name: profile.name,
            surname: profile.surname,
            pseudo: profile.pseudo,
            profileImageUrl: profile.profileImageUrl,
            title: profile.title,
            tags: profile.tags,
            landingArtistSlug: profile.landingArtist?.slug ?? null,
          },
        }
      })
  } catch (error) {
    console.error('[getTopUgcArtists] error:', error)
    return []
  }
}
