'use server'

import { prisma } from '@/lib/prisma'

const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? ''

function resolveImageUrl(url: string | null): string | null {
  if (!url) return null
  if (url.startsWith('https://') || url.startsWith('http://')) return url
  // Les clés R2 peuvent contenir des espaces (ex. « Grim Valorant/… »)
  const key = url.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/')
  return `${R2_BASE_URL}/${key}`
}

export interface AgencyEventData {
  id: number
  name: string
  description: string
  imageUrl: string
  linkToEvent: string | null
}

/**
 * Returns featured agency events that have an image, for the /agence hero.
 */
export async function getFeaturedAgencyEvents(): Promise<AgencyEventData[]> {
  try {
    const events = await prisma.agencyEvent.findMany({
      where: { isFeatured: true },
      orderBy: { id: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        linkToEvent: true,
      },
    })

    return events.flatMap((event) => {
      const imageUrl = resolveImageUrl(event.imageUrl)
      return imageUrl ? [{ ...event, imageUrl }] : []
    })
  } catch (error) {
    console.error('Error fetching featured agency events:', error)
    return []
  }
}
