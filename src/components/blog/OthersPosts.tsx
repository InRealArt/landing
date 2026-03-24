'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import FirebaseImage from '@/components/common/FirebaseImage'
import { useQueryState, parseAsInteger } from 'nuqs'
import { useLanguageStore } from '@/store/languageStore'
import { SeoPost } from '@/types/seoPost'
import { getPublishedPostsPaginated, getLanguageIdByCode } from '@/actions/seoPostActions'
import BlogPagination from './BlogPagination'

interface Props {
  initialPosts: SeoPost[]
  initialPage: number
  totalPages: number
}

export default function OthersPosts({ initialPosts, initialPage, totalPages }: Props) {
  const { language, t } = useLanguageStore()
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const [posts, setPosts] = useState<SeoPost[]>(initialPosts)
  const [currentTotalPages, setCurrentTotalPages] = useState(totalPages)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Sync URL page param with initial SSR page on first mount.
  // If the user lands on /blog?page=3, `page` from nuqs already equals 3.
  // We only need to ensure the state matches; no extra fetch needed for
  // the FR + initialPage case since SSR data covers it.
  useEffect(() => {
    const isInitialFrenchData = language === 'fr' && page === initialPage

    if (isInitialFrenchData) {
      // Restore SSR data if the user navigates back to this exact state.
      setPosts(initialPosts)
      setCurrentTotalPages(totalPages)
      setFetchError(null)
      return
    }

    let cancelled = false

    const fetchPage = async () => {
      setIsLoading(true)
      setFetchError(null)

      try {
        const langId = await getLanguageIdByCode(language)
        if (!langId) throw new Error(`Langue inconnue : ${language}`)

        const result = await getPublishedPostsPaginated(langId, page, 6, true)

        if (cancelled) return

        setPosts(result.posts)
        setCurrentTotalPages(result.totalPages)
      } catch {
        if (!cancelled) {
          setFetchError(t('blog.noPosts'))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchPage()

    return () => {
      cancelled = true
    }
  }, [page, language]) // eslint-disable-line react-hooks/exhaustive-deps
  // initialPosts / initialPage / totalPages are stable SSR props — intentionally omitted.

  return (
    <section className="max-w-screen-2xl mx-auto px-10 py-16">
      {/* Section header */}
      <div className="mb-12 border-b border-[var(--border-light)] pb-12">
        <span className="section-number">{t('blog.othersPosts')}</span>
      </div>

      {/* Inline error */}
      {fetchError && (
        <p className="text-sm text-red-500 mb-6">{fetchError}</p>
      )}

      {/* Post grid — dimmed while fetching */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        }`}
      >
        {posts.length === 0 && !isLoading ? (
          <p className="col-span-full text-[var(--gray-text)]">
            {t('blog.noPosts')}
          </p>
        ) : isLoading && posts.length === 0 ? (
          // Skeleton — shown only on first load when there are no posts yet
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-6">
                <div className="w-1/3 shrink-0 bg-[var(--soft-gray)]" style={{ aspectRatio: '3/4' }} />
                <div className="w-2/3 flex flex-col gap-3 pt-2">
                  <div className="h-4 bg-[var(--soft-gray)] rounded w-3/4" />
                  <div className="h-3 bg-[var(--soft-gray)] rounded w-1/4" />
                  <div className="h-3 bg-[var(--soft-gray)] rounded w-full" />
                  <div className="h-3 bg-[var(--soft-gray)] rounded w-5/6" />
                </div>
              </div>
            </div>
          ))
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block p-6 bg-[var(--canvas-bg)] hover:bg-[var(--soft-gray)] transition-colors duration-500"
            >
              <div className="flex gap-6">
                {/* Portrait image — left third */}
                <div
                  className="w-1/3 shrink-0 relative overflow-hidden"
                  style={{ aspectRatio: '3/4' }}
                >
                  {post.mainImageUrl ? (
                    <FirebaseImage
                      src={post.mainImageUrl}
                      alt={post.mainImageAlt ?? post.title}
                      className="w-full h-full"
                      imgClassName="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--soft-gray)]" />
                  )}
                </div>

                {/* Content — right two thirds */}
                <div className="w-2/3 flex flex-col justify-between">
                  <div>
                    <h3 className="unbounded text-base font-bold leading-snug mb-2 text-[var(--ink-black)]">
                      {post.title}
                    </h3>

                    <p className="text-[10px] uppercase text-gold-accent font-bold mb-3 tracking-tighter">
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

      <BlogPagination totalPages={currentTotalPages} />
    </section>
  )
}
