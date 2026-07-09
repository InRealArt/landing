'use client'

import { useState, useTransition } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useLazyRecaptcha } from '@/hooks/useLazyRecaptcha'
import { toast } from 'sonner'
import { subscribeToNewsletter } from '@/actions/newsletterActions'
import OptimizedImage from './OptimizedImage'


export default function NewsletterInline() {
  const { t, language } = useTranslation()
  const { executeRecaptcha } = useLazyRecaptcha({ preloadOnInteraction: true, interactionTarget: 'form' })
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()

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
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Erreur lors de l\'abonnement:', error)
        toast.error('Une erreur inattendue s\'est produite.')
      }
    })
  }

  return (
    <section className="w-full bg-backgroundGrey border-y border-borderColor py-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left column — coupole baroque */}
          <div className="relative h-[360px] lg:h-[480px] overflow-hidden bg-black">

            {/* Full-bleed image — centrée sur la coupole */}
            <div className="absolute inset-0">
              <OptimizedImage
                src="/images/newsletter/newsletter.webp"
                alt="Coupole baroque dorée — In Real Art"
                width={800}
                height={960}
                className="w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:object-center"
              />
            </div>

            {/* Vignette radiale — assombrit les coins, révèle le vitrail central */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.60) 100%)' }}
              aria-hidden="true"
            />

            {/* Gradient bas — fondu vers le fond de section */}
            <div
              className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}
              aria-hidden="true"
            />

            {/* Cadre doré — outer */}
            <div
              className="absolute inset-5 border border-gold-accent/25 pointer-events-none"
              aria-hidden="true"
            />
            {/* Cadre doré — inner, décalé pour créer la profondeur */}
            <div
              className="absolute inset-9 border border-gold-accent/12 pointer-events-none"
              aria-hidden="true"
            />

            {/* Coin décoratif bas-gauche — ancre la composition */}
            <div className="absolute bottom-5 left-5 w-10 h-px bg-gold-accent/60" aria-hidden="true" />
            <div className="absolute bottom-5 left-5 w-px h-10 bg-gold-accent/60" aria-hidden="true" />

            {/* Coin décoratif haut-droit */}
            <div className="absolute top-5 right-5 w-10 h-px bg-gold-accent/60" aria-hidden="true" />
            <div className="absolute top-5 right-5 w-px h-10 bg-gold-accent/60" aria-hidden="true" />
          </div>

          {/* Right column — copy + form */}
          <div className="flex flex-col justify-center">
            <span className="section-number mb-6" suppressHydrationWarning>{t('newsletter.modal.eyebrow')}</span>

            <h2 className="serif italic text-4xl lg:text-5xl xl:text-6xl text-textColor leading-tight mb-6">
              <span suppressHydrationWarning>{t('newsletter.modal.title')}</span>{' '}
              <em className="not-italic text-gold-accent" suppressHydrationWarning>{t('newsletter.modal.titleAccent')}</em>
            </h2>

            <p className="montserrat text-sm text-grayText leading-loose mb-2 font-light" suppressHydrationWarning>
              {t('newsletter.modal.subtitle')}
            </p>

            <p className="montserrat text-sm text-grayText leading-loose mb-10 font-light" suppressHydrationWarning>
              {t('newsletter.modal.description')}
            </p>

            {/* Form */}
            <form action={handleSubmit} className="flex flex-col gap-0">
              {/* Hidden language field */}
              <input type="hidden" name="language" value={language} />

              {/* Minimal underline input */}
              <div className="relative border-b border-borderColor focus-within:border-gold-accent transition-colors duration-300 mb-8">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.modal.emailPlaceholder')}
                  suppressHydrationWarning
                  disabled={isPending}
                  className="w-full bg-transparent py-3 pr-4 text-textColor placeholder-grayText montserrat text-sm font-light focus:outline-none"
                  required
                />
              </div>

              {/* CTA button — gallery style */}
              <div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-cta border-textColor hover:bg-textColor hover:text-backgroundColor disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span suppressHydrationWarning>{isPending ? t('newsletter.modal.subscribing') : t('newsletter.modal.subscribeButton')}</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
