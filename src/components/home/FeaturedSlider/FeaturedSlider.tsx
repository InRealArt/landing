import { Suspense } from 'react'
import { getFeaturedArtist } from '@/actions/getFeaturedArtist'
import { getFeaturedArtwork } from '@/actions/getFeaturedArtwork'
import { getFeaturedPostByLanguage } from '@/actions/getFeaturedPost'
import { getFeaturedExhibition } from '@/actions/getFeaturedExhibition'
import { prisma } from '@/lib/prisma'
import type { FeaturedItem } from '@/types/featured-item'
import FeaturedSliderClient from './FeaturedSliderClient'
import { FeaturedSliderSkeleton } from './FeaturedSliderSkeleton'

async function buildItems(): Promise<FeaturedItem[]> {
  // Get language ID for French (default)
  const language = await prisma.language.findUnique({
    where: { code: 'fr' },
  })
  const languageId = language?.id || 1

  const [artist, artwork, post, exhibition] = await Promise.all([
    getFeaturedArtist(),
    getFeaturedArtwork(),
    getFeaturedPostByLanguage(languageId),
    getFeaturedExhibition(),
  ])

  const items: FeaturedItem[] = []
  if (artist) items.push(artist)
  if (artwork) items.push(artwork)
  if (post) items.push(post)
  if (exhibition) items.push(exhibition)

  return items
}

export default async function FeaturedSlider() {
  const items = await buildItems()

  if (items.length === 0) return null

  return (
    <Suspense fallback={<FeaturedSliderSkeleton />}>
      <FeaturedSliderClient items={items} />
    </Suspense>
  )
}
