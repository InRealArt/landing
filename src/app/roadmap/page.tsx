import { Metadata } from 'next'
import Intro from "@/components/roadmap/Intro";
import Roadmap from "@/components/roadmap/Roadmap";
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Roadmap - Feuille de Route InRealArt',
  description: 'Suivez l\'évolution d\'InRealArt avec notre roadmap détaillée. Découvrez les étapes clés de développement de notre plateforme d\'art tokenisé.',
  keywords: ['roadmap', 'feuille de route', 'développement', 'étapes', 'milestones', 'évolution plateforme'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/roadmap`
})

export default function RoadmapPage() {
  return (
    <main className="min-h-screen text-white">
      <Intro />
      <Roadmap items={[]} />
    </main>
  );
}
