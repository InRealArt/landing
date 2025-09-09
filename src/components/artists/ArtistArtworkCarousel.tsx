'use client'

import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
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

      {/* Swiper Carousel - Style page d'accueil */}
      <section className={`mt-12 ${artworks.length < 3 ? 'flex justify-center' : ''}`}>
        <Swiper
          autoplay={artworks.length > 3 ? {
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            reverseDirection: false
          } : false}
          modules={[Autoplay, Pagination]}
          spaceBetween={10}
          slidesPerView={artworks.length < 2 ? 1 : 2}
          speed={800}
          scrollbar={{ draggable: true }}
          initialSlide={artworks.length < 2 ? 0 : Math.floor(artworks.length / 2)}
          centeredSlidesBounds={artworks.length >= 2}
          centeredSlides={artworks.length >= 2}
          loop={artworks.length > 3}
          breakpoints={{
            768: {
              slidesPerView: artworks.length < 2 ? 1 : artworks.length < 3 ? 2 : 2,
              centeredSlides: artworks.length >= 2,
              centeredSlidesBounds: artworks.length >= 2,
            },
            1023: {
              slidesPerView: artworks.length < 3 ? Math.min(artworks.length, 2) : 3,
              centeredSlides: artworks.length >= 3,
              centeredSlidesBounds: artworks.length >= 3,
            },
            1279: {
              slidesPerView: artworks.length < 4 ? Math.min(artworks.length, 3) : 4,
              centeredSlides: artworks.length >= 4,
              centeredSlidesBounds: artworks.length >= 4,
            },
          }}
        >
          {artworks.map((item, index) => (
            <SwiperSlide key={`artwork-slide-${index}`}>
              <ArtworkCard 
                name={item.name} 
                image={item.image} 
                type="artwork"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Styles personnalisés pour le centrage */}
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
      `}</style>
    </div>
  )
}
