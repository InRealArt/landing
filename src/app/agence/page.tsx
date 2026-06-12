import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import { getServerTranslations } from '@/utils/serverTranslations'
import AgencePage from '@/components/agence/AgencePage'
import { getTopUgcArtists } from '@/actions/ugcActions'
import NewsletterInline from '@/components/common/NewsletterInline'
import AgenceFAQ from '@/components/agence/AgenceFAQ'

const { t } = getServerTranslations('fr')

export const metadata: Metadata = generateStaticMetadata({
  title: t('agence.metadata.title'),
  description: t('agence.metadata.description'),
  keywords: [
    'agence créateurs',
    'ugc premium',
    'influenceurs art',
    'campagnes créateurs',
    'contenu premium marque',
    'agence nano-influenceurs',
  ],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/agence`,
})

export default async function Page() {
  const topArtists = await getTopUgcArtists(4)
  return (
    <>
      <AgencePage topArtists={topArtists} />
      <AgenceFAQ />
      <NewsletterInline />
    </>
  )
}
