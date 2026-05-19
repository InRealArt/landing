'use server'

import { prisma } from '@/lib/prisma'
import { generateUgcSlug } from '@/utils/ugcSlug'

export interface UgcTopArtistData {
  id: number
  order: number
  profile: {
    id: number
    slug: string
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
            slug: generateUgcSlug(profile),
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


export interface UgcArtistProfileData {
  id: number
  slug: string
  name: string | null
  surname: string | null
  pseudo: string | null
  profileImageUrl: string | null
  title: string | null
  description: string | null
  presentation: string | null
  tags: string[]
  mediaUrls: string[]
  landingArtistSlug: string | null
  socialMetrics: {
    totalAudience: number | null
    averageEngagement: number | null
    totalConsumption: number | null
    socialNetworks: string[]
  } | null
}

function mapUgcProfile(row: {
  id: number
  name: string | null
  surname: string | null
  pseudo: string | null
  profileImageUrl: string | null
  title: string | null
  description: string | null
  presentation: string | null
  tags: string[]
  mediaUrls: string[]
  landingArtist: { slug: string } | null
  socialMetrics: {
    totalAudience: number | null
    averageEngagement: number | null
    totalConsumption: bigint | null
    socialNetworks: string[]
  } | null
}): UgcArtistProfileData {
  return {
    id: row.id,
    slug: generateUgcSlug(row),
    name: row.name,
    surname: row.surname,
    pseudo: row.pseudo,
    profileImageUrl: row.profileImageUrl,
    title: row.title,
    description: row.description,
    presentation: row.presentation,
    tags: row.tags,
    mediaUrls: row.mediaUrls,
    landingArtistSlug: row.landingArtist?.slug ?? null,
    socialMetrics: row.socialMetrics
      ? {
          totalAudience: row.socialMetrics.totalAudience,
          averageEngagement: row.socialMetrics.averageEngagement,
          totalConsumption: row.socialMetrics.totalConsumption !== null
            ? Number(row.socialMetrics.totalConsumption)
            : null,
          socialNetworks: row.socialMetrics.socialNetworks,
        }
      : null,
  }
}

const ugcProfileInclude = {
  socialMetrics: true,
  landingArtist: { select: { slug: true } },
} as const

export async function getAllUgcArtists(): Promise<UgcArtistProfileData[]> {
  try {
    const rows = await prisma.landingUgcArtistProfile.findMany({
      orderBy: { pseudo: 'asc' },
      include: ugcProfileInclude,
    })
    return rows.map(mapUgcProfile)
  } catch (error) {
    console.error('[getAllUgcArtists] error:', error)
    return []
  }
}

export async function getUgcArtistBySlug(slug: string): Promise<UgcArtistProfileData | null> {
  // Slug format: "<name-parts>-<id>" — extract id from the last segment
  const id = parseInt(slug.split('-').pop() ?? '', 10)
  if (isNaN(id)) return null
  try {
    const row = await prisma.landingUgcArtistProfile.findUnique({
      where: { id },
      include: ugcProfileInclude,
    })
    if (!row) return null
    return mapUgcProfile(row)
  } catch (error) {
    console.error('[getUgcArtistBySlug] error:', error)
    return null
  }
}
