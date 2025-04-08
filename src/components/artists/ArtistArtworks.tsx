'use client'

import ArtworkCard from '@/components/common/cards/ArtworkCardOrder';
import { useLanguageStore } from '@/store/languageStore';

interface ArtistArtworksProps {
  artistName: string;
  artworks: Array<{
    id: string;
    name: string;
    price: number;
    image: {
      src: string;
    };
  }>;
}

export default function ArtistArtworks({ artistName, artworks }: ArtistArtworksProps) {
  const { t } = useLanguageStore();
  return (
    <div className="mt-20">
      <h2 className='text-2xl lg:text-6xl bricolage-grotesque font-medium mb-6'>
        {t('artistPage.discover')} {artistName}
      </h2>
      <div className="flex flex-wrap gap-4">
        {artworks.map((item, index) => (
          <ArtworkCard key={`${item.name}-${index}`} {...item} />
        ))}
      </div>
    </div>
  );
} 