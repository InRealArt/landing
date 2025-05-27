'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'
import { getPostsByCategorySlug, getLanguageIdByCode } from '@/actions/seoPostActions'
import { SeoPost } from '@/store/useSeoPostStore'
import BlogPostCard from '@/components/common/BlogPostCard'
import { seoPostToBlogPost } from '@/utils/seoPostUtils'

interface CategoryData {
  id: number
  name: string
  color: string | null
  url: string | null
}

export default function CategoryPage() {
  const params = useParams()
  const { t, language } = useLanguageStore()
  const [posts, setPosts] = useState<SeoPost[]>([])
  const [category, setCategory] = useState<CategoryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Le paramètre slug est le slug de la catégorie
  const categorySlug = params.slug as string

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const languageId = await getLanguageIdByCode(language)
        if (!languageId) {
          throw new Error('Langue non trouvée')
        }

        const result = await getPostsByCategorySlug(categorySlug, languageId)
        
        if (!result.category) {
          setError('Catégorie non trouvée')
          return
        }

        setPosts(result.posts)
        setCategory(result.category)
      } catch (error) {
        console.error('Erreur lors du chargement des posts de la catégorie:', error)
        setError('Erreur lors du chargement des articles')
      } finally {
        setIsLoading(false)
      }
    }

    if (categorySlug) {
      fetchCategoryPosts()
    }
  }, [categorySlug, language])

  if (isLoading) {
    return (
      <main className="min-h-screen pt-headerSize text-white">
        <div className="max-w-90 xl:max-w-screen-xl m-auto py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-64 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !category) {
    return (
      <main className="min-h-screen pt-headerSize text-white">
        <div className="max-w-90 xl:max-w-screen-xl m-auto py-16">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl bricolage-grotesque font-medium mb-4">
              {error || 'Catégorie non trouvée'}
            </h1>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-purpleColor hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('buttons.back')}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-headerSize text-white">
      <div className="max-w-90 xl:max-w-screen-xl m-auto py-16">
        {/* En-tête de la catégorie */}
        <div className="mb-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-purpleColor hover:text-purple-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('buttons.back')}
          </Link>
          
          <h1 className="text-3xl md:text-5xl bricolage-grotesque font-medium mb-4">
            {category.name}
          </h1>
          
          <p className="text-gray-300 text-lg">
            {posts.length} {posts.length === 1 ? 'article' : 'articles'}
          </p>
        </div>

        {/* Liste des articles */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={seoPostToBlogPost(post)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              Aucun article disponible dans cette catégorie.
            </p>
          </div>
        )}
      </div>
    </main>
  )
} 