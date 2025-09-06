'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
import { useLanguageStore } from '@/store/languageStore'

export default function AcademySection1() {
  const { t } = useLanguageStore()

  return (
    <section className="relative w-full py-16 md:py-24 bg-[rgb(19,19,19)]">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto">
        {/* Titre principal */}
        <h2 className="bricolage-grotesque text-3xl md:text-4xl lg:text-5xl font-bold text-textColor text-left mb-12">
          {t('academy.section1.mainTitle')}
        </h2>
        
        {/* Container flex pour la disposition */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Colonne gauche - moins large */}
          <div className="lg:w-2/5">
            <div className="bg-[rgb(30,30,30)] rounded-2xl p-6 h-full">
              <OptimizedBackgroundImage
                src="/images/academy/academy_section1_image1.webp"
                alt="Sublimez votre intérieur"
                fill={true}
                className="w-full aspect-[3/4] rounded-xl mb-6"
                quality={90}
                priority={false}
              >
                <div className="absolute inset-0 border-2 border-white rounded-xl"></div>
              </OptimizedBackgroundImage>
              <h3 className="bricolage-grotesque text-2xl md:text-3xl font-bold text-textColor mb-4">
                {t('academy.section1.block1.title')}
              </h3>
              <p className="text-textColor/90 text-base leading-relaxed">
                {t('academy.section1.block1.description')}
              </p>
            </div>
          </div>
          
          {/* Colonne droite - plus large, 3 blocs empilés */}
          <div className="lg:w-3/5 flex flex-col gap-6">
            
            {/* Premier bloc droit - titre + texte à gauche, image à droite */}
            <div className="bg-[rgb(30,30,30)] rounded-2xl p-6">
              <div className="flex gap-6">
                <div className="w-1/2">
                  <h3 className="bricolage-grotesque text-xl md:text-2xl font-bold text-textColor mb-3">
                    {t('academy.section1.block2.title')}
                  </h3>
                  <p className="text-textColor/90 text-sm leading-relaxed">
                    {t('academy.section1.block2.description')}
                  </p>
                </div>
                <div className="w-1/2">
                  <OptimizedBackgroundImage
                    src="/images/academy/academy_section1_image2.webp"
                    alt="Valorisez votre espace professionnel"
                    fill={true}
                    className="w-full aspect-[4/3] rounded-xl"
                    quality={90}
                    priority={false}
                  >
                    <div className="absolute inset-0 border-2 border-white rounded-xl"></div>
                  </OptimizedBackgroundImage>
                </div>
              </div>
            </div>
            
            {/* Deuxième bloc droit - titre + texte + image */}
            <div className="bg-[rgb(30,30,30)] rounded-2xl p-6">
              <div className="flex gap-6">
                <div className="w-1/2">
                  <h3 className="bricolage-grotesque text-xl md:text-2xl font-bold text-textColor mb-3">
                    {t('academy.section1.block3.title')}
                  </h3>
                  <p className="text-textColor/90 text-sm leading-relaxed mb-4">
                    {t('academy.section1.block3.description')}
                  </p>
                  <OptimizedBackgroundImage
                    src="/images/academy/academy_section1_image3.webp"
                    alt="Créez des moments inoubliables"
                    fill={true}
                    className="w-full aspect-[4/3] rounded-xl"
                    quality={90}
                    priority={false}
                  >
                    <div className="absolute inset-0 border-2 border-white rounded-xl"></div>
                  </OptimizedBackgroundImage>
                </div>
                <div className="w-1/2">
                  <OptimizedBackgroundImage
                    src="/images/academy/academy_section1_image4.webp"
                    alt="L'art au service du mieux-être"
                    fill={true}
                    className="w-full aspect-[4/3] rounded-xl mb-4"
                    quality={90}
                    priority={false}
                  >
                    <div className="absolute inset-0 border-2 border-white rounded-xl"></div>
                  </OptimizedBackgroundImage>
                  <h3 className="bricolage-grotesque text-xl md:text-2xl font-bold text-textColor mb-3">
                    {t('academy.section1.block4.title')}
                  </h3>
                  <p className="text-textColor/90 text-sm leading-relaxed">
                    {t('academy.section1.block4.description')}
                  </p>
                </div>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
    </section>
  )
}
