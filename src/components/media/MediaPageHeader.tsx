'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function MediaPageHeader() {
  const { t } = useTranslation()

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-8 border-b" style={{ borderColor: 'var(--border-light)' }}>
      <span className="text-xs uppercase tracking-[0.4em] montserrat" style={{ color: 'var(--gray-text)' }}>
        {t('media.header.eyebrow')}
      </span>
      <h1 className="serif text-[clamp(2rem,6vw,3.75rem)] mt-4 italic" style={{ color: 'var(--text)' }}>
        {t('media.header.title')}
      </h1>
    </div>
  )
}
