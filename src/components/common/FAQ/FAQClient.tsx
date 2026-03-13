'use client'

import { useLanguageStore } from '@/store/languageStore'
import Button from '@/components/common/Button'
import Question from './subcomponents/Question'
import { FaqData } from '@/actions/faqActions'

interface FAQClientProps {
  faqs: FaqData[]
  titleKey?: string
  descriptionKey?: string
  titre?: string
  description?: string
}

export default function FAQClient({
  faqs,
  titleKey,
  descriptionKey,
  titre,
  description
}: FAQClientProps) {
  const t = useLanguageStore(state => state.t)

  const faqTitle = titre ?? (titleKey ? t(titleKey) : t('faq.page.title'))
  const faqDescription = description ?? (descriptionKey ? t(descriptionKey) : t('faq.page.description'))

  return (
    <section className="w-full m-auto mt-36 flex flex-col md:flex-row gap-16 max-w-90 xl:max-w-screen-xl">
      <div className="w-full md:w-1/3">
        <h1 className="text-6xl md:text-6xl serif"><span className="italic text-gold-accent">{faqTitle}</span></h1>
        <p className="mt-8">{faqDescription}</p>
        <Button
          text={`${t('buttons.readMore')} ${t('nav.faq')}`}
          additionalClassName="bg-purpleColor mt-8"
          link="/faq"
        />
      </div>
      <div className="h-full w-full md:w-2/3">
        {faqs.map((item) => (
          <Question key={item.id} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  )
}
