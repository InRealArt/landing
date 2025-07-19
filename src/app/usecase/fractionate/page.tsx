import { Metadata } from 'next'
import Hero from "@/components/usecase/fractionate/Hero";
import Benefits from "@/components/usecase/fractionate/Benefits";
import HowItWorks from "@/components/usecase/fractionate/HowItWorks";
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Fractionnement d\'Art - Investissement Accessible',
  description: 'Investissez dans l\'art grâce au fractionnement d\'œuvres avec InRealArt. Rendez l\'art accessible à tous les investisseurs.',
  keywords: ['fractionnement art', 'investissement partagé', 'art accessible', 'copropriété art', 'tokenisation art', 'investissement collectif'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase/fractionate`,
  alternateLanguages: {
    'fr': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/fr/usecase/fractionate`,
    'en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/en/usecase/fractionate`
  }
})

export default function FractionatePage() {
  return (
    <main className="min-h-screen text-white">
      <Hero />
      <Benefits />
      <HowItWorks />
    </main>
  );
} 