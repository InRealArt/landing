'use client'

import { useEffect, useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguageStore } from '@/store/languageStore'
import { useSeoPostStore } from '@/store/useSeoPostStore'
import { getCategoriesWithTranslations } from '@/actions/seoPostActions'

interface TranslatedCategory {
  id: number
  name: string
  color: string | null
  url: string | null
}

export default function FeaturedPost() {
  const { language, t } = useLanguageStore()
  const { featuredPost, isLoadingFeatured, featuredError, fetchFeaturedPost, currentLanguage } = useSeoPostStore()
  const [translatedCategories, setTranslatedCategories] = useState<TranslatedCategory[]>([])

  // Effet pour charger le post initial ou lors du changement de langue
  useEffect(() => {
    if (language) {
      console.log('language choisi', language)
      // On appelle toujours fetchFeaturedPost, le store gère la logique interne
      fetchFeaturedPost(language)
    }
  }, [language, fetchFeaturedPost])

  // Effet pour charger les traductions des catégories
  useEffect(() => {
    const fetchCategoryTranslations = async () => {
      if (language) {
        try {
          const categories = await getCategoriesWithTranslations(language)
          setTranslatedCategories(categories)
        } catch (error) {
          console.error('Erreur lors du chargement des traductions de catégories:', error)
        }
      }
    }

    fetchCategoryTranslations()
  }, [language])

  // Fonction pour obtenir le nom traduit de la catégorie
  const getTranslatedCategoryName = useCallback((categoryId: number, defaultName: string) => {
    const translatedCategory = translatedCategories.find(cat => cat.id === categoryId)
    return translatedCategory?.name || defaultName
  }, [translatedCategories])

  // Fonction pour formater la date
  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }, [language])

  // Fonction pour formater le temps de lecture
  const formatReadTime = useCallback((minutes: number | null) => {
    if (!minutes) return t('blog.readTime.unknown')
    return `${minutes} ${t('blog.readTime.minutes')}`
  }, [t])

  if (isLoadingFeatured) {
    return (
      <section className="mx-auto px-4 max-w-screen-xl">
        <div className="mb-16">
          <h2 className="text-xl font-medium italic mb-8">{t('blog.featuredPost')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[440px] bg-gray-200 animate-pulse rounded-lg" />
            <div className="p-8 bg-white rounded-lg">
              <div className="h-4 bg-gray-200 animate-pulse rounded mb-3" />
              <div className="h-8 bg-gray-200 animate-pulse rounded mb-3" />
              <div className="h-20 bg-gray-200 animate-pulse rounded mb-6" />
              <div className="flex gap-2 mb-6">
                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-full" />
                <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (featuredError) {
    return (
      <section className="mx-auto px-4 max-w-screen-xl">
        <div className="mb-16">
          <h2 className="text-xl font-medium italic mb-8">{t('blog.featuredPost')}</h2>
          <div className="p-8 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {featuredError}
          </div>
        </div>
      </section>
    )
  }

  if (!featuredPost) {
    return (
      <section className="mx-auto px-4 max-w-screen-xl">
        <div className="mb-16">
          <h2 className="text-xl font-medium italic mb-8">{t('blog.featuredPost')}</h2>
          <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
          <Link 
            href={`/blog/${featuredPost.slug}`} 
            className="relative h-[440px] cursor-pointer overflow-hidden rounded-lg transition-transform hover:scale-[1.02] duration-300"
          >
            {featuredPost.mainImageUrl ? (
              <Image
                className="rounded-lg"
                src={featuredPost.mainImageUrl}
                alt={featuredPost.mainImageAlt || featuredPost.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">{t('blog.noImage')}</span>
              </div>
            )}
          </Link>

          <Link 
            href={`/blog/${featuredPost.slug}`} 
            className="relative p-8 flex flex-col justify-center rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors duration-300"
          >
            {/* Catégorie en haut à droite */}
            {featuredPost.category && (
              <div className="absolute top-4 right-4">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: featuredPost.category.color || '#f3f4f6',
                    color: featuredPost.category.color ? '#ffffff' : '#374151'
                  }}
                >
                  {getTranslatedCategoryName(featuredPost.category.id, featuredPost.category.name)}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm mb-3 text-gray-600">
              <span>{formatDate(featuredPost.createdAt)}</span>
              <span>•</span>
              <span>{formatReadTime(featuredPost.estimatedReadTime)}</span>
              {featuredPost.viewsCount > 0 && (
                <>
                  <span>•</span>
                  <span>{featuredPost.viewsCount} {t('blog.views')}</span>
                </>
              )}
            </div>

            <h3 className="text-2xl font-bold mb-3">{featuredPost.title}</h3>

            <p className="mb-6 text-gray-700">
              {featuredPost.excerpt || featuredPost.metaDescription}
            </p>

            <div className="flex gap-2 mb-6">
              {featuredPost.listTags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index} 
                  className="px-4 py-1 border rounded-full text-sm"
                  style={{ 
                    borderColor: featuredPost.category.color || '#e5e7eb',
                    color: featuredPost.category.color || '#374151'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-600">
                {t('blog.by')} {featuredPost.author}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
} 