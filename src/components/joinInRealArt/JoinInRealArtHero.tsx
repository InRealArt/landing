'use client'

import Image from 'next/image'
import { useLanguageStore } from '@/store/languageStore'
import TranslatedText from "@/components/common/TranslatedText"
import { ArrowRight } from "lucide-react"
import Button from "@/components/common/Button"

export default function JoinInRealArtHero() {
  const { t } = useLanguageStore()

  const selectPersonType = [
    {
      title: t('joinInRealArt.header.artists.title'),
      link: "/joinInRealArt/artists",
      description: 'joinInRealArt.header.artists.description'
    },
    {
      title: t('joinInRealArt.header.galleries.title'),
      link: "/joinInRealArt/galleries",
      description: 'joinInRealArt.header.galleries.description'
    }
  ]

  return (
    <section className="relative w-full min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <Image
          src="/images/joinInRealArt/hero_joinInRealArt.webp"
          alt={t('joinInRealArt.header.title')}
          fill
          className="object-cover"
          priority
          quality={90}
        />
        
        {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent" />
      </div>

      {/* Contenu du hero */}
      <div className="relative z-10 flex items-end lg:items-center h-full">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 lg:pt-24 xl:pt-28 pb-8 sm:pb-12 md:pb-16 lg:pb-16 xl:pb-20">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
            {/* Contenu principal à gauche */}
            <div className="lg:w-3/5 mt-4 sm:mt-6 lg:mt-8">
              <h1 className="bricolage-grotesque text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
                {t('joinInRealArt.header.title')}
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-2xl leading-relaxed mb-6 sm:mb-8">
                <TranslatedText 
                  translationKey="joinInRealArt.header.description"
                  allowHtml={true}
                />
              </p>
            </div>
            
            {/* PersonTypeSelection à droite */}
            <div className="lg:w-2/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 mt-4 sm:mt-6 lg:mt-0">
                {selectPersonType.map((personType, index) => (
                  <div key={index} className="bg-[rgb(30,30,30)]/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/20">
                    <h3 className="text-base sm:text-lg bricolage-grotesque font-semibold text-white mb-2 sm:mb-3">
                      {personType.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 mb-3 sm:mb-4 bricolage-grotesque leading-relaxed">
                      <TranslatedText 
                        translationKey={personType.description}
                        allowHtml={true}
                      />
                    </p>
                    <Button 
                      text={t('buttons.readMore')} 
                      additionalClassName="bg-purpleColor w-full justify-center text-xs sm:text-sm" 
                      icon={<ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />} 
                      link={personType.link}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
