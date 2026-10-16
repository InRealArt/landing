import { prisma } from '@/lib/prisma'
import { toSlug } from '@/utils/slug'
import { generateUgcSlug } from '@/utils/ugcSlug'

/**
 * Index des slugs publics, lu par src/proxy.ts avant le rendu (IRA-07).
 *
 * Pourquoi dans le proxy : les pages sont streamées (Suspense du layout racine, loading.tsx),
 * donc un notFound()/permanentRedirect() dans la page arrive après l'envoi du statut 200 et
 * devient une « soft 404 » (200 + <meta refresh>). Le proxy, lui, répond avant tout rendu.
 *
 * Les règles reproduisent celles des pages :
 * - œuvres : toutes les PresaleArtwork, slug = toSlug(name), la plus ancienne gagne en cas de doublon
 *   (getPresaleArtworkBySlug) ;
 * - artistes : LandingArtist avec artistsPage = true (getArtistBySlug) ;
 * - profils agence : LandingUgcArtistProfile par id (dernier segment), slug canonique = generateUgcSlug ;
 * - catégories d'artistes : nom de ArtistCategory, insensible à la casse (getArtistCategoryBySlug).
 *
 * Résilience : l'index périmé est servi pendant son rechargement ; un rechargement est borné à 2 s ;
 * après un échec, on ne réessaie pas avant 10 s. Sans index, le proxy laisse passer (les pages gèrent).
 */
interface SlugIndex {
  artworkSlugs: Set<string>
  artworkSlugById: Map<number, string>
  artistSlugs: Set<string>
  ugcSlugById: Map<number, string>
  categoryNames: Set<string>
  loadedAt: number
}

const TTL_MS = 60_000
/** Un slug absent de l'index déclenche un rechargement s'il date de plus de 10 s (œuvre tout juste publiée) */
const MISS_REFRESH_MS = 10_000
const LOAD_TIMEOUT_MS = 2_000
const FAILURE_BACKOFF_MS = 10_000

let index: SlugIndex | null = null
let loading: Promise<SlugIndex> | null = null
let lastFailureAt = 0

async function load(): Promise<SlugIndex> {
  const [artworks, artists, ugcProfiles, categories] = await Promise.all([
    prisma.presaleArtwork.findMany({ select: { id: true, name: true }, orderBy: { id: 'asc' } }),
    prisma.landingArtist.findMany({ where: { artistsPage: true }, select: { slug: true } }),
    prisma.landingUgcArtistProfile.findMany({ select: { id: true, pseudo: true, name: true, surname: true } }),
    prisma.artistCategory.findMany({ select: { name: true } }),
  ])

  const artworkSlugs = new Set<string>()
  const artworkSlugById = new Map<number, string>()
  for (const artwork of artworks) {
    const slug = toSlug(artwork.name)
    if (!slug) continue
    artworkSlugs.add(slug)
    artworkSlugById.set(artwork.id, slug)
  }

  return {
    artworkSlugs,
    artworkSlugById,
    artistSlugs: new Set(artists.map(a => a.slug)),
    ugcSlugById: new Map(ugcProfiles.map(p => [p.id, generateUgcSlug(p)])),
    categoryNames: new Set(categories.map(c => c.name.toLowerCase())),
    loadedAt: Date.now(),
  }
}

function startLoad(): Promise<SlugIndex> {
  loading ??= Promise.race([
    load(),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('slug index load timeout')), LOAD_TIMEOUT_MS)),
  ])
    .then(fresh => (index = fresh))
    .catch(error => {
      lastFailureAt = Date.now()
      throw error
    })
    .finally(() => { loading = null })
  return loading
}

/** Index d'au plus `maxAgeMs` ; si un index plus ancien existe, il est servi pendant le rechargement */
async function getIndex(maxAgeMs: number): Promise<SlugIndex | null> {
  const now = Date.now()
  if (index && now - index.loadedAt < maxAgeMs) return index
  if (now - lastFailureAt < FAILURE_BACKOFF_MS) return index
  if (index) {
    startLoad().catch(() => {}) // stale-while-revalidate
    return index
  }
  return startLoad()
}

/**
 * Cherche dans l'index. Si absent et index de plus de 10 s : un rechargement attendu, puis nouvelle lecture.
 * `null` = index indisponible (le proxy laisse alors passer).
 */
async function lookup<T>(read: (i: SlugIndex) => T | undefined): Promise<T | undefined | null> {
  const current = await getIndex(TTL_MS)
  if (!current) return null
  const found = read(current)
  if (found !== undefined || Date.now() - current.loadedAt < MISS_REFRESH_MS) return found
  if (Date.now() - lastFailureAt < FAILURE_BACKOFF_MS) return found
  try {
    return read(await startLoad())
  } catch {
    return found
  }
}

export type SlugResolution = { kind: 'ok' } | { kind: 'redirect'; slug: string } | { kind: 'unknown' } | { kind: 'unavailable' }

export async function resolveArtworkParam(param: string): Promise<SlugResolution> {
  const exists = await lookup(i => (i.artworkSlugs.has(param) ? true : undefined))
  if (exists === null) return { kind: 'unavailable' }
  if (exists) return { kind: 'ok' }
  if (/^\d+$/.test(param)) {
    const slug = await lookup(i => i.artworkSlugById.get(Number(param)))
    if (slug) return { kind: 'redirect', slug }
  }
  return { kind: 'unknown' }
}

export async function resolveArtistSlug(slug: string): Promise<SlugResolution> {
  const exists = await lookup(i => (i.artistSlugs.has(slug) ? true : undefined))
  if (exists === null) return { kind: 'unavailable' }
  return exists ? { kind: 'ok' } : { kind: 'unknown' }
}

/** Profil agence : « <nom>-<id> » ; toute autre graphie du même id redirige vers le slug canonique */
export async function resolveUgcProfileSlug(slug: string): Promise<SlugResolution> {
  const idPart = slug.split('-').pop() ?? ''
  if (!/^\d+$/.test(idPart)) return { kind: 'unknown' }
  const canonical = await lookup(i => i.ugcSlugById.get(Number(idPart)))
  if (canonical === null) return { kind: 'unavailable' }
  if (!canonical) return { kind: 'unknown' }
  return canonical === slug ? { kind: 'ok' } : { kind: 'redirect', slug: canonical }
}

export async function resolveArtistCategorySlug(slug: string): Promise<SlugResolution> {
  const exists = await lookup(i => (i.categoryNames.has(slug.toLowerCase()) ? true : undefined))
  if (exists === null) return { kind: 'unavailable' }
  return exists ? { kind: 'ok' } : { kind: 'unknown' }
}
