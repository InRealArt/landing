'use client'

import { useTranslation } from '@/hooks/useTranslation'
import SeoPostsCarousel from '../blog/SeoPostsCarousel'
import type { SeoPost } from '@/types/seoPost'

interface AcademySection2Props {
  posts: SeoPost[]
}

export default function AcademySection2({ posts }: AcademySection2Props) {
  const { t } = useTranslation()

  return (
    <section className="relative w-full py-16 md:py-24 bg-[rgb(19,19,19)]">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto">
        <h2 className="text-5xl md:text-7xl serif italic leading-tight text-textColor text-left mb-12">
          {t('academy.section2.title')}
        </h2>

        <SeoPostsCarousel
          title=""
          posts={posts}
          postsPerPage={9}
          className="pb-20"
        />
      </div>
    </section>
  )
}
