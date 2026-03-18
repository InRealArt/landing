'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getPostsMentioningArtist, getLanguageIdByCode } from '@/actions/seoPostActions'
import { useLanguageStore } from '@/store/languageStore'
import { SeoPost } from '@/types/seoPost'

interface Props {
  artistName: string
  artistSurname: string
}

export default function ArtistRelatedPosts({ artistName, artistSurname }: Props) {
  const { language } = useLanguageStore()
  const [posts, setPosts] = useState<SeoPost[]>([])
  const [loading, setLoading] = useState(true)

  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  // Guard against double-animation on StrictMode double-invoke
  const animatedRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      animatedRef.current = false
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

  // — Animate header once on first visible render
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const initHeaderAnimation = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        if (!headerRef.current) return

        const bars = headerRef.current.querySelectorAll('.rp-bar')
        const title = headerRef.current.querySelector('.rp-title')
        const line = headerRef.current.querySelector('.rp-line')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 88%',
            once: true,
          },
        })

        if (bars.length > 0) {
          tl.fromTo(
            bars,
            { scaleY: 0, opacity: 0 },
            { scaleY: 1, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.08, transformOrigin: 'bottom' }
          )
        }
        if (title) {
          tl.fromTo(
            title,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' },
            '-=0.2'
          )
        }
        if (line) {
          tl.fromTo(
            line,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power3.out', transformOrigin: 'left' },
            '-=0.4'
          )
        }
      }, sectionRef)
    }

    initHeaderAnimation()
    return () => ctx?.revert()
  }, [])

  // — Animate cards once posts finish loading
  useEffect(() => {
    if (loading || posts.length === 0 || animatedRef.current) return
    animatedRef.current = true

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const animateCards = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        if (!gridRef.current) return

        const cards = gridRef.current.querySelectorAll('.rp-card')
        if (cards.length === 0) return

        gsap.fromTo(
          cards,
          { opacity: 0, y: 32, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 90%',
              once: true,
            },
          }
        )
      }, sectionRef)
    }

    // One frame delay to ensure React has committed the grid DOM
    const id = window.requestAnimationFrame(() => animateCards())
    return () => {
      window.cancelAnimationFrame(id)
      ctx?.revert()
    }
  }, [loading, posts])

  if (!loading && posts.length === 0) return null

  return (
    <section ref={sectionRef} className="w-full max-w-90 xl:max-w-screen-xl mx-auto mt-20 mb-16 px-4 xl:px-0">

      {/* En-tête de section stylé */}
      <div ref={headerRef} className="flex items-center gap-4 mb-10">
        {/* Trait violet + point */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="rp-bar block w-1 h-7 rounded-full bg-purpleColor origin-bottom" aria-hidden="true" />
          <span className="rp-bar block w-1 h-4 rounded-full bg-purpleColor/40 origin-bottom" aria-hidden="true" />
        </div>

        <h2 className="rp-title text-xl lg:text-2xl font-bold text-textColor unbounded">
          {language === 'fr' ? 'Retrouvez nos articles de blog' : 'Discover our blog articles'}
        </h2>

        {/* Ligne décorative */}
        <div className="rp-line flex-1 h-px bg-borderColor hidden sm:block origin-left" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-cardBackground border border-borderColor overflow-hidden animate-pulse">
              <div className="aspect-video bg-backgroundGrey" />
              <div className="p-4 space-y-2.5">
                <div className="h-2.5 bg-backgroundGrey rounded-full w-3/4" />
                <div className="h-2.5 bg-backgroundGrey rounded-full w-full" />
                <div className="h-2.5 bg-backgroundGrey rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="rp-card group flex flex-col bg-cardBackground rounded-2xl overflow-hidden
                border border-borderColor
                transition-all duration-300 ease-out
                hover:-translate-y-1.5
                hover:shadow-[0_16px_40px_rgba(96,82,255,0.15)]
                hover:border-purpleColor/40"
            >
              {/* Image */}
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

                {/* Overlay au hover */}
                <div
                  className="absolute inset-0 bg-purpleColor/0 group-hover:bg-purpleColor/5 transition-colors duration-300 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Badge catégorie */}
                <div className="absolute top-2.5 left-2.5">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white tracking-wide shadow-sm"
                    style={{ backgroundColor: post.category.color || '#6052ff' }}
                  >
                    {post.category.name}
                  </span>
                </div>
              </div>

              {/* Contenu texte */}
              <div className="flex flex-col gap-2 p-4 flex-1">
                <h3 className="text-sm font-bold leading-snug text-textColor line-clamp-2 group-hover:text-purpleColor transition-colors duration-200 bricolage-grotesque">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-xs text-grayText line-clamp-2 leading-relaxed bricolage-grotesque">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-grayText mt-auto pt-3 border-t border-borderColor/60">
                  {post.estimatedReadTime && (
                    <>
                      <span className="bricolage-grotesque">{post.estimatedReadTime} min</span>
                      <span className="opacity-30" aria-hidden="true">·</span>
                    </>
                  )}
                  <span className="bricolage-grotesque">
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
