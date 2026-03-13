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
    <footer className="text-textColor pt-40 pb-20 px-10 bg-canvas-white border-t border-border-light">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* Logo */}
        <div className="text-4xl tracking-[0.8em] uppercase serif font-light mb-24 text-center md:text-left text-ink-black">InRealArt</div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-16 mb-32">
          
          {/* Column 1: About */}
          <div>
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 border-b border-black/10 pb-4 text-nowrap text-ink-black" suppressHydrationWarning>{t('footer.about')}</h5>
            <Link href="/about" className="footer-link">{t('nav.aboutInRealArt')}</Link>
            <Link href="/manifest" className="footer-link">{t('nav.whitepaper')}</Link>
            <Link href="/team" className="footer-link">{t('nav.team')}</Link>
            <Link href="/joinInRealArt" className="footer-link" data-umami-event="joinInRealArt-footer-click">{t('nav.joinInRealArt')}</Link>
            <Link href="/blog" className="footer-link font-medium mt-4">Blog</Link>
          </div>

          {/* Column 2: Marketplace */}
          <div>
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 border-b border-black/10 pb-4 text-nowrap text-ink-black" suppressHydrationWarning>{t('footer.marketplace')}</h5>
            <Link href="/presale" className="footer-link font-semibold text-ink-black">{t('nav.artworks')}</Link>
            <Link href="/artists" className="footer-link">{t('nav.artists')}</Link>
            <Link href="/marketplace" className="footer-link">{t('nav.marketplace')}</Link>
            <Link href="/faq" className="footer-link">{t('nav.faq')}</Link>
          </div>

          {/* Column 3: Expertise */}
          <div>
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 border-b border-black/10 pb-4 text-nowrap text-ink-black" suppressHydrationWarning>{t('footer.expertise')}</h5>
            <Link href="/glossary" className="footer-link">{t('nav.glossary')}</Link>
            <Link href="/usecase" className="footer-link">{t('nav.usecase')}</Link>
            <Link href="/blog" className="footer-link font-medium mt-4">{t('nav.blog')}</Link>
          </div>

          {/* Column 4: Simulators */}
          <div>
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 border-b border-black/10 pb-4 text-nowrap text-ink-black" suppressHydrationWarning>{t('footer.simulators')}</h5>
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
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 border-b border-black/10 pb-4 text-nowrap text-ink-black" suppressHydrationWarning>{t('footer.residents')}</h5>
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
              className={`w-full montserrat rounded-none border-b-2 py-4 px-0 pr-16 outline-0 bg-transparent transition-colors ${
                theme === 'light'
                  ? 'border-ink-black text-ink-black placeholder-gray-400 focus:border-gold-accent'
                  : 'border-white text-white placeholder-gray-500 focus:border-gold-accent'
              }`}
              required
            />
            <button
              type="submit"
              className={`absolute right-0 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.25em] ${isPending ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-50 transition-opacity'} text-ink-black`}
              aria-label={t('footer.newsletter.subscribe')}
              disabled={isPending}
            >
              {isPending ? '...' : 'OK'}
            </button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-border-light gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest italic">{t('footer.physicalWorkshops')}</p>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest">© {new Date().getFullYear()} — {t('footer.rights')}</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex space-x-6">
              <a href="https://www.linkedin.com/company/inrealart/" target="_blank" rel="noopener noreferrer" className="text-[9px] text-gray-500 uppercase tracking-[0.3em] hover:text-ink-black">LinkedIn</a>
              <a href="https://www.instagram.com/inrealartgallery/" target="_blank" rel="noopener noreferrer" className="text-[9px] text-gray-500 uppercase tracking-[0.3em] hover:text-ink-black">Instagram</a>
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
