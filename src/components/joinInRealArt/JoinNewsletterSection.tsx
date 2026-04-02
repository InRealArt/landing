'use client'

import { useState, useTransition } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useTheme } from '@/contexts/ThemeContext'
import { useLazyRecaptcha } from '@/hooks/useLazyRecaptcha'
import { subscribeToNewsletter } from '@/actions/newsletterActions'
import { toast } from 'sonner'

export default function JoinNewsletterSection() {
  const { t, language } = useTranslation()
  const { theme } = useTheme()
  const { executeRecaptcha } = useLazyRecaptcha({ preloadOnInteraction: true, interactionTarget: 'form' })
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const recaptchaToken = await executeRecaptcha('newsletter_subscribe')
        if (!recaptchaToken) {
          toast.error('reCAPTCHA non disponible. Veuillez réessayer.')
          return
        }
        formData.append('recaptchaToken', recaptchaToken)
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

  const sectionBg = theme === 'light' ? 'bg-[#f8f8f8]' : 'bg-[rgb(20,20,20)]'

  return (
    <section className={`py-16 md:py-24 lg:py-40 px-4 sm:px-6 lg:px-10 ${sectionBg}`}>
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-[family-name:var(--font-cormorant)] font-light italic text-textColor mb-8 md:mb-12 leading-tight">
          {t('joinInRealArt.newsletter.title')}
        </h3>

        <form
          action={handleSubmit}
          className="flex flex-col md:flex-row gap-6 justify-center items-stretch"
        >
          {/* Hidden language field */}
          <input type="hidden" name="language" value={language} />

          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('joinInRealArt.newsletter.placeholder').toUpperCase()}
            required
            disabled={isPending}
            className={[
              'flex-1 min-w-0 px-6 py-4 text-[11px] uppercase tracking-[0.3em] font-light',
              'bg-transparent border border-borderColor text-textColor placeholder-grayText',
              'focus:outline-none focus:border-[#b89c72] transition-colors duration-300',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            ].join(' ')}
          />

          <button
            type="submit"
            disabled={isPending}
            className={[
              'px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-light transition-all duration-300',
              'bg-textColor text-backgroundColor',
              'hover:bg-[#b89c72] hover:border-[#b89c72]',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'whitespace-nowrap',
            ].join(' ')}
          >
            {isPending ? '…' : t('joinInRealArt.newsletter.cta')}
          </button>
        </form>
      </div>
    </section>
  )
}
