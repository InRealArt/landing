'use client'

import Link from 'next/link'
import FirebaseImage from '@/components/common/FirebaseImage'
import { useLanguageStore } from '@/store/languageStore'
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
    <div className="animate-pulse">
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
  const { t } = useLanguageStore()

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

      {/* Pagination nuqs — page /blog uniquement */}
      {showPagination && <BlogPagination totalPages={totalPages} />}

      {/* CTA "Voir tous les articles" — mode preview /media */}
      {showViewAllCta && !isEmpty && (
        <div className="flex justify-center mt-12">
          <Link
            href="/blog"
            className="border border-[var(--ink-black)] text-[var(--ink-black)] px-8 py-3 text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[var(--ink-black)] hover:text-[var(--canvas-bg)] transition-colors duration-300"
          >
            {t('blog.viewAllPosts')}
          </Link>
        </div>
      )}
    </>
  )
}
