'use client'

import { useEffect, useCallback, useState } from 'react'
import OptimizedImage from '@/components/common/OptimizedImage'
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
      <section className="mx-auto px-4 max-w-screen-xl">
        <div className="mb-16">
          <h2 className="text-xl font-medium italic mb-8">{t('blog.featuredPost')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[440px] bg-backgroundGrey animate-pulse rounded-lg" />
            <div className="p-8 bg-backgroundColor rounded-lg">
              <div className="h-4 bg-backgroundGrey animate-pulse rounded mb-3" />
              <div className="h-8 bg-backgroundGrey animate-pulse rounded mb-3" />
              <div className="h-20 bg-backgroundGrey animate-pulse rounded mb-6" />
              <div className="flex gap-2 mb-6">
                <div className="h-6 w-16 bg-backgroundGrey animate-pulse rounded-full" />
                <div className="h-6 w-20 bg-backgroundGrey animate-pulse rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mx-auto px-4 max-w-screen-xl">
        <div className="mb-16">
          <h2 className="text-xl font-medium italic mb-8">{t('blog.featuredPost')}</h2>
          <div className="p-8 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        </div>
      </section>
    )
  }

  if (!post) {
    return (
      <section className="mx-auto px-4 max-w-screen-xl">
        <div className="mb-16">
          <h2 className="text-xl font-medium italic mb-8">{t('blog.featuredPost')}</h2>
          <div className="p-8 bg-backgroundGrey border border-textColor/20 rounded-lg text-grayText">
            {t('blog.noFeaturedPost')}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto px-4 max-w-screen-xl">
      <div className="mb-16">
        <h2 className="text-xl font-medium italic mb-8">{t('blog.featuredPost')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-textColor items-stretch">
          <Link
            href={`/blog/${post.slug}`}
            className="group relative h-[440px] cursor-pointer rounded-lg bg-[#1d1c1c] overflow-hidden
              transition-all duration-300 ease-out
              hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] hover:scale-[1.02]
              active:scale-[0.99] active:brightness-90 active:shadow-none active:duration-75"
          >
            {post.mainImageUrl ? (
              <OptimizedImage
                className="w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-contain [&_img]:rounded-lg [&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-out group-hover:[&_img]:scale-105 group-active:[&_img]:scale-100"
                src={post.mainImageUrl}
                alt={post.mainImageAlt || post.title}
                width={600}
                height={440}
                priority
              />
            ) : (
              <div className="w-full h-full bg-backgroundGrey rounded-lg flex items-center justify-center">
                <span className="text-grayText">{t('blog.noImage')}</span>
              </div>
            )}
          </Link>

          <Link
            href={`/blog/${post.slug}`}
            className="relative p-8 flex flex-col justify-center rounded-lg bg-backgroundColor cursor-pointer h-full
              transition-all duration-300 ease-out
              hover:bg-backgroundGrey hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]
              active:bg-backgroundGrey active:scale-[0.99] active:brightness-90 active:shadow-none active:duration-75"
          >
            <div className="flex items-center gap-2 text-sm mb-3 text-grayText">
              <span>{formatDate(post.createdAt)}</span>
              <span>•</span>
              <span>{formatReadTime(post.estimatedReadTime)}</span>
            </div>

            <h3 className="text-2xl font-bold mb-3 line-clamp-2 md:line-clamp-none">{post.title}</h3>

            <p className="mb-6 text-grayText line-clamp-4 md:line-clamp-none">
              {post.excerpt || post.metaDescription}
            </p>

            <div className="flex gap-2 mb-6">
              {post.listTags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-1 border rounded-full text-sm text-textColor"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center">
              <span className="text-sm text-grayText">
                {t('blog.by')} {post.author}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
