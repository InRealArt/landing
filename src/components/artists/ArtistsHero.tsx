'use client'

import { useLanguageStore } from '@/store/languageStore'
import { useTheme } from '@/contexts/ThemeContext'
import OptimizedBackgroundImage from "@/components/common/OptimizedBackgroundImage"

export default function ArtistsHero() {
  const { t } = useLanguageStore()
  const { theme } = useTheme()
  return (
    <section className="relative w-screen h-96 md:h-[550px] overflow-hidden ml-[calc(-50vw+50%)]">
      <OptimizedBackgroundImage
        src="/images/artists/hero_artists.webp"
        alt={t('artists.title')}
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Dégradé du bas vers le background - blanc en mode clair, noir en mode sombre */}
      <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'light'
          ? 'bg-gradient-to-t from-white via-white/50 to-transparent'
          : 'bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent'
        }`} />

      {/* Contenu du hero */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
          <h1 className={`bricolage-grotesque text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {t('artists.hero.title')}
          </h1>
          <p className={`text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl leading-relaxed ${
            theme === 'light' ? 'text-gray-700' : 'text-white/90'
          }`}>
            {t('artists.hero.subtitle')}
          </p>
        </div>
      </div>
    </section>
  )
}
