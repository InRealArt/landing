import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Catégories Blog - InRealArt',
  description: 'Explorez les articles par catégories sur le blog InRealArt. Actualités, guides et analyses sur l\'art tokenisé.',
  keywords: ['catégories blog', 'articles', 'art tokenisé', 'actualités', 'guides'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/blog/category`,
  alternateLanguages: {
    'fr': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/fr/blog/category`,
    'en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/en/blog/category`
  }
})

export default function BlogCategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}