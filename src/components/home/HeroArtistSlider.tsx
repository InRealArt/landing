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
    image: '/images/home/hero/senechal.png',
    name: 'Catherine Sénéchal',
    citation: {
      en: "I was finally able to showcase my work on social media and at art fairs! The provided materials are clear, professional and super easy to use. My visibility has exploded, I highly recommend it!",
      fr: "J'ai enfin pu mettre mon travail en avant sur les réseaux sociaux et sur les salons! Les supports fournis sont clairs, professionnels et super faciles à utiliser. Ma visibilité a explosé, je recommande !"
    }
  },
  {
    id: 2,
    image: '/images/home/hero/laville.png',
    name: 'Monique Laville',
    citation: {
      en: "I feel supported on a daily basis! The team is always there to answer my questions, guide me and even accompany me during events. There's a real authentic closeness, I don't feel isolated",
      fr: "Je me sens soutenu au quotidien ! L’équipe est toujours là pour répondre à mes questions, me guider et même m'accompagner lors des événements. Il y a une vrai proximité authentique, je ne me sens pas isolée"
    }
  },
  {
    id: 3,
    image: '/images/home/hero/ronan.png',
    name: 'Martin Ronan',
    citation: {
      en: "I discovered this project by meeting Catherine Meulemans, director of the Artthema gallery. I was won over by the sensitivity of the project leader, the team and the trust of their partners. I joined the adventure and I'm very satisfied with it.",
      fr: "J’ai découvert ce projet grâce en rencontrant Catherine Meulemans directrice de la galerie Artthema, j’ai été conquis par la sensibilité du porteur de projet, de l'équipe et la confiance de leurs partenaires. J’ai rejoint l’aventure et j’en suis très satisfait."
    }
  },
  {
    id: 4,
    image: '/images/home/hero/boyer.png',
    name: 'Jean-Paul Boyer',
    citation: {
      en: "I tested other platforms, but everything costs a lot and is never adapted to my situation. Inrealart really understood my needs: a fair counterpart and a flexible solution that fits my needs.",
      fr: "J’ai testé d’autres plateformes, mais tout coûte cher et n’est jamais adapté à ma situation. Inrealart a vraiment compris mes besoins : une contrepartie juste et une solution flexible qui colle à mes besoins."
    }
  }
]

export default function HeroArtistSlider() {
  const { theme } = useTheme()
  const { language } = useLanguageStore()
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
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        onSwiper={setSwiper}
        className="hero-artist-swiper h-96"
      >
        {artists.map((artist) => (
          <SwiperSlide key={artist.id}>
            <div className="relative">
              {/* Artist Image */}
              <div className="relative w-full rounded-2xl flex">
                <blockquote>
                  <p className={`leading-relaxed text-white italic text-lg font-medium`}>
                    &ldquo;{artist.citation[language as 'en' | 'fr']}&rdquo;
                  </p>
                  <cite className={`block mt-3 text-sm font-medium text-white`}>
                    — {artist.name}
                  </cite>
                </blockquote>
                <Image
                  className="w-full h-auto"
                  src={artist.image}
                  alt={artist.name}
                  width={400}
                  height={500}
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
