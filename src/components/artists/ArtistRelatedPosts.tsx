'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import FirebaseImage from '@/components/common/FirebaseImage'
import { getPostsMentioningArtist, getLanguageIdByCode } from '@/actions/seoPostActions'
import { useTranslation } from '@/hooks/useTranslation'
import { SeoPost } from '@/types/seoPost'

interface Props {
  artistName: string
  artistSurname: string
}

export default function ArtistRelatedPosts({ artistName, artistSurname }: Props) {
  const { language } = useTranslation()
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

        const label = headerRef.current.querySelector('.rp-label')
        const title = headerRef.current.querySelector('.rp-title')
        const line = headerRef.current.querySelector('.rp-line')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 88%',
            once: true,
          },
        })

        if (label) {
          tl.fromTo(
            label,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
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
    <section
      ref={sectionRef}
      id="artist-related-posts"
      className="py-24 lg:py-32 border-t"
      style={{ borderColor: '#eeeeee' }}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">

        {/* Section header */}
        <div ref={headerRef} className="flex items-end gap-10 mb-16">
          <div>
            <span className="rp-label block text-[10px] uppercase tracking-[0.5em] text-gray-400 font-montserrat mb-4">
              {language === 'fr' ? 'À lire aussi' : 'Further reading'}
            </span>
            <h2 className="rp-title text-4xl lg:text-5xl font-cormorant font-light text-textColor leading-tight">
              {language === 'fr' ? (
                <>Nos articles sur{' '}<span className="italic" style={{ color: '#b89c72' }}>{artistName}</span></>
              ) : (
                <>Articles about{' '}<span className="italic" style={{ color: '#b89c72' }}>{artistName}</span></>
              )}
            </h2>
          </div>

          <div
            className="rp-line flex-1 h-px hidden lg:block origin-left"
            style={{ backgroundColor: '#eeeeee' }}
            aria-hidden="true"
          />
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div
                  className="w-full mb-5"
                  style={{ aspectRatio: '3/4', backgroundColor: 'var(--soft-gray)' }}
                />
                <div className="space-y-3">
                  <div
                    className="h-2 rounded-full w-1/3"
                    style={{ backgroundColor: 'var(--soft-gray)' }}
                  />
                  <div
                    className="h-3 rounded-full w-full"
                    style={{ backgroundColor: 'var(--soft-gray)' }}
                  />
                  <div
                    className="h-3 rounded-full w-4/5"
                    style={{ backgroundColor: 'var(--soft-gray)' }}
                  />
                  <div
                    className="h-3 rounded-full w-2/3"
                    style={{ backgroundColor: 'var(--soft-gray)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Article grid */
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {posts.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="rp-card group block"
              >
                {/* Portrait image — aspect 3/4, editorial gallery feel */}
                <div
                  className="relative w-full overflow-hidden mb-5"
                  style={{ aspectRatio: '3/4', backgroundColor: 'var(--soft-gray)' }}
                >
                  {post.mainImageUrl ? (
                    <FirebaseImage
                      src={post.mainImageUrl}
                      alt={post.mainImageAlt || post.title}
                      className="absolute inset-0 w-full h-full"
                      imgClassName="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-[10px] uppercase tracking-widest font-montserrat opacity-40"
                        style={{ color: 'var(--gray-text)' }}
                      >
                        {language === 'fr' ? 'Sans image' : 'No image'}
                      </span>
                    </div>
                  )}

                  {/* Category badge — gold outline, no background fill */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="inline-block px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-montserrat font-semibold"
                      style={{
                        backgroundColor: 'var(--canvas-bg)',
                        color: '#b89c72',
                        border: '1px solid #b89c72',
                      }}
                    >
                      {post.category.name}
                    </span>
                  </div>
                </div>

                {/* Text content */}
                <div className="space-y-3">
                  <h3
                    className="unbounded text-sm font-bold leading-snug transition-colors duration-300"
                    style={{ color: 'var(--text)' }}
                    onMouseEnter={e => {
                      ;(e.currentTarget as HTMLHeadingElement).style.color = '#b89c72'
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLHeadingElement).style.color = 'var(--text)'
                    }}
                  >
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p
                      className="text-xs leading-relaxed line-clamp-2 font-montserrat"
                      style={{ color: 'var(--gray-text)' }}
                    >
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta row + read link */}
                  <div
                    className="flex items-center justify-between pt-4 border-t"
                    style={{ borderColor: '#eeeeee' }}
                  >
                    <span
                      className="text-[10px] uppercase tracking-[0.12em] font-montserrat"
                      style={{ color: 'var(--gray-text)' }}
                    >
                      {new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
                        month: 'short',
                        year: 'numeric',
                      }).format(new Date(post.createdAt))}
                      {post.estimatedReadTime && (
                        <> &middot; {post.estimatedReadTime}&nbsp;min</>
                      )}
                    </span>

                    {/* Read link — border-b transitions to gold on hover */}
                    <span
                      className="inline-block border-b text-[9px] uppercase tracking-[0.15em] font-semibold font-montserrat transition-colors duration-300 flex-shrink-0 ml-2"
                      style={{ borderColor: 'var(--text)', color: 'var(--text)' }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLSpanElement
                        el.style.color = '#b89c72'
                        el.style.borderColor = '#b89c72'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLSpanElement
                        el.style.color = 'var(--text)'
                        el.style.borderColor = 'var(--text)'
                      }}
                    >
                      {language === 'fr' ? 'Lire' : 'Read'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
