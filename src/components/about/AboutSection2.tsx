'use client'

import Image from 'next/image'
import { useLanguageStore } from '@/store/languageStore'

export default function AboutSection2() {
  const { t } = useLanguageStore()

  return (
    <section className="relative w-full py-16 md:py-24 bg-[rgb(19,19,19)]">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto relative">
        {/* Fond gris rectangulaire qui englobe le contenu - positionné encore plus bas */}
        <div className="absolute left-0 right-0 bottom-0 h-1/2 bg-gray-800 transform translate-y-8"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 px-8">
          
          {/* Colonne gauche - Image de la femme avec marges */}
          <div className="relative">
            <div className="relative w-4/5 mx-auto aspect-[3/4] rounded-2xl overflow-hidden">
              <Image
                src="/images/about/about_section2_photo1.webp"
                alt="Femme avec tenue artistique"
                fill
                className="object-cover"
                quality={90}
              />
            </div>
          </div>
          
          {/* Colonne droite - Contenu textuel avec marges */}
          <div className="space-y-8 flex flex-col justify-center w-4/5 mx-auto">
            {/* Titre principal */}
            <div className="text-white">
              <h2 className="bricolage-grotesque text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                {t('about.section2.title')}
              </h2>
            </div>
            
            {/* Premier paragraphe */}
            <div className="text-white/90 leading-relaxed">
              <p className="text-lg">
                {t('about.section2.description1')}
              </p>
            </div>
            
            {/* Deuxième paragraphe - sans fond distinctif */}
            <div className="text-white/80 leading-relaxed">
              <p className="text-base">
                {t('about.section2.description2')}
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
