'use client'

import SuccessModal from '@/components/common/SuccessModal'
import { useLanguageStore } from '@/store/languageStore'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useLazyRecaptcha } from '@/hooks/useLazyRecaptcha'
import { subscribeToNewsletter, type NewsletterActionResult } from '@/actions/newsletterActions'
import { salons } from '@/utils/artSalonCalculations'
import { useTheme } from '@/contexts/ThemeContext'
import Link from 'next/link'

const atelierLinks = [
  { label: 'Sandrine Hirson - artiste InRealArt', href: 'https://share.google/GewswgKB0Od9tyFEV' },
  { label: 'Nadine LePrince - artiste InRealArt', href: 'https://share.google/7uieG9SlEVKaUTHvO' },
  { label: 'Mr Hope - artiste InRealArt', href: 'https://share.google/ZwMEQTKtzRROGGeUF' },
  { label: 'Monique Laville - artiste InRealArt', href: 'https://share.google/sYkUAhGdXAat97EVf' },
  { label: 'Marie de Saint Germain - artiste InRealArt', href: 'https://share.google/7XwDxxwXSRlo3IfpQ' },
  { label: 'Marianne Quinzin - artiste InRealArt', href: 'https://share.google/kYGzFfbZQ7NZdExgQ' },
  { label: 'Marc Peltzer - artiste InRealArt', href: 'https://share.google/1A8fKvVlZ3lKXIrD7' },
  { label: 'Jean-Paul Boyer - artiste InRealArt', href: 'https://share.google/374mb9VcmQvHSyppN' },
  { label: 'François Poulat - artiste InRealArt', href: 'https://share.google/c0cqNa2fGo738bTei' },
  { label: 'Franck Alagna - artiste InRealArt', href: 'https://share.google/7MeBYyD6SPH1P1I89' },
  { label: 'Florence Autelin - Artiste InRealArt', href: 'https://share.google/C8KXeYSLAwtW0ya3Z' },
  { label: 'Catherine Sénéchal - artiste InRealArt', href: 'https://share.google/DfFrXEYyGarxVUkUf' },
  { label: 'Alves Antoine Junior - Artiste InRealArt', href: 'https://share.google/IzSfhbdnUDNx0e47K' },
]

const Footer = () => {
  const t = useLanguageStore(state => state.t)
  const language = useLanguageStore(state => state.language)
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const { executeRecaptcha } = useLazyRecaptcha({ preloadOnInteraction: true, interactionTarget: 'form' })
  const { theme } = useTheme()
  
  // États pour la modal de succès
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

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

  const svgClass = theme === 'light' ? 'hover:opacity-80 transition-opacity' : 'hover:opacity-80 transition-opacity'

  return (
    <footer className="text-textColor pt-24 sm:pt-32 lg:pt-40 pb-20 px-4 sm:px-6 lg:px-10 bg-canvas-white border-t border-border-light">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* Logo */}
        <div className="text-2xl sm:text-3xl md:text-4xl tracking-[0.4em] sm:tracking-[0.6em] md:tracking-[0.8em] uppercase serif font-light mb-16 md:mb-24 text-center md:text-left text-ink-black">InRealArt</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-16 mb-32">
          
          {/* Column 1: About */}
          <div>
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 border-b border-black/10 pb-4 text-ink-black" suppressHydrationWarning>{t('footer.about')}</h5>
            <Link href="/about" className="footer-link">{t('nav.aboutInRealArt')}</Link>
            <Link href="/manifest" className="footer-link">{t('nav.whitepaper')}</Link>
            <Link href="/team" className="footer-link">{t('nav.team')}</Link>
            <Link href="/joinInRealArt" className="footer-link" data-umami-event="joinInRealArt-footer-click">{t('nav.joinInRealArt')}</Link>
            <Link href="/blog" className="footer-link font-medium mt-4">Blog</Link>
          </div>

          {/* Column 2: Marketplace */}
          {/* <div>
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 border-b border-black/10 pb-4 text-ink-black" suppressHydrationWarning>{t('footer.marketplace')}</h5>
            <Link href="/presale" className="footer-link font-semibold text-ink-black">{t('nav.artworks')}</Link>
            <Link href="/artists" className="footer-link">{t('nav.artists')}</Link>
            <Link href="/marketplace" className="footer-link">{t('nav.marketplace')}</Link>
            <Link href="/faq" className="footer-link">{t('nav.faq')}</Link>
          </div> */}

          {/* Column 3: Expertise */}
          <div>
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 border-b border-black/10 pb-4 text-ink-black" suppressHydrationWarning>{t('footer.expertise')}</h5>
            {/* <Link href="/glossary" className="footer-link">{t('nav.glossary')}</Link> */}
            <Link href="/usecase" className="footer-link">{t('nav.usecase')}</Link>
            <Link href="/blog" className="footer-link font-medium mt-4">{t('nav.blog')}</Link>
          </div>

          {/* Column 4: Simulators */}
          <div>
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 border-b border-black/10 pb-4 text-ink-black" suppressHydrationWarning>{t('footer.simulators')}</h5>
            {Object.entries(salons).slice(0, 2).map(([slug, salon]) => (
              <Link key={slug} href={`/art-salon-simulator/${slug}`} className="footer-link">
                {salon.name}
              </Link>
            ))}
            <Link href="/loa-simulator" className="footer-link">{t('footer.loaSimulator')}</Link>
            <Link href="/heritage-art-simulator" className="footer-link">{t('footer.heritageArtSimulator')}</Link>
            <Link href="/simulators" className="footer-link font-bold text-ink-black mt-2 italic">{t('footer.viewAllSimulators')}</Link>
          </div>

          {/* Column 5: Artists */}
          <div>
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 border-b border-black/10 pb-4 text-ink-black" suppressHydrationWarning>{t('footer.residents')}</h5>
            <div className="h-48 overflow-y-auto pr-2 custom-scrollbar">
              {atelierLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artist-list-item"
                >
                  {link.label.replace(' - artiste InRealArt', '').replace(' - Artiste InRealArt', '')}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 flex flex-col items-center text-center mb-24">
          <form
            action={handleSubmit}
            className="relative w-full md:w-80"
          >
            <input type="hidden" name="language" value={language} />
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('footer.newsletter.subscribe')}
              disabled={isPending}
              className="w-full montserrat rounded-none border-b border-[var(--border-light)] py-3 px-0 pr-16 outline-none bg-transparent text-[var(--ink-black)] placeholder-[var(--gray-text)] text-[12px] font-light focus:border-[var(--gold-accent)] transition-colors duration-300 disabled:opacity-50"
              required
            />
            <button
              type="submit"
              className={`absolute right-0 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-[0.3em] text-[var(--gray-text)] hover:text-[var(--ink-black)] transition-colors duration-300 ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={t('footer.newsletter.subscribe')}
              disabled={isPending}
            >
              {isPending ? '···' : 'OK'}
            </button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-border-light gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest italic">{t('footer.physicalWorkshops')}</p>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest">© {new Date().getFullYear()} — {t('footer.rights')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-6 justify-center md:justify-end">
            <div className="flex space-x-6">
              <a href="https://www.linkedin.com/company/inrealart/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-ink-black transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-[9px] uppercase tracking-[0.3em]">LinkedIn</span>
              </a>
              <a href="https://www.instagram.com/inrealartgallery/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-ink-black transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
                <span className="text-[9px] uppercase tracking-[0.3em]">Instagram</span>
              </a>
            </div>
            <div className="flex space-x-4">
              <Link href="/terms" className="text-[9px] text-gray-500 uppercase tracking-[0.3em] hover:text-ink-black">{t('footer.terms')}</Link>
              <Link href="/legal" className="text-[9px] text-gray-500 uppercase tracking-[0.3em] hover:text-ink-black">{t('footer.legal')}</Link>
            </div>
          </div>
        </div>

        {/* Notice reCAPTCHA */}
        <div className="text-xs text-gray-500 text-center mt-8">
          {t('footer.recaptcha.notice')} &nbsp;
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
            {t('footer.recaptcha.privacyPolicy')}
          </a> &nbsp;
          {t('footer.recaptcha.and')} &nbsp;
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
            {t('footer.recaptcha.termsOfService')}
          </a>
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
