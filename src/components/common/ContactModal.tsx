'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
}

export default function ContactModal({ isOpen, onClose, title, message }: ContactModalProps) {

  // Gestion de l'échappement pour fermer la modale
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-backgroundColor/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-cardBackground border border-white/20 rounded-xl p-8 mx-4 max-w-md w-full shadow-2xl">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-grayText hover:text-textColor transition-colors"
          aria-label="Fermer la modale"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Contenu */}
        <div className="text-center">
          <h3 className="text-2xl font-medium bricolage-grotesque text-textColor mb-6">
            {title}
          </h3>
          
          <p className="text-grayText leading-relaxed mb-6">
            {message}
          </p>
          
          <a
            href="mailto:teaminrealart@gmail.com"
            className="inline-flex items-center justify-center px-6 py-3 bg-purpleColor text-textColor rounded-lg hover:bg-purpleColor/90 transition-colors font-medium"
          >
            teaminrealart@gmail.com
          </a>
        </div>
      </div>
    </div>
  )
} 