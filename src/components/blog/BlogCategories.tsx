'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

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

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setShowLeftFade(el.scrollLeft > 8)
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    // Init fade state once categories are loaded
    setShowRightFade(el.scrollWidth > el.clientWidth)
  }, [categories])

  if (isLoading) {
    return (
      <section className="max-w-90 xl:max-w-screen-xl m-auto py-16">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mx-auto mb-8"></div>
            {/* Mobile skeleton: single row */}
            <div className="flex md:hidden gap-3 px-5 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-700 rounded-full shrink-0 w-28"></div>
              ))}
            </div>
            {/* Desktop skeleton: wrap */}
            <div className="hidden md:flex flex-wrap justify-center gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-700 rounded-full w-32"></div>
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

        {/* ── Mobile: horizontal scroll rail ── */}
        <div className="relative md:hidden">
          {/* Left fade */}
          {showLeftFade && (
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-r from-[var(--background,#0d0d0d)] to-transparent" />
          )}
          {/* Right fade */}
          {showRightFade && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-l from-[var(--background,#0d0d0d)] to-transparent" />
          )}

          <style>{`.blog-cat-scroll::-webkit-scrollbar{display:none}`}</style>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="blog-cat-scroll flex gap-3 overflow-x-auto px-5 pb-1 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.url || category.id}`}
                className="snap-start shrink-0 inline-flex items-center px-5 py-2.5 bg-purpleColor border border-white/20 rounded-full text-white text-sm font-medium unbounded
                  transition-all duration-200 ease-out
                  hover:bg-purple-700 hover:border-white/40 hover:shadow-[0_0_16px_rgba(139,92,246,0.4)]
                  active:scale-90 active:brightness-150 active:shadow-none active:duration-75"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Desktop: original flex-wrap ── */}
        <div className="hidden md:flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog/category/${category.url || category.id}`}
              className="inline-flex items-center px-6 py-3 bg-purpleColor border border-white rounded-full text-white font-medium unbounded
                transition-all duration-300 ease-out
                hover:bg-purple-700 hover:scale-105 hover:shadow-[0_0_24px_rgba(139,92,246,0.5)]
                active:scale-95 active:brightness-150 active:shadow-none active:duration-75"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 