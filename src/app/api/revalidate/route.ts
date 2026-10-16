import { createHash, timingSafeEqual } from 'crypto'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Contrat d'appel pour le back-office : docs/CACHE_REVALIDATION.md
// Tags des unstable_cache du site (src/app/services/page.tsx) : purgés aussi par `all`
const ALL_DATA_TAGS = ['team']
const pathSchema = z.string().startsWith('/').max(300)
const bodySchema = z.object({
  secret: z.string(),
  paths: z.array(pathSchema).min(1).max(100).optional(),
  path: pathSchema.optional(),
  tags: z.array(z.string().min(1).max(100)).min(1).max(20).optional(),
  all: z.boolean().optional(),
})

// Comparaison en temps constant (les empreintes SHA-256 ont toujours la même longueur)
const sha256 = (value: string) => createHash('sha256').update(value).digest()
const isValidSecret = (secret: string) =>
  !!process.env.REVALIDATE_SECRET && timingSafeEqual(sha256(secret), sha256(process.env.REVALIDATE_SECRET))

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const { secret, paths, path, tags, all } = parsed.data
  if (!isValidSecret(secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (all) {
    revalidatePath('/', 'layout') // purge tout le site
    ALL_DATA_TAGS.forEach(tag => revalidateTag(tag, { expire: 0 })) // + caches de données taggés (unstable_cache)
    return NextResponse.json({ revalidated: true, scope: 'all' })
  }

  const targets = [...(paths ?? []), ...(path ? [path] : [])]
  if (!targets.length && !tags?.length) {
    return NextResponse.json({ error: 'Missing path(s) or tag(s)' }, { status: 400 })
  }
  targets.forEach(p => revalidatePath(p))
  // expire: 0 → expiration immédiate (pas de stale-while-revalidate) : la requête suivante lit la base
  tags?.forEach(tag => revalidateTag(tag, { expire: 0 }))
  return NextResponse.json({ revalidated: true, paths: targets, tags: tags ?? [] })
}
