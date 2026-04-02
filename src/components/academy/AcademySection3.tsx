'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
import { useTranslation } from '@/hooks/useTranslation'

export default function AcademySection3() {
  const { t } = useTranslation()

  return (
    <section className="relative w-full py-16 md:py-24 bg-[rgb(19,19,19)]">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto">
        <div className="bg-[rgb(30,30,30)] rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Colonne gauche - Contenu texte + bouton */}
            <div className="lg:w-3/5">
              {/* Petit titre en haut */}
              <p className="text-grayText text-sm font-medium mb-4">
                {t('academy.section3.smallTitle')}
              </p>
              
              {/* Titre principal */}
              <h2 className="text-5xl md:text-7xl serif italic leading-tight text-textColor mb-6">
                {t('academy.section3.mainTitle')}
              </h2>
              
              {/* Paragraphe descriptif */}
              <p className="text-grayText text-base md:text-lg leading-relaxed mb-8">
                {t('academy.section3.description')}
              </p>
              
              {/* Bouton */}
              <button className="btn-cta" type="button">
                {t('academy.section3.button')}
              </button>
            </div>
            
            {/* Colonne droite - Image */}
            <div className="lg:w-2/5">
              <OptimizedBackgroundImage
                src="/images/academy/academy_section3_image1.webp"
                alt="Art classique InRealArt"
                fill={true}
                className="w-full aspect-[3/4] rounded-2xl"
                quality={90}
                priority={false}
              />
            </div>
            
          </div>
        </div>
      </div>
    </section>
  )
}
