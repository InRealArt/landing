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
      <section className={`px-10 py-20 max-w-screen-2xl mx-auto ${className}`}>
        {title && <span className="section-number mb-12 block">{title}</span>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
          {Array.from({ length: postsPerPage }).map((_, index) => (
            <div key={index} className="bg-[var(--canvas-bg)] animate-pulse p-6">
              <div className="flex gap-6">
                <div className="w-1/3 shrink-0 bg-[var(--border-light)]" style={{ aspectRatio: '3/4' }} />
                <div className="w-2/3 flex flex-col gap-3">
                  <div className="h-4 bg-[var(--border-light)] w-full" />
                  <div className="h-4 bg-[var(--border-light)] w-3/4" />
                  <div className="h-2 bg-[var(--border-light)] w-16 mt-1" />
                  <div className="h-2 bg-[var(--border-light)] w-full" />
                  <div className="h-2 bg-[var(--border-light)] w-5/6" />
                  <div className="h-2 bg-[var(--border-light)] w-4/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error && isEmpty) {
    return (
      <section className={`px-10 py-20 max-w-screen-2xl mx-auto ${className}`}>
        {title && <span className="section-number mb-12 block">{title}</span>}
        <div className="text-center py-12">
          <p className="text-[12px] text-red-500 mb-6">{error}</p>
          <button
            onClick={retry}
            className="btn-cta"
          >
            {t('common.retry')}
          </button>
        </div>
      </section>
    )
  }

  if (isEmpty) {
    return (
      <section className={`px-10 py-20 max-w-screen-2xl mx-auto ${className}`}>
        {title && <span className="section-number mb-12 block">{title}</span>}
        <div className="text-center py-12">
          <p className="text-[12px] text-[var(--gray-text)] uppercase tracking-[0.2em]">{t('blog.noPosts')}</p>
        </div>
      </section>
    )
  }

  const currentPosts = getCurrentPagePosts()

  return (
    <section className={`px-10 py-20 max-w-screen-2xl mx-auto ${className}`}>
      {title && (
        <span className="section-number mb-12 block">
          {title}{currentPage > 0 ? ` — ${currentPage + 1}` : ''}
        </span>
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
          <div className="text-center py-16 border border-[var(--border-light)]">
            <h3 className="serif italic text-2xl mb-3">{t('blog.noArticles')}</h3>
            <p className="text-[12px] text-[var(--gray-text)] uppercase tracking-[0.2em]">
              {t('blog.noArticlesDescription')}
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-16">
          <nav className="flex items-center gap-1">
            {currentPage > 0 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="border border-[var(--border-light)] text-[var(--gray-text)] px-4 py-2 text-[10px] uppercase tracking-[0.2em] hover:border-[var(--ink-black)] hover:text-[var(--ink-black)] transition-colors disabled:opacity-30"
                disabled={isTransitioning}
              >
                ← {t('blog.carousel.previous')}
              </button>
            )}

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors disabled:opacity-30 ${
                    page === currentPage
                      ? 'border border-[var(--ink-black)] bg-[var(--ink-black)] text-white'
                      : 'border border-[var(--border-light)] text-[var(--gray-text)] hover:border-[var(--ink-black)] hover:text-[var(--ink-black)]'
                  }`}
                  disabled={isTransitioning || page === currentPage}
                >
                  {page + 1}
                </button>
              ))}
            </div>

            {currentPage < totalPages - 1 && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="border border-[var(--border-light)] text-[var(--gray-text)] px-4 py-2 text-[10px] uppercase tracking-[0.2em] hover:border-[var(--ink-black)] hover:text-[var(--ink-black)] transition-colors disabled:opacity-30"
                disabled={isTransitioning}
              >
                {t('blog.carousel.next')} →
              </button>
            )}
          </nav>
        </div>
      )}
    </section>
  )
} 