'use server'

import { prisma } from '@/lib/prisma'
import type { FeaturedExhibition } from '@/types/featured-item'

export async function getFeaturedExhibition(): Promise<FeaturedExhibition | null> {
  try {
    const exhibition = await prisma.exhibition.findFirst({
      where: { isFeatured: true },
      select: {
        id: true,
        name: true,
        address: true,
        imageUrl: true,
        startDate: true,
        endDate: true,
      },
    })

    if (!exhibition) return null

    return {
      kind: 'exhibition',
      id: exhibition.id,
      title: exhibition.name,
      imageUrl: exhibition.imageUrl,
      location: exhibition.address,
      startDate: exhibition.startDate.toISOString(),
      endDate: exhibition.endDate.toISOString(),
    }
  } catch (error) {
    console.error('Error fetching featured exhibition:', error)
    return null
  }
}
