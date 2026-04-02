'use client'

import BioSlider from "@/components/common/slider/BioSlider";
import { useTranslation } from '@/hooks/useTranslation';

interface HeroProps {
  artists: Array<{
    name: string;
    role: string;
    intro: string;
    description: string;
    photo: string;
  }>;
  onSlideChange: (index: number) => void;
}

export default function Hero({ artists, onSlideChange }: HeroProps) {
  const { t } = useTranslation();
  
  const formattedArtists = artists.map(artist => ({
    name: artist.name,
    role: artist.role,
    intro: artist.intro,
    description: artist.description,
    image: { src: artist.photo }
  }));

  return (
    <>
      <BioSlider 
        items={formattedArtists} 
        title={t('artistPage.whoIs')} 
        hasArtistName 
        onSlideChange={onSlideChange} 
      />
    </>
    
  );
} 