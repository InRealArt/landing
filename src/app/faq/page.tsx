import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import FaqClient from './FaqClient'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Questions Fréquentes — Tout comprendre sur In Real Art',
  description: "Retrouvez les réponses aux questions les plus fréquentes sur le fonctionnement d'In Real Art, nos services, nos engagements éthiques et notre accompagnement artistique.",
  keywords: ['faq art', 'fonctionnement In Real Art', 'questions artistes', 'plateforme curatoriale', 'aide'],
  canonical: 'https://inrealart.com/faq',
})

export default function FaqPage() {
  return <FaqClient />
}
