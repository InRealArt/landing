'use client'
import TokenHero from '@/components/token/TokenHero';
import TokenWhyChoose from '@/components/token/TokenWhyChoose';
import TokenHowToBuy from '@/components/token/TokenHowToBuy';
import TokenAllocation from '@/components/token/TokenAllocation';
import TokenICO from '@/components/token/TokenICO';
import TokenPhysicalArt from '@/components/token/TokenPhysicalArt';
import Roadmap, { RoadmapItem } from '@/components/roadmap/Roadmap';
import { useLanguageStore } from '@/store/languageStore';
import Team from '@/components/common/Team';

export default function TokenPage() {
  const { t } = useLanguageStore();

  const items: RoadmapItem[] = [
    {
      title: t('roadmap.items.q2_2025.title'),
      description: [
        t('roadmap.items.q2_2025.description.0'),
        t('roadmap.items.q2_2025.description.1'),
        t('roadmap.items.q2_2025.description.2')
      ]
    },
    {
      title: t('roadmap.items.q3_2025.title'),
      description: [
        t('roadmap.items.q3_2025.description.0'),
        t('roadmap.items.q3_2025.description.1'),
        t('roadmap.items.q3_2025.description.2')
      ]
    },
    {
      title: t('roadmap.items.q4_2025.title'),
      description: [
        t('roadmap.items.q4_2025.description.0'),
        t('roadmap.items.q4_2025.description.1'),
        t('roadmap.items.q4_2025.description.2')
      ]
    },
  ]
  return (
    <main className="min-h-screen text-white">      
      <TokenHero />
      <TokenWhyChoose />
      <TokenHowToBuy />
      <TokenAllocation />
      <Roadmap items={items}/>
      <TokenICO />
      <TokenPhysicalArt />
      <Team />
      {/* Additional sections will be added here */}
    </main>
  );
} 