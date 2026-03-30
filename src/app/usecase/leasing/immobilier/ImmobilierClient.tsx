'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguageStore } from '@/store/languageStore'
import TranslatedText from '@/components/common/TranslatedText'

export default function ImmobilierClient() {
  const { t } = useLanguageStore()

  return (
    <main className="min-h-screen bg-[var(--canvas-bg)] text-[var(--ink-black)]">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <header className="pt-48 pb-32 px-6 lg:px-10 bg-[var(--canvas-bg)]">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left — copy */}
            <div>
              <span className="section-number">
                <TranslatedText translationKey="immobilier.hero.sectionNumber" />
              </span>
              <h1 className="serif text-6xl md:text-8xl leading-tight text-[var(--ink-black)]">
                <TranslatedText translationKey="immobilier.hero.title" />{' '}
                <em className="italic" style={{ color: 'var(--gold-accent)' }}>
                  <TranslatedText translationKey="immobilier.hero.titleEmphasis" />
                </em>{' '}
                <TranslatedText translationKey="immobilier.hero.titleSuffix" />
              </h1>
              <p className="text-[12px] uppercase tracking-[0.3em] text-[var(--gray-text)] mt-12 leading-loose max-w-lg montserrat">
                <TranslatedText translationKey="immobilier.hero.description" />
              </p>
              <div className="mt-12">
                <a
                  href="#etude-sur-mesure"
                  className="btn-cta"
                >
                  <TranslatedText translationKey="immobilier.hero.cta" />
                </a>
              </div>
            </div>

            {/* Right — image + floating quote */}
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden relative">
                <Image
                  src="/images/usecase/usecase_leasing.avif"
                  alt={t('immobilier.hero.imageAlt')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              {/* Floating quote card */}
              <div className="absolute -bottom-10 -left-10 bg-[var(--canvas-bg)] p-8 hidden lg:block border border-[var(--border-light)] shadow-xl max-w-xs">
                <p className="serif text-xl italic mb-2 text-[var(--ink-black)]">
                  &ldquo;<TranslatedText translationKey="immobilier.hero.quote" />&rdquo;
                </p>
                <p className="text-[8px] uppercase tracking-widest text-[var(--gray-text)] montserrat">
                  <TranslatedText translationKey="immobilier.hero.quoteAuthor" />
                </p>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* ── AVANTAGES (fond noir) ─────────────────────────────────────────── */}
      <section className="py-40 bg-[var(--ink-black)] px-6 lg:px-10">
        <div className="max-w-screen-2xl mx-auto">

          <div className="mb-24">
            <span className="section-number !text-[#666]">
              <TranslatedText translationKey="immobilier.advantages.sectionNumber" />
            </span>
            <h2 className="serif text-5xl md:text-7xl italic text-[var(--canvas-bg)] leading-tight">
              <TranslatedText translationKey="immobilier.advantages.title" />
              <br />
              <TranslatedText translationKey="immobilier.advantages.titleSuffix" />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 01 */}
            <div
              className="p-10 border border-[#333] transition-colors duration-300 hover:border-[var(--gold-accent)] group"
            >
              <span className="serif text-5xl italic block mb-6" style={{ color: 'var(--gold-accent)', opacity: 0.5 }}>
                <TranslatedText translationKey="immobilier.advantages.cards.projection.number" />
              </span>
              <h3 className="serif text-2xl mb-6 text-[var(--canvas-bg)]">
                <TranslatedText translationKey="immobilier.advantages.cards.projection.title" />
              </h3>
              <p className="text-[13px] text-[#999] leading-loose montserrat font-light">
                <TranslatedText translationKey="immobilier.advantages.cards.projection.description" />
              </p>
            </div>

            {/* Card 02 */}
            <div
              className="p-10 border border-[#333] transition-colors duration-300 hover:border-[var(--gold-accent)] group"
            >
              <span className="serif text-5xl italic block mb-6" style={{ color: 'var(--gold-accent)', opacity: 0.5 }}>
                <TranslatedText translationKey="immobilier.advantages.cards.acceleration.number" />
              </span>
              <h3 className="serif text-2xl mb-6 text-[var(--canvas-bg)]">
                <TranslatedText translationKey="immobilier.advantages.cards.acceleration.title" />
              </h3>
              <p className="text-[13px] text-[#999] leading-loose montserrat font-light">
                <TranslatedText translationKey="immobilier.advantages.cards.acceleration.description" />
              </p>
            </div>

            {/* Card 03 */}
            <div
              className="p-10 border border-[#333] transition-colors duration-300 hover:border-[var(--gold-accent)] group"
            >
              <span className="serif text-5xl italic block mb-6" style={{ color: 'var(--gold-accent)', opacity: 0.5 }}>
                <TranslatedText translationKey="immobilier.advantages.cards.differentiation.number" />
              </span>
              <h3 className="serif text-2xl mb-6 text-[var(--canvas-bg)]">
                <TranslatedText translationKey="immobilier.advantages.cards.differentiation.title" />
              </h3>
              <p className="text-[13px] text-[#999] leading-loose montserrat font-light">
                <TranslatedText translationKey="immobilier.advantages.cards.differentiation.description" />
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── PROCESSUS ────────────────────────────────────────────────────── */}
      <section className="py-40 px-6 lg:px-10 bg-[var(--canvas-bg)]">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20">

            {/* Left — intro */}
            <div className="lg:w-1/3">
              <span className="section-number">
                <TranslatedText translationKey="immobilier.process.sectionNumber" />
              </span>
              <h2 className="serif text-5xl italic leading-tight mb-8 text-[var(--ink-black)]">
                <TranslatedText translationKey="immobilier.process.title" />
                <br />
                <TranslatedText translationKey="immobilier.process.titleSuffix" />
              </h2>
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--gray-text)] leading-loose montserrat">
                <TranslatedText translationKey="immobilier.process.description" />
              </p>
            </div>

            {/* Right — 2×2 grid */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-light)] border border-[var(--border-light)]">

              <div className="bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] border-t-2 border-t-transparent hover:border-t-[var(--gold-accent)] p-12 transition-all duration-500">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 montserrat text-[var(--ink-black)]">
                  <TranslatedText translationKey="immobilier.process.steps.curation.title" />
                </h4>
                <p className="text-[13px] text-[var(--gray-text)] montserrat font-light leading-relaxed">
                  <TranslatedText translationKey="immobilier.process.steps.curation.description" />
                </p>
              </div>

              <div className="bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] border-t-2 border-t-transparent hover:border-t-[var(--gold-accent)] p-12 transition-all duration-500">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 montserrat text-[var(--ink-black)]">
                  <TranslatedText translationKey="immobilier.process.steps.deployment.title" />
                </h4>
                <p className="text-[13px] text-[var(--gray-text)] montserrat font-light leading-relaxed">
                  <TranslatedText translationKey="immobilier.process.steps.deployment.description" />
                </p>
              </div>

              <div className="bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] border-t-2 border-t-transparent hover:border-t-[var(--gold-accent)] p-12 transition-all duration-500">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 montserrat text-[var(--ink-black)]">
                  <TranslatedText translationKey="immobilier.process.steps.commitment.title" />
                </h4>
                <p className="text-[13px] text-[var(--gray-text)] montserrat font-light leading-relaxed">
                  <TranslatedText translationKey="immobilier.process.steps.commitment.description" />
                </p>
              </div>

              <div className="bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] border-t-2 border-t-transparent hover:border-t-[var(--gold-accent)] p-12 transition-all duration-500">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 montserrat text-[var(--ink-black)]">
                  <TranslatedText translationKey="immobilier.process.steps.revelation.title" />
                </h4>
                <p className="text-[13px] text-[var(--gray-text)] montserrat font-light leading-relaxed">
                  <TranslatedText translationKey="immobilier.process.steps.revelation.description" />
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION IMAGE ÉDITORIALE ─────────────────────────────────────── */}
      <section className="py-0 bg-[var(--soft-gray)] border-y border-[var(--border-light)]">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-stretch">

          {/* Image */}
          <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[480px]">
            <Image
              src="/images/usecase/hero_usecase.webp"
              alt={t('immobilier.stats.imageAlt')}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Stat block */}
          <div className="flex flex-col justify-center px-12 lg:px-20 py-20 lg:py-32 bg-[var(--canvas-bg)]">
            <span className="section-number">
              <TranslatedText translationKey="immobilier.stats.sectionNumber" />
            </span>
            <div className="divide-y divide-[var(--border-light)]">
              <div className="py-10">
                <span className="serif text-6xl italic block mb-3" style={{ color: 'var(--gold-accent)' }}>
                  <TranslatedText translationKey="immobilier.stats.items.projection.value" />
                </span>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--gray-text)] montserrat">
                  <TranslatedText translationKey="immobilier.stats.items.projection.label" />
                </p>
              </div>
              <div className="py-10">
                <span className="serif text-6xl italic block mb-3" style={{ color: 'var(--gold-accent)' }}>
                  <TranslatedText translationKey="immobilier.stats.items.acceleration.value" />
                </span>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--gray-text)] montserrat">
                  <TranslatedText translationKey="immobilier.stats.items.acceleration.label" />
                </p>
              </div>
              <div className="py-10">
                <span className="serif text-6xl italic block mb-3" style={{ color: 'var(--gold-accent)' }}>
                  <TranslatedText translationKey="immobilier.stats.items.tax.value" />
                </span>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--gray-text)] montserrat">
                  <TranslatedText translationKey="immobilier.stats.items.tax.label" />
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA RETOUR ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10 border-t border-[var(--border-light)] bg-[var(--canvas-bg)]">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <span className="section-number">
              <TranslatedText translationKey="immobilier.backLink.sectionNumber" />
            </span>
            <p className="serif text-3xl italic text-[var(--ink-black)]">
              <TranslatedText translationKey="immobilier.backLink.description" />
            </p>
          </div>
          <Link
            href="/usecase/leasing"
            className="btn-cta shrink-0"
          >
            <TranslatedText translationKey="immobilier.backLink.cta" />
          </Link>
        </div>
      </section>

    </main>
  )
}
