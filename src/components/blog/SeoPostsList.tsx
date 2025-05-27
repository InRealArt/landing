'use client'

import { useLanguageStore } from '@/store/languageStore'
import BlogPostCard from '@/components/common/BlogPostCard'
import { useSeoPostsData } from '@/hooks/useSeoPostsData'

interface SeoPostsListProps {
  title?: string
  excludeFeatured?: boolean
  limit?: number
  showLoadMore?: boolean
  className?: string
}

export default function SeoPostsList({
  title,
  excludeFeatured = true,
  limit = 6,
  showLoadMore = true,
  className = ''
}: SeoPostsListProps) {
  const { t } = useLanguageStore()
  const {
    blogPosts,
    isInitialLoading,
    isLoading,
    error,
    isEmpty,
    hasMore,
    loadMore,
    retry
  } = useSeoPostsData({
    excludeFeatured,
    limit,
    autoFetch: true
  })

  // Affichage du loading initial
  if (isInitialLoading) {
    return (
      <section className={`mx-auto px-4 max-w-screen-xl ${className}`}>
        <div>
          {title && (
            <h2 className="text-xl font-medium italic mb-8 flex items-center">
              {title}
            </h2>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Skeleton loading */}
            {Array.from({ length: Math.min(limit, 3) }).map((_, index) => (
              <div key={index} className="bg-cardBackground rounded-lg overflow-hidden border border-white-800 animate-pulse">
                <div className="h-[240px] bg-gray-300"></div>
                <div className="p-6">
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded mb-3 w-24"></div>
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Affichage d'erreur
  if (error && isEmpty) {
    return (
      <section className={`mx-auto px-4 max-w-screen-xl ${className}`}>
        <div>
          {title && (
            <h2 className="text-xl font-medium italic mb-8 flex items-center">
              {title}
            </h2>
          )}
          
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={retry}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {t('common.retry')}
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Affichage quand aucun post n'est disponible
  if (isEmpty) {
    return (
      <section className={`mx-auto px-4 max-w-screen-xl ${className}`}>
        <div>
          {title && (
            <h2 className="text-xl font-medium italic mb-8 flex items-center">
              {title}
            </h2>
          )}
          
          <div className="text-center py-12">
            <p className="text-gray-500">{t('blog.noPosts')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`mx-auto px-4 max-w-screen-xl ${className}`}>
      <div>
        {title && (
          <h2 className="text-xl font-medium italic mb-8 flex items-center">
            {title}
          </h2>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Bouton "Charger plus" si activé et qu'il y a plus de posts */}
        {showLoadMore && hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('common.loading') : t('blog.loadMore')}
            </button>
          </div>
        )}
      </div>
    </section>
  )
} 