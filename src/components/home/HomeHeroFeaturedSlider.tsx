'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { FeaturedArtist, FeaturedArtwork, FeaturedExhibition } from '@/types/featured-item'
import { useTranslation } from '@/hooks/useTranslation'
import { getSafeExternalUrl } from '@/utils/url'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/pagination'

const FEATURED_IMAGE_ASPECT = 'aspect-[4/3] sm:aspect-[16/9]'

// Le slider s'étend jusqu'à max-w-7xl (1280px) ; on plafonne à 1280 pour éviter
// de charger une résolution plus grande que nécessaire.
const FEATURED_IMAGE_SIZES = '(min-width: 1280px) 1280px, 100vw'

export type FeaturedSlideKey = 'artwork' | 'artist' | 'exhibition'

interface HomeHeroFeaturedSliderProps {
  featuredArtwork: FeaturedArtwork | null
  featuredArtist: FeaturedArtist | null
  featuredExhibition: FeaturedExhibition | null
  onActiveSlideChange?: (key: FeaturedSlideKey) => void
}

interface FeaturedSlide {
  key: FeaturedSlideKey
  href: string
  isExternal?: boolean
  imageUrl: string
  alt: string
  eyebrow: string
  title: string
  subtitle?: string
  descriptionText: string
  ctaLabel: string
}

function buildSlides(
  featuredArtwork: FeaturedArtwork | null,
  featuredArtist: FeaturedArtist | null,
  featuredExhibition: FeaturedExhibition | null,
  t: (key: string) => string
): FeaturedSlide[] {
  const slides: FeaturedSlide[] = []

  if (featuredArtwork) {
    slides.push({
      key: 'artwork',
      href: '/presale',
      imageUrl: featuredArtwork.imageUrl,
      alt: featuredArtwork.title,
      eyebrow: t('exhibitions.hero.featuredArtworkEyebrow'),
      title: featuredArtwork.title,
      subtitle: featuredArtwork.artistName || undefined,
      descriptionText: t('exhibitions.hero.featuredArtworkDescription'),
      ctaLabel: t('exhibitions.hero.featuredArtworkCta'),
    })
  }

  if (featuredArtist) {
    slides.push({
      key: 'artist',
      href: `/artists/${featuredArtist.slug}`,
      imageUrl: featuredArtist.imageUrl,
      alt: `${featuredArtist.name} ${featuredArtist.surname}`,
      eyebrow: t('exhibitions.hero.featuredArtistEyebrow'),
      title: `${featuredArtist.name} ${featuredArtist.surname}`,
      descriptionText: t('exhibitions.hero.featuredArtistDescription'),
      ctaLabel: t('exhibitions.hero.featuredArtistCta'),
    })
  }

  if (featuredExhibition && featuredExhibition.imageUrl) {
    const exhibitionHref = getSafeExternalUrl(featuredExhibition.linkToEvent)
    slides.push({
      key: 'exhibition',
      href: exhibitionHref || '#',
      isExternal: Boolean(exhibitionHref),
      imageUrl: featuredExhibition.imageUrl,
      alt: featuredExhibition.title,
      eyebrow: t('exhibitions.hero.featuredExhibitionEyebrow'),
      title: featuredExhibition.title,
      descriptionText: t('exhibitions.hero.featuredExhibitionDescription'),
      ctaLabel: t('exhibitions.hero.featuredExhibitionCta'),
    })
  }

  return slides
}

function FeaturedSlideContent({ slide, priority = false }: { slide: FeaturedSlide; priority?: boolean }) {
  return (
    <>
      <a
        href={slide.href}
        target={slide.isExternal ? '_blank' : undefined}
        rel={slide.isExternal ? 'noopener noreferrer' : undefined}
        aria-label={`${slide.eyebrow} : ${slide.title}`}
        className={`relative overflow-hidden bg-black group/img block w-full ${FEATURED_IMAGE_ASPECT}`}
      >
        {/* Couche fond : la même image, remplie (object-cover), floutée et assombrie
            pour combler élégamment le vide autour d'une image plus petite / de ratio
            différent — sans jamais rogner l'image nette du premier plan. */}
        <Image
          src={slide.imageUrl}
          alt=""
          fill
          sizes={FEATURED_IMAGE_SIZES}
          quality={40}
          priority={priority}
          aria-hidden="true"
          className="object-cover scale-110 blur-2xl brightness-[0.45] saturate-150"
        />
        {/* Couche premier plan : l'image entière, nette, jamais rognée (object-contain). */}
        <Image
          src={slide.imageUrl}
          alt={slide.alt}
          fill
          sizes={FEATURED_IMAGE_SIZES}
          quality={85}
          priority={priority}
          className="object-contain transition-transform duration-700 group-hover/img:scale-[1.02]"
        />

        {/* Dégradé bas pour asseoir le titre sur l'image */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
          aria-hidden="true"
        />

        {/* Eyebrow raffiné : cadre flouté (glassmorphism) + label en capitales espacées */}
        <div className="absolute top-5 left-5 z-10 flex items-center border border-white/15 bg-black/70 backdrop-blur-md px-4 py-2 shadow-lg">
          <span className="montserrat text-xs sm:text-sm uppercase tracking-[0.35em] text-gold-accent font-medium">
            {slide.eyebrow}
          </span>
        </div>

        {/* Bloc titre éditorial (Cormorant) + sous-titre + CTA au hover */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7 lg:p-9">
          <h3 className="font-cormorant font-light leading-[0.95] text-white text-3xl sm:text-4xl lg:text-5xl">
            {slide.title}
          </h3>
          {slide.subtitle && (
            <p className="mt-1.5 montserrat text-xs sm:text-sm text-white/60">
              {slide.subtitle}
            </p>
          )}
          <span className="mt-3 inline-flex items-center gap-2 montserrat text-xs uppercase tracking-[0.25em] text-white/70 opacity-0 translate-y-1 transition-all duration-300 group-hover/img:opacity-100 group-hover/img:translate-y-0">
            {slide.ctaLabel}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </a>
    </>
  )
}

export default function HomeHeroFeaturedSlider({
  featuredArtwork,
  featuredArtist,
  featuredExhibition,
  onActiveSlideChange,
}: HomeHeroFeaturedSliderProps) {
  const { t } = useTranslation()
  const slides = buildSlides(featuredArtwork, featuredArtist, featuredExhibition, t)
  const firstSlideKey = slides[0]?.key
  const [activeKey, setActiveKey] = useState<FeaturedSlideKey | undefined>(firstSlideKey)

  useEffect(() => {
    if (firstSlideKey) {
      setActiveKey(firstSlideKey)
      onActiveSlideChange?.(firstSlideKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstSlideKey])

  if (slides.length === 0) {
    return null
  }

  if (slides.length === 1) {
    return (
      <div className="mb-12 max-w-7xl">
        <FeaturedSlideContent slide={slides[0]} priority />
        <p className="mt-4 text-white/30 text-xs leading-relaxed">{slides[0].descriptionText}</p>
      </div>
    )
  }

  const activeSlide = slides.find((s) => s.key === activeKey) ?? slides[0]

  const handleSlideChange = (swiper: SwiperType) => {
    const slide = slides[swiper.realIndex % slides.length]
    if (slide) {
      setActiveKey(slide.key)
      onActiveSlideChange?.(slide.key)
    }
  }

  return (
    <div className="mb-12 max-w-7xl featured-slider">
      <style jsx global>{`
        .featured-slider-pagination-target.swiper-pagination-bullets.swiper-pagination-horizontal {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: auto;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          gap: 6px;
          padding: 1rem;
          z-index: 10;
        }
        .featured-slider-bullet {
          display: inline-block;
          width: 20px;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .featured-slider-bullet-active {
          background: var(--gold-accent, #b89c72);
        }
      `}</style>
      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination]}
          speed={600}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            el: '.featured-slider-pagination-target',
            clickable: true,
            bulletClass: 'featured-slider-bullet',
            bulletActiveClass: 'featured-slider-bullet-active',
          }}
          onSlideChange={handleSlideChange}
          loop
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.key}>
              <FeaturedSlideContent slide={slide} priority={index === 0} />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Anchored to the image's aspect ratio, not the slide (which also contains the caption text below it) */}
        <div className={`featured-slider-pagination-target ${FEATURED_IMAGE_ASPECT}`} />
      </div>
      <p className="mt-4 text-white/30 text-xs leading-relaxed">
        {activeSlide.descriptionText}
      </p>
    </div>
  )
}
