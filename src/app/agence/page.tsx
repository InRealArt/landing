import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import { getServerTranslations } from '@/utils/serverTranslations'
import AgencePage from '@/components/agence/AgencePage'

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

export default function Page() {
  return <AgencePage />
}
