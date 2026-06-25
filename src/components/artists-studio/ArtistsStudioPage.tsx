'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { artistsStudioData } from '@/data/artistsStudioData'
import ArtistsStudioGrid from './ArtistsStudioGrid'

// Leaflet must be loaded client-side only
const ArtistsStudioMap = dynamic(() => import('./ArtistsStudioMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-cardBackground animate-pulse flex items-center justify-center">
      <span className="text-grayText text-sm font-bricolage">Chargement de la carte…</span>
    </div>
  ),
})

const MEDIUMS = [
  { color: '#E11D48', label: 'Peinture' },
  { color: '#0D9488', label: 'Sculpture' },
  { color: '#D97706', label: 'Photographie' },
  { color: '#4F46E5', label: 'Dessin / Papier' },
  { color: '#7C3AED', label: 'Autres médiums' },
]

export default function ArtistsStudioPage() {
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null)

  function handleSelectArtist(id: number) {
    setSelectedArtistId(id === -1 ? null : id)
  }

  return (
    <div className="min-h-screen bg-backgroundColor text-textColor">
      {/* BLOC 1 — Hero Header */}
      <header className="relative overflow-hidden border-b border-borderColor py-12 lg:py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <span className="text-xs font-unbounded font-semibold tracking-widest text-gold-accent uppercase mb-3">
            Réseau d&apos;Art Vivant Contemporain
          </span>
          <h1 className="font-cormorant text-4xl sm:text-6xl lg:text-7xl font-light max-w-4xl leading-tight mb-4 text-textColor mt-8">
            L&apos;Index des Ateliers
            <span className="italic text-grayText block">
              Trouvez un artiste près de chez vous
            </span>
          </h1>
          <p className="text-sm sm:text-lg max-w-2xl text-grayText font-light leading-relaxed mb-8">
            Explorez la géographie de la création. Rencontrez nos artistes résidents, poussez les portes de leurs ateliers et découvrez l&apos;art au plus près de son lieu de naissance.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-2 text-xs tracking-wider uppercase font-unbounded font-medium text-grayText">
            <div>
              <span className="text-gold-accent font-bold text-lg mr-1">{artistsStudioData.length}</span>
              Ateliers Référencés
            </div>
            <div>
              <span className="text-gold-accent font-bold text-lg mr-1">100%</span>
              Artistes Certifiés
            </div>
            <div>
              <span className="text-gold-accent font-bold text-lg mr-1">5</span>
              Disciplines Majeures
            </div>
          </div>
        </div>

        {/* Background blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-12 -left-12 w-96 h-96 rounded-full bg-gold-accent blur-3xl" />
          <div className="absolute top-1/2 -right-12 w-80 h-80 rounded-full bg-purple-600 blur-3xl" />
        </div>
      </header>

      {/* BLOC 2 — Interactive Map */}
      <section className="relative h-[420px] sm:h-[520px] w-full border-b border-borderColor bg-cardBackground">
        <ArtistsStudioMap
          artists={artistsStudioData}
          selectedArtistId={selectedArtistId}
          onSelectArtist={handleSelectArtist}
        />

        {/* Map legend */}
        <div className="absolute bottom-5 left-5 z-[20] bg-cardBackground/95 backdrop-blur shadow-lg border border-borderColor rounded-xl p-4 max-w-[200px] text-xs">
          <h4 className="font-unbounded font-bold tracking-wider uppercase mb-3 text-grayText text-[10px]">
            Médiums Artistiques
          </h4>
          <div className="space-y-1.5">
            {MEDIUMS.map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-textColor">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOC 3+4+5 — Filters, Grid, Detail */}
      <ArtistsStudioGrid
        artists={artistsStudioData}
        selectedArtistId={selectedArtistId}
        onSelectArtist={handleSelectArtist}
      />

      {/* BLOC 6 — CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
        <div className="relative bg-cardBackground border border-gold-accent/30 rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="relative z-10 max-w-2xl text-center lg:text-left">
            <span className="text-xs font-unbounded font-bold tracking-widest text-gold-accent uppercase mb-3 block">
              Rejoignez le collectif
            </span>
            <h2 className="font-cormorant text-3xl sm:text-5xl font-light leading-tight mb-4 text-textColor">
              Vous êtes artiste et vous n&apos;êtes pas encore dans l&apos;Index ?
            </h2>
            <p className="text-sm sm:text-base text-grayText font-bricolage font-light leading-relaxed">
              Bénéficiez d&apos;une visibilité directe auprès de milliers de collectionneurs et passionnés d&apos;art contemporain.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <a
              href="/joinInRealArt"
              className="w-full sm:w-auto bg-gold-accent hover:opacity-90 text-white px-8 py-4 rounded-xl font-unbounded font-semibold uppercase tracking-wider text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              S&apos;inscrire gratuitement
            </a>
            <a
              href="/artists"
              className="w-full sm:w-auto border border-borderColor hover:border-gold-accent text-center px-8 py-4 rounded-xl font-unbounded font-semibold uppercase tracking-wider text-xs transition-colors text-textColor block"
            >
              Voir tous les artistes
            </a>
          </div>

          {/* Background blobs */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-gold-accent blur-3xl" />
            <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-rose-600 blur-3xl" />
          </div>
        </div>
      </section>

    </div>
  )
}
