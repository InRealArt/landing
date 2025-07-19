import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Simulateur de Visite de Salon d\'Art | InRealArt',
  description: 'Estimez le coût total de votre déplacement professionnel pour visiter un salon d\'art. Calculez transport, hébergement et pass d\'entrée en quelques clics.',
  keywords: [
    'simulateur salon art',
    'déplacement professionnel',
    'Art Basel Paris',
    'Artgenève',
    'coût visite salon',
    'transport art',
    'hébergement salon',
    'estimation voyage art'
  ],
  openGraph: {
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