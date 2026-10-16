import { getDetailedFaqPageData } from '@/actions/detailedFaqActions'
import PageFAQClient from './PageFAQClient'
import { generateFAQJsonLd } from '@/utils/metadata'

interface PageFAQProps {
  pageName: string
  titleKey?: string
  descriptionKey?: string
  className?: string
}

const PageFAQ = async ({
  pageName,
  titleKey = 'common.faq.title',
  descriptionKey = 'common.faq.description',
  className = ''
}: PageFAQProps) => {
  let initialData
  try {
    initialData = await getDetailedFaqPageData(pageName)
  } catch {
    return null
  }

  if (!initialData) {
    return null
  }

  // JSON-LD FAQPage (IRA-02) : mêmes données que le rendu, en français (langue servie par défaut)
  const faqJsonLd = generateFAQJsonLd(
    [...initialData.faqItems]
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        question: item.translations?.question?.fr || item.question,
        answer: item.translations?.answer?.fr || item.answer,
      }))
  )

  return (
    <>
      {initialData.faqItems.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      )}
      <PageFAQClient
        initialData={initialData}
        titleKey={titleKey}
        descriptionKey={descriptionKey}
        className={className}
      />
    </>
  )
}

export default PageFAQ
