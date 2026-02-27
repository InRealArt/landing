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
}

// Known valid static routes — these are never redirected
const KNOWN_STATIC_ROUTES = new Set([
  '/',
  '/about',
  '/academy',
  '/artists',
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
  '/presale',
  '/roadmap',
  '/simulators',
  '/team',
  '/terms',
  '/terms-nft',
  '/usecase',
  '/usecase/companies',
  '/usecase/fractionate',
  '/usecase/leasing',
  '/usecase/lending',
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
])

function getRedirectTarget(pathname: string): string {
  const firstSegment = pathname.split('/').filter(Boolean)[0]
  return SEGMENT_REDIRECTS[firstSegment] ?? '/'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pass through Next.js internals, API routes, and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Known static routes are always valid
  if (KNOWN_STATIC_ROUTES.has(pathname)) {
    return NextResponse.next()
  }

  // Known dynamic prefixes: allow any single slug segment
  for (const prefix of DYNAMIC_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      const rest = pathname.slice(prefix.length).replace(/\/$/, '')
      // Allow one slug segment (no further slashes)
      if (rest.length > 0 && !rest.includes('/')) {
        return NextResponse.next()
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
