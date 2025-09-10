'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import PresaleHero from "@/components/presale/PresaleHero";
import ArtworkCard from "@/components/common/cards/ArtworkCardOrder";
import { usePresaleArtworkStore } from '@/store/usePresaleArtworkStore'
import { useLanguageStore } from '@/store/languageStore';
import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs'
import BlockFaq from '@/components/common/BlockFaq';
import Button from "@/components/common/Button";
import { ArrowRight } from "lucide-react";
import FAQ from '@/components/common/FAQ/FAQ';

const PAGE_SIZE = 16 // 4 colonnes x 4 lignes

export default function Presale() {
  const { t, language } = useLanguageStore();
  const { 
    artworks,
    fetchPresaleArtworks, 
    isLoading, 
    hasError 
  } = usePresaleArtworkStore()

  // URLs pour les catalogues hébergés en ligne
  const catalogUrls = {
    en: 'https://drive.google.com/file/d/1P_3Q_nTExvorTrAQhoLTv_kGs8FDCWNu/view?usp=sharing',
    fr: 'https://drive.google.com/file/d/1Z56Fvbi2HD5raHO8fDh3Fx6UhMzL6ot-/view?usp=sharing'
  };

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
        <PresaleHero />
        <div className="relative max-w-90 xl:max-w-screen-xl m-auto mt-10 text-center">
          {t('team.loading')}
        </div>
      </>
    )
  }

  if (hasError) {
    return (
      <>
        <PresaleHero />
        <div className="relative max-w-90 xl:max-w-screen-xl m-auto mt-10 text-center">
          {t('team.error')}
        </div>
      </>
    )
  }
  

  return (
    <>
      <PresaleHero />
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
                className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-5 py-2 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 bricolage-grotesque font-medium"
              >
                <span>{params.artist || t('presale.filters.allArtists')}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute z-20 mt-2 w-56 rounded-2xl bg-white dark:bg-gray-800 p-2 shadow-xl ring-1 ring-gray-200 dark:ring-gray-600 border border-gray-200 dark:border-gray-600">
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 bricolage-grotesque font-medium ${
                      params.artist === '' 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => { setParams({ artist: '', page: 1 }); setIsOpen(false) }}
                  >{t('presale.filters.allArtists')}</button>
                  <div className="max-h-64 overflow-y-auto">
                    {artists.map(artist => (
                      <button
                        key={artist}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 bricolage-grotesque font-medium ${
                          params.artist === artist 
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => { setParams({ artist, page: 1 }); setIsOpen(false) }}
                      >{artist}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="text-gray-400 dark:text-gray-500 select-none">|</span>

            {/* Barre de recherche */}
            <div className="inline-flex items-center gap-3 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 shadow-md border border-gray-200 dark:border-gray-600 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all duration-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 dark:text-gray-400">
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <input
                value={params.q}
                onChange={e => setParams({ q: e.target.value, page: 1 })}
                placeholder={t('presale.filters.searchPlaceholder')}
                className="bg-transparent outline-none text-sm min-w-[280px] placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bricolage-grotesque font-medium"
              />
            </div>
          </div>
          
          {/* Nombre de résultats */}
          <div className="text-gray-600 dark:text-gray-400 text-sm bricolage-grotesque font-medium">
            {filtered.length} {filtered.length > 1 ? t('presale.filters.artworksFound') : t('presale.filters.artworkFound')}
          </div>
        </div>
        
        {/* Grille des artworks - 4 colonnes sur desktop, responsive sur mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              className="px-4 py-2 rounded-lg bg-backgroundColor/10 text-textColor disabled:opacity-40 hover:bg-backgroundColor/20 transition-colors"
            >
              {t('pagination.previous')}
            </button>
            <div className="text-textColor/80 px-4">
              {t('pagination.page')} {page} / {totalPages}
            </div>
            <button
              disabled={page === totalPages}
              onClick={() => setParams({ page: page + 1 })}
              className="px-4 py-2 rounded-lg bg-backgroundColor/10 text-textColor disabled:opacity-40 hover:bg-backgroundColor/20 transition-colors"
            >
              {t('pagination.next')}
            </button>
          </div>
        )}

        {/* Bouton du catalogue après la pagination */}
        <div className="flex justify-center mt-12">
          <Button 
            link={language === 'en' ? catalogUrls.en : catalogUrls.fr} 
            text={t('presale.intro.buttons.catalog')} 
            additionalClassName="bg-purpleColor" 
            icon={<ArrowRight />} 
            target='_blank' 
          />
        </div>
        
        {/* <BuyProcess /> */}
      </div>

      {/* <BlockFaq title={t('presale.faq.title')} description={t('presale.faq.description')} /> */}
      <FAQ titre={t('presale.faq.title')} description={t('presale.faq.description')} />
    </>
  );
}
