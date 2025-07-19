import { Metadata } from 'next'
import { generateStaticMetadata, defaultMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: defaultMetadata.artists.title,
  description: defaultMetadata.artists.description,
  keywords: defaultMetadata.artists.keywords,
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/artists`,
  alternateLanguages: {
    'fr': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/fr/artists`,
    'en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/en/artists`
  }
})

export default function ArtistsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 