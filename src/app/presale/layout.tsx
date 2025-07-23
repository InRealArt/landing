import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Pré-vente - Œuvres d\'Art Exclusives',
  description: 'Découvrez les œuvres d\'art exclusives en pré-vente sur InRealArt. Investissez dans l\'art tokenisé avant le lancement officiel.',
  keywords: ['pré-vente art', 'œuvres exclusives', 'presale', 'investissement art', 'early access', 'art tokenisé'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/presale`
})

export default function PresaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 