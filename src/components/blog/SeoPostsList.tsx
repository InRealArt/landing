'use client'

import { useState, useTransition } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import BlogPostCard from '@/components/common/BlogPostCard'
import { seoPostsToBlogPosts } from '@/utils/seoPostUtils'
import { getLanguageIdByCode, getPublishedPosts } from '@/actions/seoPostActions'
import type { SeoPost } from '@/types/seoPost'

interface SeoPostsListProps {
  title?: string
  initialPosts: SeoPost[]
  initialHasMore: boolean
  limit?: number
  showLoadMore?: boolean
  excludeFeatured?: boolean
  className?: string
}

export default function SeoPostsList({
  title,
  initialPosts,
  initialHasMore,
  limit = 6,
  showLoadMore = true,
  excludeFeatured = true,
  className = ''
}: SeoPostsListProps) {
  const { t, language } = useTranslation()
  const [posts, setPosts] = useState<SeoPost[]>(initialPosts)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [isPending, startTransition] = useTransition()

  const blogPosts = seoPostsToBlogPosts(posts)

  const loadMore = () => {
    startTransition(async () => {
      const languageId = await getLanguageIdByCode(language)
      if (!languageId) return
      const nextPage = page + 1
      const offset = page * limit
      const { posts: newPosts, total } = await getPublishedPosts(languageId, limit, offset, [], excludeFeatured)
      setPosts((prev) => [...prev, ...newPosts])
      setPage(nextPage)
      setHasMore(offset + newPosts.length < total)
    })
  }

  if (posts.length === 0) {
    return (
      <section className={`mx-auto px-4 max-w-screen-xl ${className}`}>
        {title && (
          <h2 className="text-xl font-medium italic mb-8 flex items-center">{title}</h2>
        )}
        <div className="text-center py-12">
          <p className="text-gray-500">{t('blog.noPosts')}</p>
        </div>
      </section>
    )
  }

  return (
    <section className={`mx-auto px-4 max-w-screen-xl ${className}`}>
      {title && (
        <h2 className="text-xl font-medium italic mb-8 flex items-center">{title}</h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {showLoadMore && hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="px-6 py-3 bg-blue-500 text-textColor rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? t('common.loading') : t('blog.loadMore')}
          </button>
        </div>
      )}
    </section>
  )
}
