'use client'
import { useEffect } from 'react';
import BioSlider from "@/components/common/slider/BioSlider";
import ArtworkCard from "@/components/common/cards/ArtworkCardOrder";
import Button from "@/components/common/Button";
import { ArrowRight } from "lucide-react";
import { useArtistStore } from '@/store/useArtistStore';
import { useLanguageStore } from '@/store/languageStore';
import Image from 'next/image';

export default function Artists() {
  const { t } = useLanguageStore();
  const { 
    artists, 
    fetchArtists, 
    isLoading, 
    hasError, 
    setCurrentArtistIndex, 
    getCurrentArtistArtworks 
  } = useArtistStore();

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const formattedArtists = artists.map(artist => ({
    name: artist.name,
    role: artist.role,
    intro: artist.intro,
    description: artist.description,
    image: { src: artist.photo }
  }));

  const artworkImages = getCurrentArtistArtworks().map(artwork => ({
    ...artwork,
    image: { src: artwork.url }
  }));

  if (isLoading) {
    return <div className="mt-headerSize text-center">{t('team.loading')}</div>;
  }

  if (hasError) {
    return <div className="mt-headerSize text-center">{t('team.error')}</div>;
  }

  if (artists.length === 0) {
    return <div className="mt-headerSize text-center">{t('team.noMembers')}</div>;
  }

  return (
    <>
      <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-headerSize">
        <BioSlider 
          items={formattedArtists} 
          title={t('artistPage.whoIs')} 
          hasArtistName 
          onSlideChange={setCurrentArtistIndex} 
        />
        <div className="mt-20">
          <h1 className='text-2xl lg:text-6xl bricolage-grotesque font-medium mb-6'>{t('artistPage.discover')}</h1>
          <div className="flex flex-wrap gap-4">
            {artworkImages.map((item, index) => <ArtworkCard key={`${item.name}-${index}`} {...item} />)}
          </div>
        </div>

        <section className="flex flex-col md:flex-row justify-between gap-10 md:gap-20 items-center mt-32">
          <div className="flex-1">
            <h1 className="bricolage-grotesque text-6xl mb-3">{t('artistPage.expert')}</h1>
            <p className="bricolage-grotesque text-base">{t('artistPage.expertDescription')}</p>
          </div>
          <div className="flex-1">
            <p className="bricolage-grotesque text-base mb-5">{t('artistPage.expertDescription2')}</p>
            <Button text={t('artistPage.seeMarketplace')} additionalClassName="bg-purpleColor" icon={<ArrowRight />} />
          </div>
        </section>
      </section>
    </>
  );
}
