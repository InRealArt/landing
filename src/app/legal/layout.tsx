import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Mentions Légales - InRealArt',
  description: 'Mentions légales d\'InRealArt. Informations sur l\'éditeur, l\'hébergement, la propriété intellectuelle et les conditions d\'utilisation.',
  keywords: ['mentions légales', 'éditeur', 'hébergement', 'propriété intellectuelle', 'conditions utilisation'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/legal`
})

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 