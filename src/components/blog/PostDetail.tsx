'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Button from '@/components/common/Button'
import { BlogBreadcrumb } from '@/components/common/Breadcrumb'
import { useLanguageStore } from '@/store/languageStore'
import { useSeoPostStore } from '@/store/useSeoPostStore'
import { SeoPost } from '@/store/useSeoPostStore'
import { getPostBySlug } from '@/actions/seoPostActions'
import './style.css'
interface PostDetailProps {
  slug: string
  initialPost?: SeoPost | null
}

export default function PostDetail({ slug, initialPost }: PostDetailProps) {
  const { language, t } = useLanguageStore()
  const {
    currentPost,
    isLoadingPost,
    postError,
    fetchPostBySlug,
    incrementPostViews,
    clearCurrentPost,
    relatedPosts,
    isLoadingRelated,
    fetchRelatedPosts,
    clearRelatedPosts
  } = useSeoPostStore()

  // État pour gérer le post traduit trouvé
  const [translatedPost, setTranslatedPost] = useState<SeoPost | null>(null)
  const [isSearchingTranslation, setIsSearchingTranslation] = useState(false)

  // Ref pour éviter l'incrémentation multiple des vues
  const viewsIncrementedRef = useRef<number | null>(null)

  // Charger le post au montage du composant
  useEffect(() => {
    if (language && slug) {
      fetchPostBySlug(slug, language)
      setTranslatedPost(null) // Réinitialiser le post traduit
    }

    // Nettoyer au démontage
    return () => {
      clearCurrentPost()
      clearRelatedPosts()
      viewsIncrementedRef.current = null
      setTranslatedPost(null)
    }
  }, [slug, language, fetchPostBySlug, clearCurrentPost, clearRelatedPosts])

  // Use initialPost for rendering when the store hasn't loaded yet (SSR hydration)
  const displayPost = currentPost ?? initialPost ?? null

  // Rechercher un post traduit si le post n'est pas trouvé dans la langue courante
  useEffect(() => {
    const searchForTranslatedPost = async () => {
      if (!currentPost && !isLoadingPost && !postError && language && slug) {
        setIsSearchingTranslation(true)
        
        try {
          // Importer les fonctions nécessaires
          const { getLanguageIdByCode } = await import('@/actions/seoPostActions')
          
          // Obtenir l'ID de la langue courante
          const currentLanguageId = await getLanguageIdByCode(language)
          if (!currentLanguageId) {
            console.error('Impossible de trouver l\'ID de la langue courante:', language)
            return
          }

          // Essayer de trouver le post dans toutes les langues disponibles
          const languages = ['fr', 'en'] // Langues supportées
          let foundPost = null
          
          for (const lang of languages) {
            if (lang !== language) { // Éviter de rechercher dans la langue courante
              try {
                foundPost = await getPostBySlug(slug, lang)
                if (foundPost) break
              } catch (error) {
                console.log(`Post non trouvé en ${lang}:`, error)
              }
            }
          }
          
          if (foundPost && foundPost.languageId !== currentLanguageId) {
            // Le post existe dans une autre langue, chercher la traduction
            const { findTranslatedPost } = await import('@/actions/seoPostActions')
            const translated = await findTranslatedPost(foundPost, language)
            
            if (translated) {
              setTranslatedPost(translated)
            }
          }
        } catch (error) {
          console.error('Erreur lors de la recherche de traduction:', error)
        } finally {
          setIsSearchingTranslation(false)
        }
      }
    }

    // Délai pour éviter les recherches trop fréquentes
    const timeoutId = setTimeout(searchForTranslatedPost, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [currentPost, isLoadingPost, postError, language, slug])

  // Incrémenter les vues et charger les posts similaires une fois le post chargé
  useEffect(() => {
    if (currentPost && language && viewsIncrementedRef.current !== currentPost.id) {
      // Marquer que les vues ont été incrémentées pour ce post
      viewsIncrementedRef.current = currentPost.id
      
      // Incrémenter les vues
      incrementPostViews(currentPost.id)
      
      // Charger les posts similaires
      fetchRelatedPosts(currentPost.category.id, currentPost.id, language)
    }
  }, [currentPost, language, incrementPostViews, fetchRelatedPosts])

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  // Loading state: only show spinner if we have no initial data to display
  if (isLoadingPost && !displayPost) {
    return (
      <div className="pt-8 mb-16 px-5 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-xl mt-4">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  // Error state
  if (postError) {
    return (
      <div className="pt-8 mb-16 px-5 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-xl text-red-500 mb-4">{postError}</p>
          <Link href="/blog" className="text-purpleColor hover:underline">
            {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    )
  }

  // Post not found
  if (!displayPost) {
    // Si on est en train de chercher une traduction, afficher le loading
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

    // Si un post traduit a été trouvé, proposer le lien
    if (translatedPost) {
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

    // Post vraiment introuvable
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

  // Utiliser le HTML généré ou le contenu de base
  const htmlContent = displayPost.generatedArticleHtml || displayPost.content

  return (
    <>
      {/* Injection du JSON-LD depuis la base de données */}
      {displayPost.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: displayPost.jsonLd }}
        />
      )}

      {/* Breadcrumb avec données structurées */}
      <script
        type="application/ld+json"
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
          {/* Breadcrumb navigation */}
          <BlogBreadcrumb postTitle={displayPost.title} className="mb-8" />

          {/* Contenu HTML de l'article dans un conteneur isolé */}
          <div
            id="blog-content-container"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Métadonnées de l'article */}
          {/* <div className="mt-8 pt-8 border-t border-gray-200"> */}
            {/* <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span>{t('blog.by')} {currentPost.author}</span>
              <span>•</span>
              <span>{formatDate(currentPost.createdAt)}</span>
              {currentPost.estimatedReadTime && (
                <>
                  <span>•</span>
                  <span>{currentPost.estimatedReadTime} {t('blog.readTime.minutes')}</span>
                </>
              )}
              <span>•</span>
              <span>{currentPost.viewsCount} {t('blog.views')}</span>
            </div> */}

            {/* Tags */}
            {/* {currentPost.listTags.length > 0 && (
              <div className="flex gap-2 mt-4">
                {currentPost.listTags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 border rounded-full text-sm"
                    style={{ 
                      borderColor: currentPost.category.color || '#e5e7eb',
                      color: currentPost.category.color || '#374151'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )} */}
          {/* </div> */}

          {/* Retour au blog */}
          <div className="mt-12 text-center">
            <Button 
              text={t('blog.backToBlog')}
              additionalClassName="mt-6 justify-center bg-purpleColor"
              link="/blog"
            />
          </div>

          {/* Articles similaires */}
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
                        {/* Image zone */}
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

                          {/* Category badge overlaid on image */}
                          <div className="absolute top-3 left-3">
                            <span
                              className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md tracking-wide"
                              style={{ backgroundColor: relatedPost.category.color || '#6052ff' }}
                            >
                              {relatedPost.category.name}
                            </span>
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="p-5 flex flex-col gap-2">
                          <h3 className="text-sm font-bold leading-snug text-textColor line-clamp-2 group-hover:text-purpleColor transition-colors duration-200">
                            {relatedPost.title}
                          </h3>

                          {relatedPost.excerpt && (
                            <p className="text-xs text-grayText line-clamp-2 leading-relaxed">
                              {relatedPost.excerpt}
                            </p>
                          )}

                          {/* Meta: read time + date */}
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