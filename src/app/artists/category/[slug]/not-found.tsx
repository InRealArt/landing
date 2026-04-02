'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function CategoryNotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-backgroundColor text-textColor flex items-center justify-center">
      <div className="text-center">
        <h1 className="bricolage-grotesque text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-6">{t('artists.notFound.title')}</h2>
        <p className="text-textColor/70 mb-8 max-w-md mx-auto">
          {t('artists.notFound.description')}
        </p>
        <div className="space-x-4">
          <Link
            href="/artists"
            className="inline-block bg-backgroundColor text-textColor px-6 py-3 rounded-full font-semibold hover:bg-backgroundColor/90 transition-colors"
          >
            {t('artists.notFound.viewAllArtists')}
          </Link>
          <Link
            href="/"
            className="inline-block border border-white text-textColor px-6 py-3 rounded-full font-semibold hover:bg-backgroundColor hover:text-textColor transition-colors"
          >
            {t('artists.notFound.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}
