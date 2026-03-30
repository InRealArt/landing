'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useLanguageStore } from '@/store/languageStore'
import ArtistApplicationForm from './ArtistApplicationForm'

const Testimonials = dynamic(() => import('@/components/home/Testimonials'), {
  loading: () => <div className="w-full h-96 animate-pulse bg-cardBackground" />,
})

export default function ArtistApplicationPage() {
  const { t } = useLanguageStore()

  const engagements = [1, 2, 3].map((n) => ({
    number: t(`joinInRealArt.artists.application.engagements.${n}.number`),
    category: t(`joinInRealArt.artists.application.engagements.${n}.category`),
    subtitle: t(`joinInRealArt.artists.application.engagements.${n}.subtitle`),
    description: t(`joinInRealArt.artists.application.engagements.${n}.description`),
  }))

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="pt-40 pb-28 px-6 sm:px-10 bg-backgroundColor">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            <div className="lg:col-span-7">
              <span className="section-number">
                {t('joinInRealArt.artists.application.hero.label')}
              </span>
              <h1 className="serif text-5xl sm:text-7xl md:text-8xl leading-tight text-textColor">
                {t('joinInRealArt.artists.application.hero.titleLine1')}
                <br />
                <span className="italic" style={{ color: 'var(--gold-accent)' }}>
                  {t('joinInRealArt.artists.application.hero.titleAccent')}
                </span>
              </h1>
              <p className="text-[12px] uppercase tracking-[0.3em] text-grayText mt-10 max-w-xl leading-loose">
                {t('joinInRealArt.artists.application.hero.subtitle')}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-[4/5] bg-backgroundGrey overflow-hidden grayscale">
                <Image
                  src="/images/joinInRealArt/artists/hero_joinInReal_artists.webp"
                  alt={t('joinInRealArt.artists.application.hero.imageAlt')}
                  width={800}
                  height={1000}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── LES ENGAGEMENTS ─── */}
      <section className="py-28 lg:py-32 px-6 sm:px-10 bg-backgroundGrey border-y border-borderColor">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {engagements.map((item) => (
              <div key={item.number} className="border-l border-borderColor pl-8">
                <span className="serif text-3xl italic block mb-6" style={{ color: 'var(--gold-accent)' }}>
                  {item.category}
                </span>
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-textColor mb-6">
                  {item.subtitle}
                </h3>
                <p className="text-[13px] text-grayText leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TÉMOIGNAGES ─── */}
      <Testimonials />

      {/* ─── FORMULAIRE DE CANDIDATURE ─── */}
      <ArtistApplicationForm />
    </>
  )
}
