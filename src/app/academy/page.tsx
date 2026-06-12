import AcademyHero from '@/components/academy/AcademyHero'
import AcademySection1 from '@/components/academy/AcademySection1'
import AcademySection2 from '@/components/academy/AcademySection2'
import AcademySection3 from '@/components/academy/AcademySection3'
import NewsletterInline from '@/components/common/NewsletterInline'
import PageFAQ from '@/components/common/FAQ/PageFAQ'
import { getLanguageIdByCode, getPublishedPosts } from '@/actions/seoPostActions'

export default async function AcademyPage() {
  const languageId = await getLanguageIdByCode('fr')
  const { posts } = languageId
    ? await getPublishedPosts(languageId, 100, 0, [], true)
    : { posts: [] }

  return (
    <>
      <AcademyHero />
      <AcademySection1 />
      <AcademySection2 posts={posts} />
      <AcademySection3 />
      <PageFAQ pageName="academy" />
      <NewsletterInline />
    </>
  )
}
