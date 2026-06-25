'use client'

import { ArtistStudio } from '@/types/artistsStudio'
import Image from 'next/image'

type Props = {
  artist: ArtistStudio | null
  onClose: () => void
}

export default function ArtistsStudioDetail({ artist, onClose }: Props) {
  if (!artist) {
    return (
      <div className="bg-cardBackground border border-dashed border-borderColor rounded-2xl p-8 text-center flex flex-col items-center justify-center h-[520px]">
        <div className="w-14 h-14 rounded-full bg-gold-accent/10 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-gold-accent animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
        <h3 className="font-unbounded text-base font-bold mb-2 text-textColor">Fiche de l&apos;atelier</h3>
        <p className="text-sm text-grayText max-w-xs leading-relaxed">
          Cliquez sur un marqueur ou sur un atelier pour afficher sa fiche complète.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-cardBackground border border-borderColor rounded-2xl overflow-hidden shadow-xl">
      {/* Header image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={artist.photo}
          alt={artist.name}
          fill
          className="object-cover"
          unoptimized
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-black/50 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
          aria-label="Fermer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span
          className="absolute bottom-3 left-3 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md"
          style={{ backgroundColor: artist.color }}
        >
          {artist.medium}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div>
          <span className="text-xs font-unbounded font-bold text-gold-accent uppercase tracking-wider">{artist.city}</span>
          <h3 className="font-unbounded text-xl font-bold mt-1 text-textColor">{artist.name}</h3>
        </div>

        <p className="text-sm italic text-grayText border-l-2 border-gold-accent pl-3 leading-relaxed">
          &ldquo;{artist.tagline}&rdquo;
        </p>

        <div>
          <h4 className="text-xs font-unbounded text-grayText uppercase tracking-widest mb-1">Démarche</h4>
          <p className="text-sm text-textColor leading-relaxed font-bricolage">{artist.bio}</p>
        </div>

        {/* Gallery */}
        {artist.gallery.length > 0 && (
          <div>
            <h4 className="text-xs font-unbounded text-grayText uppercase tracking-widest mb-2">Portfolio</h4>
            <div className="grid grid-cols-3 gap-2">
              {artist.gallery.map((img, i) => (
                <div key={i} className="relative h-16 rounded-lg overflow-hidden bg-gray-800">
                  <Image src={img} alt={`Œuvre ${i + 1}`} fill className="object-cover hover:scale-110 transition-transform" unoptimized />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="pt-4 border-t border-borderColor space-y-2">
          <div className="flex items-center gap-3 text-sm text-grayText">
            <svg className="w-4 h-4 text-gold-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{artist.hours}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-grayText">
            <svg className="w-4 h-4 text-gold-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <span>Atelier : {artist.openPublic ? 'Entrée libre' : 'Sur rendez-vous'}</span>
          </div>
        </div>

        {/* CTA */}
        <a
          href="/joinInRealArt"
          className="block w-full text-center bg-gold-accent hover:opacity-90 text-white font-unbounded font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all"
        >
          Rejoindre le réseau
        </a>
      </div>
    </div>
  )
}
