'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPostsMentioningArtist, getLanguageIdByCode } from '@/actions/seoPostActions'
import { useLanguageStore } from '@/store/languageStore'
import { SeoPost } from '@/store/useSeoPostStore'

interface Props {
  artistName: string
  artistSurname: string
}

export default function ArtistRelatedPosts({ artistName, artistSurname }: Props) {
  const { language } = useLanguageStore()
  const [posts, setPosts] = useState<SeoPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const langId = await getLanguageIdByCode(language)
        if (!langId || cancelled) return
        const result = await getPostsMentioningArtist(artistName, artistSurname, langId, 4)
        if (!cancelled) setPosts(result)
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [artistName, artistSurname, language])

  if (!loading && posts.length === 0) return null

  return (
    <section className="w-full max-w-90 xl:max-w-screen-xl mx-auto mt-20 mb-12 px-4 xl:px-0">
      <div className="flex items-center gap-3 mb-8">
        <span className="block w-1 h-6 rounded-full bg-purpleColor flex-shrink-0" aria-hidden="true" />
        <h2 className="text-lg bricolage-grotesque font-semibold text-textColor tracking-wide">
          {language === 'fr' ? 'Dans nos articles' : 'In our articles'}
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-cardBackground border border-borderColor overflow-hidden animate-pulse">
              <div className="aspect-video bg-backgroundGrey" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-backgroundGrey rounded w-3/4" />
                <div className="h-3 bg-backgroundGrey rounded w-full" />
                <div className="h-3 bg-backgroundGrey rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-cardBackground rounded-2xl overflow-hidden
                border border-borderColor
                transition-all duration-300 ease-out
                hover:-translate-y-1.5
                hover:shadow-[0_16px_40px_rgba(96,82,255,0.15)]
                hover:border-purpleColor/40"
            >
              <div className="relative aspect-video overflow-hidden bg-backgroundGrey flex-shrink-0">
                {post.mainImageUrl ? (
                  <img
                    src={post.mainImageUrl}
                    alt={post.mainImageAlt || post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-grayText text-xs opacity-50">
                      {language === 'fr' ? "Pas d'image" : 'No image'}
                    </span>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                    style={{ backgroundColor: post.category.color || '#6052ff' }}
                  >
                    {post.category.name}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 p-4 flex-1">
                <h3 className="text-sm font-bold leading-snug text-textColor line-clamp-2 group-hover:text-purpleColor transition-colors duration-200">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-xs text-grayText line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-grayText mt-auto pt-2 border-t border-borderColor">
                  {post.estimatedReadTime && (
                    <>
                      <span>{post.estimatedReadTime} min</span>
                      <span className="opacity-40">·</span>
                    </>
                  )}
                  <span>
                    {new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
                      month: 'short',
                      year: 'numeric',
                    }).format(new Date(post.createdAt))}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
