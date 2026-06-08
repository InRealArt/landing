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
  let initialData
  try {
    initialData = await getDetailedFaqPageData(pageName)
  } catch {
    return null
  }

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
