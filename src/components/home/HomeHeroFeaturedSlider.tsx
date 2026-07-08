'use client'

import type { FeaturedArtist, FeaturedArtwork } from '@/types/featured-item'

interface HomeHeroFeaturedSliderProps {
  featuredArtwork: FeaturedArtwork | null
  featuredArtist: FeaturedArtist | null
}

interface FeaturedSlide {
  key: 'artwork' | 'artist'
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

function FeaturedSlideContent({ slide }: { slide: FeaturedSlide }) {
  return (
    <>
      <a
        href={slide.href}
        aria-label={`${slide.badgeLabel} : ${slide.alt}`}
        className="relative overflow-hidden bg-white/5 group/img block w-full aspect-[4/3] sm:aspect-[16/9]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slide.imageUrl}
          alt={slide.alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-[1.03]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"
          aria-hidden="true"
        />
        <span className="absolute top-4 left-4 bg-black/70 text-gold-accent text-[9px] uppercase tracking-[0.3em] px-3 py-1.5 montserrat backdrop-blur-sm">
          {slide.badgeLabel}
        </span>
        <div
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"
          aria-hidden="true"
        />
      </a>
      <div className="flex flex-col gap-2 mt-4">
        <p className="text-white/30 text-xs leading-relaxed">{slide.descriptionText}</p>
      </div>
    </>
  )
}

export default function HomeHeroFeaturedSlider({
  featuredArtwork,
  featuredArtist,
}: HomeHeroFeaturedSliderProps) {
  const slides = buildSlides(featuredArtwork, featuredArtist)

  if (slides.length === 0) {
    return null
  }

  if (slides.length === 1) {
    return (
      <div className="mb-12 max-w-4xl">
        <FeaturedSlideContent slide={slides[0]} />
      </div>
    )
  }

  // Multi-slide Swiper carousel is added in Task 2.
  return null
}
