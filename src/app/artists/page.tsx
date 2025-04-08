'use client'
import { useEffect } from 'react';
import Hero from "@/components/artists/Hero";
import ArtworksGallery from "@/components/artists/ArtworksGallery";
import ExpertSection from "@/components/artists/ExpertSection";
import { useArtistStore } from '@/store/useArtistStore';
import { useLanguageStore } from '@/store/languageStore';
import ArtistArtworks from '@/components/artists/ArtistArtworks';

export default function Artists() {
  const { t } = useLanguageStore();
  const { 
    artists, 
    fetchArtists, 
    isLoading, 
    hasError, 
    setCurrentArtistIndex,
    currentArtistIndex,
    getCurrentArtistArtworks 
  } = useArtistStore();

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  if (isLoading) {
    return <div className="mt-headerSize text-center">{t('team.loading')}</div>;
  }

  if (hasError) {
    return <div className="mt-headerSize text-center">{t('team.error')}</div>;
  }

  if (artists.length === 0) {
    return <div className="mt-headerSize text-center">{t('team.noMembers')}</div>;
  }

  console.log(getCurrentArtistArtworks());
  

  return (
    <>
      <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-headerSize">
        <Hero artists={artists} onSlideChange={setCurrentArtistIndex} />
        <ArtworksGallery artworks={getCurrentArtistArtworks()} artistName={artists[currentArtistIndex].name} />
        <ExpertSection />
      </section>
    </>
  );
}
