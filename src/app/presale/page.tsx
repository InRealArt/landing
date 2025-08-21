'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Intro from "@/components/presale/Intro";
import ArtworkCard from "@/components/common/cards/ArtworkCardOrder";
import { usePresaleArtworkStore } from '@/store/usePresaleArtworkStore'
import { useLanguageStore } from '@/store/languageStore';
import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs'

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
    page: parseAsInteger.withDefault(1),
    artist: parseAsString.withDefault(''),
    q: parseAsString.withDefault('')
  })

  // État pour le dropdown
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchPresaleArtworks()
  }, [fetchPresaleArtworks])

  // Gestion du clic extérieur pour fermer le dropdown
  useEffect(() => {
    function onClickOutside (e: MouseEvent) {
      if (!dropdownRef.current) return
      if (!dropdownRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    function onKey (e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('click', onClickOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClickOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  // Logique de filtrage
  const filtered = useMemo(() => {
    // Filtre par artiste
    const byArtist = params.artist
      ? artworks.filter(artwork => artwork.artistName.toLowerCase().includes(params.artist.toLowerCase()))
      : artworks

    // Filtre par recherche (nom d'artiste ou nom d'œuvre)
    const query = params.q.trim().toLowerCase()
    const bySearch = query
      ? byArtist.filter(artwork => 
          artwork.name.toLowerCase().includes(query) ||
          artwork.artistName.toLowerCase().includes(query)
        )
      : byArtist

    return bySearch
  }, [artworks, params.artist, params.q])

  // Liste unique des artistes pour le dropdown
  const artists = useMemo(() => {
    const uniqueArtists = Array.from(new Set(artworks.map(artwork => artwork.artistName)))
    return uniqueArtists.sort()
  }, [artworks])

  // Calculs de pagination avec filtrage
  const { paginatedArtworks, totalPages, page, startIndex, endIndex } = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const page = Math.min(params.page, totalPages)
    const start = (page - 1) * PAGE_SIZE
    const paginatedArtworks = filtered.slice(start, start + PAGE_SIZE)
    const startIndex = start
    const endIndex = Math.min(start + PAGE_SIZE, filtered.length)
    
    return { paginatedArtworks, totalPages, page, startIndex, endIndex }
  }, [filtered, params.page])

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
        <h1 className="text-2xl md:text-4xl font-bold mt-10 mb-6">{t('presale.onDemand')}</h1>
        
        {/* Filtres */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Filtre par artiste */}
            <div ref={dropdownRef} className="relative inline-block">
              <button
                type="button"
                onClick={() => setIsOpen(o => !o)}
                className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2 shadow-sm hover:shadow transition bricolage-grotesque"
              >
                <span>{params.artist || t('presale.filters.allArtists')}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute z-20 mt-2 w-56 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-black/5">
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg ${params.artist === '' ? 'bg-black/5' : 'hover:bg-black/5'} text-black bricolage-grotesque`}
                    onClick={() => { setParams({ artist: '', page: 1 }); setIsOpen(false) }}
                  >{t('presale.filters.allArtists')}</button>
                  <div className="max-h-64 overflow-y-auto">
                    {artists.map(artist => (
                      <button
                        key={artist}
                        className={`w-full text-left px-3 py-2 rounded-lg text-black bricolage-grotesque ${params.artist === artist ? 'bg-black/5' : 'hover:bg-black/5'}`}
                        onClick={() => { setParams({ artist, page: 1 }); setIsOpen(false) }}
                      >{artist}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="text-white/40 select-none">|</span>

            {/* Barre de recherche */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-1.5 shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <input
                value={params.q}
                onChange={e => setParams({ q: e.target.value, page: 1 })}
                placeholder={t('presale.filters.searchPlaceholder')}
                className="bg-transparent outline-none text-sm min-w-[220px] placeholder-black/40 bricolage-grotesque"
              />
            </div>
          </div>
          
          {/* Nombre de résultats */}
          <div className="text-white/60 text-sm bricolage-grotesque">
            {filtered.length} {filtered.length > 1 ? t('presale.filters.artworksFound') : t('presale.filters.artworkFound')}
          </div>
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
