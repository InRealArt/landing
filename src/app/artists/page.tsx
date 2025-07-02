'use client'
import { useEffect } from 'react';
import Hero from "@/components/artists/Hero";
import ArtworksGallery from "@/components/artists/ArtworksGallery";
import ExpertSection from "@/components/artists/ExpertSection";
import ArtistSlider from "@/components/home/ArtistSlider";
import { useArtistStore } from '@/store/useArtistStore';
import { useLanguageStore } from '@/store/languageStore';
import ArtistArtworks from '@/components/artists/ArtistArtworks';

export default function Artists() {
  const { t } = useLanguageStore();
  
  return (
    <>
      <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-headerSize">
        <h2 className="bricolage-grotesque text-3xl md:text-6xl mb-3">
          {t('artists.title')}
        </h2>
        <ArtistSlider />
        <ExpertSection />
      </section>
    </>
  );
}
