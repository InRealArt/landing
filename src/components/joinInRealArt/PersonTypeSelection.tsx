'use client'

import { ArrowRight } from "lucide-react"
import Button from "@/components/common/Button"
import { useLanguageStore } from '@/store/languageStore'
import TranslatedText from "@/components/common/TranslatedText"

export default function PersonTypeSelection() {
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

  return (
    <section className="w-full py-16 bg-[rgb(19,19,19)]">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectPersonType.map((personType, index) => (
            <div key={index} className="bg-cardBackground rounded-lg p-8 border border-white/20 flex flex-col justify-between">
              <h3 className="text-xl bricolage-grotesque font-medium mb-6">{personType.title}</h3>
              <p className="text-sm text-grayText mb-6 bricolage-grotesque">
                <TranslatedText 
                  translationKey={personType.description}
                  allowHtml={true}
                />
              </p>
              <Button 
                text={t('buttons.readMore')} 
                additionalClassName="bg-purpleColor w-full justify-center mt-auto" 
                icon={<ArrowRight />} 
                link={personType.link}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

