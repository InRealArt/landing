import { RoadmapItem } from "@/components/roadmap/Roadmap";

export const getRoadmapItems = (t: (key: string) => string): RoadmapItem[] => [
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
  {
    title: t('roadmap.items.q1_2026.title'),
    description: [
      t('roadmap.items.q1_2026.description.0'),
      t('roadmap.items.q1_2026.description.1'),
      t('roadmap.items.q1_2026.description.2')
    ]
  }
]