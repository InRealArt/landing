import BlockFaq from './BlockFaq'
import { getServerTranslations } from '@/utils/serverTranslations'

interface BlockFaqServerProps {
  titleKey?: string
  descriptionKey?: string
  buttonKey?: string
  link?: string
  language?: 'fr' | 'en'
}

export default function BlockFaqServer({ 
  titleKey = 'common.faq.title',
  descriptionKey = 'common.faq.description',
  buttonKey = 'home.faq.button',
  link = 'faq',
  language = 'fr'
}: BlockFaqServerProps) {
  const { t } = getServerTranslations(language)
  
  const title = t(titleKey)
  const description = t(descriptionKey)
  const buttonText = t(buttonKey)

  return (
    <BlockFaq 
      title={title}
      description={description}
      buttonText={buttonText}
      link={link}
    />
  )
}
