'use client'

import ArtworkCard from "@/components/common/cards/ArtworkCardOrder";
import { useLanguageStore } from '@/store/languageStore';

interface Artwork {
  id: string;
  name: string;
  url: string;
  price: number;
  [key: string]: any;
}

interface ArtworksGalleryProps {
  artworks: Artwork[];
  artistName: string;
}

export default function ArtworksGallery({ artworks, artistName }: ArtworksGalleryProps) {
  const { t } = useLanguageStore();
  
  const artworkImages = artworks.map(artwork => ({
    id: artwork.id,
    name: artwork.name,
    price: artwork.price,
    image: { src: artwork.url }
  }));

  return (
    <section className="w-full mt-20">
      <h2 className='text-2xl lg:text-6xl bricolage-grotesque font-medium mb-6'>
        {t('artistPage.discover')} {artistName}
      </h2>
      <div className="flex flex-wrap gap-4">
        {artworkImages.map((item, index) => (
          <ArtworkCard key={`${item.name}-${index}`} {...item} />
        ))}
      </div>
    </section>
  );
} 