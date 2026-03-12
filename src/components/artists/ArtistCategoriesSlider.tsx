'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { getArtistCategories, ArtistCategory } from '@/actions/artistCategoryActions'
import { useLanguageStore } from '@/store/languageStore'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

export default function ArtistCategoriesSlider() {
  const [categories, setCategories] = useState<ArtistCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t, language } = useLanguageStore()
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getArtistCategories()
        setCategories(data)
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const displayCategories = useMemo(() => {
    return categories.map(c => ({
      ...c,
      name: c.translations?.name?.[language] || c.name,
      description: c.translations?.description?.[language] || c.description
    }))
  }, [categories, language])

  const handleCategoryClick = (category: ArtistCategory) => {
    // Pour l'instant, utiliser le nom comme slug (en attendant la migration)
    const slug = category.slug || encodeURIComponent(category.name.toLowerCase())
    router.push(`/artists/category/${slug}`)
  }

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-textColor">{t('common.loading')}</div>
      </div>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="w-full mb-16 mt-24">
      <div className="max-w-90 xl:max-w-screen-xl m-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-5xl md:text-7xl serif italic leading-tight text-textColor">
            {t('artists.categories.title') || 'Catégories d\'artistes'}
          </h2>
          
          {/* Navigation buttons */}
          <div className="flex items-center space-x-4">
            <button className="swiper-button-prev-custom w-12 h-12 rounded-full bg-textColor/10 hover:bg-textColor/20 transition-colors duration-200 flex items-center justify-center group">
              <ChevronLeft className="w-6 h-6 text-textColor group-hover:text-textColor/80" />
            </button>
            <button className="swiper-button-next-custom w-12 h-12 rounded-full bg-textColor/10 hover:bg-textColor/20 transition-colors duration-200 flex items-center justify-center group">
              <ChevronRight className="w-6 h-6 text-textColor group-hover:text-textColor/80" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 28,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
          }}
          className="w-full"
        >
          {displayCategories.map((category) => (
            <SwiperSlide key={category.id}>
              <div 
                className="relative group cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                {/* Background Image */}
                <div 
                  className="w-full h-64 rounded-md overflow-hidden bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: category.imageUrl 
                      ? `url(${category.imageUrl})` 
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  {/* Overlay léger pour lisibilité globale */}
                  <div className="absolute inset-0 bg-backgroundColor/10 transition-colors duration-300 group-hover:bg-backgroundColor/20" />

                  {/* Dégradé bas pour fondre avec le fond noir du site */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 md:h-28 lg:h-32 bg-gradient-to-b from-transparent to-backgroundColor" />

                  {/* Bouton en pilule comme le screenshot */}
                  <div className="absolute bottom-4 left-4">
                    <button 
                      className="inline-flex items-center justify-between gap-3 rounded-full border border-textColor/20 bg-textColor/10 px-4 py-2 text-textColor font-semibold backdrop-blur-sm hover:bg-textColor/20 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCategoryClick(category)
                      }}
                    >
                      <span className="text-sm md:text-base">{category.name}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination supprimée */}
      </div>

      <style jsx global>{`
        .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  )
}
