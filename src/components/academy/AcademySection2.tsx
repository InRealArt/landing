'use client'

import { useLanguageStore } from '@/store/languageStore'
import SeoPostsCarousel from '../blog/SeoPostsCarousel'

export default function AcademySection2() {
  const { t } = useLanguageStore()

  return (
    <section className="relative w-full py-16 md:py-24 bg-[rgb(19,19,19)]">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto">
        {/* Titre avec la même police et fonte que AcademySection1 */}
        <h2 className="bricolage-grotesque text-3xl md:text-4xl lg:text-5xl font-bold text-white text-left mb-12">
          {t('academy.section2.title')}
        </h2>
        
        {/* Carousel des articles */}
        <SeoPostsCarousel
          title="" // Pas de titre ici car on l'a mis au-dessus
          excludeFeatured={true}
          postsPerPage={9}
          className="pb-20"
        />
      </div>
    </section>
  )
}
