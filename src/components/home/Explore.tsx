'use client'

import { useEffect, useRef } from 'react'
import { loadGsap } from '@/lib/gsap'
import Button from '../common/Button'
import TranslatedText from '@/components/common/TranslatedText'
import { ArrowRight } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

export default function Explore() {
  const t = useLanguageStore((state) => state.t)
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const items = [
    {
      key: 'block1',
      number: '01',
      titleKey: 'home.explore.items.block1.title',
      descriptionKey: 'home.explore.items.block1.description',
      button: {
        text: t('home.explore.items.block1.buttons.artworks'),
        link: '/joinInRealArt/artists',
        umamiEvent: 'explore-joinInRealArt-artists-click' as string | undefined,
      },
    },
    {
      key: 'block2',
      number: '02',
      titleKey: 'home.explore.items.block2.title',
      descriptionKey: 'home.explore.items.block2.description',
      button: {
        text: t('home.explore.items.block2.buttons.marketplace'),
        link: '/joinInRealArt/galleries',
        umamiEvent: 'explore-joinInRealArt-galleries-click' as string | undefined,
      },
    },
    {
      key: 'block3',
      number: '03',
      titleKey: 'home.explore.items.block3.title',
      descriptionKey: 'home.explore.items.block3.description',
      button: {
        text: t('home.explore.items.block3.buttons.usecase'),
        link: '/manifest',
        umamiEvent: undefined as string | undefined,
      },
    },
  ]

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const initAnimations = async () => {
      const { gsap, ScrollTrigger } = await loadGsap()

      // ScrollTrigger registered as side-effect via loadGsap
      void ScrollTrigger

      ctx = gsap.context(() => {
        if (headerRef.current) {
          gsap.fromTo(
            Array.from(headerRef.current.children),
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.14,
              scrollTrigger: {
                trigger: headerRef.current,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          )
        }

        itemRefs.current.forEach((item) => {
          if (!item) return
          gsap.fromTo(
            item,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 84%',
                toggleActions: 'play none none none',
              },
            }
          )
        })
      }, sectionRef)
    }

    initAnimations()

    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} className="w-full bg-[#111] text-white py-28 lg:py-40">

      {/* Section header */}
      <div ref={headerRef} className="max-w-90 xl:max-w-screen-xl mx-auto px-4 text-center mb-20 md:mb-24 lg:mb-28">
        {/* Small uppercase eyebrow */}
        <span className="block text-[0.6rem] uppercase tracking-[0.5em] text-gray-500 mb-10 opacity-0">
          <TranslatedText translationKey="home.explore.title" />
        </span>

        {/* Gold divider above subtitle */}
        <div className="w-12 h-px bg-[#b89c72] mx-auto mb-10 opacity-0" />

        {/* Subtitle — rendered as plain text; the value contains <br/> markup
            that reads poorly in a centred italic block so we strip it via allowHtml=false */}
        <TranslatedText
          translationKey="home.explore.subtitle"
          as="p"
          className="bricolage-grotesque text-lg lg:text-2xl text-white/70 leading-relaxed max-w-3xl mx-auto opacity-0"
          allowHtml={true}
        />
      </div>

      {/* Three editorial cards — CSS grid with 1px gap as ruled dividers */}
      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/[0.08]">
          {items.map((item, index) => (
            <div
              key={item.key}
              ref={(el) => { itemRefs.current[index] = el }}
              className="opacity-0 bg-[#111] flex flex-col px-5 py-8 md:px-8 md:py-12 lg:px-10 lg:py-14 group"
            >
              {/* Gold number */}
              <span className="bricolage-grotesque text-[#b89c72] text-[0.6rem] uppercase tracking-[0.5em] mb-8 block">
                {item.number}
              </span>

              {/* Title */}
              <TranslatedText
                as="h3"
                translationKey={item.titleKey}
                className="bricolage-grotesque text-white text-2xl lg:text-[1.65rem] font-light leading-snug mb-6"
                allowHtml={true}
              />

              {/* Animated gold rule */}
              <div className="w-8 h-px bg-[#b89c72] mb-8 transition-[width] duration-500 ease-out group-hover:w-16" />

              {/* Description */}
              <TranslatedText
                as="p"
                translationKey={item.descriptionKey}
                className="bricolage-grotesque text-white/55 text-sm leading-relaxed mb-10 grow"
                allowHtml={true}
              />

              {/* CTA — btn-cta variant with white border override for dark background */}
              <div>
                <Button
                  link={item.button.link}
                  text={item.button.text}
                  additionalClassName="bg-purpleColor text-white border-white hover:bg-white hover:!text-black"
                  icon={<ArrowRight size={14} />}
                  data-umami-event={item.button.umamiEvent}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
