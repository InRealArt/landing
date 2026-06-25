'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { ArtistStudio, ArtistMedium } from '@/types/artistsStudio'
import ArtistsStudioDetail from './ArtistsStudioDetail'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
  artists: ArtistStudio[]
  selectedArtistId: number | null
  onSelectArtist: (id: number) => void
}

const MEDIUMS: ArtistMedium[] = ['peinture', 'sculpture', 'photographie', 'dessin', 'autre']

export default function ArtistsStudioGrid({ artists, selectedArtistId, onSelectArtist }: Props) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [locationSearch, setLocationSearch] = useState('')
  const [selectedMediums, setSelectedMediums] = useState<ArtistMedium[]>([])
  const [openOnly, setOpenOnly] = useState(false)
  const [showMediumDropdown, setShowMediumDropdown] = useState(false)

  const selectedArtist = artists.find((a) => a.id === selectedArtistId) ?? null

  const filtered = useMemo(() => {
    return artists.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.mediumLabel.toLowerCase().includes(search.toLowerCase()) ||
        a.bio.toLowerCase().includes(search.toLowerCase())
      const matchLoc =
        a.city.toLowerCase().includes(locationSearch.toLowerCase()) ||
        a.region.toLowerCase().includes(locationSearch.toLowerCase())
      const matchMedium = selectedMediums.length === 0 || selectedMediums.includes(a.medium)
      const matchOpen = !openOnly || a.openPublic
      return matchSearch && matchLoc && matchMedium && matchOpen
    })
  }, [artists, search, locationSearch, selectedMediums, openOnly])

  function toggleMedium(m: ArtistMedium) {
    setSelectedMediums((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    )
  }

  function resetFilters() {
    setSearch('')
    setLocationSearch('')
    setSelectedMediums([])
    setOpenOnly(false)
  }

  const studioCountKey = filtered.length === 1 ? 'artistsStudio.grid.studioCount_one' : 'artistsStudio.grid.studioCount_other'
  const studioCountLabel = t(studioCountKey).replace('{{count}}', String(filtered.length))

  return (
    <section className="max-w-7xl mx-auto py-10 px-4 sm:px-8">
      {/* Sticky filter bar */}
      <div className="sticky top-[73px] z-40 bg-cardBackground/95 backdrop-blur-md border-b border-borderColor py-4 mb-8 -mx-4 sm:-mx-8 px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search inputs */}
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <div className="flex-1 flex items-center bg-cardBackground border border-borderColor rounded-xl px-4 py-2.5 gap-2">
              <svg className="w-4 h-4 text-grayText shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('artistsStudio.grid.searchPlaceholder')}
                className="w-full bg-transparent focus:outline-none text-sm text-textColor placeholder-grayText montserrat"
              />
            </div>
            <div className="flex-1 flex items-center bg-cardBackground border border-borderColor rounded-xl px-4 py-2.5 gap-2">
              <svg className="w-4 h-4 text-grayText shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder={t('artistsStudio.grid.locationPlaceholder')}
                className="w-full bg-transparent focus:outline-none text-sm text-textColor placeholder-grayText montserrat"
              />
            </div>
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Medium dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMediumDropdown((v) => !v)}
                className="bg-cardBackground border border-borderColor px-4 py-2.5 text-sm montserrat flex items-center gap-2 hover:border-gold-accent transition-colors text-textColor"
              >
                {t('artistsStudio.grid.filterMediums')}
                <svg className="w-3 h-3 text-grayText" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showMediumDropdown && (
                <div className="absolute left-0 mt-2 w-52 bg-cardBackground shadow-xl border border-borderColor p-3 z-50 space-y-2">
                  {MEDIUMS.map((val) => (
                    <label key={val} className="flex items-center gap-2 text-sm cursor-pointer hover:text-gold-accent text-textColor montserrat">
                      <input
                        type="checkbox"
                        checked={selectedMediums.includes(val)}
                        onChange={() => toggleMedium(val)}
                      />
                      {t(`artistsStudio.map.mediums.${val}`)}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Open only */}
            <label className="flex items-center gap-2 bg-cardBackground border border-borderColor px-4 py-2.5 text-sm cursor-pointer hover:border-gold-accent transition-colors text-textColor montserrat">
              <input
                type="checkbox"
                checked={openOnly}
                onChange={(e) => setOpenOnly(e.target.checked)}
              />
              {t('artistsStudio.grid.filterOpen')}
            </label>

            {/* Count + reset */}
            <span className="text-[11px] text-grayText montserrat">{studioCountLabel}</span>
            <button
              onClick={resetFilters}
              className="text-[11px] uppercase tracking-[0.2em] montserrat text-grayText hover:text-textColor transition-colors"
            >
              {t('artistsStudio.grid.reset')}
            </button>
          </div>
        </div>
      </div>

      {/* Grid + Detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grid */}
        <div className="lg:col-span-2">
          <h2 className="font-cormorant text-3xl font-light text-textColor mb-6">{t('artistsStudio.grid.title')}</h2>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h3 className="font-cormorant text-2xl font-light mb-2 text-textColor">{t('artistsStudio.grid.emptyTitle')}</h3>
              <p className="text-sm text-grayText montserrat max-w-sm">{t('artistsStudio.grid.emptyHint')}</p>
              <button
                onClick={resetFilters}
                className="mt-6 text-[11px] uppercase tracking-[0.35em] montserrat border border-gold-accent text-textColor px-6 py-2.5 hover:bg-gold-accent hover:text-white transition-all duration-300"
              >
                {t('artistsStudio.grid.resetFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((artist) => {
                const isSelected = selectedArtistId === artist.id
                return (
                  <div
                    key={artist.id}
                    onClick={() => onSelectArtist(artist.id)}
                    className={`group relative flex flex-col cursor-pointer bg-cardBackground transition-all duration-300 ${
                      isSelected ? 'outline outline-1 outline-gold-accent' : ''
                    }`}
                  >
                    {/* Portrait */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-backgroundGrey">
                      <Image
                        src={artist.photo}
                        alt={artist.name}
                        fill
                        className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 ${isSelected ? '' : 'grayscale group-hover:grayscale-0'}`}
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                        <span
                          className="text-[9px] uppercase tracking-[0.3em] text-white/90 montserrat bg-black/40 backdrop-blur-sm px-2 py-1"
                          style={{ backgroundColor: artist.color + '99' }}
                        >
                          {artist.mediumLabel}
                        </span>
                        {artist.openPublic && (
                          <span className="text-[9px] uppercase tracking-[0.3em] text-white/90 montserrat bg-black/40 backdrop-blur-sm px-2 py-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                            {t('artistsStudio.detail.openPublic')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="flex flex-col flex-1 pt-5 pb-6 px-5 border border-t-0 border-borderColor">
                      <p className="text-[10px] uppercase tracking-[0.35em] text-grayText montserrat mb-1">
                        {artist.city} — {artist.region}
                      </p>
                      <h3 className="serif text-xl font-light text-textColor leading-tight mb-3 group-hover:text-gold-accent transition-colors duration-300">
                        {artist.name}
                      </h3>
                      <p className="text-xs text-grayText italic leading-relaxed line-clamp-2 mb-4">
                        &ldquo;{artist.tagline}&rdquo;
                      </p>
                      <button className="mt-auto inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] montserrat border border-gold-accent text-textColor px-4 py-2.5 hover:bg-gold-accent hover:text-white transition-all duration-300 self-start">
                        {t('artistsStudio.grid.discoverCta')}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        <aside className="lg:col-span-1">
          <div className="sticky top-[160px] z-30">
            <ArtistsStudioDetail
              artist={selectedArtist}
              onClose={() => onSelectArtist(-1)}
            />
          </div>
        </aside>
      </div>
    </section>
  )
}
