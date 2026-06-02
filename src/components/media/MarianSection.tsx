'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'

export default function MarianSection() {
  const { t } = useTranslation()

  const SERVICES = [
    t('media.marian.services.interviews'),
    t('media.marian.services.aftermovies'),
  ]

  const descriptionParts = t('media.marian.description').split('{marian}')

  return (
    <section
      className="mb-16 md:mb-24 lg:mb-32 py-10 sm:py-14 lg:py-16 px-4 sm:px-8 lg:px-12 border"
      style={{
        background: 'var(--canvas-bg)',
        borderColor: 'var(--border-light)',
      }}
    >
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left column — text */}
        <div>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 sm:mb-6 block montserrat"
            style={{ color: 'var(--gold-accent)' }}
          >
            {t('media.marian.eyebrow')}
          </span>

          <h2
            className="serif text-[clamp(1.75rem,4vw,2.5rem)] mb-4 sm:mb-6"
            style={{ color: 'var(--text)' }}
          >
            {t('media.marian.title')}
          </h2>

          <p
            className="text-sm mb-6 sm:mb-8 leading-relaxed montserrat"
            style={{ color: 'var(--gray-text)' }}
          >
            {descriptionParts[0]}
            <strong style={{ color: 'var(--text)' }}>Marian</strong>
            {descriptionParts[1]}
          </p>

          <ul className="text-[11px] uppercase tracking-widest space-y-4 mb-8 sm:mb-10 montserrat">
            {SERVICES.map((service) => (
              <li
                key={service}
                className="flex items-center gap-3"
                style={{ color: 'var(--text)' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: 'var(--gold-accent)' }}
                />
                {service}
              </li>
            ))}
          </ul>

          <Link
            href="/media/production"
            className="btn-action inline-flex items-center min-h-[44px]"
          >
            {t('media.marian.cta')}
          </Link>
        </div>

        {/* Right column — image */}
        <div className="hidden lg:block">
          <div
            className="aspect-[4/5] overflow-hidden shadow-xl relative"
            style={{ border: '8px solid var(--canvas-bg)' }}
          >
            <Image
              src="/images/media/Marian.webp"
              alt={t('media.marian.imageAlt')}
              fill
              className="object-cover object-top grayscale"
              sizes="(max-width: 1024px) 0px, 50vw"
            />
          </div>
        </div>
      </div>

      {/* Separator */}
      <div
        className="mt-10 sm:mt-14 lg:mt-16 mb-10 sm:mb-12"
        style={{ borderTop: '1px solid var(--border-light)' }}
        role="separator"
        aria-hidden="true"
      />

      {/* YouTube videos grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {YOUTUBE_IDS.map((id, index) => (
          <div
            key={id}
            className="group overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            style={{
              border: '1px solid var(--border-light)',
              outline: '1px solid transparent',
              transition:
                'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.borderColor =
                'var(--gold-accent)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                '0 8px 32px rgba(0,0,0,0.28)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.borderColor =
                'var(--border-light)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = ''
            }}
          >
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title={`Marian — vidéo ${index + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
                style={{ display: 'block' }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const YOUTUBE_IDS = ['mDVfbV8TNUQ', '4sdz6Rlojfc', 'I35a3f7BSGk']

