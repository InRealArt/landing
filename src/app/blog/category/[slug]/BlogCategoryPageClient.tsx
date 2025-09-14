'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguageStore } from '@/store/languageStore'
import { SeoPost } from '@/store/useSeoPostStore'
import { getPostsByCategorySlug, getLanguageIdByCode } from '@/actions/seoPostActions'
import { generateCollectionJsonLd, generateBreadcrumbJsonLd } from '@/utils/metadata'

interface Props {
  categorySlug: string
}

interface CategoryData {
  id: number
  name: string
  color: string | null
  url: string | null
  description?: string
}

export default function BlogCategoryPageClient({ categorySlug }: Props) {
  const { t, language } = useLanguageStore()
  const [posts, setPosts] = useState<SeoPost[]>([])
  const [category, setCategory] = useState<CategoryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      <main className="min-h-screen pt-headerSize text-textColor">
        <div className="max-w-90 xl:max-w-screen-xl m-auto py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-backgroundGrey rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-64 bg-backgroundGrey rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !category) {
    return (
      <main className="min-h-screen pt-headerSize text-textColor">
        <div className="max-w-90 xl:max-w-screen-xl m-auto py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{error || 'Catégorie non trouvée'}</h1>
            <Link href="/blog" className="text-purpleColor hover:underline">
              Retour au blog
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: generateCollectionJsonLd(
            `${category.name} - Blog InRealArt`,
            category.description || `Articles de la catégorie ${category.name}`,
            posts.map(post => ({
              name: post.title,
              url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/blog/${post.slug}`
            }))
          )
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: generateBreadcrumbJsonLd([
            { name: 'Accueil', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com' },
            { name: 'Blog', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/blog` },
            { name: category.name }
          ])
        }}
      />
      
      <main className="min-h-screen pt-headerSize text-textColor">
        <div className="max-w-90 xl:max-w-screen-xl m-auto py-16">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-grayText text-lg">{category.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-cardBackground rounded-lg overflow-hidden border border-borderColor">
                {post.mainImageUrl && (
                  <div className="aspect-video relative">
                    <Image
                      src={post.mainImageUrl}
                      alt={post.mainImageAlt || post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-purpleColor">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-grayText mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-grayText">
                    <span>{post.author}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}