'use client'

import { useLanguageStore } from '@/store/languageStore'
import OptimizedBackgroundImage from "@/components/common/OptimizedBackgroundImage"

const Intro = () => {
  const { t } = useLanguageStore();

  return (
    <section className="relative w-full h-96 md:h-[550px] overflow-hidden">
      <OptimizedBackgroundImage
        src="/images/presale/hero_presale.webp"
        alt="Background presale"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full"
        overlay={false}
      />
      
      {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent z-10" />

      {/* Contenu du hero */}
      <div className="absolute inset-0 z-20 flex items-end sm:items-center">
        <div className="max-w-90 xl:max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 sm:py-6 md:py-8 lg:py-12">
          <div className="flex flex-col md:flex-row md:justify-between gap-12">
            <div className="md:w-6/12 bricolage-grotesque font-semibold">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl bricolage-grotesque mb-6 sm:mb-8 text-white">{t('presale.intro.title')}</h1>
              <h3 className="mb-6 sm:mb-8 inter text-sm sm:text-base md:text-lg text-white/90">{t('presale.intro.subtitle')}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Intro;