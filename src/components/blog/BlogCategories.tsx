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

interface Props {
  initialCategories: Category[]
}

export default function BlogCategories({ initialCategories }: Props) {
  const { t, language } = useLanguageStore()
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [loadedLang, setLoadedLang] = useState<string | null>(null)
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!language || language === loadedLang) return

    getCategoriesWithTranslations(language)
      .then(data => {
        setCategories(data)
        setLoadedLang(language)
      })
      .catch(err => console.error('Erreur lors du chargement des catégories:', err))
  }, [language, loadedLang])

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setShowLeftFade(el.scrollLeft > 8)
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    setShowRightFade(el.scrollWidth > el.clientWidth)
  }, [categories])

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="py-20 px-10 max-w-screen-2xl mx-auto border-b border-[var(--border-light)]">
      <h2 className="text-3xl md:text-4xl serif italic mb-12 text-left">
        {t('blog.categories.title')}
      </h2>

      {/* ── Mobile: horizontal scroll rail ── */}
      <div className="relative md:hidden">
        {showLeftFade && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-r from-[var(--canvas-bg)] to-transparent" />
        )}
        {showRightFade && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-l from-[var(--canvas-bg)] to-transparent" />
        )}

        <style>{`.blog-cat-scroll::-webkit-scrollbar{display:none}`}</style>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="blog-cat-scroll flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog/category/${category.url || category.id}`}
              data-anim="blog-category"
              className="snap-start shrink-0 inline-block px-5 py-2.5 border border-[var(--ink-black)] text-[0.6rem] uppercase tracking-[0.25em] text-[var(--ink-black)] bg-transparent hover:bg-[var(--ink-black)] hover:text-white transition-all duration-500"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Desktop: flex-wrap left-aligned ── */}
      <div className="hidden md:flex flex-wrap gap-3 justify-start">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/blog/category/${category.url || category.id}`}
            data-anim="blog-category"
            className="inline-block px-5 py-2.5 border border-[var(--ink-black)] text-[0.6rem] uppercase tracking-[0.25em] text-[var(--ink-black)] bg-transparent hover:bg-[var(--ink-black)] hover:text-white transition-all duration-500"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
