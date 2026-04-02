'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-backgroundColor text-textColor flex items-center justify-center">
      <div className="text-center">
        <h1 className="bricolage-grotesque text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-6">{t('notFound.title')}</h2>
        <p className="text-textColor/70 mb-8 max-w-md mx-auto">
          {t('notFound.description')}
        </p>
        <Link
          href="/"
          className="inline-block bg-backgroundColor text-textColor border border-textColor px-6 py-3 rounded-full font-semibold hover:opacity-80 transition-opacity"
        >
          {t('notFound.backToHome')}
        </Link>
      </div>
    </div>
  )
}
