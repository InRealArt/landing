import { Suspense } from 'react'
import { getFaqs } from '@/actions/faqActions'
import FAQSkeleton from './FAQSkeleton'
import FAQClient from './FAQClient'

interface FAQWrapperProps {
  titleKey?: string
  descriptionKey?: string
  titre?: string
  description?: string
}

export default async function FAQWrapper({ titleKey, descriptionKey, titre, description }: FAQWrapperProps) {
  // faqs are already sorted by order ASC from the server action
  const faqs = await getFaqs()

  return (
    <Suspense fallback={<FAQSkeleton />}>
      <FAQClient
        faqs={faqs}
        titleKey={titleKey}
        descriptionKey={descriptionKey}
        titre={titre}
        description={description}
      />
    </Suspense>
  )
}
