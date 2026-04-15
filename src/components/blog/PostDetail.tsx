'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Button from '@/components/common/Button'
import { BlogBreadcrumb } from '@/components/common/Breadcrumb'
import { useTranslation } from '@/hooks/useTranslation'
import { getPostBySlug, getLanguageIdByCode, getRelatedPosts, findTranslatedPost, incrementPostViews } from '@/actions/seoPostActions'
import type { SeoPost } from '@/types/seoPost'
import FirebaseImage from '@/components/common/FirebaseImage'
import PostRelatedArtists from '@/components/blog/PostRelatedArtists'
import './style.css'

interface PostDetailProps {
  slug: string
  initialPost: SeoPost
}

export default function PostDetail({ slug, initialPost }: PostDetailProps) {
  const { language, t } = useTranslation()
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
      <div className="px-10 py-32 max-w-screen-2xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-8">
          <span className="block w-px h-16 bg-[var(--border-light)] animate-pulse" />
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--gray-text)]">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!post && !isSearchingTranslation && !translatedPost) {
    return (
      <div className="px-10 py-32 max-w-screen-2xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 border border-[var(--border-light)] p-16">
          <p className="serif italic text-3xl text-[var(--ink-black)]">{t('blog.postNotFound')}</p>
          <Link href="/blog" className="text-[11px] uppercase tracking-[0.3em] text-[var(--gray-text)] border-b border-[var(--border-light)] hover:border-[var(--ink-black)] hover:text-[var(--ink-black)] transition-colors pb-1">
            {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    )
  }

  if (isSearchingTranslation) {
    return (
      <div className="px-10 py-32 max-w-screen-2xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-8">
          <span className="block w-px h-16 bg-[var(--border-light)] animate-pulse" />
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--gray-text)]">{t('blog.searchingTranslation')}</p>
        </div>
      </div>
    )
  }

  if (translatedPost && !post) {
    return (
      <div className="px-10 py-32 max-w-screen-2xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 border border-[var(--border-light)] p-16 text-center">
          <p className="serif italic text-3xl text-[var(--ink-black)] mb-2">{t('blog.postNotFoundInLanguage')}</p>
          <p className="text-[12px] text-[var(--gray-text)] leading-loose max-w-md">
            {t('blog.postAvailableInOtherLanguage')}
          </p>
          <Button
            text={t('blog.viewInCorrectLanguage')}
            additionalClassName="bg-purpleColor mt-4"
            link={`/blog/${translatedPost.slug}`}
          />
          <Link href="/blog" className="text-[10px] uppercase tracking-[0.3em] text-[var(--gray-text)] border-b border-[var(--border-light)] hover:border-[var(--ink-black)] hover:text-[var(--ink-black)] transition-colors pb-1">
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

      <div className="pb-32 min-h-screen bg-[var(--canvas-bg)]">
        <div className="max-w-3xl mx-auto px-10">
          <BlogBreadcrumb postTitle={displayPost.title} className="mb-12 pt-10" />

          <div
            data-anim="post-content"
            id="blog-content-container"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <div className="mt-16 pt-8 border-t border-[var(--border-light)]">
            <Button
              text={t('blog.backToBlog')}
              additionalClassName="bg-purpleColor"
              link="/blog"
            />
          </div>

          <PostRelatedArtists
            postTitle={displayPost.title}
            postMetaKeywords={displayPost.metaKeywords}
            postListTags={displayPost.listTags}
            postMetaDescription={displayPost.metaDescription}
          />
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-24 border-t border-[var(--border-light)]">
            <div className="px-10 py-20 max-w-screen-2xl mx-auto">
              <span className="section-number mb-12 block">{t('blog.relatedPosts')}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    data-anim="post-related-card"
                    className="group flex flex-col bg-[var(--canvas-bg)] border border-[var(--border-light)] overflow-hidden hover:bg-[var(--soft-gray)] transition-all duration-500 h-full"
                  >
                    <div className="relative aspect-video overflow-hidden shrink-0">
                      {relatedPost.mainImageUrl ? (
                        <FirebaseImage
                          src={relatedPost.mainImageUrl}
                          alt={relatedPost.mainImageAlt || relatedPost.title}
                          className="w-full h-full"
                          imgClassName="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[var(--soft-gray)]">
                          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--gray-text)]">{t('blog.noImage')}</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--canvas-bg)] bg-[var(--ink-black)] px-3 py-1">
                          {relatedPost.category.name}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="serif text-xl leading-snug text-[var(--ink-black)] line-clamp-2 mb-4 group-hover:text-[var(--gold-accent)] transition-colors duration-300 flex-grow">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.excerpt && (
                        <p className="text-[12px] text-[var(--gray-text)] line-clamp-2 leading-relaxed mb-6">
                          {relatedPost.excerpt}
                        </p>
                      )}
                      <div className="mt-auto pt-4 border-t border-[var(--border-light)] text-[9px] uppercase tracking-[0.25em] text-[var(--gray-text)] flex justify-between items-center">
                        <span>{formatDate(relatedPost.createdAt)}</span>
                        {relatedPost.estimatedReadTime && (
                          <span>{relatedPost.estimatedReadTime} {t('blog.readTime.minutes')}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
