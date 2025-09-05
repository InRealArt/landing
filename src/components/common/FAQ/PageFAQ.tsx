'use client'
import { useEffect } from 'react'
import { useDetailedFaqStore } from '@/store/useDetailedFaqStore'
import { useLanguageStore } from '@/store/languageStore'
import Question from './subcomponents/Question'
import { titleClassName } from '@/utils/classes'
import Button from '@/components/common/Button'
import TranslatedText from '@/components/common/TranslatedText'
import { ArrowRight } from 'lucide-react'

interface PageFAQProps {
  pageName: string
  titleKey?: string
  descriptionKey?: string
  className?: string
}

const PageFAQ = ({ 
  pageName, 
  titleKey = 'common.faq.title', 
  descriptionKey = 'common.faq.description',
  className = ''
}: PageFAQProps) => {
  const { rawFaqData, isLoading, hasError, fetchDetailedFaqPageData, getTranslatedFaqItems } = useDetailedFaqStore()
  const { t, language } = useLanguageStore()
  
  useEffect(() => {
    // Récupérer les données brutes avec toutes les traductions
    fetchDetailedFaqPageData(pageName)
  }, [fetchDetailedFaqPageData, pageName])
  
  // Obtenir les items traduits dans la langue actuelle
  const translatedFaqItems = getTranslatedFaqItems()
  
  // Trier les items par ordre si disponible
  const sortedFaqItems = translatedFaqItems.sort((a, b) => {
    // Si les items ont un ordre, les trier par ordre
    if ('order' in a && 'order' in b) {
      return (a as any).order - (b as any).order
    }
    return 0
  })

  if (isLoading) {
    return (
      <section className={`w-full m-auto mt-36 flex flex-col gap-16 max-w-90 xl:max-w-screen-xl ${className}`}>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-700 rounded w-1/3 mb-8"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (hasError) {
    return (
      <section className={`w-full m-auto mt-36 flex flex-col gap-16 max-w-90 xl:max-w-screen-xl ${className}`}>
        <div className="text-red-500">
          <TranslatedText
            as="p"
            translationKey="common.error"
          />
        </div>
      </section>
    )
  }

  if (sortedFaqItems.length === 0) {
    return null // Ne rien afficher s'il n'y a pas de FAQ
  }

  return (
    <section className={`w-full m-auto mt-36 flex flex-col md:flex-row gap-16 max-w-90 xl:max-w-screen-xl ${className}`}>
      <div className='w-full md:w-1/3'>
        <TranslatedText
          as="h2"
          translationKey={titleKey}
          className={titleClassName}
          allowHtml={true}
        />
        <TranslatedText
          as="p"
          translationKey={descriptionKey}
          className="mt-8"
          allowHtml={true}
        />
        <Button
          text={t('buttons.viewGlobalFAQ')}
          link="/faq"
          additionalClassName="bg-purpleColor mt-6"
          icon={<ArrowRight />}
        />
      </div>
      <div className='h-full w-full md:w-2/3'>
        {sortedFaqItems.map((item, index) => (
          <Question 
            key={`${item.title}-${index}`} 
            question={item.title} 
            answer={item.content} 
          />
        ))}
      </div>
    </section>
  )
}

export default PageFAQ
