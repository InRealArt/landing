'use client'

import { useLanguageStore } from '@/store/languageStore'
import TranslatedText from "@/components/common/TranslatedText"
import OptimizedContentImage from "@/components/common/OptimizedContentImage"

export default function DescriptionsBlock() {
  const { t } = useLanguageStore()

  return (
    <section className="w-full py-12 md:py-16 bg-[rgb(19,19,19)]">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto">
        {/* Titre principal */}
        
        {/* Container flex pour la disposition en quinconce */}
        <div className="flex flex-col gap-6 md:gap-8">
          
          {/* Premier bloc - Image à gauche, texte à droite */}
          <div className="bg-[rgb(30,30,30)] rounded-2xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="md:w-2/5">
                <div className="relative w-full rounded-xl overflow-hidden bg-[rgb(20,20,20)]">
                  <OptimizedContentImage
                    src="/images/joinInRealArt/joinInRealArt_desc2.webp"
                    alt="Description 2"
                    width={928}
                    height={1160}
                    className="w-full h-auto object-contain"
                    isDecorative={false}
                  />
                  <div className="absolute inset-0 border-2 border-white rounded-xl pointer-events-none"></div>
                </div>
              </div>
              <div className="md:w-3/5 flex items-center">
                <div>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    <TranslatedText 
                      translationKey="joinInRealArt.header.description2"
                      allowHtml={true}
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Deuxième bloc - Texte à gauche, image à droite */}
          <div className="bg-[rgb(30,30,30)] rounded-2xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="md:w-3/5 flex items-center order-2 md:order-1">
                <div>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    <TranslatedText 
                      translationKey="joinInRealArt.header.description3"
                      allowHtml={true}
                    />
                  </p>
                </div>
              </div>
              <div className="md:w-2/5 order-1 md:order-2">
                <div className="relative w-full rounded-xl overflow-hidden bg-[rgb(20,20,20)]">
                  <OptimizedContentImage
                    src="/images/joinInRealArt/joinInRealArt_desc3.webp"
                    alt="Description 3"
                    width={774}
                    height={1161}
                    className="w-full h-auto object-contain"
                    isDecorative={false}
                  />
                  <div className="absolute inset-0 border-2 border-white rounded-xl pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
