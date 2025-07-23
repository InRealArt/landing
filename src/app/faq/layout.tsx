import { Metadata } from 'next'
import { generateStaticMetadata, defaultMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: defaultMetadata.faq.title,
  description: defaultMetadata.faq.description,
  keywords: defaultMetadata.faq.keywords,
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/faq`
})

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 