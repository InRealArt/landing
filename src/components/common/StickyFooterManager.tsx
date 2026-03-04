import { headers } from 'next/headers'
import StickyFooter from './StickyFooter'
import { getActiveStickyFooter } from '@/actions/stickyFooterActions'

/**
 * Convertit le pathname en clé LandingPage pour la correspondance avec la base de données.
 *
 * Les pages dynamiques (/blog/[id], /artists/[id], etc.) retournent undefined :
 * seuls les sticky footers avec activeOnAllPages=true leur seront affichés.
 */
function getCurrentPageFromPathname(pathname: string): string | undefined {
  const pathMapping: Record<string, string> = {
    '/': 'root',
    '/artists': 'artists',
    '/marketplace': 'marketplace',
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
    '/legal': 'legal',
  }

  return pathMapping[pathname]
}

/**
 * Server Component — lit le pathname depuis le header x-pathname injecté par le middleware,
 * récupère le sticky footer actif via Prisma (Server Action), et passe les données
 * en props au Client Component StickyFooter.
 *
 * Aucun appel réseau côté client. Aucun useEffect de fetch.
 * StickyFooter gère uniquement l'affichage et le localStorage (fermeture).
 */
export default async function StickyFooterManager() {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? '/'
  const currentPage = getCurrentPageFromPathname(pathname)

  const data = await getActiveStickyFooter(currentPage)

  if (!data) return null
  if (!data.title && !data.text) return null

  return (
    <StickyFooter
      id={data.id}
      title={data.title}
      text={data.text}
      textButton={data.textButton}
      buttonUrl={data.buttonUrl}
    />
  )
}
