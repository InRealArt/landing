'use client'

import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import ArtworkCard from '@/components/common/cards/ArtworkCard'
import { useTranslation } from '@/hooks/useTranslation'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

interface ArtistArtworkCarouselProps {
  artistName: string
  artworks: Array<{
    id: string
    name: string
    price: number | null
    image: {
      src: string
    }
  }>
}

// Minimum slides needed to safely enable loop at max breakpoint (slidesPerView=4, need 4*2=8)
const LOOP_MIN_SLIDES = 8

export default function ArtistArtworkCarousel({ artistName, artworks }: ArtistArtworkCarouselProps) {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (artworks.length === 0) return null
  if (!mounted) return <div className="h-40" />

  const canLoop = artworks.length >= LOOP_MIN_SLIDES

  // Only duplicate slides when loop is actually enabled
  const slides = canLoop
    ? [...artworks, ...artworks].map((aw, i) => ({ ...aw, key: `${aw.id}-${i}` }))
    : artworks.map((aw, i) => ({ ...aw, key: `${aw.id}-${i}` }))

  return (
    <div className="relative bg-gradient max-w-screen-2xl m-auto mt-20">
      <div className="mb-12 px-4">
        <div className="border-t border-white/20 mb-6" />
        <h2 className="text-5xl md:text-7xl serif italic leading-tight text-center mb-6">
          {t('artistPage.discover')} <span className="whitespace-nowrap">{artistName}</span>
        </h2>
        <div className="border-t border-white/20" />
      </div>

      <section className="mt-12 relative">
        <button
          className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/95 hover:bg-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group backdrop-blur-sm"
          aria-label="Slide précédent"
        >
          <svg className="w-7 h-7 text-gray-700 group-hover:text-purpleColor transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/95 hover:bg-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group backdrop-blur-sm"
          aria-label="Slide suivant"
        >
          <svg className="w-7 h-7 text-gray-700 group-hover:text-purpleColor transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <Swiper
          modules={canLoop ? [Autoplay, Pagination, Navigation] : [Navigation]}
          spaceBetween={10}
          speed={800}
          centeredSlides={canLoop}
          centeredSlidesBounds={!canLoop}
          loop={canLoop}
          autoplay={canLoop ? { delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: false } : false}
          allowTouchMove={false}
          simulateTouch={false}
          grabCursor={false}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          slidesPerView={Math.min(artworks.length, 1)}
          breakpoints={{
            768: { slidesPerView: Math.min(artworks.length, 2) },
            1023: { slidesPerView: Math.min(artworks.length, 3) },
            1279: { slidesPerView: Math.min(artworks.length, 4) },
          }}
        >
          {slides.map((item) => (
            <SwiperSlide key={item.key}>
              <ArtworkCard
                name={item.name}
                image={item.image}
                type="artwork"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <style jsx global>{`
        /* Navigation arrows */
        .swiper-button-prev-custom,
        .swiper-button-next-custom {
          opacity: 0.9;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
        }
        .swiper-button-prev-custom:hover,
        .swiper-button-next-custom:hover {
          opacity: 1;
          transform: translateY(-50%) scale(1.1);
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        .swiper-button-prev-custom:active,
        .swiper-button-next-custom:active {
          transform: translateY(-50%) scale(0.95);
        }
        .swiper-button-prev-custom.swiper-button-disabled,
        .swiper-button-next-custom.swiper-button-disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: translateY(-50%) scale(1);
          background-color: rgba(255, 255, 255, 0.5);
        }
        .swiper-button-prev-custom.swiper-button-disabled:hover,
        .swiper-button-next-custom.swiper-button-disabled:hover {
          transform: translateY(-50%) scale(1);
          border-color: transparent;
        }
        /* Hide default Swiper arrows */
        .swiper-button-next,
        .swiper-button-prev {
          display: none !important;
        }
        /* No grab cursor */
        .swiper,
        .swiper-slide {
          cursor: default !important;
        }
      `}</style>
    </div>
  )
}
