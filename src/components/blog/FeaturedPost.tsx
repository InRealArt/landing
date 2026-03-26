'use client'

import { useEffect, useCallback, useState } from 'react'
import FirebaseImage from '@/components/common/FirebaseImage'
import Link from 'next/link'
import { useLanguageStore } from '@/store/languageStore'
import { getFeaturedPost, getLanguageIdByCode } from '@/actions/seoPostActions'
import type { SeoPost } from '@/types/seoPost'

interface Props {
  initialPost: SeoPost | null
}

export default function FeaturedPost({ initialPost }: Props) {
  const { language, t } = useLanguageStore()
  const [post, setPost] = useState<SeoPost | null>(initialPost)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadedLang, setLoadedLang] = useState<string | null>(null)

  useEffect(() => {
    if (!language || language === loadedLang) return

    setIsLoading(true)
    setError(null)

    getLanguageIdByCode(language)
      .then(langId => {
        if (!langId) throw new Error(`Langue non trouvée: ${language}`)
        return getFeaturedPost(langId)
      })
      .then(p => {
        setPost(p)
        setLoadedLang(language)
      })
      .catch(err => {
        console.error('Erreur lors de la récupération du post épinglé:', err)
        setError(err instanceof Error ? err.message : 'Erreur')
      })
      .finally(() => setIsLoading(false))
  }, [language, loadedLang])

  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }, [language])

  const formatReadTime = useCallback((minutes: number | null) => {
    if (!minutes) return t('blog.readTime.unknown')
    return `${minutes} ${t('blog.readTime.minutes')}`
  }, [t])

  if (isLoading) {
    return (
      <section className="px-10 py-20 max-w-screen-2xl mx-auto border-b border-[var(--border-light)]">
        <span className="section-number mb-12 block">{t('blog.featuredPost')}</span>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-0">
          <div className="h-[520px] bg-[var(--soft-gray)] animate-pulse" />
          <div className="p-10 bg-[var(--soft-gray)] border border-l-0 border-[var(--border-light)]">
            <div className="h-3 bg-[var(--border-light)] animate-pulse mb-6 w-32" />
            <div className="h-10 bg-[var(--border-light)] animate-pulse mb-4" />
            <div className="h-10 bg-[var(--border-light)] animate-pulse mb-6 w-3/4" />
            <div className="h-20 bg-[var(--border-light)] animate-pulse mb-6" />
            <div className="flex gap-2 mb-6">
              <div className="h-6 w-16 bg-[var(--border-light)] animate-pulse" />
              <div className="h-6 w-20 bg-[var(--border-light)] animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="px-10 py-20 max-w-screen-2xl mx-auto border-b border-[var(--border-light)]">
        <span className="section-number mb-12 block">{t('blog.featuredPost')}</span>
        <div className="border border-red-200 p-8 text-red-700 text-[12px]">{error}</div>
      </section>
    )
  }

  if (!post) {
    return (
      <section className="px-10 py-20 max-w-screen-2xl mx-auto border-b border-[var(--border-light)]">
        <span className="section-number mb-12 block">{t('blog.featuredPost')}</span>
        <div className="border border-[var(--border-light)] p-8 text-[12px] text-[var(--gray-text)]">
          {t('blog.noFeaturedPost')}
        </div>
      </section>
    )
  }

  return (
    <section className="px-10 py-20 max-w-screen-2xl mx-auto border-b border-[var(--border-light)]">
      <span className="section-number mb-12 block">{t('blog.featuredPost')}</span>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-0 items-stretch">
        {/* Image */}
        <Link
          data-anim="blog-featured-img"
          href={`/blog/${post.slug}`}
          className="group overflow-hidden border border-[var(--border-light)] h-[520px] block"
        >
          {post.mainImageUrl ? (
            <FirebaseImage
              className="w-full h-full"
              imgClassName="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02] grayscale group-hover:grayscale-0"
              src={post.mainImageUrl}
              alt={post.mainImageAlt || post.title}
            />
          ) : (
            <div className="w-full h-full bg-[var(--soft-gray)] flex items-center justify-center">
              <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--gray-text)]">{t('blog.noImage')}</span>
            </div>
          )}
        </Link>

        {/* Text */}
        <Link
          data-anim="blog-featured-text"
          href={`/blog/${post.slug}`}
          className="p-10 border border-l-0 border-[var(--border-light)] flex flex-col justify-between bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] transition-colors duration-500"
        >
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--gray-text)] mb-6">
              <span>{formatDate(post.createdAt)}</span>
              <span className="mx-3 text-[var(--gold-accent)]">—</span>
              <span>{formatReadTime(post.estimatedReadTime)}</span>
            </div>

            <h3 className="serif italic text-3xl md:text-4xl leading-tight mb-6 text-[var(--ink-black)]">
              {post.title}
            </h3>

            <p className="text-[12px] text-[var(--gray-text)] leading-loose mb-6">
              {post.excerpt || post.metaDescription}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.listTags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 border border-[var(--border-light)] text-[9px] uppercase tracking-[0.2em] text-[var(--gray-text)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--gray-text)] border-t border-[var(--border-light)] pt-6">
            {t('blog.by')} <span className="text-[var(--ink-black)]">{post.author}</span>
          </div>
        </Link>
      </div>
    </section>
  )
}
