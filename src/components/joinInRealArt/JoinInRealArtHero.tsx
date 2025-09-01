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
    <section className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
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
      <div className="relative z-10 flex items-end h-full">
        <div className="max-w-90 xl:max-w-screen-xl mx-auto w-full pb-12 md:pb-16 lg:pb-20">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Contenu principal à gauche */}
            <div className="lg:w-3/5">
              <h1 className="bricolage-grotesque text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 md:mb-6">
                {t('joinInRealArt.header.title')}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl leading-relaxed mb-8">
                <TranslatedText 
                  translationKey="joinInRealArt.header.description"
                  allowHtml={true}
                />
              </p>
            </div>
            
            {/* PersonTypeSelection à droite */}
            <div className="lg:w-2/5">
              <div className="grid grid-cols-1 gap-4">
                {selectPersonType.map((personType, index) => (
                  <div key={index} className="bg-[rgb(30,30,30)]/90 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h3 className="text-lg bricolage-grotesque font-semibold text-white mb-3">
                      {personType.title}
                    </h3>
                    <p className="text-sm text-white/80 mb-4 bricolage-grotesque">
                      <TranslatedText 
                        translationKey={personType.description}
                        allowHtml={true}
                      />
                    </p>
                    <Button 
                      text={t('buttons.readMore')} 
                      additionalClassName="bg-purpleColor w-full justify-center" 
                      icon={<ArrowRight />} 
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
