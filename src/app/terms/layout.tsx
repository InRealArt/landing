import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Conditions Générales d\'Utilisation - InRealArt',
  description: 'Conditions générales d\'utilisation d\'InRealArt. Modalités d\'utilisation de la plateforme, droits et obligations des utilisateurs.',
  keywords: ['conditions générales', 'CGU', 'utilisation', 'modalités', 'droits utilisateurs', 'obligations'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/terms`,
  alternateLanguages: {
    'fr': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/fr/terms`,
    'en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/en/terms`
  }
})

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 