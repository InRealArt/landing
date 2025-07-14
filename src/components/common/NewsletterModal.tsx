'use client'

import { X, Mail } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { toast } from 'sonner'
import { subscribeToNewsletter, type NewsletterActionResult } from '@/actions/newsletterActions'
import { useNewsletter } from '@/contexts/NewsletterContext'
import { useActionState } from 'react'
import Image from 'next/image'

const initialState: NewsletterActionResult = {
  success: false,
  message: '',
  errors: undefined
}

export default function NewsletterModal() {
  const { isModalOpen, closeModal, markAsNotInterested, onSubscriptionSuccess } = useNewsletter()
  const { t } = useLanguageStore()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const [isMounted, setIsMounted] = useState(false)
  
  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Wrapper pour la server action compatible avec les bonnes pratiques
  const handleSubmit = async (formData: FormData) => {
    if (!executeRecaptcha) {
      toast.error('reCAPTCHA non disponible. Veuillez réessayer.')
      return
    }

    startTransition(async () => {
      try {
        // Générer le token reCAPTCHA
        const recaptchaToken = await executeRecaptcha('newsletter_subscribe')
        
        // Ajouter le token au FormData
        formData.append('recaptchaToken', recaptchaToken)
        
        // Appeler la server action
        const result = await subscribeToNewsletter(formData)
        
        if (result.success) {
          toast.success(result.message)
          setEmail('')
          onSubscriptionSuccess()
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Erreur lors de l\'abonnement:', error)
        toast.error('Une erreur inattendue s\'est produite.')
      }
    })
  }

  // Gestion de l'échappement pour fermer la modale
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    if (isModalOpen && isMounted) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen, isMounted, closeModal])

  // Gestion du clic sur le backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  // Gestion du lien "pas intéressé"
  const handleNotInterested = (e: React.MouseEvent) => {
    e.preventDefault()
    markAsNotInterested()
  }

  // Ne pas rendre si pas encore monté (évite les problèmes d'hydratation)
  if (!isMounted) {
    return null
  }

  // Ne pas rendre si la modal n'est pas ouverte
  if (!isModalOpen) {
    return null
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative w-full max-w-4xl transform rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl transition-all duration-300 ease-out overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture */}
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 z-10 text-gray-400 hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X size={24} />
        </button>

        {/* Contenu en deux colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
          {/* Colonne gauche - Images */}
          <div className="relative bg-gradient-to-br from-purpleColor/20 to-purpleColor/10 p-6 flex items-center justify-center">
            <div className="relative w-[280px] h-[320px]">
              {/* Image de fond (décalée) */}
              <div className="absolute top-0 right-0 w-[180px] h-[220px] rounded-lg overflow-hidden shadow-xl z-10">
                <Image
                  src="/images/newsletter/image_nl_2.jpg"
                  alt="Newsletter illustration 2"
                  fill
                  className="object-cover"
                  sizes="180px"
                />
              </div>
              
              {/* Image de premier plan */}
              <div className="absolute bottom-0 left-0 w-[200px] h-[240px] rounded-lg overflow-hidden shadow-2xl z-20">
                <Image
                  src="/images/newsletter/image_nl_1.jpg"
                  alt="Newsletter illustration 1"
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
            </div>
          </div>

          {/* Colonne droite - Contenu textuel */}
          <div className="p-6 flex flex-col justify-center">
            <div className="text-center">
              {/* Titre */}
              <h2 className="text-2xl font-bold mb-2">
                {t('newsletter.modal.title')}
              </h2>
              
              {/* Sous-titre */}
              <p className="text-gray-300 mb-2">
                {t('newsletter.modal.subtitle')}
              </p>
              
              {/* Description */}
              <p className="text-sm text-gray-400 mb-6">
                {t('newsletter.modal.description')}
              </p>

              {/* Formulaire */}
              <form
                action={handleSubmit}
                className="space-y-4"
              >
                {/* Champ caché pour la langue */}
                <input type="hidden" name="language" value={useLanguageStore.getState().language} />
                
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('newsletter.modal.emailPlaceholder')}
                    disabled={isPending}
                    className="w-full pl-12 pr-4 py-4 bg-transparent border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purpleColor transition-colors"
                    required
                  />
                </div>
                
                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-4 bg-purpleColor text-white rounded-lg hover:bg-purpleColor/90 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? t('newsletter.modal.subscribing') : t('newsletter.modal.subscribeButton')}
                </button>
              </form>

              {/* Lien "pas intéressé" */}
              <div className="mt-4 text-center">
                <button
                  onClick={handleNotInterested}
                  className="text-xs text-gray-400 hover:text-gray-300 transition-colors underline"
                >
                  {t('newsletter.modal.notInterested')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 