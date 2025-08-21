'use client'
import { useEffect, useMemo } from 'react'
import Intro from "@/components/presale/Intro";
import ArtworkCard from "@/components/common/cards/ArtworkCardOrder";
import { usePresaleArtworkStore } from '@/store/usePresaleArtworkStore'
import { useLanguageStore } from '@/store/languageStore';
import { useQueryStates, parseAsInteger } from 'nuqs'

const PAGE_SIZE = 6 // 3 colonnes x 2 lignes

export default function Presale() {
  const { t } = useLanguageStore();
  const { 
    artworks,
    fetchPresaleArtworks, 
    isLoading, 
    hasError 
  } = usePresaleArtworkStore()

  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1)
  })

  useEffect(() => {
    fetchPresaleArtworks()
  }, [fetchPresaleArtworks])

  // Calculs de pagination avec useMemo pour optimiser les performances
  const { paginatedArtworks, totalPages, page, startIndex, endIndex } = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(artworks.length / PAGE_SIZE))
    const page = Math.min(params.page, totalPages)
    const start = (page - 1) * PAGE_SIZE
    const paginatedArtworks = artworks.slice(start, start + PAGE_SIZE)
    const startIndex = start
    const endIndex = Math.min(start + PAGE_SIZE, artworks.length)
    
    return { paginatedArtworks, totalPages, page, startIndex, endIndex }
  }, [artworks, params.page])

  const artworkImages = paginatedArtworks.map(artwork => ({
    image: { src: artwork.url },
    name: artwork.name,
    price: artwork.price,
    order: artwork.order,
    artistName: artwork.artistName
  }))

  if (isLoading) {
    return (
      <>
        <Intro />
        <div className="relative max-w-90 xl:max-w-screen-xl m-auto mt-10 text-center">
          {t('team.loading')}
        </div>
      </>
    )
  }

  if (hasError) {
    return (
      <>
        <Intro />
        <div className="relative max-w-90 xl:max-w-screen-xl m-auto mt-10 text-center">
          {t('team.error')}
        </div>
      </>
    )
  }
  

  return (
    <>
      <Intro />
      <div className="relative max-w-90 xl:max-w-screen-xl m-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mt-10">{t('presale.onDemand')}</h1>
          
          {/* Informations sur la pagination */}
          {artworks.length > 0 && (
            <div className="text-sm text-gray-600 mt-10">
              {t('pagination.showing')
                .replace('{{start}}', (startIndex + 1).toString())
                .replace('{{end}}', endIndex.toString())
                .replace('{{total}}', artworks.length.toString())
              }
            </div>
          )}
        </div>
        
        {/* Grille des artworks - 3 colonnes sur desktop, responsive sur mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworkImages.map((item, index) => (
            <ArtworkCard key={`${item.name}-${startIndex + index}`} {...item} />
          ))}
        </div>

        {/* Pagination simple comme ArtistsGrid */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setParams({ page: page - 1 })}
              className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-40 hover:bg-white/20 transition-colors"
            >
              {t('pagination.previous')}
            </button>
            <div className="text-white/80 px-4">
              {t('pagination.page')} {page} / {totalPages}
            </div>
            <button
              disabled={page === totalPages}
              onClick={() => setParams({ page: page + 1 })}
              className="px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-40 hover:bg-white/20 transition-colors"
            >
              {t('pagination.next')}
            </button>
          </div>
        )}
        
        {/* <BuyProcess /> */}
      </div>


    </>
  );
}
