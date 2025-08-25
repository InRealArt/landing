'use client'

import { useEffect } from 'react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    // Log l'erreur pour le debugging
    console.error('Erreur dans la page artiste:', error)
  }, [error])

  return (
    <div className="mt-headerSize text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Une erreur est survenue
        </h2>
        <p className="text-gray-600 mb-6">
          Impossible to load the artist page. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
