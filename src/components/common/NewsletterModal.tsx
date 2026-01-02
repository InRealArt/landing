'use client'

import { X, Mail } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { useLazyRecaptcha } from '@/hooks/useLazyRecaptcha'
import { toast } from 'sonner'
import { subscribeToNewsletter, type NewsletterActionResult } from '@/actions/newsletterActions'
import { useNewsletter } from '@/contexts/NewsletterContext'
import OptimizedImage from './OptimizedImage'
import Button from './Button'

const initialState: NewsletterActionResult = {
  success: false,
  message: '',
  errors: undefined
}

export default function NewsletterModal() {
  const { isModalOpen, closeModal, markAsNotInterested, onSubscriptionSuccess } = useNewsletter()
  const { t } = useLanguageStore()
  const { executeRecaptcha } = useLazyRecaptcha({ preloadOnInteraction: true, interactionTarget: 'form' })
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const [isMounted, setIsMounted] = useState(false)

  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Wrapper pour la server action compatible avec les bonnes pratiques
  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        // Générer le token reCAPTCHA (charge automatiquement si nécessaire)
        const recaptchaToken = await executeRecaptcha('newsletter_subscribe')
        
        if (!recaptchaToken) {
          toast.error('reCAPTCHA non disponible. Veuillez réessayer.')
          return
        }

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
  const handleNotInterested = () => {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-backgroundColor/50 backdrop-blur-sm p-4 "
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-4xl transform rounded-xl bg-cardBackground text-textColor shadow-2xl transition-all duration-300 ease-out overflow-hidden max-h-[95vh] border border-borderColor"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture */}
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 z-10 text-grayText hover:text-textColor transition-colors"
          aria-label="Fermer"
        >
          <X size={24} />
        </button>

        {/* Contenu en deux colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px] h-full">
          {/* Colonne gauche - Images */}
          <div className="relative bg-gradient-to-br from-purpleColor/20 to-purpleColor/10 p-6 flex items-center justify-center">
            <div className="relative w-[280px] h-[160px] md:h-[320px] md:w-[280px]">
              {/* Image de fond (décalée) */}
              <div className="absolute top-0 right-[25%] md:right-0 w-[80px] h-[120px] md:w-[180px] md:h-[220px] rounded-lg overflow-hidden shadow-xl z-10">
                <OptimizedImage
                  src="/images/newsletter/image_nl_2.webp"
                  alt="Newsletter illustration 2"
                  width={180}
                  height={220}
                  className="w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover"
                />
              </div>

              {/* Image de premier plan */}
              <div className="absolute bottom-0 left-[20%] md:left-0 w-[100px] h-[140px] md:w-[200px] md:h-[240px] rounded-lg overflow-hidden shadow-2xl z-20">
                <OptimizedImage
                  src="/images/newsletter/image_nl_1.webp"
                  alt="Newsletter illustration 1"
                  width={200}
                  height={240}
                  className="w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover"
                />
              </div>
            </div>
          </div>

          {/* Colonne droite - Contenu textuel */}
          <div className="p-6 flex flex-col justify-center">
            <div className="text-center">
              {/* Titre */}
              <h2 className="text-2xl font-bold mb-2 text-textColor">
                {t('newsletter.modal.title')}
              </h2>

              {/* Sous-titre */}
              <p className="text-grayText mb-2">
                {t('newsletter.modal.subtitle')}
              </p>

              {/* Description */}
              <p className="text-sm text-grayText mb-6">
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
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grayText" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('newsletter.modal.emailPlaceholder')}
                    disabled={isPending}
                    className="w-full pl-12 pr-4 py-4 bg-transparent border-2 border-borderColor rounded-lg text-textColor placeholder-grayText focus:outline-none focus:border-purpleColor transition-colors"
                    required
                  />
                </div>

                {/* Bouton de soumission */}
                <Button
                  type="submit"
                  disabled={isPending}
                  additionalClassName="w-full py-4 bg-purpleColor text-white rounded-lg hover:bg-purpleColor/90 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  text={isPending ? t('newsletter.modal.subscribing') : t('newsletter.modal.subscribeButton')}
                  center
                />
              </form>

              {/* Lien "pas intéressé" */}
              <div className="mt-4 text-center">
                <Button
                  action={handleNotInterested}
                  additionalClassName="text-xs text-grayText hover:text-textColor transition-colors underline bg-transparent border-none"
                  text={t('newsletter.modal.notInterested')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 