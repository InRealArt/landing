'use client'

import React, { useState, useEffect } from 'react'
import { useLanguageStore } from '@/store/languageStore'

interface TranslatedTextProps {
  translationKey?: string
  content?: string
  as?: React.ElementType
  className?: string
  allowHtml?: boolean
}

export default function TranslatedText({ 
  translationKey,
  content,
  as: Component = 'span', 
  className = '',
  allowHtml = false 
}: TranslatedTextProps) {
  const { t, language } = useLanguageStore()
  const [sanitizedContent, setSanitizedContent] = useState('')

  useEffect(() => {
    if (allowHtml && typeof window !== 'undefined') {
      // Importer DOMPurify uniquement côté client
      const importDOMPurify = async () => {
        const DOMPurify = (await import('dompurify')).default
        
        let contentToSanitize = ''
        
        if (content) {
          contentToSanitize = content
        } else if (translationKey) {
          contentToSanitize = t(translationKey)
        }
        
        if (contentToSanitize) {
          const sanitized = DOMPurify.sanitize(contentToSanitize, {
            ALLOWED_TAGS: ['br'],
            ALLOWED_ATTR: []
          })
          setSanitizedContent(sanitized)
        }
      }
      
      importDOMPurify()
    }
  }, [allowHtml, content, translationKey, t, language])

  // Validation : soit translationKey, soit content doit être fourni
  if (!translationKey && !content) {
    console.error('TranslatedText: Either translationKey or content must be provided')
    return <Component className={className}>Missing content</Component>
  }

  // Si HTML est autorisé et que nous avons du contenu sanitisé
  if (allowHtml && sanitizedContent) {
    return (
      <Component 
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    )
  }

  // Si HTML est autorisé mais pas encore sanitisé (côté serveur ou en cours de chargement)
  if (allowHtml) {
    const fallbackContent = content || (translationKey ? t(translationKey) : '')
    return (
      <Component className={className}>
        {fallbackContent}
      </Component>
    )
  }

  // Si on a du contenu direct sans HTML
  if (content) {
    return (
      <Component className={className}>
        {content}
      </Component>
    )
  }

  // Si on a une clé de traduction sans HTML
  if (translationKey) {
    return (
      <Component className={className}>
        {t(translationKey)}
      </Component>
    )
  }

  return <Component className={className}>Error</Component>
} 