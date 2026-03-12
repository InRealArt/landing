'use client'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import PresaleHero from "@/components/presale/PresaleHero";
import ArtworkCard from "@/components/common/cards/ArtworkCardOrder";
import { usePresaleArtworkStore } from '@/store/usePresaleArtworkStore'
import { useLanguageStore } from '@/store/languageStore';
import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs'
import BlockFaq from '@/components/common/BlockFaq';
import Button from "@/components/common/Button";
import { ArrowRight, Mail, Download } from "lucide-react";
import FAQ from '@/components/common/FAQ/FAQ';
import { useLazyRecaptcha } from '@/hooks/useLazyRecaptcha'
import { toast } from 'sonner'
import { downloadCatalog } from '@/actions/catalogActions'
import CatalogSuccessModal from '@/components/common/SuccessModal'

const PAGE_SIZE = 16 // 4 colonnes x 4 lignes

export default function PresaleClient() {
  const { t, language } = useLanguageStore();
  const { 
    artworks,
    fetchPresaleArtworks, 
    isLoading, 
    hasError 
  } = usePresaleArtworkStore()

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

  useEffect(() => {
    fetchPresaleArtworks()
  }, [fetchPresaleArtworks])

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
      ? artworks.filter(artwork => artwork.artistName.toLowerCase().includes(params.artist.toLowerCase()))
      : artworks

    // Filtre par recherche (nom d'artiste ou nom d'œuvre)
    const query = params.q.trim().toLowerCase()
    const bySearch = query
      ? byArtist.filter(artwork => 
          artwork.name.toLowerCase().includes(query) ||
          artwork.artistName.toLowerCase().includes(query)
        )
      : byArtist

    return bySearch
  }, [artworks, params.artist, params.q])

  // Liste unique des artistes pour le dropdown
  const artists = useMemo(() => {
    const uniqueArtists = Array.from(new Set(artworks.map(artwork => artwork.artistName)))
    return uniqueArtists.sort()
  }, [artworks])

  // Calculs de pagination avec filtrage
  const { paginatedArtworks, totalPages, page, startIndex, endIndex } = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const page = Math.min(params.page, totalPages)
    const start = (page - 1) * PAGE_SIZE
    const paginatedArtworks = filtered.slice(start, start + PAGE_SIZE)
    const startIndex = start
    const endIndex = Math.min(start + PAGE_SIZE, filtered.length)
    
    return { paginatedArtworks, totalPages, page, startIndex, endIndex }
  }, [filtered, params.page])

  const artworkImages = paginatedArtworks.map(artwork => ({
    image: { src: artwork.url },
    name: artwork.name,
    price: artwork.price,
    order: artwork.order,
    artistName: artwork.artistName,
    isSold: artwork.isSold || false
  }))

  if (isLoading) {
    return (
      <>
        <PresaleHero />
        <div className="relative max-w-90 xl:max-w-screen-xl m-auto mt-10 text-center">
          {t('team.loading')}
        </div>
      </>
    )
  }

  if (hasError) {
    return (
      <>
        <PresaleHero />
        <div className="relative max-w-90 xl:max-w-screen-xl m-auto mt-10 text-center">
          {t('team.error')}
        </div>
      </>
    )
  }
  

  return (
    <>
      <PresaleHero />
      <div className="relative max-w-screen-2xl m-auto px-10 mt-48">
        <div className="border-b border-border-light pb-12 mb-16">
          <span className="section-number">{t('presale.onDemand')}</span>
          <h1 className="text-6xl md:text-8xl serif">
            Œuvres <span className="italic text-gold-accent">Sélectionnées</span>
          </h1>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 mt-6 max-w-xl leading-relaxed">
            {t('presale.catalog.description')}
          </p>
        </div>
        
        {/* Filtres */}
        <div className="space-y-4 mb-6">
          {/* Top row: Filter button and results count */}
          <div className="flex items-center justify-between">
            {/* Filtre par artiste */}
            <div ref={dropdownRef} className="relative inline-block">
              <button
                type="button"
                onClick={() => setIsOpen(o => !o)}
                className="inline-flex items-center gap-2 rounded-full bg-cardBackground text-textColor px-4 py-2 shadow-md hover:shadow-lg border border-borderColor transition-all duration-200 bricolage-grotesque font-medium text-sm"
              >
                <span className="truncate max-w-[140px] sm:max-w-none">{params.artist || t('presale.filters.allArtists')}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-200 flex-shrink-0" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute z-20 mt-2 w-48 sm:w-56 rounded-2xl bg-cardBackground p-2 shadow-xl ring-1 ring-borderColor border border-borderColor right-0 sm:right-auto">
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 bricolage-grotesque font-medium text-sm ${
                      params.artist === '' 
                        ? 'bg-purpleColor/20 text-purpleColor' 
                        : 'text-textColor hover:bg-backgroundGrey'
                    }`}
                    onClick={() => { setParams({ artist: '', page: 1 }); setIsOpen(false) }}
                  >{t('presale.filters.allArtists')}</button>
                  <div className="max-h-48 sm:max-h-64 overflow-y-auto">
                    {artists.map(artist => (
                      <button
                        key={artist}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 bricolage-grotesque font-medium text-sm ${
                          params.artist === artist 
                            ? 'bg-purpleColor/20 text-purpleColor' 
                            : 'text-textColor hover:bg-backgroundGrey'
                        }`}
                        onClick={() => { setParams({ artist, page: 1 }); setIsOpen(false) }}
                      >{artist}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Nombre de résultats */}
            <div className="text-grayText text-sm bricolage-grotesque font-medium">
              {filtered.length} {filtered.length > 1 ? t('presale.filters.artworksFound') : t('presale.filters.artworkFound')}
            </div>
          </div>

          {/* Bottom row: Search bar */}
          <div className="w-full">
            <div className="inline-flex items-center gap-3 rounded-full bg-cardBackground text-textColor px-4 py-2 shadow-md border border-borderColor focus-within:ring-2 focus-within:ring-purpleColor focus-within:border-transparent transition-all duration-200 w-full max-w-md">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-grayText flex-shrink-0">
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <input
                value={params.q}
                onChange={e => setParams({ q: e.target.value, page: 1 })}
                placeholder={t('presale.filters.searchPlaceholder')}
                className="bg-transparent outline-none text-sm placeholder-grayText text-textColor bricolage-grotesque font-medium flex-1 min-w-0"
              />
            </div>
          </div>
        </div>
        
        {/* Grille des artworks - 4 colonnes sur desktop, responsive sur mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {artworkImages.map((item, index) => (
            <ArtworkCard key={`${item.name}-${startIndex + index}`} {...item} />
          ))}
        </div>

        {/* Pagination simple comme ArtistsGrid */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setParams({ page: page - 1 })}
              className="px-4 py-2 rounded-lg bg-backgroundGrey text-textColor disabled:opacity-40 hover:bg-backgroundGrey/80 transition-colors"
            >
              {t('pagination.previous')}
            </button>
            <div className="text-textColor/80 px-4">
              {t('pagination.page')} {page} / {totalPages}
            </div>
            <button
              disabled={page === totalPages}
              onClick={() => setParams({ page: page + 1 })}
              className="px-4 py-2 rounded-lg bg-backgroundGrey text-textColor disabled:opacity-40 hover:bg-backgroundGrey/80 transition-colors"
            >
              {t('pagination.next')}
            </button>
          </div>
        )}

        {/* Formulaire de téléchargement du catalogue après la pagination */}
        <div className="flex justify-center mt-12">
          <div className="bg-gradient-to-br from-gradientFrom to-gradientTo rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-textColor mb-2">
                {t('presale.intro.buttons.catalog')}
              </h3>
              <p className="text-textColor/80 text-sm">
                {language === 'en' 
                  ? 'Enter your email to download our catalog' 
                  : 'Entrez votre email pour télécharger notre catalogue'
                }
              </p>
            </div>

            <form
              action={handleCatalogDownload}
              className="space-y-4"
            >
              {/* Champ caché pour la langue */}
              <input type="hidden" name="language" value={language} />

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textColor/60" size={20} />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('presale.intro.form.emailPlaceholder')}
                  disabled={isPending}
                  className="w-full pl-12 pr-4 py-4 bg-backgroundGrey/20 border-2 border-borderColor rounded-lg text-textColor placeholder-grayText focus:outline-none focus:border-purpleColor transition-colors"
                  required
                />
              </div>

              {/* Bouton de téléchargement */}
              <Button
                type="submit"
                disabled={isPending}
                text={isPending 
                  ? t('presale.intro.form.downloadingButton')
                  : t('presale.intro.form.downloadButton')
                }
                additionalClassName="w-full bg-purpleColor"
                icon={<Download />}
                center
              />
            </form>
          </div>
        </div>
        
        {/* <BuyProcess /> */}
      </div>

      {/* <BlockFaq title={t('presale.faq.title')} description={t('presale.faq.description')} /> */}
      <FAQ titre={t('presale.faq.title')} description={t('presale.faq.description')} />
      
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
