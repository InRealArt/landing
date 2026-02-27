import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import AboutHero from '@/components/about/AboutHero'

export const metadata: Metadata = generateStaticMetadata({
  title: "À propos d'In Real Art — Mission, Histoire et Équipe",
  description: "Découvrez In Real Art : notre mission pour rendre l'art accessible, humain et éthique. Notre histoire, nos engagements et l'équipe qui les porte.",
  keywords: ['à propos', 'mission In Real Art', 'équipe artistique', 'éthique culturelle', 'plateforme curatoriale'],
  canonical: 'https://inrealart.com/about',
})
import AboutOurCommitments from '@/components/about/AboutOurCommitments'
import AboutOurHistory from '@/components/about/AboutOurHistory'
import AboutTeam from '@/components/about/AboutTeam'
import AboutOurInvitation from '@/components/about/AboutOurInvitation'
import NewsletterInline from '@/components/common/NewsletterInline'

export default function AboutPage() {
  return (
    <>
      {/* Hero Section avec image hero_about.webp */}
      <AboutHero />
      
      
      {/* Section 3 : grille des 4 textes avec icônes */}
      <AboutOurHistory />
      
      {/* Section 4 : équipe professionnelle */}
      <AboutTeam />
      
      {/* Section 1 : contenu avec mise en page en deux colonnes */}
      <AboutOurCommitments />

      {/* Section 2 : image de femme à gauche, contenu à droite */}
      <AboutOurInvitation />
      

      {/* Section 5 : newsletter */}
      <NewsletterInline />
      {/* Le footer est automatiquement inclus via le layout principal */}
    </>
  )
}
