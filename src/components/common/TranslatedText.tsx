'use client'

import React from 'react'
import { useLanguageStore } from '@/store/languageStore'
import DOMPurify from 'dompurify'

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
  const { t, tHtml } = useLanguageStore()

  // Validation : soit translationKey, soit content doit être fourni
  if (!translationKey && !content) {
    console.error('TranslatedText: Either translationKey or content must be provided')
    return <Component className={className}>Missing content</Component>
  }

  // Si on a du contenu direct
  if (content) {
    if (allowHtml) {
      // Sanitiser le contenu HTML avec DOMPurify
      const sanitizedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['br'],
        ALLOWED_ATTR: []
      })
      return (
        <Component 
          className={className}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      )
    }
    return (
      <Component className={className}>
        {content}
      </Component>
    )
  }

  // Si on a une clé de traduction
  if (translationKey) {
    if (allowHtml) {
      const htmlContent = tHtml(translationKey)
      return (
        <Component 
          className={className}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )
    }
    return (
      <Component className={className}>
        {t(translationKey)}
      </Component>
    )
  }

  return <Component className={className}>Error</Component>
} 