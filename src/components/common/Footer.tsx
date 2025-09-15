'use client'

import OptimizedImage from '@/components/common/OptimizedImage'
import OptimizedSVG from '@/components/common/OptimizedSVG'
import SuccessModal from '@/components/common/SuccessModal'
import { useLanguageStore } from '@/store/languageStore'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { subscribeToNewsletter, type NewsletterActionResult } from '@/actions/newsletterActions'
import { salons } from '@/utils/artSalonCalculations'
import { useTheme } from '@/contexts/ThemeContext'


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
    { label: 'nav.blog', href: '/blog' },
    { label: 'nav.joinInRealArt', href: '/joinInRealArt' },
    
  ],
}

// Split links into two groups
const firstColumnLinks: NavigationLink[] = navigation.pages.slice(0, 6)
const secondColumnLinks: NavigationLink[] = navigation.pages.slice(6, 11)


const Footer = () => {
  const { t, language } = useLanguageStore()
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const { theme } = useTheme()
  
  // États pour la modal de succès
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

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
          setIsSuccessModalOpen(true)
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

  const svgClass = theme === 'light' ? 'hover:opacity-80 transition-opacity invert' : 'hover:opacity-80 transition-opacity'

  return (
    <footer className="text-textColor py-12 mt-36 bg-linear-to-b from-[#1F1F1F] to-[##1f1f1f29]">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

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
                    className={`${link.href === '/joinInRealArt' ? 'text-purple-500 hover:text-purple-400' : 'text-grayText hover:text-textColor'} transition-colors ${link.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
            <div />

          </div>

          {/* Simulators Section - Combined */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-4 h-8 flex items-center justify-center">{t('footer.professionalsAndCompanies')}</h3>
            <ul className="space-y-2">
              {/* Art Salon Simulators */}
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
              {/* LOA Simulator */}
              <li>
                <Link
                  href="/loa-simulator"
                  className="text-grayText hover:text-textColor transition-colors"
                >
                  {t('footer.loaSimulator')}
                </Link>
              </li>
              {/* Heritage Art Simulator */}
              <li>
                <Link
                  href="/heritage-art-simulator"
                  className="text-grayText hover:text-textColor transition-colors"
                >
                  {t('footer.heritageArtSimulator')}
                </Link>
              </li>
              {/* View All Simulators */}
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



        </div>
        
        {/* Newsletter */}
        <div className="mt-12 flex flex-col items-center text-center">
          <form
            action={handleSubmit}
            className="relative w-full md:w-80"
          >
            {/* Champ caché pour la langue */}
            <input type="hidden" name="language" value={language} />
            
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('footer.newsletter.subscribe')}
              disabled={isPending}
              className={`w-full bricolage-grotesque rounded-3xl font-semibold py-6 px-4 pr-16 outline-0 ${
                theme === 'light' 
                  ? 'bg-transparent border-2 border-black text-gray-800 placeholder-gray-500 focus:border-gray-800' 
                  : 'bg-transparent border border-white'
              }`}
              required
            />
            <button
              type="submit"
              className={`absolute right-2 top-1/2 -translate-y-1/2 bg-[#6052FF] text-textColor rounded-full w-12 h-12 flex items-center justify-center border border-white ${isPending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#4F3EED] transition-colors'}`}
              aria-label={t('footer.newsletter.subscribe')}
              disabled={isPending}
            >
              {isPending ? (
                <svg className="animate-spin h-5 w-5 text-textColor" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          </form>
        </div>

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
      
      {/* Modal de succès */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={t('footer.newsletter.success.title')}
        subtitle={t('footer.newsletter.success.subtitle')}
        message=''
        closeButtonText={t('footer.newsletter.success.closeButton')}
      />
    </footer>
  );
}

export default Footer;
