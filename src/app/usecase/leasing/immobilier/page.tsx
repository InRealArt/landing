import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Leasing d\'Art pour Immobilier de Prestige — InRealArt',
  description: 'Accélérez la vente de vos programmes immobiliers avec l\'art contemporain. Leasing d\'œuvres pour halls, circulations, espaces partagés. Curation sur mesure, installation rapide.',
  keywords: [
    'art immobilier',
    'leasing art programme immobilier',
    'art parties communes',
    'curation immobilière',
    'valorisation bien immobilier',
    'halls prestige art',
  ],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase/leasing/immobilier`,
})

export default function ImmobilierPage() {
  return (
    <main className="min-h-screen bg-[var(--canvas-bg)] text-[var(--ink-black)]">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <header className="pt-48 pb-32 px-6 lg:px-10 bg-[var(--canvas-bg)]">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left — copy */}
            <div>
              <span className="section-number">Immobilier d&apos;Exception &amp; Art Contemporain</span>
              <h1 className="serif text-6xl md:text-8xl leading-tight text-[var(--ink-black)]">
                Accélérez la{' '}
                <em className="italic" style={{ color: 'var(--gold-accent)' }}>
                  projection
                </em>{' '}
                émotionnelle.
              </h1>
              <p className="text-[12px] uppercase tracking-[0.3em] text-[var(--gray-text)] mt-12 leading-loose max-w-lg montserrat">
                Un espace habité par l&apos;art devient immédiatement tangible, désirable.
                Nos solutions de leasing artistique transforment vos espaces communs en atouts commerciaux véritables.
              </p>
              <div className="mt-12">
                <a
                  href="#etude-sur-mesure"
                  className="btn-cta"
                >
                  Échanger sur votre programme
                </a>
              </div>
            </div>

            {/* Right — image + floating quote */}
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden relative">
                <Image
                  src="/images/usecase/usecase_leasing.avif"
                  alt="Espace commun d'un programme immobilier avec œuvres d'art"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              {/* Floating quote card */}
              <div className="absolute -bottom-10 -left-10 bg-[var(--canvas-bg)] p-8 hidden lg:block border border-[var(--border-light)] shadow-xl max-w-xs">
                <p className="serif text-xl italic mb-2 text-[var(--ink-black)]">
                  &ldquo;L&apos;art aide vos futurs acquéreurs à se voir déjà chez eux.&rdquo;
                </p>
                <p className="text-[8px] uppercase tracking-widest text-[var(--gray-text)] montserrat">
                  InRealArt — Architecture &amp; Immobilier
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
            <span className="section-number !text-[#666]">Un levier direct de performance commerciale</span>
            <h2 className="serif text-5xl md:text-7xl italic text-[var(--canvas-bg)] leading-tight">
              Pourquoi l&apos;art<br />transforme vos ventes.
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
                Projection Émotionnelle
              </h3>
              <p className="text-[13px] text-[#999] leading-loose montserrat font-light">
                Un espace habité par l&apos;art devient immédiatement tangible et désirable.
                Jusqu&apos;à +20&nbsp;% de projection émotionnelle lors des visites — vos futurs acquéreurs se voient déjà chez eux.
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
                Accélération Commerciale
              </h3>
              <p className="text-[13px] text-[#999] leading-loose montserrat font-light">
                Les programmes valorisés artistiquement enregistrent une accélération des ventes sur les lots témoins.
                Réduction des cycles de décision et meilleure mémorisation du bien présenté.
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
                Différenciation Forte
              </h3>
              <p className="text-[13px] text-[#999] leading-loose montserrat font-light">
                Valorisation perçue du bien et des parties communes. Un levier puissant face à des biens comparables — car un appartement mis en scène avec exigence ne se visite pas, il se ressent.
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
              <span className="section-number">Une solution souple et intégrée</span>
              <h2 className="serif text-5xl italic leading-tight mb-8 text-[var(--ink-black)]">
                Des espaces<br />qui incarnent.
              </h2>
              <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--gray-text)] leading-loose montserrat">
                Des halls, circulations, espaces partagés — autant de lieux stratégiques pour affirmer votre signature. Chaque détail est pensé.
              </p>
            </div>

            {/* Right — 2×2 grid */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-light)] border border-[var(--border-light)]">

              <div className="bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] border-t-2 border-t-transparent hover:border-t-[var(--gold-accent)] p-12 transition-all duration-500">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 montserrat text-[var(--ink-black)]">
                  Curation Architecturale
                </h4>
                <p className="text-[13px] text-[var(--gray-text)] montserrat font-light leading-relaxed">
                  Curation sur mesure, en lien avec vos partis pris architecturaux.
                  Identité esthétique cohérente avec votre programme, expérience résidentielle haut de gamme dès l&apos;entrée.
                </p>
              </div>

              <div className="bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] border-t-2 border-t-transparent hover:border-t-[var(--gold-accent)] p-12 transition-all duration-500">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 montserrat text-[var(--ink-black)]">
                  Déploiement Rapide
                </h4>
                <p className="text-[13px] text-[var(--gray-text)] montserrat font-light leading-relaxed">
                  Installation rapide pour vos délais commerciaux. Rotation possible selon les phases du programme — aucun investissement immobilisé.
                </p>
              </div>

              <div className="bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] border-t-2 border-t-transparent hover:border-t-[var(--gold-accent)] p-12 transition-all duration-500">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 montserrat text-[var(--ink-black)]">
                  Engagement Culturel
                </h4>
                <p className="text-[13px] text-[var(--gray-text)] montserrat font-light leading-relaxed">
                  Soutien à la création artistique, démarche responsable via la mutualisation des œuvres.
                  Contribution à un cadre de vie plus culturel et inspirant.
                </p>
              </div>

              <div className="bg-[var(--soft-gray)] hover:bg-[var(--canvas-bg)] border-t-2 border-t-transparent hover:border-t-[var(--gold-accent)] p-12 transition-all duration-500">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 montserrat text-[var(--ink-black)]">
                  Révélation du Lieu
                </h4>
                <p className="text-[13px] text-[var(--gray-text)] montserrat font-light leading-relaxed">
                  L&apos;art ne finalise pas un lieu — il le révèle. Et parfois, il déclenche une décision. Vos espaces deviennent mémorables.
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
              alt="Collection d'art dans un programme immobilier de prestige"
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
                  +20&nbsp;%
                </span>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--gray-text)] montserrat">
                  de projection émotionnelle lors des visites dans les programmes avec collection d&apos;art
                </p>
              </div>
              <div className="py-10">
                <span className="serif text-6xl italic block mb-3" style={{ color: 'var(--gold-accent)' }}>
                  +15&nbsp;%
                </span>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--gray-text)] montserrat">
                  d&apos;accélération moyenne des ventes sur les lots témoins artifialisés
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
            <span className="section-number justify-center flex">Parlons de votre programme</span>
            <h3 className="serif text-4xl italic mb-4 text-[var(--ink-black)]">
              Transformer un espace en évidence
            </h3>
            <p className="text-[9px] uppercase tracking-widest text-[var(--gray-text)] montserrat">
              L&apos;art ne finalise pas un lieu. Il le révèle. Et parfois, il déclenche une décision.
            </p>
          </div>

          <form
            action="/contact"
            method="GET"
            className="space-y-10"
            aria-label="Formulaire de demande pour votre programme immobilier"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label
                  htmlFor="immo-program"
                  className="sr-only"
                >
                  Votre programme
                </label>
                <input
                  id="immo-program"
                  type="text"
                  name="programme"
                  placeholder="VOTRE PROGRAMME"
                  className="w-full border-b border-[var(--border-light)] py-3 text-[10px] uppercase tracking-widest outline-none bg-transparent text-[var(--ink-black)] placeholder:text-[var(--gray-text)] montserrat focus:border-[var(--gold-accent)] transition-colors duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="immo-lots"
                  className="sr-only"
                >
                  Nombre de lots
                </label>
                <select
                  id="immo-lots"
                  name="lots"
                  className="w-full border-b border-[var(--border-light)] py-3 text-[10px] uppercase tracking-widest outline-none bg-transparent text-[var(--gray-text)] montserrat focus:border-[var(--gold-accent)] transition-colors duration-300 cursor-pointer"
                >
                  <option value="">NOMBRE DE LOTS</option>
                  <option value="moins-20">&lt; 20 lots</option>
                  <option value="20-100">20 – 100 lots</option>
                  <option value="100-plus">100+ lots</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label
                  htmlFor="immo-email"
                  className="sr-only"
                >
                  Email professionnel
                </label>
                <input
                  id="immo-email"
                  type="email"
                  name="email"
                  placeholder="EMAIL PROFESSIONNEL"
                  className="w-full border-b border-[var(--border-light)] py-3 text-[10px] uppercase tracking-widest outline-none bg-transparent text-[var(--ink-black)] placeholder:text-[var(--gray-text)] montserrat focus:border-[var(--gold-accent)] transition-colors duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="immo-budget"
                  className="sr-only"
                >
                  Budget estimé
                </label>
                <select
                  id="immo-budget"
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
              Échanger sur votre programme
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
