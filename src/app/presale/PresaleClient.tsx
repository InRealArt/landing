'use client'
import React, { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import PresaleHero from "@/components/presale/PresaleHero";
import ArtworkCard from "@/components/common/cards/ArtworkCardOrder";
import { useTranslation } from '@/hooks/useTranslation';
import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs'
import { Download } from "lucide-react";
import { useLazyRecaptcha } from '@/hooks/useLazyRecaptcha'
import { toast } from 'sonner'
import { downloadCatalog } from '@/actions/catalogActions'
import CatalogSuccessModal from '@/components/common/SuccessModal'
import { PresaleArtworkData } from '@/actions/presaleArtworkActions';

const PAGE_SIZE = 12 // 3 colonnes x 4 lignes

export default function PresaleClient({ children, initialArtworks }: { children?: React.ReactNode, initialArtworks: PresaleArtworkData[] }) {
  const { t, language } = useTranslation();

  // États pour le formulaire de téléchargement du catalogue
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { executeRecaptcha } = useLazyRecaptcha({ preloadOnInteraction: true, interactionTarget: 'form' })

  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    artist: parseAsString.withDefault(''),
    q: parseAsString.withDefault('')
  })

  // État pour le dropdown
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Gestion du clic extérieur pour fermer le dropdown
  useEffect(() => {
    function onClickOutside (e: MouseEvent) {
      if (!dropdownRef.current) return
      if (!dropdownRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    function onKey (e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('click', onClickOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClickOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  // Fonction de gestion du téléchargement du catalogue
  const handleCatalogDownload = async (formData: FormData) => {
    startTransition(async () => {
      try {
        // Générer le token reCAPTCHA (charge automatiquement si nécessaire)
        const recaptchaToken = await executeRecaptcha('catalog_download')

        if (!recaptchaToken) {
          toast.error('reCAPTCHA non disponible. Veuillez réessayer.')
          return
        }

        // Ajouter le token au FormData
        formData.append('recaptchaToken', recaptchaToken)

        // Appeler la server action
        const result = await downloadCatalog(formData)

        if (result.success) {
          setEmail('')
          // Afficher la popup de succès (sans téléchargement automatique)
          setShowSuccessModal(true)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Erreur lors du téléchargement du catalogue:', error)
        toast.error('Une erreur inattendue s\'est produite.')
      }
    })
  }

  // Logique de filtrage
  const filtered = useMemo(() => {
    // Filtre par artiste
    const byArtist = params.artist
      ? initialArtworks.filter(artwork => {
          const artistFullName = `${artwork.artist.name} ${artwork.artist.surname}`.toLowerCase();
          return artistFullName.includes(params.artist.toLowerCase());
        })
      : initialArtworks

    // Filtre par recherche (nom d'artiste ou nom d'œuvre)
    const query = params.q.trim().toLowerCase()
    const bySearch = query
      ? byArtist.filter(artwork => {
          const artistFullName = `${artwork.artist.name} ${artwork.artist.surname}`.toLowerCase();
          return artwork.name.toLowerCase().includes(query) || artistFullName.includes(query);
        })
      : byArtist

    return bySearch
  }, [initialArtworks, params.artist, params.q])

  // Liste unique des artistes pour le dropdown
  const artists = useMemo(() => {
    const uniqueArtists = Array.from(new Set(initialArtworks.map(artwork => `${artwork.artist.name} ${artwork.artist.surname}`)))
    return uniqueArtists.sort()
  }, [initialArtworks])

  // Calculs de pagination avec filtrage
  const { paginatedArtworks, totalPages, page, startIndex } = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const page = Math.min(params.page, totalPages)
    const start = (page - 1) * PAGE_SIZE
    const paginatedArtworks = filtered.slice(start, start + PAGE_SIZE)
    const startIndex = start

    return { paginatedArtworks, totalPages, page, startIndex }
  }, [filtered, params.page])

  const scrollToGrid = () => {
    const grid = document.querySelector('#presale-grid') as HTMLElement | null
    if (!grid) return
    const headerEl = document.querySelector('header')
    const headerHeight = headerEl?.offsetHeight ?? 90
    const top = grid.getBoundingClientRect().top + window.scrollY - headerHeight - 16
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const artworkImages = paginatedArtworks.map(artwork => ({
    image: { src: artwork.imageUrl },
    name: artwork.name,
    price: artwork.price,
    order: artwork.order,
    artistName: `${artwork.artist.name} ${artwork.artist.surname}`,
    isSold: artwork.isSold || false
  }))


  return (
    <>
      <PresaleHero />

      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-10">

        {/* ── Filters ────────────────────────────────────────────────── */}
        <div className="border-t border-borderColor pt-8 mb-12 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-0 sm:justify-between">

          {/* Left: artist dropdown + search */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 sm:items-end">

            {/* Artist filter — underline style */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(o => !o)}
                aria-expanded={isOpen}
                className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] pb-1 border-b transition-colors duration-300 ${
                  params.artist
                    ? 'text-[#b89c72] border-[#b89c72]'
                    : 'text-textColor border-textColor hover:text-[#b89c72] hover:border-[#b89c72]'
                }`}
              >
                <span className="truncate max-w-[160px]">
                  {params.artist || t('presale.filters.allArtists')}
                </span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0 transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute z-20 top-full mt-2 w-52 bg-backgroundColor border border-borderColor shadow-md">
                  <button
                    className={`w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 ${
                      params.artist === ''
                        ? 'text-[#b89c72]'
                        : 'text-textColor hover:text-[#b89c72]'
                    }`}
                    onClick={() => { setParams({ artist: '', page: 1 }); setIsOpen(false) }}
                  >
                    {t('presale.filters.allArtists')}
                  </button>
                  <div className="max-h-56 overflow-y-auto">
                    {artists.map(artist => (
                      <button
                        key={artist}
                        className={`w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 border-t border-borderColor/40 ${
                          params.artist === artist
                            ? 'text-[#b89c72]'
                            : 'text-textColor hover:text-[#b89c72]'
                        }`}
                        onClick={() => { setParams({ artist, page: 1 }); setIsOpen(false) }}
                      >
                        {artist}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search — underline style */}
            <div className="flex items-center gap-2 border-b border-borderColor pb-1 focus-within:border-[#b89c72] transition-colors duration-300 w-full sm:w-64">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-textColor/40 flex-shrink-0"
                aria-hidden="true"
              >
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <input
                value={params.q}
                onChange={e => setParams({ q: e.target.value, page: 1 })}
                placeholder={t('presale.filters.searchPlaceholder')}
                className="bg-transparent outline-none text-[10px] uppercase tracking-[0.2em] placeholder-textColor/30 text-textColor flex-1 min-w-0 py-0"
              />
            </div>
          </div>

          {/* Right: results count */}
          <p className="section-number !mb-0">
            {filtered.length}&nbsp;
            {filtered.length > 1 ? t('presale.filters.artworksFound') : t('presale.filters.artworkFound')}
          </p>
        </div>

        {/* ── Artwork grid — 3 columns ────────────────────────────────── */}
        <div id="presale-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {artworkImages.map((item, index) => (
            <ArtworkCard key={`${item.name}-${startIndex + index}`} {...item} />
          ))}
        </div>

        {/* ── Pagination — text-link style ────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-8 mt-24">
            <button
              disabled={page === 1}
              onClick={() => { setParams({ page: page - 1 }); scrollToGrid() }}
              className="text-[10px] uppercase tracking-[0.25em] text-textColor border-b border-transparent hover:border-textColor pb-0.5 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t('pagination.previous')}
            </button>

            <span className="section-number !mb-0">
              {page}&nbsp;/&nbsp;{totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => { setParams({ page: page + 1 }); scrollToGrid() }}
              className="text-[10px] uppercase tracking-[0.25em] text-textColor border-b border-transparent hover:border-textColor pb-0.5 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t('pagination.next')}
            </button>
          </div>
        )}

        {/* ── Catalog download form ────────────────────────────────────── */}
        <div className="mt-32 mb-16 max-w-xl mx-auto border-t border-borderColor pt-16">
          <span className="section-number">{t('presale.onDemand')}</span>

          <h2 className="serif font-light text-3xl italic text-textColor mb-4">
            {t('presale.intro.buttons.catalog')}
          </h2>

          <p className="text-[10px] uppercase tracking-[0.3em] text-textColor/50 mb-10 leading-relaxed">
            {language === 'en'
              ? 'Enter your email to download our catalog'
              : 'Entrez votre email pour télécharger notre catalogue'
            }
          </p>

          <form action={handleCatalogDownload} className="space-y-8">
            {/* Champ caché pour la langue */}
            <input type="hidden" name="language" value={language} />

            {/* Email — underline style */}
            <div className="flex items-center gap-3 border-b-2 border-borderColor focus-within:border-[#b89c72] transition-colors duration-300 pb-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-textColor/30 flex-shrink-0"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('presale.intro.form.emailPlaceholder')}
                disabled={isPending}
                className="flex-1 bg-transparent outline-none text-sm text-textColor placeholder-textColor/30 py-1"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-cta !flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="text-[0.6rem] uppercase tracking-[0.25em]">
                {isPending
                  ? t('presale.intro.form.downloadingButton')
                  : t('presale.intro.form.downloadButton')
                }
              </span>
              <Download size={14} />
            </button>
          </form>
        </div>

      </div>

      {children}

      {/* Popup de succès */}
      <CatalogSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={t('presale.intro.successPopup.title')}
        subtitle={t('presale.intro.successPopup.subtitle')}
        message={t('presale.intro.successPopup.message')}
        closeButtonText={t('presale.intro.successPopup.closeButton')}
      />
    </>
  );
}
