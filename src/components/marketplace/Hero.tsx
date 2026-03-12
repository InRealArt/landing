'use client'

import { useLanguageStore } from '@/store/languageStore'
import Button from "@/components/common/Button"
import OptimizedBackgroundImage from "@/components/common/OptimizedBackgroundImage"

export default function Hero() {
  const { t } = useLanguageStore();

  return (
    <section className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
      <OptimizedBackgroundImage
        src="/images/marketplace/hero_marketplace.webp"
        alt="Marketplace hero background"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full"
        overlay={false}
      />
      
      {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent z-10" />
      
      {/* Contenu du hero */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="max-w-screen-2xl mx-auto w-full px-10">
          <span className="section-number">{t('marketplace.hero.subtitle')}</span>
          <h1 className="text-6xl md:text-8xl serif mb-8">
            {t('marketplace.hero.title')} <span className="italic text-gold-accent">{t('marketplace.hero.highlight')}</span>
          </h1>
          <div className="mt-12 md:mt-4">
            <Button
              text={t('marketplace.hero.mainButton')}
              additionalClassName="border border-white text-textColor rounded-full py-3 px-8 opacity-50 cursor-not-allowed"
              center
              disabled={true}
            />
          </div>
        </div>
      </div>
    </section>
  )
} 