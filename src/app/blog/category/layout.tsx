import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Catégories Blog - InRealArt',
  description: 'Explorez les articles par catégories sur le blog InRealArt. Actualités, guides et analyses sur l\'art contemporain.',
  keywords: ['catégories blog', 'articles', 'art contemporain', 'actualités', 'guides'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inrealart.com'}/blog/category`
})

export default function BlogCategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}