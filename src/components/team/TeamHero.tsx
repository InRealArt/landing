'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguageStore } from '@/store/languageStore'

export default function TeamHero() {
  const { t } = useLanguageStore()
  const { theme } = useTheme()

  return (
    <section className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
      <OptimizedBackgroundImage
        src="/images/team/hero_team.avif"
        alt={t('team.title')}
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full"
        overlay={false}
        priority={true}
      />
      
      {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
      <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'light'
          ? 'bg-gradient-to-t from-white via-white/50 to-transparent'
          : 'bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent'
        }`} />
      {/* Contenu du hero */}
      <div className="absolute inset-0 z-20 flex items-end h-full">
        <div className="max-w-screen-2xl mx-auto w-full px-10 pb-12 md:pb-16 lg:pb-20">
          <div className="max-w-4xl">
            <span className="section-number text-white/70">{t('team.hero.subtitle')}</span>
            <h1 className="text-6xl md:text-8xl serif text-white mb-6">
              Notre <span className="italic text-gold-accent">équipe</span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  )
}
