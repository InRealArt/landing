'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import FirebaseImage from '@/components/common/FirebaseImage'
import { useLanguageStore } from '@/store/languageStore'
import { SeoPost } from '@/types/seoPost'
import { getPostsByCategorySlug, getLanguageIdByCode } from '@/actions/seoPostActions'
import { generateCollectionJsonLd, generateBreadcrumbJsonLd } from '@/utils/metadata'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CategoryData {
  id: number
  name: string
  color: string | null
  url: string | null
}

interface Props {
  categorySlug: string
  /** Server-rendered initial data for the default language (French). */
  initialPosts: SeoPost[]
  initialCategory: CategoryData
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://inrealart.com'

// ---------------------------------------------------------------------------
// Component
//
// Rendering strategy:
//   - First paint uses `initialPosts` / `initialCategory` provided by the
//     Server Component parent — no loading state, no layout shift.
//   - When the user switches language, a client-side re-fetch updates the
//     posts and the translated category name.
//   - `isRefetching` tracks the language-switch re-fetch without hiding the
//     existing content (posts stay visible while the new language loads).
// ---------------------------------------------------------------------------

export default function BlogCategoryPageClient({
  categorySlug,
  initialPosts,
  initialCategory,
}: Props) {
  const { language, t } = useLanguageStore()

  const [posts, setPosts] = useState<SeoPost[]>(initialPosts)
  const [category, setCategory] = useState<CategoryData>(initialCategory)
  const [isRefetching, setIsRefetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Re-fetch only when the language changes.
  // The initial French data was already provided by the server, so we skip
  // the first mount when the language is 'fr' (no wasted round-trip).
  useEffect(() => {
    if (language === 'fr') {
      // Restore initial server data if the user switches back to French.
      setPosts(initialPosts)
      setCategory(initialCategory)
      setFetchError(null)
      return
    }

    let cancelled = false

    const refetchForLanguage = async () => {
      setIsRefetching(true)
      setFetchError(null)

      try {
        const languageId = await getLanguageIdByCode(language)
        if (!languageId) {
          throw new Error(`Langue inconnue : ${language}`)
        }

        const result = await getPostsByCategorySlug(categorySlug, languageId)

        if (cancelled) return

        if (result.category) {
          setPosts(result.posts as SeoPost[])
          setCategory(result.category)
        }
        // If the category has no translated posts for this language we keep
        // the French content rather than showing an empty page.
      } catch {
        if (!cancelled) {
          setFetchError('Erreur lors du chargement des articles')
        }
      } finally {
        if (!cancelled) {
          setIsRefetching(false)
        }
      }
    }

    refetchForLanguage()

    return () => {
      cancelled = true
    }
  }, [language, categorySlug, initialPosts, initialCategory])

  // JSON-LD is derived entirely from our own typed data — no user HTML involved.
  const collectionLd = generateCollectionJsonLd(
    `${category.name} - Blog InRealArt`,
    `Articles de la catégorie ${category.name}`,
    posts.map((post) => ({
      name: post.title,
      url: `${BASE_URL}/blog/${post.slug}`,
    }))
  )

  const breadcrumbLd = generateBreadcrumbJsonLd([
    { name: 'Accueil', url: BASE_URL },
    { name: 'Blog', url: `${BASE_URL}/blog` },
    { name: category.name },
  ])

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: collectionLd }}
      />
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbLd }}
      />

      <main className="min-h-screen pt-headerSize text-textColor bg-canvas-white">
        <div className="max-w-screen-2xl m-auto px-10 py-16">
          {/* Category header */}
          <div className="mb-12 border-b border-border-light pb-12">
            <span className="section-number">Blog</span>
            <h1 className="text-6xl md:text-8xl serif text-ink-black mb-6"><span className="italic text-gold-accent">{category.name}</span></h1>
            {(category as { description?: string }).description && (
              <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 max-w-2xl leading-relaxed">
                {(category as { description?: string }).description}
              </p>
            )}
          </div>

          {/* Inline error — displayed alongside existing content, not instead */}
          {fetchError && (
            <p className="text-sm text-red-500 mb-6">{fetchError}</p>
          )}

          {/* Post grid — dimmed while a language re-fetch is in progress */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-light)] transition-opacity duration-200 ${
              isRefetching ? 'opacity-50' : 'opacity-100'
            }`}
          >
            {posts.length === 0 ? (
              <p className="col-span-full text-grayText bg-[var(--canvas-bg)] p-8">
                {t('blog.noPosts')}
              </p>
            ) : (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block border-0 p-6 bg-[var(--canvas-bg)] hover:bg-[var(--soft-gray)] transition-colors duration-500"
                >
                  <div className="flex gap-6">
                    {/* Image portrait gauche */}
                    <div className="w-1/3 shrink-0 relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                      {post.mainImageUrl ? (
                        <FirebaseImage
                          src={post.mainImageUrl}
                          alt={post.mainImageAlt ?? post.title}
                          className="w-full h-full"
                          imgClassName="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-full h-full bg-[var(--card)]" />
                      )}
                    </div>

                    {/* Contenu droite */}
                    <div className="w-2/3 flex flex-col justify-between">
                      <div>
                        <h2 className="unbounded text-base font-bold leading-snug mb-2 text-[var(--ink-black)]">
                          {post.title}
                        </h2>

                        <p className="text-[10px] uppercase text-[#b89c72] font-bold mb-3 tracking-tighter">
                          {post.category.name}
                        </p>

                        <p className="text-xs text-[var(--gray-text)] leading-relaxed line-clamp-4">
                          {post.excerpt ?? post.metaDescription}
                        </p>
                      </div>

                      <div className="mt-4">
                        <span className="inline-block border-b border-[var(--ink-black)] text-[0.7rem] uppercase tracking-[0.15em] font-semibold text-[var(--ink-black)] transition-colors duration-300 group-hover:text-[#b89c72] group-hover:border-[#b89c72]">
                          {t('blog.readMore')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="mt-12">
            <Link
              href="/blog"
              className="inline-block text-[0.7rem] uppercase tracking-[0.15em] font-semibold text-[var(--ink-black)] border-b border-[var(--ink-black)] hover:text-[#b89c72] hover:border-[#b89c72] transition-colors duration-300"
            >
              ← {t('blog.backToBlog')}
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
