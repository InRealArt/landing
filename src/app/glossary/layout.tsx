import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Glossaire - Termes et Définitions',
  description: 'Retrouvez tous les termes techniques utilisés dans l\'univers de la blockchain, des NFTs et de l\'art digital pour mieux comprendre notre écosystème.',
  keywords: ['glossaire', 'définitions', 'termes blockchain', 'NFT', 'art digital', 'tokenisation', 'crypto art'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/glossary`,
  alternateLanguages: {
    'fr': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/fr/glossary`,
    'en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/en/glossary`
  }
})

export default function GlossaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}