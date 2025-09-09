'use client'

import { useLanguageStore } from '@/store/languageStore'
import { useTheme } from '@/contexts/ThemeContext'
import Hero from '@/components/common/Hero'

const PresaleHero = () => {
  const { t } = useLanguageStore();
  const { theme } = useTheme();

  return (
    <Hero
      backgroundImage="/images/presale/hero_presale.webp"
      alt="Background presale"
      title={t('presale.intro.title')}
      subtitle={t('presale.intro.subtitle')}
      className="relative w-full h-96 md:h-[550px] overflow-hidden"
      contentAlignment="end"
      contentContainerClassName="max-w-90 xl:max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 sm:py-6 md:py-8 lg:py-12"
      titleClassName={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl bricolage-grotesque mb-6 sm:mb-8 ${
        theme === 'light' ? 'text-gray-900' : 'text-white'
      }`}
      subtitleClassName={`mb-6 sm:mb-8 text-sm sm:text-base md:text-lg ${
        theme === 'light' ? 'text-gray-700' : 'text-white/90'
      }`}
    />
  )
}

export default PresaleHero;