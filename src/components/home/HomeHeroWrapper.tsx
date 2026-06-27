import { prisma } from '@/lib/prisma'
import { getFeaturedArtist } from '@/actions/getFeaturedArtist'
import { getFeaturedArtwork } from '@/actions/getFeaturedArtwork'
import { getFeaturedPostByLanguage } from '@/actions/getFeaturedPost'
import HomeHero from './HomeHero'

export default async function HomeHeroWrapper() {
  const language = await prisma.language.findUnique({ where: { code: 'fr' } })
  const languageId = language?.id ?? 1

  const [featuredArtist, featuredArtwork, featuredPost] = await Promise.all([
    getFeaturedArtist(),
    getFeaturedArtwork(),
    getFeaturedPostByLanguage(languageId),
  ])

  return (
    <HomeHero
      featuredArtist={featuredArtist}
      featuredArtwork={featuredArtwork}
      featuredPost={featuredPost}
    />
  )
}
