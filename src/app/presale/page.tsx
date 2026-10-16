import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import PresaleClient from './PresaleClient'
import FAQWrapper from '@/components/common/FAQ/FAQWrapper'
import { getKeyWorksArtworks } from '@/actions/presaleArtworkActions'
import NewsletterInline from '@/components/common/NewsletterInline'

export const revalidate = 300 // filet de sécurité : 5 min max (IRA-22), en plus de /api/revalidate

export const metadata: Metadata = generateStaticMetadata({
  title: 'Présale — Œuvres d\'Art en Exclusivité | InRealArt',
  description: "Découvrez et acquérez des œuvres d'art en exclusivité sur In Real Art. Achat direct auprès d'artistes sélectionnés avec option location-vente (LOA).",
  keywords: ['présale art', 'œuvres en exclusivité', 'achat art contemporain', 'location-vente art', 'art original'],
  canonical: 'https://www.inrealart.com/presale',
})

export default async function PresalePage() {
  const artworks = await getKeyWorksArtworks()

  return (
    <PresaleClient initialArtworks={artworks}>
      <FAQWrapper titleKey="presale.faq.title" descriptionKey="presale.faq.description" />
      <NewsletterInline />
    </PresaleClient>
  )
}
