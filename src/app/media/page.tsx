import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import MediaPageHeader from '@/components/media/MediaPageHeader'
import ExpoSection from '@/components/media/ExpoSection'
import MediaArticlesSection from '@/components/media/MediaArticlesSection'
import MarianSection from '@/components/media/MarianSection'
import InRealArtTvSection from '@/components/media/InRealArtTvSection'

export const metadata: Metadata = generateStaticMetadata({
  title: "Espace Média & Création — InRealArt",
  description:
    "Expositions, articles, entretiens d'artistes et productions vidéo : l'Observatoire de la Création d'InRealArt.",
  keywords: [
    'média art',
    'expositions',
    'interviews artistes',
    'production vidéo',
    'InRealArt TV',
    'création contemporaine',
  ],
  canonical: 'https://inrealart.com/media',
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
        <InRealArtTvSection />

        {/* 4. Marian — Production Vidéo */}
        <MarianSection />

      </main>
    </>
  )
}
