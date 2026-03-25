'use server'

const EVENT_BASE_URL = 'https://event.inrealart.com'

export interface ExpoData {
  title: string
  location: string
  date: string
  imageUrl: string
  href: string
}

/**
 * Finds the JS chunk URL that contains the ordered list of artist slugs.
 * event.inrealart.com is a Next.js RSC app — HTML is not pre-rendered,
 * so we parse the slug list from the bundled JS instead.
 */
async function fetchOrderedSlugs(): Promise<string[]> {
  const mainRes = await fetch(EVENT_BASE_URL, { next: { revalidate: 3600 } })
  if (!mainRes.ok) return []
  const mainHtml = await mainRes.text()

  const scriptUrls = [
    ...mainHtml.matchAll(/src="(\/_next\/static\/chunks\/[^"]+\.js[^"]*)"/g),
  ].map((m) => EVENT_BASE_URL + m[1])

  for (const url of scriptUrls) {
    const r = await fetch(url, { next: { revalidate: 3600 } })
    if (!r.ok) continue
    const js = await r.text()

    // The chunk contains: for(let x of["slug1","slug2",...])
    const match = js.match(/for\(let [a-z] of(\["[^)]+"\])\)/)
    if (match) {
      try {
        return JSON.parse(match[1]) as string[]
      } catch {
        return []
      }
    }
  }

  return []
}

/**
 * Fetches eventInfo for a given slug via the Next.js RSC endpoint.
 */
async function fetchExpoDataForSlug(slug: string): Promise<ExpoData | null> {
  const url = `${EVENT_BASE_URL}/${slug}?_rsc=1`
  const r = await fetch(url, {
    headers: { RSC: '1' },
    next: { revalidate: 3600 },
  })
  if (!r.ok) return null

  const text = await r.text()

  const infoMatch = text.match(
    /"eventInfo":\{"title":"([^"]+)","quand":"([^"]+)","ou":"([^"]+)"/
  )
  const posterMatch = text.match(/"posterImage":"([^"]+)"/)

  if (!infoMatch) return null

  const [, title, quand, ou] = infoMatch
  const posterPath = posterMatch?.[1] ?? ''

  return {
    title,
    date: quand,
    location: ou,
    imageUrl: posterPath
      ? `${EVENT_BASE_URL}/_next/image?url=${encodeURIComponent(posterPath)}&w=800&q=75`
      : '',
    href: `${EVENT_BASE_URL}/${slug}`,
  }
}

/**
 * Returns the 2 most recent unique expositions from event.inrealart.com.
 * Slugs are in DOM order (most recent first). Multiple slugs can share
 * the same expo title (one per artist) — we keep only the first occurrence.
 */
export async function getLatestExpos(): Promise<ExpoData[]> {
  const slugs = await fetchOrderedSlugs()
  if (slugs.length === 0) return []

  const seen = new Set<string>()
  const result: ExpoData[] = []

  for (const slug of slugs) {
    const expo = await fetchExpoDataForSlug(slug)
    if (!expo) continue
    if (seen.has(expo.title)) continue

    seen.add(expo.title)
    result.push(expo)

    if (result.length === 2) break
  }

  return result
}
