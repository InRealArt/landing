'use client'

import { useMemo } from 'react'
import ArtistProfileHero from '@/components/artists/ArtistProfileHero'
import ArtistArtworks from '@/components/artists/ArtistArtworks'
import ArtistInfoSection from '@/components/artists/ArtistInfoSection'
import ArtistBiography from '@/components/artists/ArtistBiography'
import ExpertSection from '@/components/artists/ExpertSection'
import { useLanguageStore } from '@/store/languageStore'
import { ArtWork, Lang } from '@/types/types'
import { generatePersonJsonLd, generateBreadcrumbJsonLd } from '@/utils/metadata'
import ArtistDataProvider from './ArtistDataProvider'

interface Props {
  slug: string
}

export default function ArtistPageClient({ slug }: Props) {
  const { language } = useLanguageStore()

  // Optimisation : useMemo pour la fonction de formatage
  const formatArtworksForDisplay = useMemo(() => {
    return (artworks: ArtWork[]) => {
      return artworks.map(artwork => ({
        id: artwork.id,
        name: typeof artwork.name === 'string' 
          ? artwork.name 
          : artwork.name[language as Lang] || artwork.name.FR || Object.values(artwork.name)[0] || 'Sans titre',
        price: artwork.price,
        image: { src: artwork.image || '' }
      }))
    }
  }, [language])

  return (
    <ArtistDataProvider slug={slug}>
      {({ artist, artworks, isLoading, hasError }) => {
        // Si en cours de chargement ou pas d'artiste, ne rien afficher
        // Le composant loading.tsx sera affiché automatiquement par Next.js
        if (isLoading || !artist) {
          return null
        }

        // Si erreur, ne rien afficher
        // Le composant error.tsx sera affiché automatiquement par Next.js
        if (hasError) {
          return null
        }

        const formattedArtworks = formatArtworksForDisplay(artworks)
        
        return (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ 
                __html: generatePersonJsonLd(
                  artist.name,
                  'Artiste',
                  artist.description,
                  artist.photo,
                  `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/artists/${slug}`
                )
              }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ 
                __html: generateBreadcrumbJsonLd([
                  { name: 'Accueil', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com' },
                  { name: 'Artistes', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/artists` },
                  { name: artist.name }
                ])
              }}
            />
            
            <ArtistProfileHero artist={artist} />
            
            {/* Section d'informations de l'artiste */}
            <ArtistInfoSection artist={artist} />
            
            <section className="relative max-w-90 xl:max-w-screen-xl m-auto">
              {formattedArtworks.length > 0 && (
                <ArtistArtworks artistName={artist.name} artworks={formattedArtworks} />
              )}
            </section>
            
            {/* Section biographie de l'artiste */}
            <ArtistBiography artist={artist} />
            
            {/* <section className="relative max-w-90 xl:max-w-screen-xl m-auto">
              <ExpertSection />
            </section> */}
          </>
        )
      }}
    </ArtistDataProvider>
  )
} 