'use client'
import FAQ from './FAQ'
import { useLanguageStore } from '@/store/languageStore'

interface FAQWrapperProps {
  titleKey?: string;
  descriptionKey?: string;
  titre?: string;
  description?: string;
}

const FAQWrapper = ({ titleKey, descriptionKey, titre, description }: FAQWrapperProps) => {
  const { t } = useLanguageStore()
  
  // Si des clés de traduction sont fournies, les utiliser
  const finalTitle = titre || (titleKey ? t(titleKey) : undefined)
  const finalDescription = description || (descriptionKey ? t(descriptionKey) : undefined)
  
  return (
    <FAQ 
      titre={finalTitle}
      description={finalDescription}
      titleKey={titleKey}
      descriptionKey={descriptionKey}
    />
  )
}

export default FAQWrapper
