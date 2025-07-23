import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Simulateur LOA - Calculez votre leasing d\'art',
  description: 'Simulez votre leasing d\'art avec notre calculateur LOA. Découvrez les avantages fiscaux et les modalités de location avec option d\'achat.',
  keywords: ['simulateur LOA', 'calculateur leasing art', 'location avec option d\'achat', 'avantages fiscaux', 'simulateur art'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/loa-simulator`
})

export default function LoaSimulatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 