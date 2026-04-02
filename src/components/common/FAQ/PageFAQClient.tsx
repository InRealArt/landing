'use client'
import { useTranslation } from '@/hooks/useTranslation'
import Question from './subcomponents/Question'
import TranslatedText from '@/components/common/TranslatedText'
import Button from '@/components/common/Button'
import { DetailedFaqPageData } from '@/actions/detailedFaqActions'

interface PageFAQClientProps {
  initialData: DetailedFaqPageData
  titleKey?: string
  descriptionKey?: string
  className?: string
}

const PageFAQClient = ({
  initialData,
  titleKey = 'common.faq.title',
  descriptionKey = 'common.faq.description',
  className = ''
}: PageFAQClientProps) => {
  const { t, language } = useTranslation()

  // Traduire les items
  const translatedFaqItems = initialData.faqItems.map(item => {
    const lang = language.toLowerCase()
    const question = item.translations?.question?.[lang] || item.question
    const answer = item.translations?.answer?.[lang] || item.answer

    return {
      title: question,
      content: answer,
      order: item.order
    }
  })

  const sortedFaqItems = translatedFaqItems.sort((a, b) => a.order - b.order)

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

export default PageFAQClient
