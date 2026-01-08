'use client'

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguageStore } from '@/store/languageStore'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

interface Artist {
  id: number
  image: string
  nameKey: string
  citationKey: string
}

const artists: Artist[] = [
  {
    id: 1,
    image: '/images/home/hero/senechal.webp',
    nameKey: 'leadGenerator.defaultTitle1',
    citationKey: 'leadGenerator.defaultDescription1'
  },
  {
    id: 3,
    image: '/images/home/hero/ronan.webp',
    nameKey: 'leadGenerator.defaultTitle3',
    citationKey: 'leadGenerator.defaultDescription3'
  },
  {
    id: 4,
    image: '/images/home/hero/boyer.webp',
    nameKey: 'leadGenerator.defaultTitle4',
    citationKey: 'leadGenerator.defaultDescription4'
  }
]

export default function HeroArtistSlider() {
  const { theme } = useTheme()
  const { t } = useLanguageStore()
  const [swiper, setSwiper] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any

  const nextSlide = () => {
    if (swiper) {
      swiper.slideNext()
    }
  }

  const prevSlide = () => {
    if (swiper) {
      swiper.slidePrev()
    }
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto ">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        onSwiper={setSwiper}
        className="hero-artist-swiper h-[28rem] sm:h-96"
      >
        {artists.map((artist, index) => (
          <SwiperSlide key={artist.id}>
            <div className="relative">
              {/* Artist Image */}
              <div className="relative w-full rounded-2xl flex flex-col md:flex-row">
                <blockquote>
                  <p className={`leading-relaxed text-white italic text-lg font-medium`}>
                    &ldquo;{t(artist.citationKey)}&rdquo;
                  </p>
                  <cite className={`block mt-3 text-sm font-medium text-white`}>
                    — {t(artist.nameKey)}
                  </cite>
                </blockquote>
                <Image
                  className="h-48 w-auto m-auto lg:w-full lg:h-auto lg:m-0 max-w-xs"
                  src={artist.image}
                  alt={t(artist.nameKey)}
                  width={400}
                  height={500}
                  priority={index === 0} // ✅ OPTIMISÉ: Priorité uniquement pour la première image visible
                  sizes="(max-width: 768px) 100vw, 400px" // ✅ OPTIMISÉ: Sizes responsive
                />
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={prevSlide}
          className={`p-2 rounded-full transition-all duration-200 ${theme === 'light'
            ? 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            : 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          aria-label="Previous artist"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className={`p-2 rounded-full transition-all duration-200 ${theme === 'light'
            ? 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            : 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          aria-label="Next artist"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
