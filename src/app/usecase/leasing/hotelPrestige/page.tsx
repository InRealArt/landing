import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Art & Hôtellerie d\'Exception — InRealArt',
  description: 'InRealArt accompagne les hôtels de prestige dans la création d\'univers artistiques sur mesure. Leasing d\'œuvres d\'art, curation confidentielle, installation maîtrisée.',
  keywords: [
    'art hôtellerie prestige',
    'leasing art hôtel luxe',
    'curation artistique hôtel',
    'œuvres art hôtel',
    'art contemporain hôtellerie',
    'RSE luxe art',
  ],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase/leasing/hotelPrestige`,
})

export default function HotelPrestigePage() {
  return (
    <main className="min-h-screen bg-[var(--canvas-bg)] text-[var(--ink-black)]">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <header className="pt-48 pb-32 px-6 lg:px-10 bg-[var(--canvas-bg)]">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left — copy */}
            <div>
              <span className="section-number">Hôtellerie d&apos;Exception &amp; Création Contemporaine</span>
              <h1 className="serif text-6xl md:text-8xl leading-tight text-[var(--ink-black)]">
                L&apos;art comme{' '}
                <em className="italic" style={{ color: 'var(--gold-accent)' }}>
                  signature
                </em>{' '}
                d&apos;exception.
              </h1>
              <p className="text-[12px] uppercase tracking-[0.3em] text-[var(--gray-text)] mt-12 leading-loose max-w-lg montserrat">
                Dans les établissements les plus prestigieux, rien n&apos;est laissé au hasard.
                L&apos;art ne vient pas habiller un lieu — il en révèle l&apos;âme.
                Nous accompagnons les hôtels d&apos;exception dans la création de véritables univers artistiques,
                pensés comme une extension naturelle de leur identité.
              </p>
              <div className="mt-12">
                <a
                  href="#etude-sur-mesure"
                  className="btn-cta"
                >
                  Initier une conversation
                </a>
              </div>
            </div>

            {/* Right — image + floating quote */}
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden relative">
                <Image
                  src="/images/usecase/usecase_leasing.avif"
                  alt="Hall d'un hôtel de prestige avec œuvres d'art"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              {/* Floating quote card */}
              <div className="absolute -bottom-10 -left-10 bg-[var(--canvas-bg)] p-8 hidden lg:block border border-[var(--border-light)] shadow-xl max-w-xs">
                <p className="serif text-xl italic mb-2 text-[var(--ink-black)]">
                  &ldquo;Rien n&apos;est visible, tout est ressenti.&rdquo;
                </p>
                <p className="text-[8px] uppercase tracking-widest text-[var(--gray-text)] montserrat">
                  InRealArt — Philosophie de curation
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
            <span className="section-number !text-[#666]">Une expérience qui s&apos;imprime durablement</span>
            <h2 className="serif text-5xl md:text-7xl italic text-[var(--canvas-bg)] leading-tight">
              Une esthétique<br />vivante.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 01 */}
            <div
              className="p-10 border border-[#333] transition-colors duration-300 hover:border-[var(--gold-accent)] group"
            >
              <span className="serif text-5xl italic block mb-6" style={{ color: 'var(--gold-accent)', opacity: 0.5 }}>
                01
              </span>
              <h3 className="serif text-2xl mb-6 text-[var(--canvas-bg)]">
                Séjour prolongé
              </h3>
              <p className="text-[13px] text-[#999] leading-loose montserrat font-light">
                Les environnements enrichis par l&apos;art transforment la perception et l&apos;attachement.
                Jusqu&apos;à +12&nbsp;% de durée moyenne de séjour — chaque œuvre devient un point d&apos;ancrage émotionnel.
              </p>
            </div>

            {/* Card 02 */}
            <div
              className="p-10 border border-[#333] transition-colors duration-300 hover:border-[var(--gold-accent)] group"
            >
              <span className="serif text-5xl italic block mb-6" style={{ color: 'var(--gold-accent)', opacity: 0.5 }}>
                02
              </span>
              <h3 className="serif text-2xl mb-6 text-[var(--canvas-bg)]">
                Esthétique en renouvellement
              </h3>
              <p className="text-[13px] text-[#999] leading-loose montserrat font-light">
                Le leasing inscrit votre établissement dans une dynamique culturelle subtile et continue&nbsp;:
                rotation des œuvres au fil des saisons, dialogues entre architecture, design et création contemporaine.
              </p>
            </div>

            {/* Card 03 */}
            <div
              className="p-10 border border-[#333] transition-colors duration-300 hover:border-[var(--gold-accent)] group"
            >
              <span className="serif text-5xl italic block mb-6" style={{ color: 'var(--gold-accent)', opacity: 0.5 }}>
                03
              </span>
              <h3 className="serif text-2xl mb-6 text-[var(--canvas-bg)]">
                Engagement discret, essentiel
              </h3>
              <p className="text-[13px] text-[#999] leading-loose montserrat font-light">
                Accompagnement d&apos;artistes vivants, contribution à un écosystème culturel durable.
                Une démarche responsable, en phase avec les attentes contemporaines du luxe.
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
              <span className="section-number">Une orchestration sans compromis</span>
              <h2 className="serif text-5xl italic leading-tight mb-8 text-[var(--ink-black)]">
                Chaque détail,<br />pensé.
              </h2>
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--gray-text)] leading-loose montserrat">
                Chaque projet est pensé dans ses moindres détails — rien n&apos;est visible, tout est ressenti.
              </p>
            </div>

            {/* Right — 2×2 grid */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-light)] border border-[var(--border-light)]">

              <div className="bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] border-t-2 border-t-transparent hover:border-t-[var(--gold-accent)] p-12 transition-all duration-500">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 montserrat text-[var(--ink-black)]">
                  Curation Confidentielle
                </h4>
                <p className="text-[13px] text-[var(--gray-text)] montserrat font-light leading-relaxed">
                  Curation confidentielle et sur mesure, en accord avec l&apos;ADN de votre
                  établissement&nbsp;: lobby, suites, espaces de restauration, spa.
                </p>
              </div>

              <div className="bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] border-t-2 border-t-transparent hover:border-t-[var(--gold-accent)] p-12 transition-all duration-500">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 montserrat text-[var(--ink-black)]">
                  Financement LOA
                </h4>
                <p className="text-[13px] text-[var(--gray-text)] montserrat font-light leading-relaxed">
                  Plan de leasing sur 13 à 48 mois, entièrement déductible. Pas
                  d&apos;immobilisation au bilan, trésorerie préservée.
                </p>
              </div>

              <div className="bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] border-t-2 border-t-transparent hover:border-t-[var(--gold-accent)] p-12 transition-all duration-500">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 montserrat text-[var(--ink-black)]">
                  Installation Maîtrisée
                </h4>
                <p className="text-[13px] text-[var(--gray-text)] montserrat font-light leading-relaxed">
                  Installation maîtrisée, en parfaite harmonie avec vos espaces.
                  Transport sécurisé, accrochage professionnel, éclairage scénographique.
                </p>
              </div>

              <div className="bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] border-t-2 border-t-transparent hover:border-t-[var(--gold-accent)] p-12 transition-all duration-500">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 montserrat text-[var(--ink-black)]">
                  Renouvellement Fluide
                </h4>
                <p className="text-[13px] text-[var(--gray-text)] montserrat font-light leading-relaxed">
                  Suivi attentif et renouvellement fluide des collections. Vos espaces
                  évoluent au rythme des saisons et de votre clientèle.
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
              alt="Collection d'art dans un hôtel de prestige"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Stat block */}
          <div className="flex flex-col justify-center px-12 lg:px-20 py-20 lg:py-32 bg-[var(--canvas-bg)]">
            <span className="section-number">Données de marché</span>
            <div className="divide-y divide-[var(--border-light)]">
              <div className="py-10">
                <span className="serif text-6xl italic block mb-3" style={{ color: 'var(--gold-accent)' }}>
                  +12&nbsp;%
                </span>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--gray-text)] montserrat">
                  de durée de séjour moyenne dans les hôtels proposant une collection d&apos;art
                </p>
              </div>
              <div className="py-10">
                <span className="serif text-6xl italic block mb-3" style={{ color: 'var(--gold-accent)' }}>
                  +18&nbsp;%
                </span>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--gray-text)] montserrat">
                  de satisfaction et de recommandation enregistrés par nos établissements partenaires
                </p>
              </div>
              <div className="py-10">
                <span className="serif text-6xl italic block mb-3" style={{ color: 'var(--gold-accent)' }}>
                  100&nbsp;%
                </span>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--gray-text)] montserrat">
                  des loyers déductibles du résultat imposable (CGI Art.&nbsp;39-1-1°)
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
            <span className="section-number justify-center flex">Initier une conversation</span>
            <h3 className="serif text-4xl italic mb-4 text-[var(--ink-black)]">
              Faire de votre hôtel une œuvre en soi
            </h3>
            <p className="text-[9px] uppercase tracking-widest text-[var(--gray-text)] montserrat">
              Au-delà du séjour, une expérience culturelle intime, silencieuse, inoubliable.
            </p>
          </div>

          <form
            action="/contact"
            method="GET"
            className="space-y-10"
            aria-label="Formulaire de demande d'étude personnalisée"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label
                  htmlFor="hotel-name"
                  className="sr-only"
                >
                  Nom de l&apos;établissement
                </label>
                <input
                  id="hotel-name"
                  type="text"
                  name="etablissement"
                  placeholder="ÉTABLISSEMENT"
                  className="w-full border-b border-[var(--border-light)] py-3 text-[10px] uppercase tracking-widest outline-none bg-transparent text-[var(--ink-black)] placeholder:text-[var(--gray-text)] montserrat focus:border-[var(--gold-accent)] transition-colors duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="hotel-rooms"
                  className="sr-only"
                >
                  Nombre de chambres
                </label>
                <select
                  id="hotel-rooms"
                  name="chambres"
                  className="w-full border-b border-[var(--border-light)] py-3 text-[10px] uppercase tracking-widest outline-none bg-transparent text-[var(--gray-text)] montserrat focus:border-[var(--gold-accent)] transition-colors duration-300 cursor-pointer"
                >
                  <option value="">NOMBRE DE CHAMBRES</option>
                  <option value="moins-50">&lt; 50 chambres</option>
                  <option value="50-200">50 – 200 chambres</option>
                  <option value="200-plus">200+ chambres</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label
                  htmlFor="hotel-email"
                  className="sr-only"
                >
                  Email professionnel
                </label>
                <input
                  id="hotel-email"
                  type="email"
                  name="email"
                  placeholder="EMAIL PROFESSIONNEL"
                  className="w-full border-b border-[var(--border-light)] py-3 text-[10px] uppercase tracking-widest outline-none bg-transparent text-[var(--ink-black)] placeholder:text-[var(--gray-text)] montserrat focus:border-[var(--gold-accent)] transition-colors duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="hotel-budget"
                  className="sr-only"
                >
                  Budget estimé
                </label>
                <select
                  id="hotel-budget"
                  name="budget"
                  className="w-full border-b border-[var(--border-light)] py-3 text-[10px] uppercase tracking-widest outline-none bg-transparent text-[var(--gray-text)] montserrat focus:border-[var(--gold-accent)] transition-colors duration-300 cursor-pointer"
                >
                  <option value="">BUDGET ESTIMÉ</option>
                  <option value="5k-15k">5 000 € – 15 000 €</option>
                  <option value="15k-50k">15 000 € – 50 000 €</option>
                  <option value="50k-plus">50 000 € +</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-cta w-full text-center"
            >
              Initier une conversation
            </button>
          </form>
        </div>
      </section>

      {/* ── CTA RETOUR ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10 border-t border-[var(--border-light)] bg-[var(--canvas-bg)]">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <span className="section-number">Autres solutions</span>
            <p className="serif text-3xl italic text-[var(--ink-black)]">
              Découvrez toutes nos solutions de leasing artistique.
            </p>
          </div>
          <Link
            href="/usecase/leasing"
            className="btn-cta shrink-0"
          >
            Explorer le leasing
          </Link>
        </div>
      </section>

    </main>
  )
}
