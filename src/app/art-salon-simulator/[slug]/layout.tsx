import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateStaticMetadata } from '@/utils/metadata'
import { salons } from '@/utils/artSalonCalculations'

interface ArtSalonLayoutProps {
  children: React.ReactNode
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const salon = salons[slug]
  
  if (!salon) {
    return {
      title: 'Salon non trouvé',
      description: 'Le salon d\'art demandé n\'existe pas.'
    }
  }

  return generateStaticMetadata({
    title: `Simulateur de visite à ${salon.name} — Calculez vos coûts`,
    description: `Calculez le coût de votre visite à ${salon.name}. Transport, hébergement, pass, accompagnement professionnel. Simulation gratuite et personnalisée.`,
    keywords: [`simulateur ${salon.name}`, 'coût visite salon art', 'calculateur voyage art', 'transport salon art', 'hébergement salon art'],
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/art-salon-simulator/${slug}`
  })
}

export async function generateStaticParams() {
  return Object.keys(salons).map((slug) => ({
    slug,
  }))
}

export default async function ArtSalonLayout({ children, params }: ArtSalonLayoutProps) {
  const { slug } = await params
  const salon = salons[slug]
  
  if (!salon) {
    notFound()
  }

  return children
} 