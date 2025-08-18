'use client'

import { Suspense, useEffect, useState, lazy } from 'react'
import { generateCollectionJsonLd } from '@/utils/metadata'
import Hero from '@/components/artists/Hero'
import ArtworksGallery from '@/components/artists/ArtworksGallery'
import ArtistsGrid from '@/components/artists/ArtistsGrid'
import { useArtistStore } from '@/store/useArtistStore'
import { useArtworksStore } from '@/store/useArtworksStore'
import { useLanguageStore } from '@/store/languageStore'
import { Lang } from '@/types/types'

// Lazy loading avec React.lazy pour déclencher Suspense
const ArtistCategoriesSliderLazy = lazy(
  () => import('@/components/artists/ArtistCategoriesSlider')
)

function CategoriesSliderSkeleton () {
  return (
    <section className="w-full mb-16 mt-24">
      <div className="max-w-90 xl:max-w-screen-xl m-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-64 rounded bg-white/10 animate-pulse" />
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
            <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0,1,2].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-white/10 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ArtistsPage() {
  const { artists, fetchArtists, isLoading: artistsLoading } = useArtistStore();
  const { artworks, fetchArtworks, isLoading: artworksLoading } = useArtworksStore();
  const { t, language } = useLanguageStore();
  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);

  useEffect(() => {
    fetchArtists(false); // Afficher uniquement les artistes (pas les galeries)
    fetchArtworks();
  }, [fetchArtists, fetchArtworks]);

  if (artistsLoading || artworksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">{t('common.loading')}</div>
      </div>
    );
  }

  // Format artists for Hero component
  const formattedArtists = artists.map(artist => ({
    name: artist.name,
    role: artist.role || 'Artiste',
    intro: artist.intro || '',
    description: artist.description || '',
    photo: artist.photo || '/images/default-artist.jpg'
  }));

  // Get current artist's artworks
  const currentArtist = artists[currentArtistIndex];
  const currentArtistArtworks = currentArtist 
    ? artworks.filter(artwork => artwork.artistName === currentArtist.name)
    : [];

  // Convert ArtWork[] to Artwork[] format expected by ArtworksGallery
  const formattedArtworks = currentArtistArtworks.map(artwork => ({
    id: artwork.id,
    name: typeof artwork.name === 'string' 
      ? artwork.name 
      : artwork.name[language as Lang] || artwork.name.FR || Object.values(artwork.name)[0] || 'Sans titre',
    url: artwork.url,
    price: artwork.price || 0
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: generateCollectionJsonLd(
            'Artistes InRealArt',
            'Collection d\'artistes partenaires de la plateforme InRealArt',
            artists.map(artist => ({
              name: artist.name,
              url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/artists/${artist.slug}`
            }))
          )
        }}
      />
      

      {/* Slider des catégories d'artistes (Suspense fallback) */}
      <Suspense fallback={<CategoriesSliderSkeleton />}>
        <ArtistCategoriesSliderLazy />
      </Suspense>

      {/* Grille d'artistes avec filtre nationalité & pagination via Nuqs */}
      <Suspense fallback={<div className="max-w-90 xl:max-w-screen-xl m-auto text-white/70">Chargement…</div>}>
        <ArtistsGrid />
      </Suspense>

      {/* <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-headerSize">
        <h2 className="bricolage-grotesque text-3xl md:text-6xl mb-3 text-white">
          {t('artists.title')}
        </h2>
        {formattedArtists.length > 0 && (
          <Hero 
            artists={formattedArtists}
            onSlideChange={setCurrentArtistIndex}
          />
        )}
        {formattedArtworks.length > 0 && (
          <ArtworksGallery 
            artworks={formattedArtworks}
            artistName={currentArtist?.name || ''}
          />
        )}
      </section> */}
    </>
  );
}
