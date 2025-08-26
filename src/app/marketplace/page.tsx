import { Metadata } from 'next'
import Hero from "@/components/marketplace/Hero";
import HowItWorks from "@/components/marketplace/HowItWorks";
import Benefits from "@/components/marketplace/Benefits";
import Prestige from "@/components/marketplace/Prestige";
import { generateStaticMetadata, defaultMetadata } from '@/utils/metadata'
import MarketplaceFAQ from '@/components/marketplace/MarketplaceFAQ';

export const metadata: Metadata = generateStaticMetadata({
  title: defaultMetadata.marketplace.title,
  description: defaultMetadata.marketplace.description,
  keywords: defaultMetadata.marketplace.keywords,
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/marketplace`
})

export default function Marketplace() {
  return (
    <main className="min-h-screen text-white">
      <Hero />
      <HowItWorks />
      <Benefits />
      <Prestige />
      <MarketplaceFAQ />
    </main>
  );
} 