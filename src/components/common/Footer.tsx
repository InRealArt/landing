'use client'

import SuccessModal from '@/components/common/SuccessModal'
import { useTranslation } from '@/hooks/useTranslation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useLazyRecaptcha } from '@/hooks/useLazyRecaptcha'
import { subscribeToNewsletter } from '@/actions/newsletterActions'
import { salons } from '@/utils/artSalonCalculations'
import Link from 'next/link'

const atelierLinks = [
  { label: 'Sandrine Hirson', href: 'https://share.google/GewswgKB0Od9tyFEV' },
  { label: 'Nadine LePrince', href: 'https://share.google/7uieG9SlEVKaUTHvO' },
  { label: 'Mr Hope', href: 'https://share.google/ZwMEQTKtzRROGGeUF' },
  { label: 'Monique Laville', href: 'https://share.google/sYkUAhGdXAat97EVf' },
  { label: 'Marie de Saint Germain', href: 'https://share.google/7XwDxxwXSRlo3IfpQ' },
  { label: 'Marianne Quinzin', href: 'https://share.google/kYGzFfbZQ7NZdExgQ' },
  { label: 'Marc Peltzer', href: 'https://share.google/1A8fKvVlZ3lKXIrD7' },
  { label: 'Jean-Paul Boyer', href: 'https://share.google/374mb9VcmQvHSyppN' },
  { label: 'François Poulat', href: 'https://share.google/c0cqNa2fGo738bTei' },
  { label: 'Franck Alagna', href: 'https://share.google/7MeBYyD6SPH1P1I89' },
  { label: 'Florence Autelin', href: 'https://share.google/C8KXeYSLAwtW0ya3Z' },
  { label: 'Catherine Sénéchal', href: 'https://share.google/DfFrXEYyGarxVUkUf' },
  { label: 'Alves Antoine Junior', href: 'https://share.google/IzSfhbdnUDNx0e47K' },
]

interface ResidentArtist {
  label: string
  slug: string
}

interface FooterProps {
  residentArtists?: ResidentArtist[]
}

const Footer = ({ residentArtists = [] }: FooterProps) => {
  const { t, language } = useTranslation()
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const { executeRecaptcha } = useLazyRecaptcha({ preloadOnInteraction: true, interactionTarget: 'form' })

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

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

  return (
    <footer
      className="pt-16 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-10"
      style={{
        backgroundColor: 'var(--canvas-bg)',
        color: 'var(--ink-black)',
        borderTop: '1px solid var(--border-light)',
      }}
    >
      {/* Ligne décorative dorée */}
      <div
        className="w-16 mx-auto mb-10"
        style={{ height: '1px', backgroundColor: 'var(--gold-accent)', opacity: 0.5 }}
        aria-hidden="true"
      />

      <div className="max-w-screen-xl mx-auto">

        {/* Logo centré */}
        <div
          className="text-2xl sm:text-3xl tracking-[0.6em] sm:tracking-[0.8em] uppercase serif font-light mb-12 text-center"
          style={{ color: 'var(--ink-black)' }}
        >
          In
          <span style={{ color: 'var(--gold-accent)' }}>Real</span>
          Art
        </div>

        {/* Colonnes de navigation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-10 mb-14 text-center md:text-left">

          {/* Colonne : À propos */}
          <div>
            <h5
              className="text-[10px] uppercase tracking-[0.3em] font-bold mb-5 pb-3 montserrat"
              style={{
                color: 'var(--ink-black)',
                borderBottom: '1px solid var(--border-light)',
              }}
              suppressHydrationWarning
            >
              {t('footer.about')}
            </h5>
            <Link href="/team" className="footer-link">{t('nav.aboutInRealArt')}</Link>
            <Link href="/manifest" className="footer-link">{t('nav.whitepaper')}</Link>
            <Link href="/joinInRealArt" className="footer-link" data-umami-event="joinInRealArt-footer-click">{t('nav.joinInRealArt')}</Link>
            <Link href="/blog" className="footer-link">Blog</Link>
          </div>

          {/* Colonne : Expertise */}
          <div>
            <h5
              className="text-[10px] uppercase tracking-[0.3em] font-bold mb-5 pb-3 montserrat"
              style={{
                color: 'var(--ink-black)',
                borderBottom: '1px solid var(--border-light)',
              }}
              suppressHydrationWarning
            >
              {t('footer.expertise')}
            </h5>
            <Link href="/services" className="footer-link">{t('nav.services')}</Link>
            <Link href="/usecase" className="footer-link">{t('nav.usecase')}</Link>
            <Link href="/media" className="footer-link">{t('nav.blog')}</Link>
          </div>

          {/* Colonne : Simulateurs */}
          <div>
            <h5
              className="text-[10px] uppercase tracking-[0.3em] font-bold mb-5 pb-3 montserrat"
              style={{
                color: 'var(--ink-black)',
                borderBottom: '1px solid var(--border-light)',
              }}
              suppressHydrationWarning
            >
              {t('footer.simulators')}
            </h5>
            {Object.entries(salons).slice(0, 2).map(([slug, salon]) => (
              <Link key={slug} href={`/art-salon-simulator/${slug}`} className="footer-link">
                {salon.name}
              </Link>
            ))}
            <Link href="/loa-simulator" className="footer-link">{t('footer.loaSimulator')}</Link>
            <Link href="/heritage-art-simulator" className="footer-link">{t('footer.heritageArtSimulator')}</Link>
            <Link
              href="/simulators"
              className="footer-link italic mt-3"
              style={{ color: 'var(--gold-accent)' }}
            >
              {t('footer.viewAllSimulators')}
            </Link>
          </div>

          {/* Colonne : Atelier de nos artistes */}
          <div>
            <h5
              className="text-[10px] uppercase tracking-[0.3em] font-bold mb-5 pb-3 montserrat"
              style={{
                color: 'var(--ink-black)',
                borderBottom: '1px solid var(--border-light)',
              }}
              suppressHydrationWarning
            >
              {t('footer.atelier')}
            </h5>
            <div className="h-40 overflow-y-auto pr-2 custom-scrollbar">
              {atelierLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artist-list-item"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Colonne : Artistes résidents */}
          <div>
            <h5
              className="text-[10px] uppercase tracking-[0.3em] font-bold mb-5 pb-3 montserrat"
              style={{
                color: 'var(--ink-black)',
                borderBottom: '1px solid var(--border-light)',
              }}
              suppressHydrationWarning
            >
              {t('footer.residents')}
            </h5>
            <div className="h-40 overflow-y-auto pr-2 custom-scrollbar">
              {residentArtists.map((artist) => (
                <Link
                  key={artist.slug}
                  href={`/artists/${artist.slug}`}
                  className="artist-list-item"
                >
                  {artist.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter — centrée */}
        <div className="flex flex-col items-center text-center mb-12">
          <form action={handleSubmit} className="relative w-full max-w-xs">
            <input type="hidden" name="language" value={language} />
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('footer.newsletter.subscribe')}
              disabled={isPending}
              className="w-full montserrat rounded-none py-3 px-0 pr-14 outline-none bg-transparent text-[12px] font-light transition-colors duration-300 disabled:opacity-50"
              style={{
                borderBottom: '1px solid var(--border-light)',
                color: 'var(--ink-black)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderBottomColor = 'var(--gold-accent)' }}
              onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'var(--border-light)' }}
              required
            />
            <button
              type="submit"
              className={`absolute right-0 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-[0.3em] transition-colors duration-300 montserrat${isPending ? ' opacity-50 cursor-not-allowed' : ''}`}
              style={{ color: 'var(--gray-text)' }}
              aria-label={t('footer.newsletter.subscribe')}
              disabled={isPending}
            >
              {isPending ? '···' : 'OK'}
            </button>
          </form>
        </div>

        {/* Barre inférieure */}
        <div
          className="flex flex-col md:flex-row justify-between items-center pt-8 gap-6"
          style={{ borderTop: '1px solid var(--border-light)' }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <p
              className="text-[9px] uppercase tracking-widest italic montserrat"
              style={{ color: 'var(--gray-text)' }}
            >
              {t('footer.physicalWorkshops')}
            </p>
            <p
              className="text-[9px] uppercase tracking-widest montserrat"
              style={{ color: 'var(--gray-text)' }}
            >
              © {new Date().getFullYear()} — {t('footer.rights')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 justify-center md:justify-end">
            {/* Réseaux sociaux */}
            <div className="flex items-center gap-3">
              <span
                className="text-[9px] uppercase tracking-[0.2em] montserrat"
                style={{ color: 'var(--gray-text)' }}
                suppressHydrationWarning
              >
                {t('footer.social')} :
              </span>
              <div className="flex space-x-3">
                <a
                  href="https://www.linkedin.com/company/inrealart/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  style={{ color: 'var(--gray-text)', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-black)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--gray-text)' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/inrealartgallery/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  style={{ color: 'var(--gray-text)', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-black)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--gray-text)' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Liens légaux */}
            <div className="flex space-x-4">
              <Link
                href="/terms"
                className="text-[9px] uppercase tracking-[0.2em] montserrat transition-colors duration-300"
                style={{ color: 'var(--gray-text)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-black)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--gray-text)' }}
              >
                {t('footer.terms')}
              </Link>
              <Link
                href="/legal"
                className="text-[9px] uppercase tracking-[0.2em] montserrat transition-colors duration-300"
                style={{ color: 'var(--gray-text)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-black)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--gray-text)' }}
              >
                {t('footer.legal')}
              </Link>
            </div>
          </div>
        </div>

        {/* Notice reCAPTCHA */}
        <div
          className="text-[9px] montserrat text-center mt-6"
          style={{ color: 'var(--gray-text)' }}
        >
          {t('footer.recaptcha.notice')} &nbsp;
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {t('footer.recaptcha.privacyPolicy')}
          </a>
          &nbsp;{t('footer.recaptcha.and')}&nbsp;
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {t('footer.recaptcha.termsOfService')}
          </a>
        </div>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={t('footer.newsletter.success.title')}
        subtitle={t('footer.newsletter.success.subtitle')}
        message=''
        closeButtonText={t('footer.newsletter.success.closeButton')}
      />
    </footer>
  )
}

export default Footer
