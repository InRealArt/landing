'use client'

import { Suspense } from 'react'
import { NewsletterProvider } from '@/contexts/NewsletterContext'
import NewsletterModal from './NewsletterModal'

interface NewsletterManagerProps {
  delayInSeconds?: number
  disabled?: boolean
}

export default function NewsletterManager({ 
  delayInSeconds = 30, 
  disabled = false 
}: NewsletterManagerProps) {
  return (
    <NewsletterProvider delayInSeconds={delayInSeconds} disabled={disabled}>
      <Suspense fallback={null}>
        <NewsletterModal />
      </Suspense>
    </NewsletterProvider>
  )
} 