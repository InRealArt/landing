import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import { getServerTranslations } from '@/utils/serverTranslations'
import AgenceBriefPageClient from '@/components/agence/AgenceBriefPageClient'

const { t } = getServerTranslations('fr')

export const metadata: Metadata = generateStaticMetadata({
  title: t('agence.brief.metadata.title'),
  description: t('agence.brief.metadata.description'),
  keywords: ['agence créateurs', 'brief ugc', 'campagne influence', 'créateurs marques'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/agence/brief`,
})

export default function AgenceBriefPage() {
  return <AgenceBriefPageClient />
}
