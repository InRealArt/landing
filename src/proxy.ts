import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { resolveArtSalonSlug, resolveArtistCategorySlug, resolveArtistSlug, resolveArtworkParam, resolveBlogCategorySlug, resolveBlogPostSlug, resolveGameSlug, resolveUgcProfileSlug, type SlugResolution } from '@/lib/slugIndex'

// Map first URL segment → redirect target for unknown sub-paths
const SEGMENT_REDIRECTS: Record<string, string> = {
  artists: '/artists',
  blog: '/blog',
  artwork: '/presale',
  presale: '/presale',
  games: '/',
  'art-salon-simulator': '/simulators',
  'loa-simulator': '/simulators',
  'heritage-art-simulator': '/simulators',
  simulators: '/simulators',
  usecase: '/usecase',
  joinInRealArt: '/joinInRealArt',
  faq: '/faq',
  about: '/team',
  team: '/team',
  marketplace: '/presale',
  glossary: '/glossary',
  academy: '/blog',
  contact: '/contact',
  legal: '/legal',
  terms: '/terms',
  roadmap: '/',
  manifest: '/manifest',
  services: '/services',
}

// Pages retirées : /marketplace, /about, /academy, /roadmap, /usecase/fractionate et /usecase/lending
// sont redirigées en 308 par next.config.ts (redirects), avant ce proxy.
// /terms-nft est définitivement supprimée : 410 Gone.
const GONE_ROUTES = new Set(['/terms-nft'])

// Known valid static routes — these are never redirected
const KNOWN_STATIC_ROUTES = new Set([
  '/',
  '/artists',
  '/artists-studio',
  '/art-salon-simulator',
  '/blog',
  '/contact',
  '/faq',
  '/faq/translated',
  '/glossary',
  '/heritage-art-simulator',
  '/joinInRealArt',
  '/joinInRealArt/artists',
  '/joinInRealArt/galleries',
  '/legal',
  '/loa-simulator',
  '/manifest',
  '/media',
  '/media/production',
  '/presale',
  '/simulators',
  '/team',
  '/terms',
  '/usecase',
  '/usecase/companies',
  '/usecase/leasing',
  '/usecase/leasing/hotelPrestige',
  '/usecase/leasing/immobilier',
  '/usecase/capital/contact',
  '/services',
  '/agence',
  '/agence/artists',
  '/agence/brief',
  // Image de partage générée par src/app/opengraph-image.tsx
  '/opengraph-image',
])

// Known dynamic route prefixes with exactly one slug segment — always valid
const DYNAMIC_PREFIXES = new Set([
  '/artists/category/',
  '/artists/',
  '/blog/category/',
  '/blog/',
  '/artwork/',
  '/games/',
  '/art-salon-simulator/',
  '/agence/artists/',
])

/** Chemin inconnu : 308 vers la section qui le remplace, sinon vraie 404 */
function redirectToParentOrNotFound(request: NextRequest): NextResponse {
  const firstSegment = request.nextUrl.pathname.split('/').filter(Boolean)[0]
  const target = Object.hasOwn(SEGMENT_REDIRECTS, firstSegment) ? SEGMENT_REDIRECTS[firstSegment] : null
  return target ? redirectTo(request, target) : notFound(request)
}

function nextWithPathname(request: NextRequest): NextResponse {
  const response = NextResponse.next()
  response.headers.set('x-pathname', request.nextUrl.pathname)
  return response
}

function redirectTo(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = pathname // les paramètres (UTM…) sont conservés
  return NextResponse.redirect(url, { status: 308 })
}

/** Réécrit vers la page 404 de l'app : statut 404 décidé avant tout rendu, donc sans streaming en 200 */
function notFound(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = '/_not-found'
  return NextResponse.rewrite(url, { status: 404 })
}

// fallback : page qui remplace un slug inconnu ; null quand il n'y en a pas (vraie 404)
const SLUG_SECTIONS = {
  artwork: { resolve: resolveArtworkParam, fallback: '/presale' },
  artists: { resolve: resolveArtistSlug, fallback: '/artists' },
  'agence/artists': { resolve: resolveUgcProfileSlug, fallback: '/agence/artists' },
  'artists/category': { resolve: resolveArtistCategorySlug, fallback: '/artists' },
  blog: { resolve: resolveBlogPostSlug, fallback: null },
  'blog/category': { resolve: resolveBlogCategorySlug, fallback: null },
  'art-salon-simulator': { resolve: resolveArtSalonSlug, fallback: null },
  games: { resolve: resolveGameSlug, fallback: null },
} as const satisfies Record<string, { resolve: (slug: string) => Promise<SlugResolution>; fallback: string | null }>

/**
 * Fiches à slug (IRA-07) : vérifie l'existence avant le rendu, pour répondre un vrai 308 ou une
 * vraie 404 au lieu d'une page 200 (voir src/lib/slugIndex.ts). Index indisponible ou erreur : on laisse passer.
 */
async function checkSlugPage(request: NextRequest, pathname: string): Promise<NextResponse | null> {
  const match = pathname.match(/^\/(artwork|artists\/category|artists|agence\/artists|blog\/category|blog|art-salon-simulator|games)\/([^/]+)\/?$/)
  if (!match) return null
  const section = SLUG_SECTIONS[match[1] as keyof typeof SLUG_SECTIONS]
  let slug: string
  try {
    slug = decodeURIComponent(match[2])
  } catch {
    return null
  }

  try {
    const resolution = await section.resolve(slug)
    if (resolution.kind === 'redirect') return redirectTo(request, `/${match[1]}/${resolution.slug}`)
    if (resolution.kind === 'unknown') return section.fallback ? redirectTo(request, section.fallback) : notFound(request)
    return null
  } catch (error) {
    console.error('[proxy] slug index unavailable:', error)
    return null
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pass through Server Actions (POST requests with Next-Action header)
  if (request.method === 'POST' && request.headers.has('next-action')) {
    return nextWithPathname(request)
  }

  // Pass through Next.js internals, API routes, and static files
  // (sous /blog/, un point n'indique pas un fichier : Google connaît /blog/www.inrealart.com)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    (pathname.includes('.') && !pathname.startsWith('/blog/'))
  ) {
    return nextWithPathname(request)
  }

  // Pages définitivement supprimées
  if (GONE_ROUTES.has(pathname.replace(/\/$/, ''))) {
    return new NextResponse('Gone', { status: 410, headers: { 'content-type': 'text/plain; charset=utf-8' } })
  }

  // Known static routes are always valid
  if (KNOWN_STATIC_ROUTES.has(pathname)) {
    return nextWithPathname(request)
  }

  const slugResponse = await checkSlugPage(request, pathname)
  if (slugResponse) return slugResponse

  // Known dynamic prefixes: allow any single slug segment
  for (const prefix of DYNAMIC_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      const rest = pathname.slice(prefix.length).replace(/\/$/, '')
      // Allow one slug segment (no further slashes)
      if (rest.length > 0 && !rest.includes('/')) {
        return nextWithPathname(request)
      }
      // Deep unknown path under a known prefix
      return redirectToParentOrNotFound(request)
    }
  }

  // Completely unknown path
  return redirectToParentOrNotFound(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
