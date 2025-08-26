import { Metadata } from 'next'
import Intro from "@/components/roadmap/Intro";
import Roadmap from "@/components/roadmap/Roadmap";
import { generateStaticMetadata } from '@/utils/metadata'
import RoadmapFAQ from '@/components/roadmap/RoadmapFAQ';

export const metadata: Metadata = generateStaticMetadata({
  title: 'Roadmap InRealArt — Vision, étapes et déploiement',
  description: 'Suivez notre feuille de route : évolutions techniques, éditoriales et curatoriales. Transparence et engagement à chaque étape.',
  keywords: ['roadmap art', 'feuille de route', 'stratégie curatoriale', 'développement plateforme'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/roadmap`
})

export default function RoadmapPage() {
  return (
    <main className="min-h-screen text-white">
      <Intro />
      <Roadmap items={[]} />
      <RoadmapFAQ />
    </main>
  );
}
