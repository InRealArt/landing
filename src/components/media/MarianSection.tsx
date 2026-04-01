'use client'

import Image from 'next/image'
import { useLanguageStore } from '@/store/languageStore'

export default function MarianSection() {
  const { t } = useLanguageStore()

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

          <a
            href="mailto:teaminrealart@gmail.com"
            className="btn-action inline-flex items-center min-h-[44px]"
          >
            {t('media.marian.cta')}
          </a>
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
              className="object-cover grayscale"
              sizes="(max-width: 1024px) 0px, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

