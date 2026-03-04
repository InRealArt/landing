'use client'

import { useEffect, useRef } from 'react'
import OptimizedImage from "@/components/common/OptimizedImage";
import Button from "../common/Button";
import TranslatedText from "@/components/common/TranslatedText";
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

export default function Explore() {
  const t = useLanguageStore(state => state.t);
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const items = [
    {
      key: 'block1',
      titleKey: 'home.explore.items.block1.title',
      labelKey: 'home.explore.items.block1.label',
      descriptionKey: 'home.explore.items.block1.description',
      backgroundImage: '/images/home/inrealart_for_artists.webp',
      buttons: {
        first: {
          text: t('home.explore.items.block1.buttons.artworks'),
          link: '/joinInRealArt/artists'
        }
      }
    },
    {
      key: 'block2',
      titleKey: 'home.explore.items.block2.title',
      labelKey: 'home.explore.items.block2.label',
      descriptionKey: 'home.explore.items.block2.description',
      backgroundImage: '/images/home/inrealart_for_ceos.webp',
      buttons: {
        first: {
          text: t('home.explore.items.block2.buttons.marketplace'),
          link: '/joinInRealArt/galleries'
        }
      }
    },
    {
      key: 'block3',
      titleKey: 'home.explore.items.block3.title',
      labelKey: 'home.explore.items.block3.label',
      descriptionKey: 'home.explore.items.block3.description',
      backgroundImage: '/images/home/inrealart_for_institutions.webp',
      buttons: {
        first: {
          text: t('home.explore.items.block3.buttons.usecase'),
          link: '/manifest'
        }
      }
    }
  ]

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const initAnimations = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // Header reveal
        if (headerRef.current) {
          gsap.fromTo(
            headerRef.current.children,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.12,
              scrollTrigger: {
                trigger: headerRef.current,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          )
        }

        // Each item block animates alternately from left/right
        itemRefs.current.forEach((item, index) => {
          if (!item) return
          const isReversed = index % 2 !== 0
          const imageEl = item.querySelector('.explore-image')
          const contentEl = item.querySelector('.explore-content')

          if (imageEl) {
            gsap.fromTo(
              imageEl,
              { opacity: 0, x: isReversed ? 60 : -60 },
              {
                opacity: 1,
                x: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: item,
                  start: 'top 82%',
                  toggleActions: 'play none none none',
                },
              }
            )
          }

          if (contentEl) {
            gsap.fromTo(
              contentEl,
              { opacity: 0, x: isReversed ? -60 : 60 },
              {
                opacity: 1,
                x: 0,
                duration: 0.9,
                ease: 'power3.out',
                delay: 0.1,
                scrollTrigger: {
                  trigger: item,
                  start: 'top 82%',
                  toggleActions: 'play none none none',
                },
              }
            )
          }

          // Subtle image scale on scroll
          const imgInner = item.querySelector('.explore-image-inner')
          if (imgInner) {
            gsap.fromTo(
              imgInner,
              { scale: 1.08 },
              {
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: item,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1.5,
                },
              }
            )
          }
        })
      }, sectionRef)
    }

    initAnimations()

    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} className="w-full mt-36">
      <div ref={headerRef} className="max-w-90 xl:max-w-screen-xl m-auto">
        <div className="text-lg lg:text-xl bricolage-grotesque flex gap-4 opacity-0">
          <OptimizedImage src={`/icons/Logo-purple.png`} alt='IRA-LOGO' width={33} height={33} priority={true} />
          <TranslatedText translationKey="home.explore.title" />
        </div>
        <TranslatedText
          translationKey="home.explore.subtitle"
          as="label"
          className="text-xl lg:text-4xl block bricolage-grotesque !leading-snug opacity-0"
          allowHtml={true}
        />
      </div>
      <OptimizedImage className="max-w-full md:max-w-screen-image m-auto w-full mt-6" src={`/images/home/explore/bg.webp`} alt='IRA-IMAGE' width={1440} height={250} priority={false} />

      <div className="max-w-90 xl:max-w-screen-xl m-auto flex flex-col gap-4">
        {items.map((item, index) => {
          const reverseClassName = index % 2 !== 0 ? 'md:flex-row-reverse' : '';
          return (
            <div
              key={item.key}
              ref={(el) => { itemRefs.current[index] = el }}
              className={`w-full flex flex-col md:flex-row gap-6 md:gap-20 mt-28 items-center ${reverseClassName}`}
            >
              <div className="explore-image w-full md:basis-1/2 relative min-h-[300px] md:min-h-[400px] overflow-hidden rounded-lg opacity-0">
                {/* Image de fond with subtle parallax */}
                <div className="explore-image-inner absolute inset-0 -z-10">
                  <OptimizedImage
                    src={item.backgroundImage}
                    alt={`Background for ${item.key}`}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                    priority={false}
                  />
                </div>
                {/* Contenu du titre et label */}
                <div className="relative z-10 p-4 h-full flex flex-col justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gray-500/30 backdrop-blur-sm rounded-lg -m-2"></div>
                    <TranslatedText
                      as="h3"
                      className="relative text-xl lg:text-3xl bricolage-grotesque font-bold text-white drop-shadow-lg"
                      translationKey={item.titleKey}
                      allowHtml={true}
                    />
                  </div>
                  <TranslatedText
                    as="label"
                    className="my-4 block bricolage-grotesque text-white drop-shadow-lg"
                    translationKey={item.labelKey}
                  />
                </div>
              </div>
              <div className="explore-content w-full md:basis-1/2 opacity-0">
                <TranslatedText
                  as="label"
                  className="my-4 block bricolage-grotesque"
                  translationKey={item.descriptionKey}
                  allowHtml={true}
                />
                {item.buttons.first && (
                  <Button
                    link={item.buttons.first.link}
                    text={item.buttons.first.text}
                    additionalClassName="bg-purpleColor"
                    icon={<ArrowRight />}
                    center
                    data-umami-event={item.buttons.first.link.startsWith('/joinInRealArt') ? `explore-${item.buttons.first.link.replace('/', '')}-click` : undefined}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  );
}
