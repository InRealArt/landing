'use client'

import { useState, useRef } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import BlogPostCard from '@/components/common/BlogPostCard'
import { useSeoPostsData } from '@/hooks/useSeoPostsData'

interface SeoPostsCarouselProps {
  title?: string
  excludeFeatured?: boolean
  postsPerPage?: number
  className?: string
}

export default function SeoPostsCarousel({
  title,
  excludeFeatured = true,
  postsPerPage = 3,
  className = ''
}: SeoPostsCarouselProps) {
  const { t } = useLanguageStore()
  const [currentPage, setCurrentPage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  const {
    blogPosts,
    isInitialLoading,
    error,
    isEmpty,
    retry
  } = useSeoPostsData({
    excludeFeatured,
    limit: 100, // On récupère tous les posts pour la pagination côté client
    autoFetch: true
  })

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(blogPosts.length / postsPerPage)

  // Obtenir les posts pour la page actuelle
  const getCurrentPagePosts = () => {
    const startIndex = currentPage * postsPerPage
    return blogPosts.slice(startIndex, startIndex + postsPerPage)
  }

  // Gestionnaire pour le changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage || isTransitioning) return

    setIsTransitioning(true)

    // Effet de transition
    if (carouselRef.current) {
      carouselRef.current.classList.add('opacity-0')
      setTimeout(() => {
        setCurrentPage(newPage)
        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.classList.remove('opacity-0')
          }
          setIsTransitioning(false)
        }, 50)
      }, 200)
    } else {
      setCurrentPage(newPage)
      setIsTransitioning(false)
    }
  }

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
            {/* Skeleton loading */}
            {Array.from({ length: postsPerPage }).map((_, index) => (
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

  // Les posts de la page courante
  const currentPosts = getCurrentPagePosts()

  return (
    <section className={`mx-auto px-4 max-w-screen-xl ${className}`}>
      <div>
        {title && (
          <h2 className="text-xl font-medium italic mb-8 flex items-center">
            {title} {currentPage > 0 ? `(Page ${currentPage + 1})` : ''}
          </h2>
        )}

        <div
          ref={carouselRef}
          className="transition-opacity duration-200 ease-in-out min-h-[400px]"
        >
          {blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h3 className="text-xl mb-2">{t('blog.noArticles')}</h3>
              <p className="text-gray-600 mb-4">
                {t('blog.noArticlesDescription')}
              </p>
            </div>
          )}
        </div>

        {/* Navigation du carousel */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center gap-1">
              {/* Bouton page précédente */}
              {currentPage > 0 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  disabled={isTransitioning}
                >
                  {t('blog.carousel.previous')}
                </button>
              )}

              {/* Pagination numérotée */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      page === currentPage
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    } disabled:opacity-50`}
                    disabled={isTransitioning || page === currentPage}
                  >
                    {page + 1}
                  </button>
                ))}
              </div>

              {/* Bouton page suivante */}
              {currentPage < totalPages - 1 && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  disabled={isTransitioning}
                >
                  {t('blog.carousel.next')}
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </section>
  )
} 