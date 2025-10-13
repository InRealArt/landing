'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import StickyFooter from './StickyFooter'
import { getActiveStickyFooter, StickyFooterData } from '@/actions/stickyFooterActions'

interface StickyFooterManagerProps {
  className?: string
}

export default function StickyFooterManager({ className }: StickyFooterManagerProps) {
  const [stickyFooterData, setStickyFooterData] = useState<StickyFooterData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchStickyFooter = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Convertir le pathname en format LandingPage si possible
        const currentPage = getCurrentPageFromPathname(pathname)
        
        const data = await getActiveStickyFooter(currentPage)
        setStickyFooterData(data)
      } catch (err) {
        console.error('❌ Erreur lors du chargement du sticky footer:', err)
        setError('Erreur lors du chargement du sticky footer')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStickyFooter()
  }, [pathname, mounted])

  // Ne pas afficher pendant le chargement ou en cas d'erreur
  if (isLoading || error || !stickyFooterData) {
    return null
  }

  // Vérifier que le sticky footer a du contenu à afficher
  if (!stickyFooterData.title && !stickyFooterData.text) {
    return null
  }

  return (
    <div className={className}>
      <StickyFooter
        id={stickyFooterData.id}
        title={stickyFooterData.title}
        text={stickyFooterData.text}
        textButton={stickyFooterData.textButton}
        buttonUrl={stickyFooterData.buttonUrl}
      />
    </div>
  )
}

/**
 * Convertit le pathname en format LandingPage pour la correspondance avec la base de données
 */
function getCurrentPageFromPathname(pathname: string): string | undefined {
  // Mapping des paths vers les valeurs de l'enum LandingPage
  const pathMapping: Record<string, string> = {
    '/': 'root',
    '/artists': 'artists',
    '/marketplace': 'marketplace',
    '/token': 'token',
    '/usecase': 'usecase',
    '/usecase/leasing': 'usecaseLeasing',
    '/usecase/lending': 'usecaseLending',
    '/usecase/fractionate': 'usecaseFractionate',
    '/usecase/companies': 'usecaseCompanies',
    '/roadmap': 'roadmap',
    '/presale': 'presale',
    '/team': 'team',
    '/loa-simulator': 'loa_simulator',
    '/heritage-art-simulator': 'heritage_art_simulator',
    '/art-salon-simulator/artbasel-paris': 'art_salon_simulator_artbasel_paris',
    '/art-salon-simulator/artgeneve': 'art_salon_simulator_artgeneve',
    '/joinInRealArt': 'joinInRealArt',
    '/joinInRealArt/artists': 'joinInRealArt_artists',
    '/joinInRealArt/galleries': 'joinInRealArt_galleries',
    '/faq': 'faq',
    '/faq/translated': 'faq_translated',
    '/glossary': 'glossary',
    '/contact': 'contact',
    '/terms': 'terms',
    '/terms-nft': 'terms_nft',
    '/legal': 'legal'
  }

  return pathMapping[pathname]
}
