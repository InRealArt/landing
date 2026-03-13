'use client'
import { useEffect } from 'react'
import { useDetailedFaqStore } from '@/store/useDetailedFaqStore'
import { useLanguageStore } from '@/store/languageStore'
import Question from './subcomponents/Question'
import TranslatedText from '@/components/common/TranslatedText'
import Button from '@/components/common/Button'

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
    fetchDetailedFaqPageData(pageName)
  }, [fetchDetailedFaqPageData, pageName])

  const translatedFaqItems = getTranslatedFaqItems()

  const sortedFaqItems = translatedFaqItems.sort((a, b) => {
    if ('order' in a && 'order' in b) {
      return (a as any).order - (b as any).order
    }
    return 0
  })

  if (isLoading) {
    return (
      <section className={`w-full m-auto mt-36 flex flex-col md:flex-row gap-16 max-w-90 xl:max-w-screen-xl ${className}`}>
        <div className="w-full md:w-1/3 animate-pulse">
          <div className="h-12 w-3/4 bg-borderColor rounded mb-8" />
          <div className="h-4 w-full bg-borderColor rounded mb-2" />
          <div className="h-4 w-2/3 bg-borderColor rounded" />
        </div>
        <div className="h-full w-full md:w-2/3 space-y-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-borderColor py-6 animate-pulse">
              <div className="h-5 w-3/4 bg-borderColor rounded" />
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
    return null
  }

  return (
    <section className={`w-full m-auto mt-36 flex flex-col md:flex-row gap-16 max-w-90 xl:max-w-screen-xl ${className}`}>
      <div className="w-full md:w-1/3">
        <h2 className="text-6xl md:text-6xl serif">
          <TranslatedText
            as="span"
            translationKey={titleKey}
            className="italic text-gold-accent"
            allowHtml={true}
          />
        </h2>
        <TranslatedText
          as="p"
          translationKey={descriptionKey}
          className="mt-8"
          allowHtml={true}
        />
        <Button
          text={t('buttons.viewGlobalFAQ')}
          additionalClassName="bg-purpleColor mt-8"
          link="/faq"
        />
      </div>

      {/* Right column — questions */}
      <div className="h-full w-full md:w-2/3">
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
