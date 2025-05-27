'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCategoriesWithTranslations } from '@/actions/seoPostActions'
import { useLanguageStore } from '@/store/languageStore'

interface Category {
  id: number
  name: string
  color: string | null
  url: string | null
}

export default function BlogCategories() {
  const { t, language } = useLanguageStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const categoriesData = await getCategoriesWithTranslations(language)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [language])

  if (isLoading) {
    return (
      <section className="max-w-90 xl:max-w-screen-xl m-auto py-16">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mx-auto mb-8"></div>
            <div className="flex flex-wrap justify-center gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-12 bg-gray-700 rounded-full w-32"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="max-w-90 xl:max-w-screen-xl m-auto py-16">
      <div className="text-center">
        <h2 className="text-2xl md:text-4xl bricolage-grotesque font-medium mb-8">
          {t('blog.categories.title')}
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog/category/${category.url || category.id}`}
              className="inline-flex items-center px-6 py-3 bg-purpleColor border border-white rounded-full text-white font-medium unbounded transition-all duration-300 hover:bg-purple-700 hover:scale-105 hover:shadow-lg"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 