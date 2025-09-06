'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguageStore } from '@/store/languageStore'

export default function AboutHero() {
  const { t } = useLanguageStore()
  const { theme } = useTheme()
  return (
    <section className="relative w-full h-[50vh] md:h-[55vh] lg:h-[60vh] overflow-hidden">
      <OptimizedBackgroundImage
        src="/images/hero_about.webp"
        alt={t('about.title')}
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full"
        priority={true}
        quality={90}
        overlay={false}
      />

      {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
      <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'light'
          ? 'bg-gradient-to-t from-white via-white/50 to-transparent'
          : 'bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent'
        }`} />

      {/* Contenu du hero */}
      <div className="absolute inset-0 z-20 flex items-end">
        <div className="max-w-90 xl:max-w-screen-xl mx-auto w-full pb-12 md:pb-16 lg:pb-20">
          <div className="max-w-4xl">
            <h1 className="bricolage-grotesque text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-textColor mb-4 md:mb-6 leading-tight">
              {t('about.hero.title')}
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-textColor/90 max-w-2xl leading-relaxed">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
