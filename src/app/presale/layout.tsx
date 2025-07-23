import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Prévente exclusive — oeuvres rares en accès anticipé',
  description: 'Accédez en avant-première à des œuvres rares sélectionnées par notre comité curatoriel. Réservez dès maintenant votre place dans l\'art de demain.',
  keywords: ['prévente art', 'œuvres rares', 'avant-première artistique', 'sélection curatoriale'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/presale`
})

export default function PresaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 