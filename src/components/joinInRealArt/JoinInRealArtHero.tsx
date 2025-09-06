'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
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
    <section className="relative w-full h-[70vh] sm:h-[65vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
      <OptimizedBackgroundImage
        src="/images/joinInRealArt/hero_joinInRealArt.webp"
        alt={t('joinInRealArt.header.title')}
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full"
        overlay={false}
      />
      
      {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent z-10" />
      
      {/* Contenu du hero */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
            {/* Contenu principal à gauche */}
            <div className="lg:w-3/5">
              <h1 className="bricolage-grotesque text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-textColor mb-2 sm:mb-3 md:mb-4 leading-tight">
                {t('joinInRealArt.header.title')}
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-textColor/90 max-w-2xl leading-relaxed mb-4 sm:mb-6">
                <TranslatedText 
                  translationKey="joinInRealArt.header.description"
                  allowHtml={true}
                />
              </p>
            </div>
            
            {/* PersonTypeSelection à droite */}
            <div className="lg:w-2/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                {selectPersonType.map((personType, index) => (
                  <div key={index} className="bg-[rgb(30,30,30)]/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/20">
                    <h3 className="text-base sm:text-lg bricolage-grotesque font-semibold text-textColor mb-2 sm:mb-3">
                      {personType.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-textColor/80 mb-3 sm:mb-4 bricolage-grotesque leading-relaxed">
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
