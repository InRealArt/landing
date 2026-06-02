import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import { getServerTranslations } from '@/utils/serverTranslations'
import CapitalContactPage from '@/components/usecase/capital/CapitalContactPage'

const { t } = getServerTranslations('fr')

export const metadata: Metadata = generateStaticMetadata({
  title: t('usecase.capital.contact.metadata.title'),
  description: t('usecase.capital.contact.metadata.description'),
  keywords: ['leasing art entreprise', 'contact capital inrealart', 'investissement art', 'LOA art'],
  canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://inrealart.com'}/usecase/capital/contact`,
})

export default function Page() {
  return <CapitalContactPage />
}
