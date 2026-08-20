'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { SeoPost } from '@/types/seoPost'
import { getPostsByCategorySlug, getLanguageIdByCode } from '@/actions/seoPostActions'
import PostsGrid from './PostsGrid'

interface BlogCategoryPreviewClientProps {
  categorySlug: string | string[]
  /** Clé de traduction du titre affiché au-dessus des cards */
  titleKey: string
  /** Server-rendered initial data for the default language (French). */
  initialPosts: SeoPost[]
}

// ---------------------------------------------------------------------------
// Rendering strategy — mirrors BlogCategoryPageClient:
//   - First paint uses `initialPosts` provided by the Server Component parent.
//   - When the user switches language, a client-side re-fetch updates the posts.
// ---------------------------------------------------------------------------
export default function BlogCategoryPreviewClient({
  categorySlug,
  titleKey,
  initialPosts,
}: BlogCategoryPreviewClientProps) {
  const { language, t } = useTranslation()

  const [posts, setPosts] = useState<SeoPost[]>(initialPosts)
  const categorySlugKey = Array.isArray(categorySlug) ? categorySlug.join(',') : categorySlug

  useEffect(() => {
    if (language === 'fr') {
      setPosts(initialPosts)
      return
    }

    let cancelled = false

    const refetchForLanguage = async () => {
      const languageId = await getLanguageIdByCode(language)
      if (!languageId) return

      const result = await getPostsByCategorySlug(categorySlug, languageId, 3)

      if (cancelled) return

      // If the category has no translated posts for this language, keep the
      // French content rather than showing an empty section.
      if (result.posts.length > 0) {
        setPosts(result.posts)
      }
    }

    refetchForLanguage()

    return () => {
      cancelled = true
    }
  }, [language, categorySlugKey, initialPosts])

  return (
    <section className="mb-16 md:mb-24 lg:mb-32">
      <div className="flex items-baseline gap-4 mb-8 md:mb-10">
        <h2
          className="serif text-2xl sm:text-3xl font-bold whitespace-nowrap"
          style={{ color: 'var(--text)' }}
        >
          {t(titleKey)}
        </h2>
        <div className="h-px flex-grow" style={{ background: 'var(--border-light)' }} />
      </div>

      <PostsGrid
        posts={posts}
        showPagination={false}
        showViewAllCta={true}
      />
    </section>
  )
}
