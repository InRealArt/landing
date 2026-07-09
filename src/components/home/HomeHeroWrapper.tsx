import { prisma } from '@/lib/prisma'
import { getFeaturedArtist } from '@/actions/getFeaturedArtist'
import { getFeaturedArtwork } from '@/actions/getFeaturedArtwork'
import { getFeaturedExhibition } from '@/actions/getFeaturedExhibition'
import { getFeaturedPostByLanguage } from '@/actions/getFeaturedPost'
import HomeHero from './HomeHero'

export default async function HomeHeroWrapper() {
  const language = await prisma.language.findUnique({ where: { code: 'fr' } })
  const languageId = language?.id ?? 1

  const [featuredArtist, featuredArtwork, featuredExhibition, featuredPost] = await Promise.all([
    getFeaturedArtist(),
    getFeaturedArtwork(),
    getFeaturedExhibition(),
    getFeaturedPostByLanguage(languageId),
  ])

  return (
    <HomeHero
      featuredArtist={featuredArtist}
      featuredArtwork={featuredArtwork}
      featuredExhibition={featuredExhibition}
      featuredPost={featuredPost}
    />
  )
}
