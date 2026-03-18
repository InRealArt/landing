'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Button from '@/components/common/Button'
import { BlogBreadcrumb } from '@/components/common/Breadcrumb'
import { useLanguageStore } from '@/store/languageStore'
import { getPostBySlug, getLanguageIdByCode, getRelatedPosts, findTranslatedPost, incrementPostViews } from '@/actions/seoPostActions'
import type { SeoPost } from '@/types/seoPost'
import PostRelatedArtists from '@/components/blog/PostRelatedArtists'
import './style.css'

interface PostDetailProps {
  slug: string
  initialPost: SeoPost
}

export default function PostDetail({ slug, initialPost }: PostDetailProps) {
  const { language, t } = useLanguageStore()
  const [post, setPost] = useState<SeoPost>(initialPost)
  const [relatedPosts, setRelatedPosts] = useState<SeoPost[]>([])
  const [isLoadingLang, setIsLoadingLang] = useState(false)
  const [translatedPost, setTranslatedPost] = useState<SeoPost | null>(null)
  const [isSearchingTranslation, setIsSearchingTranslation] = useState(false)
  const [loadedLang, setLoadedLang] = useState<string | null>(null)
  const viewsIncrementedRef = useRef<number | null>(null)

  // Increment views once on mount
  useEffect(() => {
    if (viewsIncrementedRef.current !== initialPost.id) {
      viewsIncrementedRef.current = initialPost.id
      incrementPostViews(initialPost.id).catch(() => {})
    }
  }, [initialPost.id])

  // Load related posts when post is available
  useEffect(() => {
    if (!language || !post) return

    getLanguageIdByCode(language)
      .then(langId => {
        if (langId) return getRelatedPosts(post.category.id, post.id, langId)
        return []
      })
      .then(setRelatedPosts)
      .catch(() => {})
  }, [post, language])

  // Reload post on language change
  useEffect(() => {
    if (!language || language === loadedLang) return

    setIsLoadingLang(true)
    setTranslatedPost(null)

    getPostBySlug(slug, language)
      .then(found => {
        if (found) {
          setPost(found)
          setLoadedLang(language)
          setIsLoadingLang(false)
          return
        }

        // Post not found in this language — search for translation
        setIsSearchingTranslation(true)
        setIsLoadingLang(false)

        const otherLangs = ['fr', 'en'].filter(l => l !== language)
        return Promise.all(otherLangs.map(l => getPostBySlug(slug, l))).then(async results => {
          const foundInOtherLang = results.find(r => r !== null)
          if (foundInOtherLang) {
            const translated = await findTranslatedPost(foundInOtherLang, language)
            if (translated) {
              setTranslatedPost(translated)
            }
          }
          setIsSearchingTranslation(false)
          setLoadedLang(language)
        })
      })
      .catch(() => {
        setIsLoadingLang(false)
        setIsSearchingTranslation(false)
      })
  }, [language, loadedLang, slug])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  if (isLoadingLang) {
    return (
      <div className="pt-8 mb-16 px-5 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-xl mt-4">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  // Post not found in this language
  if (!post && !isSearchingTranslation && !translatedPost) {
    return (
      <div className="pt-8 mb-16 px-5 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-xl mb-4">{t('blog.postNotFound')}</p>
          <Link href="/blog" className="text-purpleColor hover:underline">
            {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    )
  }

  if (isSearchingTranslation) {
    return (
      <div className="pt-8 mb-16 px-5 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-xl mt-4">{t('blog.searchingTranslation')}</p>
        </div>
      </div>
    )
  }

  if (translatedPost && !post) {
    return (
      <div className="pt-8 mb-16 px-5 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-xl mb-4">{t('blog.postNotFoundInLanguage')}</p>
          <p className="text-lg mb-6 text-gray-600">
            {t('blog.postAvailableInOtherLanguage')}
          </p>
          <Button
            text={t('blog.viewInCorrectLanguage')}
            additionalClassName="mt-6 justify-center bg-purpleColor"
            link={`/blog/${translatedPost.slug}`}
          />
          <Link href="/blog" className="text-purpleColor hover:underline">
            {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    )
  }

  const displayPost = post
  const htmlContent = displayPost.generatedArticleHtml || displayPost.content

  return (
    <>
      {displayPost.jsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: displayPost.jsonLd }}
        />
      )}

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Accueil",
                "item": process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/blog`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": displayPost.title
              }
            ]
          })
        }}
      />

      <div className="pt-8 pb-16 min-h-screen">
        <div className="max-w-3xl mx-auto px-4">
          <BlogBreadcrumb postTitle={displayPost.title} className="mb-8" />

          <div
            id="blog-content-container"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <div className="mt-12 text-center">
            <Button
              text={t('blog.backToBlog')}
              additionalClassName="mt-6 justify-center bg-purpleColor"
              link="/blog"
            />
          </div>

          <PostRelatedArtists
            postTitle={displayPost.title}
            postMetaKeywords={displayPost.metaKeywords}
            postListTags={displayPost.listTags}
            postMetaDescription={displayPost.metaDescription}
          />

          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-borderColor">
              <h2 className="text-xl font-medium italic mb-8 text-textColor">
                {t('blog.relatedPosts')}
              </h2>

              <div className="relative w-screen left-1/2 -translate-x-1/2 px-4">
                <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.slug}`}
                        className="group block bg-cardBackground rounded-2xl overflow-hidden
                          border border-borderColor
                          transition-all duration-300 ease-out
                          hover:-translate-y-1.5
                          hover:shadow-[0_16px_40px_rgba(0,0,0,0.3)]
                          hover:border-purpleColor/30
                          active:translate-y-0 active:shadow-none active:duration-75"
                      >
                        <div className="relative aspect-video overflow-hidden bg-backgroundGrey">
                          {relatedPost.mainImageUrl ? (
                            <img
                              src={relatedPost.mainImageUrl}
                              alt={relatedPost.mainImageAlt || relatedPost.title}
                              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-active:scale-100"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gradientFrom to-gradientTo">
                              <span className="text-grayText text-sm">{t('blog.noImage')}</span>
                            </div>
                          )}

                          <div className="absolute top-3 left-3">
                            <span
                              className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md tracking-wide"
                              style={{ backgroundColor: relatedPost.category.color || '#6052ff' }}
                            >
                              {relatedPost.category.name}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col gap-2">
                          <h3 className="text-sm font-bold leading-snug text-textColor line-clamp-2 group-hover:text-purpleColor transition-colors duration-200">
                            {relatedPost.title}
                          </h3>

                          {relatedPost.excerpt && (
                            <p className="text-xs text-grayText line-clamp-2 leading-relaxed">
                              {relatedPost.excerpt}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-xs text-grayText mt-auto pt-2">
                            {relatedPost.estimatedReadTime && (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-3.5 h-3.5 flex-shrink-0 opacity-60"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span>{relatedPost.estimatedReadTime} {t('blog.readTime.minutes')}</span>
                                <span className="opacity-40">·</span>
                              </>
                            )}
                            <span>{formatDate(relatedPost.createdAt)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
