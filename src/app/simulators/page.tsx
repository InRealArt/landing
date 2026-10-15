import { Metadata } from 'next'
import { generateStaticMetadata, BASE_URL } from '@/utils/metadata'
import SimulatorsPageClient from './SimulatorsPageClient'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Simulateurs leasing et patrimoine artistique',
  description: "Simulez une location avec option d'achat d'œuvres d'art, la valorisation de votre patrimoine artistique et vos frais de salon avec les simulateurs InRealArt.",
  canonical: `${BASE_URL}/simulators`,
})

export default function SimulatorsPage() {
  return <SimulatorsPageClient />
}
