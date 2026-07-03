'use client'

import { useEffect, useState } from 'react'
import { ArtistStudio } from '@/types/artistsStudio'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
  artist: ArtistStudio | null
  onClose: () => void
}

const BIO_TRUNCATE_LENGTH = 220

export default function ArtistsStudioDetail({ artist, onClose }: Props) {
  const { t } = useTranslation()
  const [bioExpanded, setBioExpanded] = useState(false)

  useEffect(() => {
    setBioExpanded(false)
  }, [artist?.id])

  if (!artist) {
    return (
      <div className="bg-cardBackground border border-dashed border-borderColor p-8 text-center flex flex-col items-center justify-center h-[520px]">
        <h3 className="serif text-xl font-light mb-2 text-textColor">{t('artistsStudio.detail.emptyTitle')}</h3>
        <p className="text-[11px] uppercase tracking-[0.25em] montserrat text-grayText max-w-xs leading-relaxed mt-2">
          {t('artistsStudio.detail.emptyHint')}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-cardBackground">
      {/* Portrait */}
      <div className="relative aspect-[3/4] overflow-hidden bg-backgroundGrey">
        <Image
          src={artist.photo}
          alt={artist.name}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-black/50 hover:bg-black/80 text-white w-8 h-8 flex items-center justify-center backdrop-blur-sm transition-all"
          aria-label="Fermer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
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
      <div className="flex flex-col pt-5 pb-6 px-5 border border-t-0 border-borderColor space-y-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-grayText montserrat mb-1">
            {artist.city}
          </p>
          <h3 className="serif text-2xl font-light text-textColor leading-tight">
            {artist.name}
          </h3>
        </div>

        {artist.tagline && (
          <p className="text-xs text-grayText italic leading-relaxed border-l border-gold-accent pl-3">
            &ldquo;{artist.tagline}&rdquo;
          </p>
        )}

        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-grayText montserrat mb-2">
            {t('artistsStudio.detail.approach')}
          </p>
          <p className="text-sm text-textColor leading-relaxed">
            {bioExpanded || artist.bio.length <= BIO_TRUNCATE_LENGTH
              ? artist.bio
              : `${artist.bio.slice(0, BIO_TRUNCATE_LENGTH).trimEnd()}…`}
          </p>
          {artist.bio.length > BIO_TRUNCATE_LENGTH && (
            <button
              onClick={() => setBioExpanded((v) => !v)}
              className="mt-2 text-[11px] uppercase tracking-[0.25em] montserrat text-gold-accent hover:text-textColor transition-colors underline underline-offset-4"
            >
              {bioExpanded ? t('artistsStudio.detail.readLess') : t('artistsStudio.detail.readMore')}
            </button>
          )}
        </div>

        {artist.gallery.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-grayText montserrat mb-2">
              {t('artistsStudio.detail.portfolio')}
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {artist.gallery.map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden bg-backgroundGrey">
                  <Image
                    src={img}
                    alt={`${t('artistsStudio.detail.artwork')} ${i + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-borderColor space-y-2">
          <div className="flex items-center gap-3 text-[11px] montserrat text-grayText uppercase tracking-wider">
            <svg className="w-3.5 h-3.5 text-gold-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{artist.hours || t('artistsStudio.detail.byAppointment')}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] montserrat text-grayText uppercase tracking-wider">
            <svg className="w-3.5 h-3.5 text-gold-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <span>
              {t('artistsStudio.detail.access')}
              {artist.openPublic ? t('artistsStudio.detail.openPublic') : t('artistsStudio.detail.byAppointment')}
            </span>
          </div>
        </div>

        <a
          href="https://artitude.inrealart.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] montserrat border border-gold-accent text-textColor px-4 py-2.5 hover:bg-gold-accent hover:text-white transition-all duration-300 self-start"
        >
          {t('artistsStudio.detail.joinCta')}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        {artist.googleBusinessProfileUrl && (
          <a
            href={artist.googleBusinessProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] montserrat border border-borderColor text-textColor px-4 py-2.5 hover:border-gold-accent transition-all duration-300 self-start"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.47a5.54 5.54 0 01-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A11.99 11.99 0 0012 24z" />
              <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 010-4.54V6.62H1.27a12 12 0 000 10.76l4-3.11z" />
              <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.62l4 3.11C6.22 6.88 8.87 4.77 12 4.77z" />
            </svg>
            {t('artistsStudio.detail.googleCta')}
          </a>
        )}
      </div>
    </div>
  )
}
