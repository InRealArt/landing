'use client'

import { useLanguageStore } from '@/store/languageStore'
import { ArrowRight } from 'lucide-react'
import Button from "@/components/common/Button"
import TranslatedText from "@/components/common/TranslatedText"
import OptimizedBackgroundImage from "@/components/common/OptimizedBackgroundImage"
import { useTheme } from '@/contexts/ThemeContext'

interface JoinIraHeroProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl?: string;
}

// Composant Hero réutilisable pour les pages Join In Real Art
export default function JoinIraHero({ title, subtitle, buttonText, buttonUrl }: JoinIraHeroProps) {
  const { t } = useLanguageStore()
  const { theme } = useTheme()
  return (
    <section className="relative w-full h-[80vh] sm:h-[70vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
      <OptimizedBackgroundImage
        src="/images/joinInRealArt/artists/hero_joinInReal_artists.webp"
        alt="Hero background"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full"
        overlay={false}
      />
      
      {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
      <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'light'
          ? 'bg-gradient-to-t from-white via-white/50 to-transparent'
          : 'bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent'
        }`} />      
      {/* Contenu du hero */}
      <div className="absolute inset-0 z-20 flex items-center md:items-end">
        <div className="max-w-full sm:max-w-90 xl:max-w-screen-xl mx-auto w-full px-6 sm:px-4 pt-32 sm:pt-36 md:pt-20 pb-12 md:pb-16 lg:pb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            {/* Texte principal à gauche */}
            <div className="flex-1 text-center md:text-left">
              <TranslatedText 
                translationKey={title}
                as="h1"
                className="bricolage-grotesque text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-textColor mb-4 md:mb-6 mt-8 sm:mt-12 md:mt-16"
                allowHtml={true}
              />
            </div>
            
            {/* Texte secondaire et bouton à droite */}
            <div className="flex-none md:max-w-md text-center md:text-left">
              <TranslatedText 
                translationKey={subtitle}
                as="p"
                className="text-sm sm:text-base md:text-lg lg:text-xl text-textColor/90 max-w-2xl leading-relaxed mb-8"
                allowHtml={true}
              />
              <Button 
                text={t(buttonText)} 
                additionalClassName="bg-purpleColor flex w-fit text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3" 
                icon={<ArrowRight />} 
                center 
                link={buttonUrl}
                target={buttonUrl?.startsWith('#') ? '_self' : '_blank'}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 