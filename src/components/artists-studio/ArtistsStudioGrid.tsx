// src/components/artists-studio/ArtistsStudioGrid.tsx
'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { ArtistStudio, ArtistMedium } from '@/types/artistsStudio'
import ArtistsStudioDetail from './ArtistsStudioDetail'

type Props = {
  artists: ArtistStudio[]
  selectedArtistId: number | null
  onSelectArtist: (id: number) => void
}

const MEDIUM_LABELS: Record<ArtistMedium, string> = {
  peinture: 'Peinture',
  sculpture: 'Sculpture',
  photographie: 'Photographie',
  dessin: 'Dessin / Papier',
  autre: 'Autres médiums',
}

export default function ArtistsStudioGrid({ artists, selectedArtistId, onSelectArtist }: Props) {
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

  return (
    <section className="max-w-7xl mx-auto py-10 px-4 sm:px-8">
      {/* Sticky filter bar */}
      <div className="sticky top-[73px] z-40 bg-cardBackground/95 backdrop-blur-md border-b border-borderColor py-4 px-0 mb-8 -mx-4 sm:-mx-8 px-4 sm:px-8">
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
                placeholder="Nom, spécialité, mots-clés..."
                className="w-full bg-transparent focus:outline-none text-sm text-textColor placeholder-grayText"
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
                placeholder="Ville, région..."
                className="w-full bg-transparent focus:outline-none text-sm text-textColor placeholder-grayText"
              />
            </div>
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Medium dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMediumDropdown((v) => !v)}
                className="bg-cardBackground border border-borderColor px-4 py-2.5 rounded-xl text-sm font-bricolage flex items-center gap-2 hover:border-gold-accent transition-colors text-textColor"
              >
                Médiums
                <svg className="w-3 h-3 text-grayText" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showMediumDropdown && (
                <div className="absolute left-0 mt-2 w-52 bg-cardBackground rounded-xl shadow-xl border border-borderColor p-3 z-50 space-y-2">
                  {(Object.entries(MEDIUM_LABELS) as [ArtistMedium, string][]).map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 text-sm cursor-pointer hover:text-gold-accent text-textColor">
                      <input
                        type="checkbox"
                        checked={selectedMediums.includes(val)}
                        onChange={() => toggleMedium(val)}
                        className="rounded"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Open only */}
            <label className="flex items-center gap-2 bg-cardBackground border border-borderColor px-4 py-2.5 rounded-xl text-sm cursor-pointer hover:border-gold-accent transition-colors text-textColor">
              <input
                type="checkbox"
                checked={openOnly}
                onChange={(e) => setOpenOnly(e.target.checked)}
                className="rounded"
              />
              Atelier ouvert
            </label>

            {/* Count + reset */}
            <span className="text-xs text-grayText font-medium">{filtered.length} atelier{filtered.length > 1 ? 's' : ''}</span>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-500 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Grid + Detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grid */}
        <div className="lg:col-span-2">
          <h2 className="font-cormorant text-3xl font-light text-textColor mb-6">Les Ateliers</h2>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-5xl mb-4">🎨</span>
              <h3 className="font-cormorant text-2xl font-light mb-2 text-textColor">Aucun atelier trouvé</h3>
              <p className="text-sm text-grayText max-w-sm">Essayez d&apos;élargir vos filtres.</p>
              <button
                onClick={resetFilters}
                className="mt-6 bg-gold-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              >
                Réinitialiser les filtres
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
                    className={`group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'ring-2 ring-gold-accent bg-gold-accent/5 border-gold-accent shadow-md border'
                        : 'bg-cardBackground border border-borderColor hover:shadow-xl hover:border-gold-accent/40'
                    }`}
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-800">
                      <Image
                        src={artist.photo}
                        alt={artist.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <span
                        className="absolute top-3 right-3 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full text-white"
                        style={{ backgroundColor: artist.color }}
                      >
                        {artist.medium}
                      </span>
                      {artist.openPublic && (
                        <span className="absolute bottom-3 left-3 bg-black/80 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                          Ouvert au public
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-xs text-grayText uppercase tracking-widest font-semibold">{artist.city}</span>
                      <h3 className="font-cormorant text-xl font-light mt-1 group-hover:text-gold-accent transition-colors text-textColor">
                        {artist.name}
                      </h3>
                      <p className="text-xs text-grayText mt-2 line-clamp-2 italic leading-relaxed">&ldquo;{artist.tagline}&rdquo;</p>
                      <div className="mt-4 pt-4 border-t border-borderColor flex items-center justify-between text-xs font-semibold text-gold-accent">
                        <span>Découvrir l&apos;atelier</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
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
