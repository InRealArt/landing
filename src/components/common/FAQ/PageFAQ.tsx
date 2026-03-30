import { getDetailedFaqPageData } from '@/actions/detailedFaqActions'
import PageFAQClient from './PageFAQClient'

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
  const initialData = await getDetailedFaqPageData(pageName)

  if (!initialData) {
    return null
  }

  return (
    <PageFAQClient
      initialData={initialData}
      titleKey={titleKey}
      descriptionKey={descriptionKey}
      className={className}
    />
  )
}

export default PageFAQ
