'use client'

import Image from 'next/image'
import { useLanguageStore } from '@/store/languageStore'

interface Scenario {
  badge: string
  title: string
  titleItalic: string
  description: string
  pills: string[]
  cta: string
  ctaSecondary: string
  ctaHref: string
  imageSrc: string
  imageAlt: string
  reversed: boolean
  bgAlternate: boolean
}

export default function UseCaseScenarios() {
  const { t } = useLanguageStore()

  const scenarios: Scenario[] = [
    {
      badge: t('usecase.scenarios.scenario2.badge'),
      title: t('usecase.scenarios.scenario2.title'),
      titleItalic: t('usecase.scenarios.scenario2.titleItalic'),
      description: t('usecase.scenarios.scenario2.description'),
      pills: [
        t('usecase.scenarios.scenario2.pills.0'),
        t('usecase.scenarios.scenario2.pills.1'),
        t('usecase.scenarios.scenario2.pills.2'),
      ],
      cta: t('usecase.scenarios.scenario2.cta'),
      ctaSecondary: t('usecase.scenarios.scenario2.ctaSecondary'),
      ctaHref: '/usecase/leasing',
      imageSrc: '/images/usecase/usecase2.avif',
      imageAlt: t('usecase.scenarios.scenario2.titleItalic'),
      reversed: false,
      bgAlternate: false,
    },
    {
      badge: t('usecase.scenarios.scenario1.badge'),
      title: t('usecase.scenarios.scenario1.title'),
      titleItalic: t('usecase.scenarios.scenario1.titleItalic'),
      description: t('usecase.scenarios.scenario1.description'),
      pills: [
        t('usecase.scenarios.scenario1.pills.0'),
        t('usecase.scenarios.scenario1.pills.1'),
        t('usecase.scenarios.scenario1.pills.2'),
      ],
      cta: t('usecase.scenarios.scenario1.cta'),
      ctaSecondary: t('usecase.scenarios.scenario1.ctaSecondary'),
      ctaHref: '/usecase/leasing/hotelPrestige',
      imageSrc: '/images/usecase/usecase1.avif',
      imageAlt: t('usecase.scenarios.scenario1.titleItalic'),
      reversed: true,
      bgAlternate: true,
    },
    {
      badge: t('usecase.scenarios.scenario3.badge'),
      title: t('usecase.scenarios.scenario3.title'),
      titleItalic: t('usecase.scenarios.scenario3.titleItalic'),
      description: t('usecase.scenarios.scenario3.description'),
      pills: [
        t('usecase.scenarios.scenario3.pills.0'),
        t('usecase.scenarios.scenario3.pills.1'),
        t('usecase.scenarios.scenario3.pills.2'),
      ],
      cta: t('usecase.scenarios.scenario3.cta'),
      ctaSecondary: t('usecase.scenarios.scenario3.ctaSecondary'),
      ctaHref: '/usecase/leasing/immobilier',
      imageSrc: '/images/usecase/usecase3.avif',
      imageAlt: t('usecase.scenarios.scenario3.titleItalic'),
      reversed: false,
      bgAlternate: false,
    },
  ]

  return (
    <div>
      {scenarios.map((scenario, index) => (
        <section
          key={index}
          data-anim="scenario-section"
          className={`group py-20 lg:py-28 px-4 sm:px-6 lg:px-10 usecase-scenario-card${
            scenario.bgAlternate ? ' bg-backgroundGrey border-y border-borderColor' : ''
          }`}
        >
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image column */}
            <div
              className={`usecase-scenario-image overflow-hidden relative aspect-[16/11] bg-backgroundGrey${
                scenario.reversed ? ' lg:order-2' : ''
              }`}
              aria-hidden="true"
            >
              <Image
                src={scenario.imageSrc}
                alt={scenario.imageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Text column */}
            <div className={`flex flex-col${scenario.reversed ? ' lg:order-1' : ''}`}>
              <span
                className="text-[10px] uppercase tracking-[0.4em] montserrat mb-6 block"
                style={{ color: 'var(--gold-accent)' }}
              >
                {scenario.badge}
              </span>

              <h2 className="serif text-[clamp(2.4rem,5vw,3.5rem)] leading-tight mb-6 text-textColor">
                {scenario.title}{' '}
                <span className="italic" style={{ color: 'var(--gold-accent)' }}>
                  {scenario.titleItalic}
                </span>
              </h2>

              <p className="text-[13px] leading-relaxed mb-8 text-grayText montserrat font-light">
                {scenario.description}
              </p>

              {/* Pill tags */}
              <div className="flex flex-wrap gap-2 mb-10">
                {scenario.pills.map((pill, pillIndex) => (
                  <span
                    key={pillIndex}
                    className="px-3 py-1 text-[8px] uppercase tracking-[0.12em] montserrat border border-borderColor rounded-full text-grayText"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <a href={scenario.ctaHref} className="btn-mag self-start">
                  {scenario.cta}
                </a>
                <a href="/simulators/loa" className="btn-mag self-start" style={{ color: 'var(--gold-accent)', borderColor: 'var(--gold-accent)' }}>
                  {scenario.ctaSecondary}
                </a>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
