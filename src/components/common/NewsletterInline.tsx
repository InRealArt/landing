'use client'

import { useState, useTransition } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { useLazyRecaptcha } from '@/hooks/useLazyRecaptcha'
import { toast } from 'sonner'
import { subscribeToNewsletter } from '@/actions/newsletterActions'
import OptimizedImage from './OptimizedImage'


export default function NewsletterInline() {
  const { t } = useLanguageStore()
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
      <div className="max-w-screen-xl mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left column — artwork imagery */}
          <div className="relative flex items-center justify-center h-[360px] lg:h-[480px]">
            {/* Gold decorative frame offset behind */}
            <div className="absolute top-6 left-6 w-[200px] h-[260px] lg:w-[260px] lg:h-[340px] border border-gold-accent/30" aria-hidden="true" />

            {/* Background artwork — portrait orientation, offset top-right */}
            <div className="artwork-container absolute top-0 right-4 lg:right-8 w-[160px] h-[220px] lg:w-[220px] lg:h-[300px] artwork-image overflow-hidden z-10">
              <OptimizedImage
                src="/images/newsletter/image_nl_2.webp"
                alt="Newsletter illustration 2"
                width={220}
                height={300}
                className="w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover"
              />
            </div>

            {/* Foreground artwork — portrait orientation, offset bottom-left */}
            <div className="artwork-container absolute bottom-0 left-4 lg:left-8 w-[180px] h-[240px] lg:w-[240px] lg:h-[320px] artwork-image overflow-hidden z-20 shadow-2xl">
              <OptimizedImage
                src="/images/newsletter/image_nl_1.webp"
                alt="Newsletter illustration 1"
                width={240}
                height={320}
                className="w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover"
              />
            </div>

            {/* Gold accent line — vertical, leftmost edge */}
            <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-gold-accent/40" aria-hidden="true" />
          </div>

          {/* Right column — copy + form */}
          <div className="flex flex-col justify-center">
            <span className="section-number mb-6">{t('newsletter.modal.eyebrow')}</span>

            <h2 className="serif italic text-4xl lg:text-5xl xl:text-6xl text-textColor leading-tight mb-6">
              {t('newsletter.modal.title')}{' '}
              <em className="not-italic text-gold-accent">{t('newsletter.modal.titleAccent')}</em>
            </h2>

            <p className="montserrat text-[13px] text-grayText leading-loose mb-2 font-light">
              {t('newsletter.modal.subtitle')}
            </p>

            <p className="montserrat text-[11px] text-grayText leading-loose mb-10 font-light">
              {t('newsletter.modal.description')}
            </p>

            {/* Form */}
            <form action={handleSubmit} className="flex flex-col gap-0">
              {/* Hidden language field */}
              <input type="hidden" name="language" value={useLanguageStore.getState().language} />

              {/* Minimal underline input */}
              <div className="relative border-b border-borderColor focus-within:border-gold-accent transition-colors duration-300 mb-8">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.modal.emailPlaceholder')}
                  disabled={isPending}
                  className="w-full bg-transparent py-3 pr-4 text-textColor placeholder-grayText montserrat text-[13px] font-light focus:outline-none"
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
                  {isPending ? t('newsletter.modal.subscribing') : t('newsletter.modal.subscribeButton')}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
