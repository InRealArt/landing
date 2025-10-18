'use client'

import { useEffect, useCallback, useState } from 'react'
import OptimizedImage from '@/components/common/OptimizedImage'
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
            href={`/blog/${featuredPost.slug}`} 
            className="relative h-[440px] cursor-pointer rounded-lg transition-transform hover:scale-[1.02] duration-300 bg-[#1d1c1c]"
          >
            {featuredPost.mainImageUrl ? (
              <OptimizedImage
                className="w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-contain [&_img]:rounded-lg"
                src={featuredPost.mainImageUrl}
                alt={featuredPost.mainImageAlt || featuredPost.title}
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
            href={`/blog/${featuredPost.slug}`} 
            className="relative p-8 flex flex-col justify-center rounded-lg bg-backgroundColor cursor-pointer hover:bg-backgroundGrey transition-colors duration-300 h-full"
          >
            <div className="flex items-center gap-2 text-sm mb-3 text-grayText">
              <span>{formatDate(featuredPost.createdAt)}</span>
              <span>•</span>
              <span>{formatReadTime(featuredPost.estimatedReadTime)}</span>
              {/* {featuredPost.viewsCount > 0 && (
                <>
                  <span>•</span>
                  <span>{featuredPost.viewsCount} {t('blog.views')}</span>
                </>
              )} */}
            </div>

            <h3 className="text-2xl font-bold mb-3 line-clamp-2 md:line-clamp-none">{featuredPost.title}</h3>

            <p className="mb-6 text-grayText line-clamp-4 md:line-clamp-none">
              {featuredPost.excerpt || featuredPost.metaDescription}
            </p>

            <div className="flex gap-2 mb-6">
              {featuredPost.listTags.slice(0, 3).map((tag, index) => (
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
                {t('blog.by')} {featuredPost.author}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
} 