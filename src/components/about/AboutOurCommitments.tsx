'use client'

import Image from 'next/image'
import { useLanguageStore } from '@/store/languageStore'

export default function AboutOurCommitments() {
  const { t } = useLanguageStore()

  return (
    <section className="relative w-full py-16 md:py-24 bg-[rgb(19,19,19)]">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Colonne gauche */}
          <div className="space-y-8">
            {/* Image de la femme - Format paysage */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
              <Image
                src="/images/about/about_section1_photo1.webp"
                alt="Artiste InRealArt"
                fill
                className="object-cover"
                quality={90}
              />
            </div>
            
            {/* Nos engagements */}
            <div className="space-y-6">
            <h2 className="bricolage-grotesque text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                {t('about.ourCommitments.commitments.title')}
              </h2>
              
              <div className="space-y-4">
                <p className="text-white/90 text-lg leading-relaxed">
                  {t('about.ourCommitments.commitments.commitment1')}
                </p>
                
                <p className="text-white/90 text-lg leading-relaxed">
                  {t('about.ourCommitments.commitments.commitment2')}
                </p>
                
                <p className="text-white/90 text-lg leading-relaxed">
                  {t('about.ourCommitments.commitments.commitment3')}
                </p>
                
                <p className="text-white/90 text-lg leading-relaxed">
                  {t('about.ourCommitments.commitments.commitment4')}
                </p>
              </div>
            </div>
            
            {/* Texte Lorem ipsum */}
            <div className="text-white/90 leading-relaxed">
              <p className="text-lg">
                {t('about.ourCommitments.description')}
              </p>
            </div>
          </div>
          
          {/* Colonne droite */}
          <div className="relative">
            {/* Image de la peinture classique - Format portrait */}
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden">
              <Image
                src="/images/about/about_section1_photo2.webp"
                alt="Peinture classique"
                fill
                className="object-cover"
                quality={90}
              />
              
              {/* Texte superposé */}
              <div className="absolute inset-0 flex items-start justify-end p-8">
                <div className="text-right">
                  <h2 className="bricolage-grotesque text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight max-w-sm">
                    {t('about.ourCommitments.title')}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
