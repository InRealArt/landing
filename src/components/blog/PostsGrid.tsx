'use client'

import Link from 'next/link'
import FirebaseImage from '@/components/common/FirebaseImage'
import { useTranslation } from '@/hooks/useTranslation'
import { SeoPost } from '@/types/seoPost'
import BlogPagination from './BlogPagination'

interface PostsGridProps {
  posts: SeoPost[]
  totalPages?: number
  isLoading?: boolean
  fetchError?: string | null
  /** Affiche la pagination nuqs. Défaut : true */
  showPagination?: boolean
  /** Quand showPagination=false, affiche un CTA "Voir tous les articles" → /blog */
  showViewAllCta?: boolean
}

function PostCardSkeleton() {
  return (
    <div className="flex flex-col bg-[var(--canvas-bg)] border border-borderColor overflow-hidden h-full">
      <div className="w-full h-[480px] bg-[var(--soft-gray)] animate-pulse" />
      <div className="p-8 flex flex-col gap-4">
        <div className="h-3 bg-[var(--soft-gray)] rounded w-1/4 animate-pulse" />
        <div className="h-8 bg-[var(--soft-gray)] rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-[var(--soft-gray)] rounded w-full animate-pulse" />
        <div className="h-4 bg-[var(--soft-gray)] rounded w-full animate-pulse" />
      </div>
    </div>
  )
}

export default function PostsGrid({
  posts,
  totalPages = 1,
  isLoading = false,
  fetchError = null,
  showPagination = true,
  showViewAllCta = false,
}: PostsGridProps) {
  const { t } = useTranslation()

  const isEmpty = posts.length === 0

  return (
    <>
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
        {isLoading && isEmpty ? (
          Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} />)
        ) : isEmpty ? (
          <p className="col-span-full text-[var(--gray-text)]">
            {t('blog.noPosts')}
          </p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-[var(--canvas-bg)] border border-borderColor hover:bg-[var(--soft-gray)] transition-all duration-500 overflow-hidden h-full"
            >
              {/* Image — Top */}
              <div className="w-full h-[480px] relative overflow-hidden shrink-0">
                {post.mainImageUrl ? (
                  <FirebaseImage
                    src={post.mainImageUrl}
                    alt={post.mainImageAlt ?? post.title}
                    className="w-full h-full"
                    imgClassName="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.05]"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--soft-gray)]" />
                )}
              </div>

              {/* Content — Bottom */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-6 bg-gold-accent" />
                  <p className="text-xs uppercase text-gold-accent font-bold tracking-[0.2em]">
                    {post.category.name}
                  </p>
                </div>

                <h3 className="serif text-xl md:text-2xl font-medium leading-tight mb-4 text-[var(--text)] group-hover:text-gold-accent transition-colors duration-300 line-clamp-2 flex-grow">
                  {post.title}
                </h3>

                <p className="text-sm text-[var(--gray-text)] leading-relaxed line-clamp-3 mb-8">
                  {post.excerpt ?? post.metaDescription}
                </p>

                <div className="mt-auto pt-4">
                  <span className="inline-block border-b border-[var(--text)] text-xs uppercase tracking-[0.3em] font-semibold text-[var(--text)] transition-all duration-500 group-hover:text-gold-accent group-hover:border-gold-accent">
                    {t('blog.readMore')}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination nuqs — page /blog uniquement */}
      {showPagination && <BlogPagination totalPages={totalPages} />}

      {/* CTA "Voir tous les articles" — mode preview /media */}
      {showViewAllCta && !isEmpty && (
        <div className="flex justify-center mt-12">
          <Link
            href="/blog"
            className="border border-[var(--text)] text-[var(--text)] px-8 py-3 text-sm uppercase tracking-[0.2em] font-semibold hover:bg-[var(--text)] hover:text-[var(--canvas-bg)] transition-colors duration-300"
          >
            {t('blog.viewAllPosts')}
          </Link>
        </div>
      )}
    </>
  )
}
