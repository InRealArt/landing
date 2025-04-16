'use client'

import Image from 'next/image'
import { useLanguageStore } from '@/store/languageStore'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { validateEmail } from '@/utils/functions'

// Type pour la réponse de l'API
type SubscribeResponse = {
  success: boolean
  message: string
}

const navigation = {
  pages: [
    { label: 'nav.home', href: '/' },
    { label: 'nav.marketplace', href: '/marketplace' },
    { label: 'nav.roadmap', href: '/roadmap' },
    { label: 'nav.team', href: '/team' },
    { label: 'nav.artists', href: '/artists' },
    { label: 'nav.presale', href: '/presale' },

    { label: 'nav.faq', href: '/faq' },
    { label: 'nav.glossary', href: '/glossary' },
    { label: 'nav.usecase', href: '/usecase' },
    { label: 'nav.whitepaper', href: '/whitepaper', disabled: true },
    { label: 'nav.airdrop', href: '/airdrop' , disabled: true },
    // { label: 'nav.blog', href: '/blog' },
  ],
}

// Split links into two groups
const firstColumnLinks = navigation.pages.slice(0, 6)
const secondColumnLinks = navigation.pages.slice(6)

const Footer = () => {
  const { t } = useLanguageStore()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { executeRecaptcha } = useGoogleReCaptcha()

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
      // Exécuter reCAPTCHA si disponible
      let recaptchaToken = undefined

      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha('newsletter_subscribe')
        } catch (recaptchaError) {
          console.error('❌ Erreur reCAPTCHA:', recaptchaError)
          
          // Tenter d'exécuter reCAPTCHA via l'API globale comme solution de contournement
          if (typeof window !== 'undefined' && window.grecaptcha && window.grecaptcha.execute) {
            try {
              const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""
              recaptchaToken = await window.grecaptcha.execute(recaptchaKey, { action: 'newsletter_subscribe' });
            } catch (fallbackError) {
              console.error('❌ Échec du plan B avec l\'API globale:', fallbackError)
            }
          }
        }
      } else {
        console.warn('❌ executeRecaptcha non disponible - reCAPTCHA ne fonctionne pas correctement')
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
    <footer className="text-white py-12 mt-36 bg-linear-to-b from-[#1F1F1F] to-[##1f1f1f29]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Pages - First Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.pages')}</h3>
            <ul className="space-y-2">
              {firstColumnLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-gray-400 hover:text-white transition-colors ${link.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages - Second Column */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2">
              {secondColumnLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-gray-400 hover:text-white transition-colors ${link.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
            <div />

          </div>
          <ul className="flex flex-col gap-2">
            <Image 
              src="/icons/Logo.png" 
              alt="InRealArt Logo" 
              width={101} 
              height={32} 
              className="mb-4" 
            />
            <h2 className='font-semibold unbounded mb-2'>{t('footer.contact')}</h2>
            <li>{t('footer.location')}</li>
            <li>{t('footer.email')}</li>
            <div className="flex space-x-4 my-4">
              <Link href="https://www.linkedin.com/company/inrealart/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Image src="/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} className="hover:opacity-80 transition-opacity" />
              </Link>
              <Link href="https://www.instagram.com/inrealartgallery/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} className="hover:opacity-80 transition-opacity" />
              </Link>
              <Link href="https://www.facebook.com/inrealart" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} className="hover:opacity-80 transition-opacity" />
              </Link>
              <Link href="https://x.com/InRealArt/" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X">
                <Image src="/icons/twitter.svg" alt="Twitter/X" width={24} height={24} className="hover:opacity-80 transition-opacity" />
              </Link>
            </div>
            <div className="relative w-80 mt-4">
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

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} InRealArt. {t('footer.rights')}
          </p>
          <div className="flex space-x-4">
            <Link href="/terms-nft" className="text-gray-400 hover:text-white transition-colors">
              {t('footer.termsNft')}
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              {t('footer.terms')}
            </Link>
            <Link href="/legal" className="text-gray-400 hover:text-white transition-colors">
              {t('footer.legal')}
            </Link>
          </div>
        </div>
        
        {/* Notice reCAPTCHA conforme aux conditions Google */}
        <div className="text-xs text-gray-500 text-center mt-4">
          Ce site est protégé par reCAPTCHA et les &nbsp;
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
            règles de confidentialité
          </a> &nbsp;
          et les &nbsp;
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
            conditions d&quote;utilisation
          </a> &nbsp;
          de Google s&quote;appliquent.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
