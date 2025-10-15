'use client'

import { useState, useEffect } from 'react'
import { X, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface StickyFooterProps {
  id: number
  title: string | null
  text: string | null
  textButton: string | null
  buttonUrl: string | null
  onClose?: () => void
}

export default function StickyFooter({
  id,
  title,
  text,
  textButton,
  buttonUrl,
  onClose
}: StickyFooterProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const handleButtonClick = () => {
    // Fermer le sticky footer quand on clique sur le bouton CTA
    handleClose()
  }


  useEffect(() => {
    // Vérifier si ce sticky footer a déjà été fermé
    const closedFooters = JSON.parse(localStorage.getItem('closedInRealArtStickyFooters') || '[]')
    if (!closedFooters.includes(id)) {
      // Délai d'apparition pour une meilleure UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [id])

  const handleClose = () => {
    setIsClosing(true)
    
    // Sauvegarder la fermeture dans le localStorage
    const closedFooters = JSON.parse(localStorage.getItem('closedInRealArtStickyFooters') || '[]')
    if (!closedFooters.includes(id)) {
      closedFooters.push(id)
      localStorage.setItem('closedInRealArtStickyFooters', JSON.stringify(closedFooters))
    }

    // Animation de fermeture
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }

  // Ne pas afficher si pas visible ou en cours de fermeture
  if (!isVisible || isClosing) {
    return null
  }

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-[9999]
        bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900
        text-white shadow-2xl border-t border-slate-700
        transform transition-all duration-300 ease-in-out
        pointer-events-auto
        ${isClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
      `}
    >
      {/* Bouton de fermeture - Positionné en haut à droite, en dehors du contenu */}
      <button
        onClick={handleClose}
        className="
          absolute top-4 right-4
          p-2 rounded-full
          bg-slate-800/80 hover:bg-slate-700
          border border-slate-600
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900
          z-20
          group
        "
        aria-label="Fermer le sticky footer"
      >
        <X className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
      </button>

      <div className="container mx-auto px-6 py-8">
        <div className="relative">
          {/* Contenu principal - Layout vertical */}
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Titre */}
            {title && (
              <h3 className="text-2xl font-bold leading-tight text-white">
                {title}
              </h3>
            )}

            {/* Texte */}
            {text && (
              <p className="text-lg text-slate-200 leading-relaxed max-w-3xl">
                {text}
              </p>
            )}

            {/* Bouton d'action */}
            {textButton && buttonUrl && (
              <div className="pt-4">
                {buttonUrl.startsWith('http') ? (
                  <a
                    href={buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleButtonClick}
                    className="
                      inline-flex items-center gap-4
                      bg-purpleColor border
                      p-4 rounded-xl
                      hover:bg-purpleColor/90
                      transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-purpleColor/50 focus:ring-offset-2 focus:ring-offset-slate-900
                      cursor-pointer
                      relative z-10
                      pointer-events-auto
                    "
                  >
                    <span className='unbounded font-semibold text-sm text-white'>{textButton}</span>
                    <ExternalLink className="w-5 h-5 text-white" />
                  </a>
                ) : (
                  <Link
                    href={buttonUrl}
                    onClick={handleButtonClick}
                    className="
                      inline-flex items-center gap-4
                      bg-purpleColor border
                      p-4 rounded-xl
                      hover:bg-purpleColor/90
                      transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-purpleColor/50 focus:ring-offset-2 focus:ring-offset-slate-900
                      cursor-pointer
                      relative z-10
                      pointer-events-auto
                    "
                  >
                    <span className='unbounded font-semibold text-sm text-white'>{textButton}</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Effet de scintillement subtil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 animate-pulse pointer-events-none" />
    </div>
  )
}

// Hook personnalisé pour gérer l'état global des sticky footers
export function useStickyFooter() {
  const [closedFooters, setClosedFooters] = useState<number[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('closedStickyFooters')
    if (stored) {
      setClosedFooters(JSON.parse(stored))
    }
  }, [])

  const isClosed = (id: number) => closedFooters.includes(id)

  const closeFooter = (id: number) => {
    const newClosedFooters = [...closedFooters, id]
    setClosedFooters(newClosedFooters)
    localStorage.setItem('closedInRealArtStickyFooters', JSON.stringify(newClosedFooters))
  }

  const resetClosedFooters = () => {
    setClosedFooters([])
    localStorage.removeItem('closedInRealArtStickyFooters')
  }

  return {
    isClosed,
    closeFooter,
    resetClosedFooters
  }
}
