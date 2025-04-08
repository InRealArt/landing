'use client'

import Image from 'next/image'
import { useLanguageStore } from '@/store/languageStore'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { loadRecaptchaScript, executeRecaptcha } from '@/lib/recaptcha'
import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

// Regex pour valider l'email
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

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
    { label: 'nav.faq', href: '/faq' },
    { label: 'nav.team', href: '/team' },
    { label: 'nav.glossary', href: '/glossary' },
    { label: 'nav.artists', href: '/artists' },
    { label: 'nav.presale', href: '/presale' },
    { label: 'nav.usecase', href: '/usecase' },
    { label: 'nav.whitepaper', href: '/whitepaper', disabled: true },
    { label: 'nav.airdrop', href: '/airdrop' },
    { label: 'nav.blog', href: '/blog' },
  ],
}

// Split links into two groups
const firstColumnLinks = navigation.pages.slice(0, 6)
const secondColumnLinks = navigation.pages.slice(6)

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
    <footer className="text-white py-12 mt-36 bg-linear-to-b from-[#1F1F1F] to-[##1f1f1f29]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.company')}</h3>
            <p className="text-gray-400 mb-4">{t('footer.location')}</p>
            <p className="text-gray-400">{t('footer.email')}</p>
          </div>

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
            <h3 className="text-xl font-bold mb-4">{t('footer.pages')}</h3>
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
      </div>
    </footer>
  );
}

export default Footer;
