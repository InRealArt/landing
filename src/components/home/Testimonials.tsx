'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'
import { loadGsap } from '@/lib/gsap'

const testimonials = [
  {
    key: 'senechal',
    image: '/images/home/hero/senechal.webp',
    nameKey: 'leadGenerator.defaultTitle1',
    quoteKey: 'leadGenerator.defaultDescription1',
  },
  {
    key: 'ronan',
    image: '/images/home/hero/ronan.webp',
    nameKey: 'leadGenerator.defaultTitle3',
    quoteKey: 'leadGenerator.defaultDescription3',
  },
  {
    key: 'boyer',
    image: '/images/home/hero/boyer.webp',
    nameKey: 'leadGenerator.defaultTitle4',
    quoteKey: 'leadGenerator.defaultDescription4',
  },
]

export default function Testimonials() {
  const { t } = useTranslation()

  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const initAnimations = async () => {
      const { gsap } = await loadGsap()

      ctx = gsap.context(() => {
        if (headerRef.current) {
          const headerElements = headerRef.current.querySelectorAll('.section-number, h2, .testimonials-rule')
          gsap.fromTo(
            headerElements,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.12,
              scrollTrigger: {
                trigger: headerRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          )
        }

        if (cardsRef.current) {
          const cards = cardsRef.current.querySelectorAll('.testimonial-card')
          gsap.fromTo(
            cards,
            { opacity: 0, y: 48 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.18,
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 82%',
                toggleActions: 'play none none none',
              },
            }
          )
        }
      }, sectionRef)
    }

    initAnimations()
    return () => ctx?.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full bg-backgroundColor border-b border-borderColor py-28 lg:py-40"
    >
      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">

        {/* Header */}
        <div ref={headerRef} className="grid lg:grid-cols-12 gap-10 mb-24">
          <div className="lg:col-span-8">
            <span className="section-number" suppressHydrationWarning>
              {t('home.testimonials.eyebrow')}
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl serif italic leading-tight text-textColor break-words" suppressHydrationWarning>
              {t('home.testimonials.title')}
              <br />
              <em className="not-italic text-gold-accent" suppressHydrationWarning>
                {t('home.testimonials.titleAccent')}
              </em>
            </h2>
          </div>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-12 lg:gap-20">
          {testimonials.map((item) => (
            <figure
              key={item.key}
              className="testimonial-card border-t border-borderColor pt-12 opacity-0 flex flex-col"
            >
              {/* Decorative opening quote */}
              <span
                className="serif italic text-gold-accent text-6xl leading-none select-none mb-6"
                aria-hidden="true"
              >
                ❝
              </span>

              {/* Quote text */}
              <blockquote className="flex-1">
                <p
                  className="text-sm text-grayText leading-loose italic"
                  suppressHydrationWarning
                >
                  {t(item.quoteKey)}
                </p>
              </blockquote>

              {/* Gold rule */}
              <div className="w-8 h-px bg-gold-accent my-8" />

              {/* Artist identity */}
              <figcaption className="flex items-center gap-4 min-w-0">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0 grayscale">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 64px, 80px"
                    className="object-cover object-top"
                  />
                </div>
                <cite
                  className="not-italic text-xs uppercase tracking-[0.35em] font-bold text-textColor leading-snug min-w-0 break-words"
                  suppressHydrationWarning
                >
                  {t(item.nameKey)}
                </cite>
              </figcaption>
            </figure>
          ))}
        </div>

      </div>
    </section>
  )
}
