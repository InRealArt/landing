import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Simulateur d\'intégration de l\'art dans un patrimoine — Optimisez votre allocation',
  description: 'Découvrez comment intégrer l\'art dans votre stratégie patrimoniale. Notre simulateur vous recommande l\'allocation optimale selon votre profil investisseur et vos objectifs.',
  keywords: ['simulateur patrimoine art', 'allocation artistique', 'diversification patrimoine', 'investissement art', 'stratégie patrimoniale'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/heritage-art-simulator`
})

export default function HeritageArtSimulatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 