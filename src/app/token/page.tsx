import { Metadata } from 'next'
import TokenHero from '@/components/token/TokenHero';
import TokenWhyChoose from '@/components/token/TokenWhyChoose';
import TokenHowToBuy from '@/components/token/TokenHowToBuy';
import TokenAllocation from '@/components/token/TokenAllocation';
import TokenICO from '@/components/token/TokenICO';
import TokenPhysicalArt from '@/components/token/TokenPhysicalArt';
import Roadmap from '@/components/roadmap/Roadmap';
import Team from '@/components/common/Team';
import { generateStaticMetadata, defaultMetadata } from '@/utils/metadata'
import TokenFAQ from '@/components/token/TokenFAQ'

export const metadata: Metadata = generateStaticMetadata({
  title: defaultMetadata.token.title,
  description: defaultMetadata.token.description,
  keywords: defaultMetadata.token.keywords,
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/token`
})

export default function TokenPage() {
  return (
    <main className="min-h-screen text-white">
      <TokenHero />
      <TokenWhyChoose />
      <TokenHowToBuy />
      <TokenAllocation />
      <Roadmap items={[]} />
      <TokenICO />
      <TokenPhysicalArt />
      <Team />
      <TokenFAQ />
    </main>
  );
} 