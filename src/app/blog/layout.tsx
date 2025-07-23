import { Metadata } from 'next'
import { generateStaticMetadata, defaultMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: defaultMetadata.blog.title,
  description: defaultMetadata.blog.description,
  keywords: defaultMetadata.blog.keywords,
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/blog`
})

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 