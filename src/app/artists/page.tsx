'use client'

import { useEffect, useState } from 'react';
import { generateCollectionJsonLd } from '@/utils/metadata'
import Hero from "@/components/artists/Hero";
import ArtworksGallery from "@/components/artists/ArtworksGallery";
import { useArtistStore } from '@/store/useArtistStore';
import { useArtworksStore } from '@/store/useArtworksStore';
import { useLanguageStore } from '@/store/languageStore';
import { Lang } from '@/types/types';

export default function ArtistsPage() {
  const { artists, fetchArtists, isLoading: artistsLoading } = useArtistStore();
  const { artworks, fetchArtworks, isLoading: artworksLoading } = useArtworksStore();
  const { t, language } = useLanguageStore();
  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);

  useEffect(() => {
    fetchArtists();
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
      
      <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-headerSize">
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
      </section>
    </>
  );
}
