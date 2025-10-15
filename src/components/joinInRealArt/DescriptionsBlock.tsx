'use client'

import TranslatedText from "@/components/common/TranslatedText"
import OptimizedContentImage from "@/components/common/OptimizedContentImage"
import { useTheme } from '@/contexts/ThemeContext'
import Button from '@/components/common/Button'
import { Phone } from 'lucide-react'

export default function DescriptionsBlock() {
  const { theme } = useTheme()

  return (
    <section className='w-full py-12 md:py-16 bg-backgroundColor'>
      <div className="max-w-90 xl:max-w-screen-xl mx-auto">
        {/* Titre principal */}

        {/* Container flex pour la disposition en quinconce */}
        <div className="flex flex-col gap-6 md:gap-8">

          {/* Premier bloc - Image à gauche, texte à droite */}
          <div className='rounded-2xl p-4 md:p-6 bg-cardBackground'>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="md:w-2/5">
                <div className={`relative w-full rounded-xl overflow-hidden ${theme === 'light' ? 'bg-gray-100' : 'bg-[rgb(20,20,20)]'} flex items-center justify-center`}>
                  <OptimizedContentImage
                    src="/images/joinInRealArt/joinInRealArt_desc2.webp"
                    alt="Description 2"
                    width={928}
                    height={1160}
                    className="w-3/4 h-auto object-contain"
                    isDecorative={false}
                  />
                  <div className={`absolute inset-0 border-2 rounded-xl pointer-events-none ${theme === 'light' ? 'border-gray-300' : 'border-white'}`}></div>
                </div>
              </div>
              <div className="md:w-3/5 flex items-center">
                <div>
                  <h1 className='text-xl md:text-2xl font-semibold text-textColor mb-4 bricolage-grotesque'>
                    <TranslatedText
                      translationKey="joinInRealArt.header.title2"
                    />
                  </h1>
                  <p className='text-sm md:text-base leading-relaxed text-grayText mb-6'>
                    <TranslatedText
                      translationKey="joinInRealArt.header.description2"
                      allowHtml={true}
                    />
                  </p>
                  <Button
                    text="Prendre RDV"
                    link="https://calendly.com/teaminrealart/plus-de-visibilite-plus-de-ventes"
                    target="_blank"
                    additionalClassName="bg-purpleColor w-fit"
                    icon={<Phone />}
                    iconBefore
                    data-umami-event="calendly-join-description-1-click"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Deuxième bloc - Texte à gauche, image à droite */}
          <div className='rounded-2xl p-4 md:p-6 bg-cardBackground'>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="md:w-3/5 flex items-center order-2 md:order-1">
                <div>
                  <h1 className='text-xl md:text-2xl font-semibold text-textColor mb-4 bricolage-grotesque '>
                    <TranslatedText
                      translationKey="joinInRealArt.header.title3"
                    />
                  </h1>
                  <p className='text-sm md:text-base leading-relaxed text-grayText mb-6'>
                    <TranslatedText
                      translationKey="joinInRealArt.header.description3"
                      allowHtml={true}
                    />
                  </p>
                  <Button
                    text="Prendre RDV"
                    link="https://calendly.com/teaminrealart/plus-de-visibilite-plus-de-ventes"
                    target="_blank"
                    additionalClassName="bg-purpleColor w-fit"
                    icon={<Phone />}
                    iconBefore
                    data-umami-event="calendly-join-description-2-click"
                  />
                </div>
              </div>
              <div className="md:w-2/5 order-1 md:order-2">
                <div className='relative w-full rounded-xl overflow-hidden bg-backgroundColor flex items-center justify-center'>
                  <OptimizedContentImage
                    src="/images/joinInRealArt/joinInRealArt_desc3.webp"
                    alt="Description 3"
                    width={774}
                    height={1161}
                    className="w-3/4 h-auto object-contain"
                    isDecorative={false}
                  />
                  <div className={`absolute inset-0 border-2 rounded-xl pointer-events-none ${theme === 'light' ? 'border-gray-300' : 'border-white'}`}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
