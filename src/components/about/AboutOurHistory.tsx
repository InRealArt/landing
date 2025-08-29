'use client'

import Image from 'next/image'
import { useLanguageStore } from '@/store/languageStore'
import Button from '@/components/common/Button'
import { ArrowRight } from 'lucide-react'

export default function AboutOurHistory() {
  const { t } = useLanguageStore()

  return (
    <section className="relative w-full py-16 md:py-24 bg-[rgb(19,19,19)]">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto">
        {/* Section des images d'art - deux images côte à côte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Image gauche - Paysage montagneux aquarelle */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
            <Image
              src="/images/about/about_section3_photo1.webp"
              alt="Paysage montagneux aquarelle"
              fill
              className="object-cover"
              quality={90}
            />
          </div>
          
          {/* Image droite - Scène tropicale avec Cupidon */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
            <Image
              src="/images/about/about_section3_photo2.webp"
              alt="Scène tropicale avec Cupidon"
              fill
              className="object-cover"
              quality={90}
            />
          </div>
        </div>

        {/* Section du contenu textuel */}
        <div className="space-y-8">
          {/* Titre principal */}
          <h2 className="bricolage-grotesque text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
            {t('about.ourHistory.title')}
          </h2>

          {/* Grille des textes avec disposition flexible */}
          <div className="flex flex-col gap-12 lg:gap-16">
            {/* Partie haute - deux colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                            {/* Colonne gauche */}
              <div className="space-y-6">
                <h3 className="bricolage-grotesque text-xl font-semibold text-white">
                  {t('about.ourHistory.title1')}
                </h3>
                <p className="text-white/90 text-lg leading-relaxed">
                  {t('about.ourHistory.text1')}
                </p>
              </div>

              {/* Colonne droite */}
              <div className="space-y-6">
                <h3 className="bricolage-grotesque text-xl font-semibold text-white">
                  {t('about.ourHistory.title2')}
                </h3>
                <p className="text-white/90 text-lg leading-relaxed">
                  {t('about.ourHistory.text2')}
                </p>
              
                </div>
              </div>

              {/* Partie basse - une colonne qui prend la largeur des deux */}
              <div className="w-full space-y-6">
                <h3 className="bricolage-grotesque text-xl font-semibold text-white">
                  {t('about.ourHistory.title3')}
                </h3>
                <p className="text-white/90 text-lg leading-relaxed">
                  {t('about.ourHistory.text3')}
                </p>
              </div>
          </div>

          {/* Bouton centré */}
          {/* <div className="text-center pt-8">
            <Button 
              text={t('about.section3.button')}
              additionalClassName="bg-purpleColor"
              center
              icon={<ArrowRight />}
            />
          </div> */}
        </div>
      </div>
    </section>
  )
}
