'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
import { useLanguageStore } from '@/store/languageStore'
import TranslatedText from "@/components/common/TranslatedText"
import { ArrowRight } from "lucide-react"
import Button from "@/components/common/Button"
import { useTheme } from '@/contexts/ThemeContext'
import { Phone } from 'lucide-react'
import { EXTERNAL_URLS } from '@/constants/constants'

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

  const { theme } = useTheme()

  const overlayColor = theme === 'light'
    ? 'linear-gradient(to top, rgb(255,255,255), rgba(255,255,255,0.8), transparent)'
    : 'linear-gradient(to top, rgb(19,19,19), rgba(19,19,19,0.8), transparent)'

  return (
    <OptimizedBackgroundImage
      src="/images/joinInRealArt/hero_joinInRealArt.webp"
      alt={t('joinInRealArt.header.title')}
      width={1920}
      height={1080}
      className="inset-0 w-full flex items-center justify-center md:mt-0 m-auto"
      overlay={true}
      overlayColor={overlayColor}
      overlayOpacity={1}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, (max-width: 1536px) 1400px, 1400px"
    >
      {/* Contenu du hero */}
      <div className="inset-0 z-20 flex items-center pt-headerSize">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
          <div className="flex flex-col gap-6 sm:gap-8 lg:gap-12">
            {/* Contenu principal à gauche */}
            <div className="lg:w-3/5">
              <div className="hero-text-container">
                <h1 className="hero-title text-white text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl mb-2 sm:mb-3 md:mb-4 leading-tight">
                  {t('joinInRealArt.header.title')}
                </h1>
                <p className="hero-subtitle text-white text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6">
                  <TranslatedText
                    translationKey="joinInRealArt.header.description"
                    allowHtml={true}
                  />
                </p>
                <Button
                  text={t('buttons.joinUs')}
                  link={EXTERNAL_URLS.CALENDLY_MEETING}
                  target="_blank"
                  additionalClassName="bg-purpleColor w-fit"
                  icon={<Phone />}
                  iconBefore
                  data-umami-event="calendly-join-hero-click"
                />
              </div>
            </div>

            {/* PersonTypeSelection à droite */}
            <div className="w-full">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {selectPersonType.map((personType, index) => (
                  <div key={index} className={`backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border ${theme === 'light' 
                    ? 'bg-white/90 border-gray-200' 
                    : 'bg-[rgb(30,30,30)]/90 border-white/20'}`}>
                    <h3 className={`text-base sm:text-lg bricolage-grotesque font-semibold mb-2 sm:mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-textColor'}`}>
                      {personType.title}
                    </h3>
                    <p className={`text-xs sm:text-sm mb-3 sm:mb-4 bricolage-grotesque leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-textColor/80'}`}>
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
                      data-umami-event={`join-readmore-${personType.link.replace('/', '')}-click`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </OptimizedBackgroundImage>
  )
}
