'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
import { useLanguageStore } from '@/store/languageStore'

export default function AboutOurCommitments() {
  const { t } = useLanguageStore()

  return (
    <section className="relative w-full py-16 md:py-24">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Colonne gauche */}
          <div className="space-y-8">
            {/* Image de la femme - Format paysage */}
            <OptimizedBackgroundImage
              src="/images/about/about_section1_photo1.webp"
              alt="Artiste InRealArt"
              fill={true}
              className="w-full aspect-[16/9] rounded-2xl"
              quality={90}
              priority={false}
            />
            
            {/* Nos engagements */}
            <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl serif italic leading-tight">
                {t('about.ourCommitments.commitments.title')}
              </h2>
              
              <div className="space-y-4">
                <p className="text-textColor/90 text-lg leading-relaxed">
                  {t('about.ourCommitments.commitments.commitment1')}
                </p>
                
                <p className="text-textColor/90 text-lg leading-relaxed">
                  {t('about.ourCommitments.commitments.commitment2')}
                </p>
                
                <p className="text-textColor/90 text-lg leading-relaxed">
                  {t('about.ourCommitments.commitments.commitment3')}
                </p>
                
                <p className="text-textColor/90 text-lg leading-relaxed">
                  {t('about.ourCommitments.commitments.commitment4')}
                </p>
              </div>
            </div>
            
            {/* Texte Lorem ipsum */}
            <div className="text-textColor/90 leading-relaxed">
              <p className="text-lg">
                {t('about.ourCommitments.description')}
              </p>
            </div>
          </div>
          
          {/* Colonne droite */}
          <div className="relative">
            {/* Image de la peinture classique - Format portrait */}
            <OptimizedBackgroundImage
              src="/images/about/about_section1_photo2.webp"
              alt="Peinture classique"
              fill={true}
              className="w-full aspect-[3/4] rounded-2xl"
              quality={90}
              priority={false}
            >
              {/* Texte superposé */}
              <div className="flex items-start justify-end p-8 h-full">
                <div className="text-right">
                  <h2 className="text-5xl md:text-7xl serif italic leading-tight text-white max-w-sm">
                    {t('about.ourCommitments.title')}
                  </h2>
                </div>
              </div>
            </OptimizedBackgroundImage>
          </div>
          
        </div>
      </div>
    </section>
  )
}
