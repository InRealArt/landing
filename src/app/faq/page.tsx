import { Metadata } from 'next'
import { generateStaticMetadata, generateFAQJsonLd } from '@/utils/metadata'
import { getTranslatedDetailedFaq } from '@/actions/detailedFaqActions'
import FaqClient from './FaqClient'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Questions Fréquentes — Tout comprendre sur InRealArt',
  description: "Retrouvez les réponses aux questions les plus fréquentes sur le fonctionnement d'In Real Art, nos services, nos engagements éthiques et notre accompagnement artistique.",
  keywords: ['faq art', 'fonctionnement In Real Art', 'questions artistes', 'plateforme curatoriale', 'aide'],
  canonical: 'https://inrealart.com/faq',
})

export default async function FaqPage() {
  const faqItems = await getTranslatedDetailedFaq('fr').catch(() => [])
  const faqData = faqItems.map(item => ({ question: item.title, answer: item.content }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateFAQJsonLd(faqData) }}
      />
      <FaqClient />
    </>
  )
}
