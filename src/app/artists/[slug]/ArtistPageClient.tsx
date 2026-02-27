'use client'

import { useMemo } from 'react'
import ArtistProfileHero from '@/components/artists/ArtistProfileHero'
import ArtistArtworks from '@/components/artists/ArtistArtworks'
import ArtistInfoSection from '@/components/artists/ArtistInfoSection'
import ArtistBiography from '@/components/artists/ArtistBiography'
import ArtistRelatedPosts from '@/components/artists/ArtistRelatedPosts'
import ArtistPageSkeleton from '@/components/artists/ArtistPageSkeleton'
import { useLanguageStore } from '@/store/languageStore'
import { ArtWork, Lang } from '@/types/types'
import { ArtistData } from '@/actions/artistActions'

export interface ArtistPageClientProps {
  slug: string
  initialArtist: ArtistData
  initialArtworks: ArtWork[]
  interviewUrl?: string | null
  artitudeUrl?: string | null
}

export default function ArtistPageClient({ slug: _slug, initialArtist, initialArtworks, interviewUrl, artitudeUrl }: ArtistPageClientProps) {
  const { language, t } = useLanguageStore()

  // Transform initialArtist to the format expected by components (StoreArtistData-like)
  const artist = useMemo(() => {
    if (!initialArtist) return null

    // Handle translations
    // initialArtist from action has translations object
    const translations = initialArtist.translations || {}
    
    // NOTE: The translation fallback order is critical here.
    // 1. Try to find a translation for the current language in the `translations` object.
    // 2. If not found, fallback to the value directly on the `initialArtist` object (which comes from LandingArtist table).
    // 3. If that is also empty, fallback to empty string.
    const getTranslated = (field: keyof typeof translations, fallback: string | null | undefined) => {
        const fieldTrans = translations[field] as Record<string, string> | undefined;
        
        if (fieldTrans && fieldTrans[language]) {
             return fieldTrans[language];
        }
        
        return fallback || '';
    }

    return {
        ...initialArtist,
        name: `${initialArtist.name} ${initialArtist.surname}`, // Combine name
        photo: initialArtist.imageUrl, // Map imageUrl to photo
        secondaryImageUrl: initialArtist.secondaryImageUrl || '', // Ensure string for components expecting StoreArtistData
        role: getTranslated('artworkStyle', initialArtist.artworkStyle) || 'Artiste',
        intro: getTranslated('intro', initialArtist.intro),
        description: getTranslated('description', initialArtist.description),
        quoteFromInRealArt: getTranslated('quoteFromInRealArt', initialArtist.quoteFromInRealArt),
        biographyHeader1: getTranslated('biographyHeader1', initialArtist.biographyHeader1),
        biographyText1: getTranslated('biographyText1', initialArtist.biographyText1),
        biographyHeader2: getTranslated('biographyHeader2', initialArtist.biographyHeader2),
        biographyText2: getTranslated('biographyText2', initialArtist.biographyText2),
        biographyHeader3: getTranslated('biographyHeader3', initialArtist.biographyHeader3),
        biographyText3: getTranslated('biographyText3', initialArtist.biographyText3),
        biographyHeader4: getTranslated('biographyHeader4', initialArtist.biographyHeader4),
        biographyText4: getTranslated('biographyText4', initialArtist.biographyText4),
    }
  }, [initialArtist, language])

  // Optimisation : useMemo pour la fonction de formatage
  const formattedArtworks = useMemo(() => {
      return initialArtworks.map(artwork => ({
        id: artwork.id,
        name: typeof artwork.name === 'string' 
          ? artwork.name 
          : artwork.name[language as Lang] || artwork.name.FR || Object.values(artwork.name)[0] || t('common.noTitle'),
        price: artwork.price,
        image: { src: artwork.image || '' },
        isSold: artwork.isSold || false
      }))
  }, [initialArtworks, language, t])

  if (!artist) {
      return <ArtistPageSkeleton />
  }

  return (
      <>
        <ArtistProfileHero artist={artist} />
        
        {/* Section d'informations de l'artiste */}
        <ArtistInfoSection artist={artist} interviewUrl={interviewUrl} artitudeUrl={artitudeUrl} />

        <section className="relative max-w-90 xl:max-w-screen-xl m-auto">
          {formattedArtworks.length > 0 && (
            <ArtistArtworks artistName={artist.name} artworks={formattedArtworks} />
          )}
        </section>

        {/* Section biographie de l'artiste */}
        <ArtistBiography artist={artist} />

        <ArtistRelatedPosts artistName={initialArtist.name} artistSurname={initialArtist.surname} />
      </>
  )
}
