'use client'

import Image from 'next/image'
import { useLanguageStore } from '@/store/languageStore'

export default function AcademyHero() {
  const { t } = useLanguageStore()

  return (
    <section className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <Image
          src="/images/academy/hero_academy.webp"
          alt={t('academy.title')}
          fill
          className="object-cover"
          priority
          quality={90}
        />
        
        {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent" />
      </div>

      {/* Contenu du hero */}
      <div className="relative z-10 flex items-end h-full">
        <div className="max-w-90 xl:max-w-screen-xl mx-auto w-full pb-12 md:pb-16 lg:pb-20">
          <div className="max-w-4xl">
            <h1 className="bricolage-grotesque text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 md:mb-6">
              {t('academy.hero.title')}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl leading-relaxed mb-8">
              {t('academy.hero.subtitle')}
            </p>
            
            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-purpleColor border bg-backgroundColor p-4 gap-4 rounded-xl items-center inline-flex hover:bg-purpleColor/90 transition-colors">
                <span className='unbounded font-semibold text-sm text-white'>{t('academy.hero.button1')}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors duration-200">
                {t('academy.hero.button2')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
