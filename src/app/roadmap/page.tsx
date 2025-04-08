'use client'
import Intro from "@/components/roadmap/Intro";
import Roadmap, { RoadmapItem } from "@/components/roadmap/Roadmap";
import { useLanguageStore } from "@/store/languageStore";

export default function RoadMap() {
  const { t } = useLanguageStore();
  const items: RoadmapItem[] = [
    {
      title: t('roadmap.items.q2_2025.title'),
      description: [
        t('roadmap.items.q2_2025.description.0'),
        t('roadmap.items.q2_2025.description.1'),
        t('roadmap.items.q2_2025.description.2'),
        t('roadmap.items.q2_2025.description.3')
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
    {
      title: t('roadmap.items.q1_2026.title'),
      description: [
        t('roadmap.items.q1_2026.description.0'),
        t('roadmap.items.q1_2026.description.1'),
        t('roadmap.items.q1_2026.description.2')
      ]
    }
  ]
  return (
    <>
      <Intro />
      <Roadmap items={items} />
    </>
  );
}
