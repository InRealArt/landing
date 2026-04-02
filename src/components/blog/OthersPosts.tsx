'use client'

import { useEffect, useState } from 'react'
import { useQueryState, parseAsInteger } from 'nuqs'
import { useTranslation } from '@/hooks/useTranslation'
import { SeoPost } from '@/types/seoPost'
import { getPublishedPostsPaginated, getLanguageIdByCode } from '@/actions/seoPostActions'
import PostsGrid from './PostsGrid'

interface Props {
  initialPosts: SeoPost[]
  initialPage: number
  totalPages: number
}

export default function OthersPosts({ initialPosts, initialPage, totalPages }: Props) {
  const { language, t } = useTranslation()
  const [page] = useQueryState('page', parseAsInteger.withDefault(1))

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

      <PostsGrid
        posts={posts}
        totalPages={currentTotalPages}
        isLoading={isLoading}
        fetchError={fetchError}
        showPagination={true}
        showViewAllCta={false}
      />
    </section>
  )
}
