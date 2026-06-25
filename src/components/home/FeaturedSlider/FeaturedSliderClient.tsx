'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { FeaturedItem } from '@/types/featured-item'
import { useTranslation } from '@/hooks/useTranslation'
import ArtistSlide from './slides/ArtistSlide'
import ArtworkSlide from './slides/ArtworkSlide'
import PostSlide from './slides/PostSlide'
import ExhibitionSlide from './slides/ExhibitionSlide'

type Props = {
  items: FeaturedItem[]
}

export default function FeaturedSliderClient({ items }: Props) {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((index: number) => {
    setActiveIndex(index)
    setIsPaused(true)
  }, [])

  // Auto-rotate: 5 seconds
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length)
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPaused, items.length])

  // Resume after 8 seconds of pause
  useEffect(() => {
    if (!isPaused) return

    const resumeTimer = setTimeout(() => {
      setIsPaused(false)
    }, 8000)

    return () => clearTimeout(resumeTimer)
  }, [isPaused])

  const current = items[activeIndex]

  return (
    <section
      className="py-24 lg:py-32 bg-backgroundColor border-y border-borderColor"
      aria-label={t('featured.gridAriaLabel')}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-16 pb-6 border-b border-borderColor">
          <div>
            <span className="section-number">{t('featured.eyebrow')}</span>
            <h2 className="serif text-4xl md:text-5xl font-light leading-none text-textColor mt-3">
              {t('featured.sectionTitle')}
            </h2>
          </div>
          <span className="unbounded text-[10px] text-grayText tabular-nums hidden sm:block">
            {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
        </div>

        {/* Slide container */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Slide */}
            <div key={activeIndex} className="min-h-[600px] flex flex-col">
              {current.kind === 'artist' && <ArtistSlide item={current} />}
              {current.kind === 'artwork' && <ArtworkSlide item={current} />}
              {current.kind === 'post' && <PostSlide item={current} />}
              {current.kind === 'exhibition' && <ExhibitionSlide item={current} />}
            </div>

            {/* Info card on right (desktop) or below (mobile) */}
            <div className="hidden lg:flex flex-col justify-center space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-gold-accent montserrat mb-3">
                  {current.kind === 'artist' && t('featured.typeArtist')}
                  {current.kind === 'artwork' && t('featured.typeArtwork')}
                  {current.kind === 'post' && t('featured.typePost')}
                  {current.kind === 'exhibition' && t('featured.typeExhibition')}
                </p>
                <h3 className="serif text-4xl font-light text-textColor leading-tight">
                  {current.kind === 'artist' && `${current.name} ${current.surname}`}
                  {current.kind === 'artwork' && current.title}
                  {current.kind === 'post' && current.title}
                  {current.kind === 'exhibition' && current.title}
                </h3>
              </div>

              {current.kind === 'artist' && current.speciality && (
                <p className="text-sm text-grayText">{current.speciality}</p>
              )}

              {current.kind === 'artwork' && current.price && (
                <p className="text-sm text-grayText">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(current.price)}
                </p>
              )}

              {current.kind === 'post' && current.categoryName && (
                <p className="text-xs text-grayText">{current.categoryName}</p>
              )}

              {current.kind === 'exhibition' && current.location && (
                <div className="space-y-2">
                  <p className="text-sm text-grayText">{current.location}</p>
                  <p className="text-xs text-grayText/60">
                    {new Date(current.startDate).toLocaleDateString()} —{' '}
                    {new Date(current.endDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="pt-4">
                {current.kind === 'artist' && (
                  <a
                    href={`/artists/${current.slug}`}
                    className="inline-block px-6 py-3 bg-gold-accent text-backgroundColor font-medium text-sm montserrat hover:bg-opacity-90 transition-all"
                  >
                    {t('featured.ctaArtist')}
                  </a>
                )}
                {current.kind === 'artwork' && (
                  <a
                    href="#"
                    className="inline-block px-6 py-3 bg-gold-accent text-backgroundColor font-medium text-sm montserrat hover:bg-opacity-90 transition-all"
                  >
                    {t('featured.ctaArtwork')}
                  </a>
                )}
                {current.kind === 'post' && (
                  <a
                    href={`/media/${current.slug}`}
                    className="inline-block px-6 py-3 bg-gold-accent text-backgroundColor font-medium text-sm montserrat hover:bg-opacity-90 transition-all"
                  >
                    {t('featured.ctaPost')}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center items-center gap-3 mt-12" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 ${
                i === activeIndex
                  ? 'w-8 h-1 bg-gold-accent'
                  : 'w-2 h-1 bg-borderColor hover:bg-gold-accent/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
