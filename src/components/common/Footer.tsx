'use client'

import OptimizedImage from '@/components/common/OptimizedImage'
import OptimizedSVG from '@/components/common/OptimizedSVG'
import { useLanguageStore } from '@/store/languageStore'
import { useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { validateEmail } from '@/utils/functions'
import { salons } from '@/utils/artSalonCalculations'
import { useTheme } from '@/contexts/ThemeContext'

// Type pour la réponse de l'API
type SubscribeResponse = {
  success: boolean
  message: string
}

// Type pour les liens de navigation
type NavigationLink = {
  label: string
  href: string
  disabled?: boolean
}

const navigation = {
  pages: [
    { label: 'nav.aboutInRealArt', href: '/about' },
    { label: 'nav.whitepaper', href: '/manifest' },
    { label: 'nav.team', href: '/team' },
    { label: 'nav.marketplace', href: '/marketplace' },
    { label: 'nav.artists', href: '/artists' },
    { label: 'nav.presale', href: '/presale' },

    { label: 'nav.faq', href: '/faq' },
    { label: 'nav.glossary', href: '/glossary' },
    { label: 'nav.usecase', href: '/usecase' },
    
  ],
}

// Split links into two groups
const firstColumnLinks: NavigationLink[] = navigation.pages.slice(0, 6)
const secondColumnLinks: NavigationLink[] = navigation.pages.slice(6, 9)


const Footer = () => {
  const { t } = useLanguageStore()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { executeRecaptcha } = useGoogleReCaptcha()
  const { theme } = useTheme()

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

  const svgClass = theme === 'light' ? 'hover:opacity-80 transition-opacity invert' : 'hover:opacity-80 transition-opacity'

  return (
    <footer className="text-textColor py-12 mt-36 bg-linear-to-b from-[#1F1F1F] to-[##1f1f1f29]">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* // Pages - First Column */}

          
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-4 h-8 flex items-center justify-center">{t('footer.pages')}</h3>
            <ul className="space-y-2">
              {firstColumnLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-grayText hover:text-textColor transition-colors ${link.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages - Second Column */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-4 h-8 flex items-center justify-center">{t('footer.resources')}</h3>
            <ul className="space-y-2">
              {secondColumnLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-grayText hover:text-textColor transition-colors ${link.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
            <div />

          </div>

          {/* Simulators Section */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-4 h-8 flex items-center justify-center">{t('footer.simulators')}</h3>
            <ul className="space-y-2">
              {Object.entries(salons).slice(0, 2).map(([slug, salon]) => (
                <li key={slug}>
                  <Link
                    href={`/art-salon-simulator/${slug}`}
                    className="text-grayText hover:text-textColor transition-colors"
                  >
                    {t('footer.artSalonSimulator')} {salon.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/simulators"
                  className="text-grayText hover:text-textColor transition-colors font-medium"
                >
                  {t('footer.viewAllSimulators')} →
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-4 h-8 flex items-center justify-center">{t('footer.leasing')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/loa-simulator"
                  className="text-grayText hover:text-textColor transition-colors"
                >
                  {t('footer.loaSimulator')}
                </Link>
              </li>
              <li>
                <Link
                  href="/heritage-art-simulator"
                  className="text-grayText hover:text-textColor transition-colors"
                >
                  {t('footer.heritageArtSimulator')}
                </Link>
              </li>
            </ul>
          </div>



        </div>
        {/* Newsletter */}


        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col items-center space-y-6">
          {/* Social Media Icons - Centered */}
          <div className="flex space-x-4">
            <Link href="https://www.linkedin.com/company/inrealart/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <OptimizedSVG src="/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} className={svgClass} />
            </Link>
            <Link href="https://www.instagram.com/inrealartgallery/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <OptimizedSVG src="/icons/instagram.svg" alt="Instagram" width={24} height={24} className={svgClass} />
            </Link>
            <Link href="https://www.facebook.com/inrealart" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <OptimizedSVG src="/icons/facebook.svg" alt="Facebook" width={16} height={16} className={svgClass} />
            </Link>
            <Link href="https://pinterest.com/teaminrealart/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
              <OptimizedSVG src="/icons/pinterest.svg" alt="Pinterest" width={24} height={24} className={svgClass} />
            </Link>
          </div>
          
          {/* Copyright and Legal Links */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p className="text-grayText">
              © {new Date().getFullYear()} InRealArt. {t('footer.rights')}
            </p>
            <div className="flex space-x-4">
              <Link href="/terms" className="text-grayText hover:text-textColor transition-colors">
                {t('footer.terms')}
              </Link>
              <Link href="/legal" className="text-grayText hover:text-textColor transition-colors">
                {t('footer.legal')}
              </Link>
            </div>
          </div>
        </div>

        {/* Notice reCAPTCHA conforme aux conditions Google */}
        <div className="text-xs text-gray-500 text-center mt-4">
          {t('footer.recaptcha.notice')} &nbsp;
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
            {t('footer.recaptcha.privacyPolicy')}
          </a> &nbsp;
          {t('footer.recaptcha.and')} &nbsp;
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
            {t('footer.recaptcha.termsOfService')}
          </a> &nbsp;
          {t('footer.recaptcha.googleApplies')}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
