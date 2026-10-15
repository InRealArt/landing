// scripts/audit-recette.mjs — encode la section 5 de l'audit V2
// Usage : node scripts/audit-recette.mjs [baseUrl]   (RECETTE_LIMIT=n pour limiter le nombre d'URL)
// RECETTE_ORIGIN = domaine attendu dans le sitemap et les canonicals (Vercel sert www, l'apex redirige en 308)
// VERCEL_BYPASS = secret « Protection Bypass for Automation » pour tester une preview Vercel protégée
const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')
const ORIGIN = (process.env.RECETTE_ORIGIN || 'https://www.inrealart.com').replace(/\/$/, '')
const SITE_HOST = /^https:\/\/(www\.)?inrealart\.com/
const FORBIDDEN = /\b(nft|blockchain|web3|tokenis\w*|tokens?|investisseurs?)\b/i
const failures = []
const fail = (rule, url, detail) => failures.push(`FAIL ${rule} ${url} ${detail}`)
const HEADERS = {
  'user-agent': 'Googlebot',
  ...(process.env.VERCEL_BYPASS && { 'x-vercel-protection-bypass': process.env.VERCEL_BYPASS }),
}

const stripTags = html => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')

const decodeEntities = s => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')

async function get(url) {
  const res = await fetch(url, { redirect: 'manual', headers: HEADERS })
  return { status: res.status, html: res.status === 200 ? await res.text() : '' }
}

async function checkPage(url) {
  const { status, html } = await get(url)
  if (status !== 200) return fail('status', url, String(status))
  const h1 = (html.match(/<h1[\s>]/gi) || []).length
  if (h1 !== 1) fail('h1', url, `${h1} H1`)
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? ''
  if ((title.match(/InRealArt/g) || []).length > 1) fail('title', url, title)
  const rawCanonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1]
  const canonical = rawCanonical && decodeEntities(rawCanonical)
  const expected = url.replace(BASE, ORIGIN)
  if (!canonical) fail('canonical', url, 'absente')
  else if (canonical.replace(/\/$/, '') !== expected.replace(/\/$/, '')) fail('canonical', url, canonical)
  if (/<meta name="keywords"/i.test(html)) fail('meta-keywords', url, 'présente')
  const text = stripTags(html)
  // Articles de blog : le corps est un contenu éditorial daté (citations de marché, droit) hors règle ;
  // on contrôle uniquement ce qui est « signature » du site : title, meta description, H1.
  const isArticle = /^\/blog\/(?!category\/)[^/]+\/?$/.test(new URL(url).pathname)
  const scope = isArticle
    ? [title, html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? '',
       ...(html.match(/<h1[\s\S]*?<\/h1>/gi) || []).map(stripTags)].join(' ')
    : text
  const bad = decodeEntities(scope).match(FORBIDDEN)
  if (bad) fail('vocabulaire', url, bad[0])
  const bracket = text.match(/\[[^\]\n]{1,40}\]/)
  if (bracket) fail('crochets', url, bracket[0])
  const price = text.match(/\b\d{1,3},\d{3}\s?€/)
  if (price) fail('prix', url, price[0])
  if (/artwork\.\w+|No description available/.test(text)) fail('cle-brute', url, 'chaîne technique visible')
}

const sitemapRes = await fetch(`${BASE}/sitemap.xml`, { redirect: 'manual', headers: HEADERS })
if (sitemapRes.status !== 200) {
  console.log(`FAIL sitemap ${BASE}/sitemap.xml statut ${sitemapRes.status}`)
  process.exit(1)
}
const sitemap = await sitemapRes.text()
if (/<sitemapindex/i.test(sitemap)) {
  console.log('FAIL sitemap index de sitemaps non pris en charge par la recette')
  process.exit(1)
}
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
if (!locs.length) {
  console.log('FAIL sitemap aucune URL <loc> trouvée')
  process.exit(1)
}
const wrongHost = locs.filter(loc => !loc.startsWith(`${ORIGIN}/`) && loc !== ORIGIN)
if (wrongHost.length) fail('sitemap-domaine', 'sitemap.xml', `${wrongHost.length} URL hors ${ORIGIN} (ex. ${wrongHost[0]})`)
const urls = locs.map(loc => loc.replace(SITE_HOST, BASE))
if (new Set(urls).size !== urls.length) fail('sitemap', 'sitemap.xml', 'URL en double')
const limit = Number(process.env.RECETTE_LIMIT || urls.length)
for (const url of urls.slice(0, limit)) await checkPage(url)

console.log(failures.join('\n') || 'OK — toutes les règles passent')
const byRule = failures.reduce((acc, f) => ({ ...acc, [f.split(' ')[1]]: (acc[f.split(' ')[1]] || 0) + 1 }), {})
console.log(Object.entries(byRule).map(([rule, n]) => `${rule}: ${n}`).join(' · ') || '')
console.log(`${urls.length} URL dans le sitemap, ${failures.length} échec(s)`)
// exitCode plutôt que process.exit() : sinon la sortie est tronquée quand elle passe dans un pipe (| tail)
process.exitCode = failures.length ? 1 : 0
