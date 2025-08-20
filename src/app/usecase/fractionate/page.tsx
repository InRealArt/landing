import { Metadata } from 'next'
import Hero from "@/components/usecase/fractionate/Hero";
import Benefits from "@/components/usecase/fractionate/Benefits";
import HowItWorks from "@/components/usecase/fractionate/HowItWorks";
import { generateStaticMetadata } from '@/utils/metadata'
import FractionateFAQ from '@/components/usecase/fractionate/FractionateFAQ';

export const metadata: Metadata = generateStaticMetadata({
  title: 'Fractionnement d\'oeuvres — Investissez à plusieurs dans l\'Art',
  description: 'Accédez à l\'investissement artistique en co-propriété. Une nouvelle façon de collectionner, accessible et partagée.',
  keywords: ['fractionnement art', 'investissement collectif', 'co-propriété artistique', 'partage de valeur'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase/fractionate`
})

export default function FractionatePage() {
  return (
    <main className="min-h-screen text-white">
      <Hero />
      <Benefits />
      <HowItWorks />
      <FractionateFAQ />
    </main>
  );
} 