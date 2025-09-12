'use client'

import { X, CheckCircle, Mail } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import Button from './Button'

interface CatalogSuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CatalogSuccessModal({ isOpen, onClose }: CatalogSuccessModalProps) {
  const { t } = useLanguageStore()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gradientFrom to-gradientTo rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-textColor/60 hover:text-textColor transition-colors"
          aria-label="Fermer"
        >
          <X size={24} />
        </button>

        {/* Contenu */}
        <div className="text-center">
          {/* Icône de succès */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purpleColor rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Titre */}
          <h3 className="text-2xl font-bold text-textColor mb-3">
            {t('presale.intro.successPopup.title')}
          </h3>

          {/* Message principal */}
          <p className="text-textColor/90 text-lg mb-2">
            {t('presale.intro.successPopup.message')}
          </p>

          {/* Sous-titre */}
          <p className="text-textColor/70 text-sm mb-6">
            {t('presale.intro.successPopup.subtitle')}
          </p>

          {/* Bouton de fermeture */}
          <Button
            text={t('presale.intro.successPopup.closeButton')}
            additionalClassName="bg-purpleColor"
            action={onClose}
            center
          />
        </div>
      </div>
    </div>
  )
}
