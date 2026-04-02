'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { SeoPost } from '@/types/seoPost'
import { getPublishedPostsPaginated, getLanguageIdByCode } from '@/actions/seoPostActions'
import PostsGrid from '@/components/blog/PostsGrid'

const PREVIEW_LIMIT = 6

interface Props {
  initialPosts: SeoPost[]
}

export default function MediaArticlesSectionClient({ initialPosts }: Props) {
  const { language, t } = useTranslation()

  const [posts, setPosts] = useState<SeoPost[]>(initialPosts)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    // Les données initiales couvrent le français — pas de re-fetch nécessaire
    if (language === 'fr') {
      setPosts(initialPosts)
      setFetchError(null)
      return
    }

    let cancelled = false

    const fetchPosts = async () => {
      setIsLoading(true)
      setFetchError(null)

      try {
        const langId = await getLanguageIdByCode(language)
        if (!langId) throw new Error(`Langue inconnue : ${language}`)

        const result = await getPublishedPostsPaginated(langId, 1, PREVIEW_LIMIT, true, 1)

        if (cancelled) return

        setPosts(result.posts)
      } catch {
        if (!cancelled) {
          // Garder les posts existants visibles, afficher une erreur discrète
          setFetchError(t('blog.noPosts'))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchPosts()

    return () => {
      cancelled = true
    }
  }, [language]) // eslint-disable-line react-hooks/exhaustive-deps
  // initialPosts est une prop SSR stable — intentionnellement omis.

  return (
    <section className="mb-16 md:mb-24 lg:mb-32">
      {/* Header */}
      <div className="flex items-baseline gap-4 mb-8 md:mb-10">
        <h2
          className="serif text-2xl sm:text-3xl font-bold whitespace-nowrap"
          style={{ color: 'var(--text)' }}
        >
          Articles &amp; Entretiens
        </h2>
        <div className="h-px flex-grow" style={{ background: 'var(--border-light)' }} />
      </div>

      <PostsGrid
        posts={posts}
        isLoading={isLoading}
        fetchError={fetchError}
        showPagination={false}
        showViewAllCta={true}
      />
    </section>
  )
}
