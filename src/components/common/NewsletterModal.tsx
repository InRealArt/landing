'use client'

import { X } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { useLazyRecaptcha } from '@/hooks/useLazyRecaptcha'
import { toast } from 'sonner'
import { subscribeToNewsletter, type NewsletterActionResult } from '@/actions/newsletterActions'
import { useNewsletter } from '@/contexts/NewsletterContext'
import OptimizedImage from './OptimizedImage'

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-backgroundColor/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-3xl bg-backgroundColor border border-borderColor shadow-2xl overflow-hidden max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute right-5 top-5 z-10 text-grayText hover:text-textColor transition-colors duration-200"
          aria-label={t('newsletter.modal.close')}
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[480px]">

          {/* Left column — artwork images */}
          <div className="relative bg-backgroundGrey border-b md:border-b-0 md:border-r border-borderColor overflow-hidden flex items-center justify-center min-h-[240px] md:min-h-0">
            {/* Gold frame accent, offset */}
            <div
              className="absolute top-6 left-6 right-10 bottom-10 border border-gold-accent/25 pointer-events-none"
              aria-hidden="true"
            />

            {/* Background artwork */}
            <div className="artwork-container absolute top-4 right-4 md:right-6 w-[110px] h-[150px] md:w-[150px] md:h-[200px] artwork-image overflow-hidden z-10">
              <OptimizedImage
                src="/images/newsletter/image_nl_2.webp"
                alt="Newsletter illustration 2"
                width={150}
                height={200}
                className="w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover"
              />
            </div>

            {/* Foreground artwork */}
            <div className="artwork-container absolute bottom-4 left-4 md:left-6 w-[130px] h-[175px] md:w-[175px] md:h-[230px] artwork-image overflow-hidden z-20 shadow-xl">
              <OptimizedImage
                src="/images/newsletter/image_nl_1.webp"
                alt="Newsletter illustration 1"
                width={175}
                height={230}
                className="w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover"
              />
            </div>

            {/* Vertical gold accent line */}
            <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-gold-accent/40" aria-hidden="true" />
          </div>

          {/* Right column — copy + form */}
          <div className="p-8 lg:p-10 flex flex-col justify-center">
            <span className="section-number mb-5">{t('newsletter.modal.eyebrow')}</span>

            <h2 className="serif italic text-3xl lg:text-4xl text-textColor leading-tight mb-4">
              {t('newsletter.modal.title')}{' '}
              <em className="not-italic text-gold-accent">{t('newsletter.modal.titleAccent')}</em>
            </h2>

            <p className="montserrat text-[12px] text-grayText leading-loose mb-1 font-light">
              {t('newsletter.modal.subtitle')}
            </p>

            <p className="montserrat text-[11px] text-grayText leading-loose mb-8 font-light">
              {t('newsletter.modal.description')}
            </p>

            {/* Form */}
            <form action={handleSubmit} className="flex flex-col">
              {/* Hidden language field */}
              <input type="hidden" name="language" value={useLanguageStore.getState().language} />

              {/* Minimal underline input */}
              <div className="relative border-b border-borderColor focus-within:border-gold-accent transition-colors duration-300 mb-6">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.modal.emailPlaceholder')}
                  disabled={isPending}
                  className="w-full bg-transparent py-3 pr-4 text-textColor placeholder-grayText montserrat text-[12px] font-light focus:outline-none"
                  required
                />
              </div>

              {/* CTA button */}
              <button
                type="submit"
                disabled={isPending}
                className="btn-cta border-textColor hover:bg-textColor hover:text-backgroundColor disabled:opacity-40 disabled:cursor-not-allowed self-start"
              >
                {isPending ? t('newsletter.modal.subscribing') : t('newsletter.modal.subscribeButton')}
              </button>
            </form>

            {/* Not interested link */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleNotInterested}
                className="montserrat text-[10px] text-grayText hover:text-textColor transition-colors duration-200 tracking-[0.15em] uppercase"
              >
                {t('newsletter.modal.notInterested')}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
