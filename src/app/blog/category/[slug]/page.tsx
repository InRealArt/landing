import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { generateDynamicMetadata } from '@/utils/metadata'
import {
  getCategoryBySlug,
  getPostsByCategorySlug,
  getLanguageIdByCode,
  getCategoriesWithTranslations,
} from '@/actions/seoPostActions'
import BlogCategoryPageClient from './BlogCategoryPageClient'
import { SeoPost } from '@/types/seoPost'

type ParamsType = Promise<{ slug: string }>

interface Props {
  params: ParamsType
}

// ---------------------------------------------------------------------------
// Static params — pre-renders every known category at build time.
// The slug stored in the DB is the `url` column on seoCategory.
// ---------------------------------------------------------------------------
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const categories = await getCategoriesWithTranslations('fr')
  return categories
    .filter((c) => c.url !== null)
    .map((c) => ({ slug: c.url as string }))
}

// ---------------------------------------------------------------------------
// Metadata — re-uses the category already fetched by generateStaticParams
// without an extra DB round-trip at runtime when the page is pre-rendered.
// For dynamic (ISR / on-demand) requests the single getCategoryBySlug call
// here is the only DB query for metadata; the page component below calls
// getPostsByCategorySlug which internally calls getCategoryBySlug again —
// this is a known minor duplication that is acceptable versus the complexity
// of sharing a per-request cache across generateMetadata and the page RSC.
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const category = await getCategoryBySlug(slug)
  if (!category) {
    return {
      title: 'Catégorie non trouvée | InRealArt',
      description: "Cette catégorie n'existe pas ou n'est plus disponible.",
    }
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://inrealart.com'
  const canonical = `${baseUrl}/blog/category/${slug}`

  return generateDynamicMetadata({
    title: `${category.name} - Blog`,
    description: `Découvrez tous les articles de la catégorie ${category.name} sur InRealArt. Actualités, guides et analyses sur l'art tokenisé.`,
    keywords: [category.name, 'blog', 'articles', 'art tokenisé', 'actualités'],
    canonical,
    alternateLanguages: {
      'x-default': canonical,
      fr: canonical,
      en: canonical,
    },
  })
}

// ---------------------------------------------------------------------------
// Page — Server Component.
//
// Fetches data for the DEFAULT language (French) server-side so that:
//   1. The first paint is fully rendered HTML — no loading skeleton for crawlers.
//   2. The client component receives `initialPosts` / `initialCategory` as props
//      and can display them immediately without any client-side fetch on mount.
//   3. When the user switches language the client component re-fetches for the
//      new language, but the French fallback is always present from SSR.
//
// `notFound()` is called when the slug does not match any category, which
// renders the nearest not-found.tsx boundary instead of a broken inline UI.
// ---------------------------------------------------------------------------
export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  // French is the default language and is always pre-rendered on the server.
  const DEFAULT_LANGUAGE_CODE = 'fr'

  const languageId = await getLanguageIdByCode(DEFAULT_LANGUAGE_CODE)
  if (!languageId) {
    // The language table is missing the 'fr' row — this is a data integrity
    // issue; fall through to the not-found boundary rather than a crash.
    notFound()
  }

  const result = await getPostsByCategorySlug(slug, languageId)

  if (!result.category) {
    // Slug does not match any row in seoCategory.url — render the 404 page.
    notFound()
  }

  return (
    <BlogCategoryPageClient
      categorySlug={slug}
      initialPosts={result.posts as SeoPost[]}
      initialCategory={result.category}
    />
  )
}
