import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import HotelPrestigeClient from './HotelPrestigeClient'
import PageFAQ from '@/components/common/FAQ/PageFAQ'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Art & Hôtellerie d\'Exception — InRealArt',
  description: 'InRealArt accompagne les hôtels de prestige dans la création d\'univers artistiques sur mesure. Leasing d\'œuvres d\'art, curation confidentielle, installation maîtrisée.',
  keywords: [
    'art hôtellerie prestige',
    'leasing art hôtel luxe',
    'curation artistique hôtel',
    'œuvres art hôtel',
    'art contemporain hôtellerie',
    'RSE luxe art',
  ],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase/leasing/hotelPrestige`,
})

export default function HotelPrestigePage() {
  return (
    <>
      <HotelPrestigeClient />
      <PageFAQ pageName="usecaseLeasingHotelPrestige" />
    </>
  )
}
