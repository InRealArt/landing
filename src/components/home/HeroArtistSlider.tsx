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
  name: string
  citation: {
    en: string
    fr: string
  }
}

const artists: Artist[] = [
  {
    id: 1,
    image: '/images/home/hero/image-1.png',
    name: 'Artist 1',
    citation: {
      en: "Art is not what you see, but what you make others see.",
      fr: "L'art n'est pas ce que vous voyez, mais ce que vous faites voir aux autres."
    }
  },
  {
    id: 2,
    image: '/images/home/hero/image-2.png',
    name: 'Artist 2',
    citation: {
      en: "Every artist was first an amateur.",
      fr: "Chaque artiste a d'abord été un amateur."
    }
  },
  {
    id: 3,
    image: '/images/home/hero/image-3.png',
    name: 'Artist 3',
    citation: {
      en: "The purpose of art is washing the dust of daily life off our souls.",
      fr: "Le but de l'art est de laver la poussière de la vie quotidienne de nos âmes."
    }
  },
  {
    id: 4,
    image: '/images/home/hero/image-4.png',
    name: 'Artist 4',
    citation: {
      en: "Art enables us to find ourselves and lose ourselves at the same time.",
      fr: "L'art nous permet de nous trouver et de nous perdre en même temps."
    }
  }
]

export default function HeroArtistSlider() {
  const { theme } = useTheme()
  const { t, language } = useLanguageStore()
  const [swiper, setSwiper] = useState<any>(null)

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
    <div className="relative w-full max-w-4xl mx-auto">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        onSwiper={setSwiper}
        className="hero-artist-swiper"
      >
        {artists.map((artist) => (
          <SwiperSlide key={artist.id}>
            <div className="relative">
              {/* Artist Image */}
              <div className="relative w-full h-80 md:h-96 overflow-hidden rounded-2xl">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
                <blockquote className="absolute bottom-4 left-4 ">
                  <p className={`leading-relaxed text-white italic text-3xl font-medium`}>
                    "{artist.citation[language as 'en' | 'fr']}"
                  </p>
                  <cite className={`block mt-3 text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                    — {artist.name}
                  </cite>
                </blockquote>
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
