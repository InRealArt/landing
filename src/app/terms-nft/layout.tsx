import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Conditions Générales NFT - InRealArt',
  description: 'Conditions générales spécifiques aux NFTs sur InRealArt. Modalités d\'achat, propriété et utilisation des tokens non-fongibles.',
  keywords: ['conditions NFT', 'CGU NFT', 'tokens non-fongibles', 'propriété numérique', 'blockchain art'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/terms-nft`
})

export default function TermsNftLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 