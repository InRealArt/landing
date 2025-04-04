'use client'

import Image from 'next/image'
import { useLanguageStore } from '@/store/languageStore'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { loadRecaptchaScript, executeRecaptcha } from '@/lib/recaptcha'

// Regex pour valider l'email
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Type pour la réponse de l'API
type SubscribeResponse = {
  success: boolean
  message: string
}

const Footer = () => {
  const { t } = useLanguageStore()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)
  
  // Charger reCAPTCHA au montage du composant
  useEffect(() => {
    const loadRecaptcha = async () => {
      try {
        await loadRecaptchaScript()
        setRecaptchaLoaded(true)
      } catch (error) {
        console.error('Erreur lors du chargement de reCAPTCHA:', error)
      }
    }

    loadRecaptcha()
  }, [])

  // Fonction pour valider l'email
  const validateEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email)
  }

  // Fonction pour soumettre l'email
  const handleSubscribe = async () => {
    // Vérifier si l'email est vide
    if (!email.trim()) {
      toast.error(t('toaster.emailValidationRequired'))
      return
    }

    // Valider l'email
    if (!validateEmail(email)) {
      toast.error(t('toaster.emailValidationError'))
      return
    }

    setIsLoading(true)

    try {
      // Exécuter reCAPTCHA si chargé
      let recaptchaToken = undefined
      
      if (recaptchaLoaded) {
        try {
          recaptchaToken = await executeRecaptcha()
        } catch (recaptchaError) {
          console.error('Erreur reCAPTCHA:', recaptchaError)
          // On continue même si reCAPTCHA échoue, la validation se fera côté serveur
        }
      }

      // Appel API pour enregistrer l'email
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          recaptchaToken 
        }),
      })

      const data: SubscribeResponse = await response.json()

      if (data.success) {
        toast.success(t('toaster.newsletter.success'))
        setEmail('') // Réinitialiser le champ après succès
      } else {
        toast.error(data.message || t('leasing.toaster.newsletter.error'))
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      toast.error(t('leasing.toaster.newsletter.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="w-full min-h-footerSize bg-cardBackground mt-36 flex flex-wrap items-center py-8">
      <div className='w-full flex flex-wrap m-auto justify-between max-w-90 xl:max-w-screen-xl'>
        <div className='socials'>
          <Image className='mb-12 md:mb-0' src={`/icons/Logo.png`} alt='IRA-LOGO' width="101" height="32" />
        </div>
        <div className='flex flex-wrap gap-12'>
          <ul className="flex flex-col gap-2">
            <h2 className='font-semibold unbounded mb-2'>{t('footer.pages')}</h2>
            <li>{t('nav.home')}</li>
            <li>{t('nav.team')}</li>
            <li>{t('nav.marketplace')}</li>
            <li>{t('nav.faq')}</li>
          </ul>
          <ul className="flex flex-col gap-2">
            <h2 className='font-semibold unbounded mb-2'>{t('footer.company')}</h2>
            <li>{t('nav.team')}</li>
            <li>{t('footer.partner')}</li>
            <li>{t('footer.terms')}</li>
          </ul>
          <div />
          <ul className="flex flex-col gap-2">
            <h2 className='font-semibold unbounded mb-2'>{t('footer.contact')}</h2>
            <li>{t('footer.location')}</li>
            <li>{t('footer.email')}</li>
            <div className="relative w-72 md:w-80 mt-4">
              <input 
                className="w-full bg-transparent border border-white bricolage-grotesque rounded-3xl font-semibold border-1 py-6 px-4 pr-16 outline-0" 
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('buttons.subscribe')} 
              />
              <button 
                className={`absolute right-2 top-1/2 -translate-y-1/2 bg-[#6052FF] text-white rounded-full w-12 h-12 flex items-center justify-center border border-white ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#4F3EED] transition-colors'}`}
                aria-label={t('buttons.subscribe')}
                onClick={handleSubscribe}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M13.0001 17.0001L19.0001 12.0001M19.0001 12.0001L13.0001 7.00012M19.0001 12.0001H5.00012" 
                      stroke="white" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;