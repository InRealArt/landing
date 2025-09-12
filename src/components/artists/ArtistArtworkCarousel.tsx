'use client'

import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import ArtworkCard from '@/components/common/cards/ArtworkCard'
import { useLanguageStore } from '@/store/languageStore'

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

export default function ArtistArtworkCarousel({ artistName, artworks }: ArtistArtworkCarouselProps) {
  const { t } = useLanguageStore()
  const [mounted, setMounted] = useState(false)

  // Assurer que le composant est monté côté client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (artworks.length === 0) {
    return null
  }

  // Si le composant n'est pas encore monté, ne pas afficher le slider
  if (!mounted) {
    return <div className="h-40"></div>
  }

  // Créer des slides pour le mode loop infini
  const createLoopSlides = () => {
    if (artworks.length < 3) {
      return artworks
    }
    
    // Dupliquer les slides pour un loop infini fluide
    const loopSlides = []
    const totalSlides = artworks.length * 2 // Dupliquer une fois
    
    for (let i = 0; i < totalSlides; i++) {
      const originalIndex = i % artworks.length
      loopSlides.push({
        ...artworks[originalIndex],
        id: `${artworks[originalIndex].id}-loop-${i}`,
        isDuplicate: i >= artworks.length
      })
    }
    
    return loopSlides
  }

  const loopSlides = createLoopSlides()

  return (
    <div className="relative bg-gradient max-w-screen-2xl m-auto mt-20">
      <div className="mb-12 px-4">
        <div className="border-t border-white/20 mb-6"></div>
        <h2 className='text-2xl lg:text-6xl bricolage-grotesque font-medium text-center mb-6'>
          {t('artistPage.discover')} {artistName}
        </h2>
        <div className="border-t border-white/20"></div>
      </div>
      
      {/* Compteur d'artworks */}
      {/* <div className="flex items-center justify-start mb-6 px-4">
        <div className="text-textColor/60 text-sm">
          {artworks.length} {artworks.length > 1 ? t('artistPage.artwork_plural') : t('artistPage.artwork_singular')}
        </div>
      </div> */}

      {/* Swiper Carousel avec flèches de navigation */}
      <section className="mt-12 relative">
        {/* Flèches de navigation élégantes */}
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
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            reverseDirection: false
          }}
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={10}
          slidesPerView={artworks.length < 3 ? 1 : 2}
          speed={800}
          scrollbar={{ draggable: true }}
          initialSlide={artworks.length >= 3 ? artworks.length : 0}
          centeredSlidesBounds
          centeredSlides
          loop={artworks.length >= 3}
          loopAdditionalSlides={artworks.length >= 3 ? 2 : 0}
          allowTouchMove={false}
          simulateTouch={false}
          grabCursor={false}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          breakpoints={{
            768: {
              slidesPerView: artworks.length < 3 ? 1 : 2,
            },
            1023: {
              slidesPerView: artworks.length < 4 ? Math.min(artworks.length, 2) : 3,
            },
            1279: {
              slidesPerView: artworks.length < 5 ? Math.min(artworks.length, 3) : 4,
            },
          }}
        >
          {loopSlides.map((item, index) => (
            <SwiperSlide key={`artwork-slide-${item.id}`}>
              <ArtworkCard 
                name={item.name} 
                image={item.image} 
                type="artwork"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Styles personnalisés pour le carousel avec flèches */}
      <style jsx global>{`
        .swiper-wrapper {
          ${artworks.length < 3 ? 'justify-content: center !important;' : ''}
        }
        
        .swiper-slide {
          ${artworks.length < 3 ? 'width: auto !important;' : ''}
        }
        
        .swiper {
          ${artworks.length < 3 ? 'width: fit-content !important; margin: 0 auto !important;' : ''}
        }
        
        /* Styles pour les flèches de navigation */
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
        
        /* Masquer les flèches par défaut de Swiper */
        .swiper-button-next,
        .swiper-button-prev {
          display: none !important;
        }
        
        /* Désactiver le curseur de grab */
        .swiper {
          cursor: default !important;
        }
        
        .swiper-slide {
          cursor: default !important;
        }
      `}</style>
    </div>
  )
}
