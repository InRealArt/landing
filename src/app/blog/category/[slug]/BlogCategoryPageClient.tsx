'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguageStore } from '@/store/languageStore'
import { SeoPost } from '@/store/useSeoPostStore'
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
  const { language } = useLanguageStore()

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

      <main className="min-h-screen pt-headerSize text-textColor">
        <div className="max-w-90 xl:max-w-screen-xl m-auto py-16">
          {/* Category header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          </div>

          {/* Inline error — displayed alongside existing content, not instead */}
          {fetchError && (
            <p className="text-sm text-red-500 mb-6">{fetchError}</p>
          )}

          {/* Post grid — dimmed while a language re-fetch is in progress */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-200 ${
              isRefetching ? 'opacity-50' : 'opacity-100'
            }`}
          >
            {posts.length === 0 ? (
              <p className="col-span-full text-grayText">
                Aucun article dans cette catégorie.
              </p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-cardBackground rounded-lg overflow-hidden border border-borderColor"
                >
                  {post.mainImageUrl && (
                    <div className="aspect-video relative">
                      <Image
                        src={post.mainImageUrl}
                        alt={post.mainImageAlt ?? post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-purpleColor"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-grayText mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center text-sm text-grayText">
                      <span>{post.author}</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-12">
            <Link href="/blog" className="text-purpleColor hover:underline">
              &larr; Retour au blog
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
