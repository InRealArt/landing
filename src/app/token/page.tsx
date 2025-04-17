'use client'
import TokenHero from '@/components/token/TokenHero';
import TokenWhyChoose from '@/components/token/TokenWhyChoose';
import TokenHowToBuy from '@/components/token/TokenHowToBuy';
import TokenAllocation from '@/components/token/TokenAllocation';
import TokenICO from '@/components/token/TokenICO';
import TokenPhysicalArt from '@/components/token/TokenPhysicalArt';
import Roadmap from '@/components/roadmap/Roadmap';
import { useLanguageStore } from '@/store/languageStore';
import Team from '@/components/common/Team';
import { getRoadmapItems } from '../roadmap/utils';

export default function TokenPage() {
  const { t } = useLanguageStore();

  return (
    <main className="min-h-screen text-white">
      <TokenHero />
      <TokenWhyChoose />
      <TokenHowToBuy />
      <TokenAllocation />
      <Roadmap items={getRoadmapItems(t)} />
      <TokenICO />
      <TokenPhysicalArt />
      <Team />
      {/* Additional sections will be added here */}
    </main>
  );
} 