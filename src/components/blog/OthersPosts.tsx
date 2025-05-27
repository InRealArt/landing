'use client'

import { useLanguageStore } from '@/store/languageStore'
import SeoPostsList from './SeoPostsList'

export default function OthersPosts() {
  const { t } = useLanguageStore()

  return (
    <SeoPostsList
      title={`${t('blog.othersPosts')} 🔥`}
      excludeFeatured={true}
      limit={1}
      showLoadMore={true}
      className="pb-20"
    />
  )
} 