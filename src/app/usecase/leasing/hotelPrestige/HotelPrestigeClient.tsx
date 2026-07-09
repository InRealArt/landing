'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import TranslatedText from '@/components/common/TranslatedText'

export default function HotelPrestigeClient() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-[var(--canvas-bg)] text-[var(--ink-black)]">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <header className="pt-48 pb-32 px-6 lg:px-10 bg-[var(--canvas-bg)]">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left — copy */}
            <div>
              <span className="section-number">
                <TranslatedText translationKey="hotelPrestige.hero.sectionNumber" />
              </span>
              <h1 className="serif text-6xl md:text-8xl leading-tight text-[var(--ink-black)]">
                <TranslatedText translationKey="hotelPrestige.hero.title" />{' '}
                <em className="italic" style={{ color: 'var(--gold-accent)' }}>
                  <TranslatedText translationKey="hotelPrestige.hero.titleEmphasis" />
                </em>{' '}
                <TranslatedText translationKey="hotelPrestige.hero.titleSuffix" />
              </h1>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--gray-text)] mt-12 leading-loose max-w-lg montserrat">
                <TranslatedText translationKey="hotelPrestige.hero.description" />
              </p>
              <div className="mt-12">
                <a
                  href="#etude-sur-mesure"
                  className="btn-cta"
                >
                  <TranslatedText translationKey="hotelPrestige.hero.cta" />
                </a>
              </div>
            </div>

            {/* Right — image + floating quote */}
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden relative">
                <Image
                  src="/images/usecase/usecase_leasing.avif"
                  alt={t('hotelPrestige.hero.imageAlt')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              {/* Floating quote card */}
              <div className="absolute -bottom-10 -left-10 bg-[var(--canvas-bg)] p-8 hidden lg:block border border-[var(--border-light)] shadow-xl max-w-xs">
                <p className="serif text-xl italic mb-2 text-[var(--ink-black)]">
                  &ldquo;<TranslatedText translationKey="hotelPrestige.hero.quote" />&rdquo;
                </p>
                <p className="text-[8px] uppercase tracking-widest text-[var(--gray-text)] montserrat">
                  <TranslatedText translationKey="hotelPrestige.hero.quoteAuthor" />
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
              <TranslatedText translationKey="hotelPrestige.advantages.sectionNumber" />
            </span>
            <h2 className="serif text-5xl md:text-7xl italic text-[var(--canvas-bg)] leading-tight">
              <TranslatedText translationKey="hotelPrestige.advantages.title" />
              <br />
              <TranslatedText translationKey="hotelPrestige.advantages.titleSuffix" />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 01 */}
            <div
              className="p-10 border border-[#333] transition-colors duration-300 hover:border-[var(--gold-accent)] group"
            >
              <span className="serif text-5xl italic block mb-6" style={{ color: 'var(--gold-accent)', opacity: 0.5 }}>
                <TranslatedText translationKey="hotelPrestige.advantages.cards.stay.number" />
              </span>
              <h3 className="serif text-2xl mb-6 text-[var(--canvas-bg)]">
                <TranslatedText translationKey="hotelPrestige.advantages.cards.stay.title" />
              </h3>
              <p className="text-sm text-[#999] leading-loose montserrat font-light">
                <TranslatedText translationKey="hotelPrestige.advantages.cards.stay.description" />
              </p>
            </div>

            {/* Card 02 */}
            <div
              className="p-10 border border-[#333] transition-colors duration-300 hover:border-[var(--gold-accent)] group"
            >
              <span className="serif text-5xl italic block mb-6" style={{ color: 'var(--gold-accent)', opacity: 0.5 }}>
                <TranslatedText translationKey="hotelPrestige.advantages.cards.aesthetics.number" />
              </span>
              <h3 className="serif text-2xl mb-6 text-[var(--canvas-bg)]">
                <TranslatedText translationKey="hotelPrestige.advantages.cards.aesthetics.title" />
              </h3>
              <p className="text-sm text-[#999] leading-loose montserrat font-light">
                <TranslatedText translationKey="hotelPrestige.advantages.cards.aesthetics.description" />
              </p>
            </div>

            {/* Card 03 */}
            <div
              className="p-10 border border-[#333] transition-colors duration-300 hover:border-[var(--gold-accent)] group"
            >
              <span className="serif text-5xl italic block mb-6" style={{ color: 'var(--gold-accent)', opacity: 0.5 }}>
                <TranslatedText translationKey="hotelPrestige.advantages.cards.commitment.number" />
              </span>
              <h3 className="serif text-2xl mb-6 text-[var(--canvas-bg)]">
                <TranslatedText translationKey="hotelPrestige.advantages.cards.commitment.title" />
              </h3>
              <p className="text-sm text-[#999] leading-loose montserrat font-light">
                <TranslatedText translationKey="hotelPrestige.advantages.cards.commitment.description" />
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
                <TranslatedText translationKey="hotelPrestige.process.sectionNumber" />
              </span>
              <h2 className="serif text-5xl italic leading-tight mb-8 text-[var(--ink-black)]">
                <TranslatedText translationKey="hotelPrestige.process.title" />
                <br />
                <TranslatedText translationKey="hotelPrestige.process.titleSuffix" />
              </h2>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--gray-text)] leading-loose montserrat">
                <TranslatedText translationKey="hotelPrestige.process.description" />
              </p>
            </div>

            {/* Right — 2×2 grid */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-light)] border border-[var(--border-light)]">

              <div className="bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] border-t-2 border-t-transparent hover:border-t-[var(--gold-accent)] p-12 transition-all duration-500">
                <h4 className="text-xs uppercase tracking-[0.3em] font-bold mb-4 montserrat text-[var(--ink-black)]">
                  <TranslatedText translationKey="hotelPrestige.process.steps.curation.title" />
                </h4>
                <p className="text-sm text-[var(--gray-text)] montserrat font-light leading-relaxed">
                  <TranslatedText translationKey="hotelPrestige.process.steps.curation.description" />
                </p>
              </div>

              <div className="bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] border-t-2 border-t-transparent hover:border-t-[var(--gold-accent)] p-12 transition-all duration-500">
                <h4 className="text-xs uppercase tracking-[0.3em] font-bold mb-4 montserrat text-[var(--ink-black)]">
                  <TranslatedText translationKey="hotelPrestige.process.steps.financing.title" />
                </h4>
                <p className="text-sm text-[var(--gray-text)] montserrat font-light leading-relaxed">
                  <TranslatedText translationKey="hotelPrestige.process.steps.financing.description" />
                </p>
              </div>

              <div className="bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] border-t-2 border-t-transparent hover:border-t-[var(--gold-accent)] p-12 transition-all duration-500">
                <h4 className="text-xs uppercase tracking-[0.3em] font-bold mb-4 montserrat text-[var(--ink-black)]">
                  <TranslatedText translationKey="hotelPrestige.process.steps.installation.title" />
                </h4>
                <p className="text-sm text-[var(--gray-text)] montserrat font-light leading-relaxed">
                  <TranslatedText translationKey="hotelPrestige.process.steps.installation.description" />
                </p>
              </div>

              <div className="bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] border-t-2 border-t-transparent hover:border-t-[var(--gold-accent)] p-12 transition-all duration-500">
                <h4 className="text-xs uppercase tracking-[0.3em] font-bold mb-4 montserrat text-[var(--ink-black)]">
                  <TranslatedText translationKey="hotelPrestige.process.steps.renewal.title" />
                </h4>
                <p className="text-sm text-[var(--gray-text)] montserrat font-light leading-relaxed">
                  <TranslatedText translationKey="hotelPrestige.process.steps.renewal.description" />
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
              alt={t('hotelPrestige.stats.imageAlt')}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Stat block */}
          <div className="flex flex-col justify-center px-12 lg:px-20 py-20 lg:py-32 bg-[var(--canvas-bg)]">
            <span className="section-number">
              <TranslatedText translationKey="hotelPrestige.stats.sectionNumber" />
            </span>
            <div className="divide-y divide-[var(--border-light)]">
              <div className="py-10">
                <span className="serif text-6xl italic block mb-3" style={{ color: 'var(--gold-accent)' }}>
                  <TranslatedText translationKey="hotelPrestige.stats.items.stay.value" />
                </span>
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--gray-text)] montserrat">
                  <TranslatedText translationKey="hotelPrestige.stats.items.stay.label" />
                </p>
              </div>
              <div className="py-10">
                <span className="serif text-6xl italic block mb-3" style={{ color: 'var(--gold-accent)' }}>
                  <TranslatedText translationKey="hotelPrestige.stats.items.satisfaction.value" />
                </span>
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--gray-text)] montserrat">
                  <TranslatedText translationKey="hotelPrestige.stats.items.satisfaction.label" />
                </p>
              </div>
              <div className="py-10">
                <span className="serif text-6xl italic block mb-3" style={{ color: 'var(--gold-accent)' }}>
                  <TranslatedText translationKey="hotelPrestige.stats.items.tax.value" />
                </span>
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--gray-text)] montserrat">
                  <TranslatedText translationKey="hotelPrestige.stats.items.tax.label" />
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FORMULAIRE ───────────────────────────────────────────────────── */}
      <section id="etude-sur-mesure" className="py-40 bg-[var(--soft-gray)] px-6 lg:px-10">
        <div className="max-w-3xl mx-auto bg-[var(--canvas-bg)] p-12 lg:p-20 shadow-sm border border-[var(--border-light)]">

          <div className="text-center mb-16">
            <span className="section-number justify-center flex">
              <TranslatedText translationKey="hotelPrestige.form.sectionNumber" />
            </span>
            <h3 className="serif text-4xl italic mb-4 text-[var(--ink-black)]">
              <TranslatedText translationKey="hotelPrestige.form.title" />
            </h3>
            <p className="text-xs uppercase tracking-widest text-[var(--gray-text)] montserrat">
              <TranslatedText translationKey="hotelPrestige.form.subtitle" />
            </p>
          </div>

          <form
            action="/contact"
            method="GET"
            className="space-y-10"
            aria-label={t('hotelPrestige.form.formAriaLabel')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label
                  htmlFor="hotel-name"
                  className="sr-only"
                >
                  <TranslatedText translationKey="hotelPrestige.form.fields.hotelName.label" />
                </label>
                <input
                  id="hotel-name"
                  type="text"
                  name="etablissement"
                  placeholder={t('hotelPrestige.form.fields.hotelName.placeholder')}
                  className="w-full border-b border-[var(--border-light)] py-3 text-xs uppercase tracking-widest outline-none bg-transparent text-[var(--ink-black)] placeholder:text-[var(--gray-text)] montserrat focus:border-[var(--gold-accent)] transition-colors duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="hotel-rooms"
                  className="sr-only"
                >
                  <TranslatedText translationKey="hotelPrestige.form.fields.rooms.label" />
                </label>
                <select
                  id="hotel-rooms"
                  name="chambres"
                  className="w-full border-b border-[var(--border-light)] py-3 text-xs uppercase tracking-widest outline-none bg-transparent text-[var(--gray-text)] montserrat focus:border-[var(--gold-accent)] transition-colors duration-300 cursor-pointer"
                >
                  <option value="">{t('hotelPrestige.form.fields.rooms.placeholder')}</option>
                  <option value="moins-50">{t('hotelPrestige.form.fields.rooms.options.less50')}</option>
                  <option value="50-200">{t('hotelPrestige.form.fields.rooms.options.50to200')}</option>
                  <option value="200-plus">{t('hotelPrestige.form.fields.rooms.options.more200')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label
                  htmlFor="hotel-email"
                  className="sr-only"
                >
                  <TranslatedText translationKey="hotelPrestige.form.fields.email.label" />
                </label>
                <input
                  id="hotel-email"
                  type="email"
                  name="email"
                  placeholder={t('hotelPrestige.form.fields.email.placeholder')}
                  className="w-full border-b border-[var(--border-light)] py-3 text-xs uppercase tracking-widest outline-none bg-transparent text-[var(--ink-black)] placeholder:text-[var(--gray-text)] montserrat focus:border-[var(--gold-accent)] transition-colors duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="hotel-budget"
                  className="sr-only"
                >
                  <TranslatedText translationKey="hotelPrestige.form.fields.budget.label" />
                </label>
                <select
                  id="hotel-budget"
                  name="budget"
                  className="w-full border-b border-[var(--border-light)] py-3 text-xs uppercase tracking-widest outline-none bg-transparent text-[var(--gray-text)] montserrat focus:border-[var(--gold-accent)] transition-colors duration-300 cursor-pointer"
                >
                  <option value="">{t('hotelPrestige.form.fields.budget.placeholder')}</option>
                  <option value="5k-15k">{t('hotelPrestige.form.fields.budget.options.5kto15k')}</option>
                  <option value="15k-50k">{t('hotelPrestige.form.fields.budget.options.15kto50k')}</option>
                  <option value="50k-plus">{t('hotelPrestige.form.fields.budget.options.more50k')}</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-cta w-full text-center"
            >
              <TranslatedText translationKey="hotelPrestige.form.submit" />
            </button>
          </form>
        </div>
      </section>

      {/* ── CTA RETOUR ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10 border-t border-[var(--border-light)] bg-[var(--canvas-bg)]">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <span className="section-number">
              <TranslatedText translationKey="hotelPrestige.backLink.sectionNumber" />
            </span>
            <p className="serif text-3xl italic text-[var(--ink-black)]">
              <TranslatedText translationKey="hotelPrestige.backLink.description" />
            </p>
          </div>
          <Link
            href="/usecase/leasing"
            className="btn-cta shrink-0"
          >
            <TranslatedText translationKey="hotelPrestige.backLink.cta" />
          </Link>
        </div>
      </section>

    </main>
  )
}
