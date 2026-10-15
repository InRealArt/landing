import { Metadata } from 'next';
import { BASE_URL } from '@/utils/metadata';

export const metadata: Metadata = {
  title: 'Simulateur de Visite de Salon d\'Art',
  description: 'Estimez le coût total de votre déplacement professionnel pour visiter un salon d\'art. Calculez transport, hébergement et pass d\'entrée en quelques clics.',
  alternates: {
    canonical: `${BASE_URL}/art-salon-simulator`,
  },
  openGraph: {
    url: `${BASE_URL}/art-salon-simulator`,
    title: 'Simulateur de Visite de Salon d\'Art | InRealArt',
    description: 'Estimez le coût total de votre déplacement professionnel pour visiter un salon d\'art. Calculez transport, hébergement et pass d\'entrée en quelques clics.',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simulateur de Visite de Salon d\'Art | InRealArt',
    description: 'Estimez le coût total de votre déplacement professionnel pour visiter un salon d\'art.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ArtSalonSimulatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 