import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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
  about: '/about',
  team: '/team',
  marketplace: '/marketplace',
  glossary: '/glossary',
  academy: '/academy',
  contact: '/contact',
  legal: '/legal',
  terms: '/terms',
  roadmap: '/roadmap',
  manifest: '/manifest',
  services: '/services',
}

// Pages retirées : /usecase/fractionate et /usecase/lending ne figurent plus dans KNOWN_STATIC_ROUTES,
// ils tombent donc dans la redirection 308 vers /usecase (SEGMENT_REDIRECTS).
// /terms-nft est définitivement supprimée : 410 Gone.
const GONE_ROUTES = new Set(['/terms-nft'])

// Known valid static routes — these are never redirected
const KNOWN_STATIC_ROUTES = new Set([
  '/',
  '/about',
  '/academy',
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
  '/marketplace',
  '/media',
  '/media/production',
  '/presale',
  '/roadmap',
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

function getRedirectTarget(pathname: string): string {
  const firstSegment = pathname.split('/').filter(Boolean)[0]
  return SEGMENT_REDIRECTS[firstSegment] ?? '/'
}

function nextWithPathname(request: NextRequest): NextResponse {
  const response = NextResponse.next()
  response.headers.set('x-pathname', request.nextUrl.pathname)
  return response
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pass through Server Actions (POST requests with Next-Action header)
  if (request.method === 'POST' && request.headers.has('next-action')) {
    return nextWithPathname(request)
  }

  // Pass through Next.js internals, API routes, and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
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

  // Known dynamic prefixes: allow any single slug segment
  for (const prefix of DYNAMIC_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      const rest = pathname.slice(prefix.length).replace(/\/$/, '')
      // Allow one slug segment (no further slashes)
      if (rest.length > 0 && !rest.includes('/')) {
        return nextWithPathname(request)
      }
      // Deep unknown path under a known prefix → redirect to parent
      const url = request.nextUrl.clone()
      url.pathname = getRedirectTarget(pathname)
      return NextResponse.redirect(url, { status: 308 })
    }
  }

  // Completely unknown top-level path → redirect to intelligent parent
  const url = request.nextUrl.clone()
  url.pathname = getRedirectTarget(pathname)
  return NextResponse.redirect(url, { status: 308 })
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
