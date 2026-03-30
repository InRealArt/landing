import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import ImmobilierClient from './ImmobilierClient'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Leasing d\'Art pour Immobilier de Prestige — InRealArt',
  description: 'Accélérez la vente de vos programmes immobiliers avec l\'art contemporain. Leasing d\'œuvres pour halls, circulations, espaces partagés. Curation sur mesure, installation rapide.',
  keywords: [
    'art immobilier',
    'leasing art programme immobilier',
    'art parties communes',
    'curation immobilière',
    'valorisation bien immobilier',
    'halls prestige art',
  ],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase/leasing/immobilier`,
})

export default function ImmobilierPage() {
  return <ImmobilierClient />
}
