import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import MediaPageHeader from '@/components/media/MediaPageHeader'
import ExpoSection from '@/components/media/ExpoSection'
import MediaArticlesSection from '@/components/media/MediaArticlesSection'
import MarianSection from '@/components/media/MarianSection'
import InRealArtTvSection from '@/components/media/InRealArtTvSection'
import MediaProductionPackages from '@/components/media/MediaProductionPackages'

export const metadata: Metadata = generateStaticMetadata({
  title: "L'Observatoire de la Création — InRealArt Média",
  description:
    "TV, blog éditorial, interviews d'artistes et packages de production : tout l'univers médias d'InRealArt.",
  keywords: [
    'média art',
    'expositions',
    'interviews artistes',
    'production vidéo',
    'InRealArt TV',
    'création contemporaine',
  ],
  canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://inrealart.com'}/media`,
})

export default function MediaPage() {
  return (
    <>
      <MediaPageHeader />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        {/* 1. Dernières Expositions */}
        <ExpoSection />

        {/* 2. Articles & Entretiens — vrais articles du blog, max 6 */}
        <MediaArticlesSection />

        {/* 3. InRealArt TV — Les Métiers de la Création */}
        {/* <InRealArtTvSection /> */}

        {/* 4. Marian — Production Vidéo */}
        {/* <MarianSection /> */}

      </main>

      {/* 5. Packages de production */}
      {/* <MediaProductionPackages /> */}
    </>
  )
}
