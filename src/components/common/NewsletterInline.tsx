'use client'

import { Mail } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { toast } from 'sonner'
import { subscribeToNewsletter } from '@/actions/newsletterActions'
import OptimizedImage from './OptimizedImage'
import Button from './Button'


export default function NewsletterInline() {
  const { t } = useLanguageStore()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()

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
        <section className="w-full bg-backgroundColor text-textColor py-16 mt-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-gradientFrom to-gradientTo rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[500px]">
          {/* Colonne gauche - Images */}
          <div className="relative bg-gradient-to-br from-purpleColor/20 to-purpleColor/10 p-6 flex items-center justify-center">
            <div className="relative w-[280px] h-[160px] md:h-[320px] md:w-[280px]">
              {/* Image de fond (décalée) */}
              <div className="absolute top-0 right-[25%] lg:right-0 w-[80px] h-[120px] lg:w-[180px] lg:h-[220px] rounded-lg overflow-hidden shadow-xl z-10">
                <OptimizedImage
                  src="/images/newsletter/image_nl_2.webp"
                  alt="Newsletter illustration 2"
                  width={180}
                  height={220}
                  className="w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover"
                />
              </div>

              {/* Image de premier plan */}
              <div className="absolute bottom-0 left-[20%] lg:left-0 w-[100px] h-[140px] lg:w-[200px] lg:h-[240px] rounded-lg overflow-hidden shadow-2xl z-20">
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
              <h2 className="text-2xl font-bold mb-2">
                {t('newsletter.modal.title')}
              </h2>

              {/* Sous-titre */}
              <p className="text-textColor/80 mb-2">
                {t('newsletter.modal.subtitle')}
              </p>

              {/* Description */}
              <p className="text-sm text-textColor/60 mb-6">
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
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textColor/60" size={20} />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.modal.emailPlaceholder')}
                  disabled={isPending}
                  className="w-full pl-12 pr-4 py-4 bg-transparent border-2 border-textColor/20 rounded-lg text-textColor placeholder-textColor/40 focus:outline-none focus:border-purpleColor transition-colors"
                  required
                />
              </div>

              {/* Bouton de soumission */}
              <Button
                type="submit"
                disabled={isPending}
                additionalClassName="w-full py-4 bg-purpleColor text-textColor rounded-lg hover:bg-purpleColor/90 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                text={isPending ? t('newsletter.modal.subscribing') : t('newsletter.modal.subscribeButton')}
                center
              />
            </form>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    </section>
  )
}
