'use client'

import { useMemo } from 'react';
import ArtworkCard from '@/components/common/cards/ArtworkCardOrder';
import { useLanguageStore } from '@/store/languageStore';
import { useQueryStates, parseAsInteger } from 'nuqs';

const PAGE_SIZE = 9; // Grid 3x3

interface ArtistArtworksProps {
  artistName: string;
  artworks: Array<{
    id: string;
    name: string;
    price: number | null;
    image: {
      src: string;
    };
    isSold?: boolean;
  }>;
}

export default function ArtistArtworks({ artistName, artworks }: ArtistArtworksProps) {
  const { t } = useLanguageStore();

  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1)
  });

  const totalPages = Math.max(1, Math.ceil(artworks.length / PAGE_SIZE));
  const page = Math.min(params.page, totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const currentArtworks = artworks.slice(start, start + PAGE_SIZE);

  return (
    <div className="mt-20">
      <div className="mb-12">
        <div className="border-t border-white/20 mb-6"></div>
        <h2 className='text-2xl lg:text-6xl bricolage-grotesque font-medium text-center mb-6'>
          {t('artistPage.discover')} <span className="whitespace-nowrap">{artistName}</span>
        </h2>
        <div className="border-t border-white/20"></div>
      </div>
      
      {/* Compteur d'artworks */}
      {artworks.length > 0 && (
        <div className="flex items-center justify-start mb-6">
          <div className="text-textColor/60 text-sm">
            {artworks.length} {artworks.length > 1 ? t('artistPage.artwork_plural') : t('artistPage.artwork_singular')}
          </div>
        </div>
      )}

      {/* Grid des artworks - Grille CSS 3x3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentArtworks.map((item, index) => (
          <ArtworkCard key={`${item.name}-${index}`} {...item} artistName={artistName} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setParams({ page: page - 1 })}
            className="px-4 py-2 rounded-md bg-backgroundColor/10 text-textColor disabled:opacity-40 hover:bg-backgroundColor/20 transition-colors disabled:cursor-not-allowed"
          >
            {t('artists.previous') || 'Précédent'}
          </button>
          <div className="text-textColor/80 px-4">
            Page {page} / {totalPages}
          </div>
          <button
            disabled={page === totalPages}
            onClick={() => setParams({ page: page + 1 })}
            className="px-4 py-2 rounded-md bg-backgroundColor/10 text-textColor disabled:opacity-40 hover:bg-backgroundColor/20 transition-colors disabled:cursor-not-allowed"
          >
            {t('artists.next') || 'Suivant'}
          </button>
        </div>
      )}
    </div>
  );
} 