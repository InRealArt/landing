import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'FAQ Traduites - Questions Fréquentes',
  description: 'Version traduite des questions fréquemment posées sur InRealArt, l\'art tokenisé et notre plateforme.',
  keywords: ['FAQ traduites', 'questions fréquentes', 'aide multilingue', 'support', 'guide utilisateur'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/faq/translated`,
  alternateLanguages: {
    'fr': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/fr/faq/translated`,
    'en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/en/faq/translated`
  }
})

export default function FaqTranslatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 