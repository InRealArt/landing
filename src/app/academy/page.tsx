import { Metadata } from 'next'
import { generateStaticMetadata, BASE_URL } from '@/utils/metadata'
import AcademyHero from '@/components/academy/AcademyHero'
import AcademySection1 from '@/components/academy/AcademySection1'
import AcademySection2 from '@/components/academy/AcademySection2'
import AcademySection3 from '@/components/academy/AcademySection3'
import NewsletterInline from '@/components/common/NewsletterInline'
import PageFAQ from '@/components/common/FAQ/PageFAQ'
import { getLanguageIdByCode, getPublishedPosts } from '@/actions/seoPostActions'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Académie — Ressources sur l\'art et le patrimoine',
  description: "Guides, articles et ressources de l'Académie InRealArt pour comprendre le marché de l'art, la collection et la transmission du patrimoine artistique.",
  canonical: `${BASE_URL}/academy`,
})

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
