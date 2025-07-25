'use client'

import { useLanguageStore } from '@/store/languageStore'
import SeoPostsCarousel from './SeoPostsCarousel'

export default function OthersPosts() {
  const { t } = useLanguageStore()

  return (
    <SeoPostsCarousel
      title={`${t('blog.othersPosts')} 🔥`}
      excludeFeatured={true}
      postsPerPage={10}
      className="pb-20"
    />
  )
} 