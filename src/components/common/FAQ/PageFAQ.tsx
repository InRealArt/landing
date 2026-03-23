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
      <section className={`w-full py-32 px-10 max-w-screen-2xl mx-auto ${className}`}>
        <div className="flex flex-col md:flex-row gap-20">
          <div className="w-full md:w-1/3 animate-pulse">
            <div className="h-3 w-24 bg-[var(--border-light)] mb-8" />
            <div className="h-16 w-3/4 bg-[var(--border-light)] mb-6" />
            <div className="h-3 w-full bg-[var(--border-light)] mb-2" />
            <div className="h-3 w-2/3 bg-[var(--border-light)]" />
          </div>
          <div className="w-full md:w-2/3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-[var(--border-light)] py-8 animate-pulse">
                <div className="h-4 w-3/4 bg-[var(--border-light)]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (hasError) {
    return (
      <section className={`w-full py-32 px-10 max-w-screen-2xl mx-auto ${className}`}>
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
    <section className={`w-full py-32 px-10 max-w-screen-2xl mx-auto ${className}`}>
      <div className="flex flex-col md:flex-row gap-20">

        {/* Left column — title + CTA */}
        <div className="w-full md:w-1/3 md:sticky md:top-32 self-start" data-anim="faq-left">
          <span className="section-number">Questions</span>
          <h2 className="serif text-5xl md:text-6xl leading-tight mb-8">
            <TranslatedText
              as="span"
              translationKey={titleKey}
              className="italic text-[var(--gold-accent)]"
              allowHtml={true}
            />
          </h2>
          <TranslatedText
            as="p"
            translationKey={descriptionKey}
            className="text-[12px] text-[var(--gray-text)] leading-loose mb-8"
            allowHtml={true}
          />
          <Button
            text={t('buttons.viewGlobalFAQ')}
            additionalClassName="bg-purpleColor"
            link="/faq"
          />
        </div>

        {/* Right column — questions */}
        <div className="w-full md:w-2/3 border-t border-[var(--border-light)]">
          {sortedFaqItems.map((item, index) => (
            <Question
              key={`${item.title}-${index}`}
              question={item.title}
              answer={item.content}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default PageFAQ
