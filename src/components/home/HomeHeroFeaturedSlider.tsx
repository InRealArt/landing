'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { FeaturedArtist, FeaturedArtwork } from '@/types/featured-item'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/pagination'

const FEATURED_IMAGE_ASPECT = 'aspect-[4/3] sm:aspect-[16/9]'

// Le slider s'étend jusqu'à max-w-7xl (1280px) ; on plafonne à 1280 pour éviter
// de charger une résolution plus grande que nécessaire.
const FEATURED_IMAGE_SIZES = '(min-width: 1280px) 1280px, 100vw'

export type FeaturedSlideKey = 'artwork' | 'artist'

interface HomeHeroFeaturedSliderProps {
  featuredArtwork: FeaturedArtwork | null
  featuredArtist: FeaturedArtist | null
  onActiveSlideChange?: (key: FeaturedSlideKey) => void
}

interface FeaturedSlide {
  key: FeaturedSlideKey
  href: string
  imageUrl: string
  alt: string
  badgeLabel: string
  descriptionText: string
}

function buildSlides(
  featuredArtwork: FeaturedArtwork | null,
  featuredArtist: FeaturedArtist | null
): FeaturedSlide[] {
  const slides: FeaturedSlide[] = []

  if (featuredArtwork) {
    slides.push({
      key: 'artwork',
      href: '/presale',
      imageUrl: featuredArtwork.imageUrl,
      alt: featuredArtwork.title,
      badgeLabel: 'Œuvre de la semaine',
      descriptionText: 'Découvrez les œuvres exclusives avant tout le monde.',
    })
  }

  if (featuredArtist) {
    slides.push({
      key: 'artist',
      href: `/artists/${featuredArtist.slug}`,
      imageUrl: featuredArtist.imageUrl,
      alt: `${featuredArtist.name} ${featuredArtist.surname}`,
      badgeLabel: 'Artiste de la semaine',
      descriptionText: 'Découvrez les artistes émergents avant tout le monde.',
    })
  }

  return slides
}

function FeaturedSlideContent({ slide, priority = false }: { slide: FeaturedSlide; priority?: boolean }) {
  return (
    <>
      <a
        href={slide.href}
        aria-label={`${slide.badgeLabel} : ${slide.alt}`}
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
        <span className="absolute top-4 left-4 z-10 bg-black/70 text-gold-accent text-[9px] uppercase tracking-[0.3em] px-3 py-1.5 montserrat backdrop-blur-sm">
          {slide.badgeLabel}
        </span>
      </a>
    </>
  )
}

export default function HomeHeroFeaturedSlider({
  featuredArtwork,
  featuredArtist,
  onActiveSlideChange,
}: HomeHeroFeaturedSliderProps) {
  const slides = buildSlides(featuredArtwork, featuredArtist)
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
