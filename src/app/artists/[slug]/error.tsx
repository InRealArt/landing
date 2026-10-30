'use client'

import { useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  const { t } = useTranslation()

  useEffect(() => {
    // Log l'erreur pour le debugging
    console.error('Erreur dans la page artiste:', error)
  }, [error])

  return (
    <div className="mt-headerSize text-center py-12 bg-backgroundColor text-textColor">
      <div className="max-w-md mx-auto">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold mb-2">
          {t('common.errorTitle')}
        </h2>
        <p className="text-textColor/70 mb-6">
          {t('common.artistPageError')}
        </p>
        <button
          onClick={reset}
          className="bg-backgroundColor text-textColor border border-textColor font-medium py-2 px-4 rounded-full hover:opacity-80 transition-opacity"
        >
          {t('common.retry')}
        </button>
      </div>
    </div>
  )
}
