import type { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
import OptimizedImage from '@/components/common/OptimizedImage'
import TranslatedText from '@/components/common/TranslatedText'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Manifeste — InRealArt',
  description:
    "Notre manifeste pour rendre l'art, la culture et le patrimoine accessibles, responsables et créateurs de valeur durable.",
  keywords: [
    'manifeste InRealArt',
    'art responsable',
    'IRA selection',
    'IRA edition',
    'IRA placement',
    'IRA agance',
    'patrimoine',
    'culture',
    'impact',
  ],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/manifest`,
})

const BULLET_KEYS = [
  'manifest.bullets.access',
  'manifest.bullets.support',
  'manifest.bullets.bridges',
  'manifest.bullets.traceability',
] as const

export default function ManifestPage() {
  return (
    <main className="text-textColor bg-backgroundColor">

      {/* ─── Hero ─── */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <OptimizedBackgroundImage
          src="/images/fabParis.webp"
          alt="InRealArt exhibition space"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </OptimizedBackgroundImage>

        {/* Content pinned bottom-left — pattern éditorial galerie */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-screen-2xl mx-auto w-full px-10 pb-16 md:pb-20 lg:pb-28">
            <div className="max-w-3xl">
              <TranslatedText
                translationKey="manifest.heroLabel"
                as="span"
                className="section-number text-white/50 block mb-6"
              />
              <h1 className="text-7xl md:text-9xl serif text-white leading-none mb-8">
                <TranslatedText
                  translationKey="manifest.title"
                  as="span"
                  className="block"
                />
              </h1>
              <div className="w-12 h-px bg-gold-accent" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Corps — texte intro + image ─── */}
      <section className="bg-backgroundColor w-full py-24 lg:py-32">
        <div className="max-w-screen-2xl mx-auto px-10">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">

            {/* Colonne texte — 7 colonnes */}
            <div className="lg:col-span-7 space-y-10">
              <div>
                <TranslatedText
                  translationKey="manifest.sectionLabel"
                  as="span"
                  className="section-number block mb-6"
                />
                <h2 className="text-5xl md:text-6xl xl:text-7xl serif italic leading-none text-textColor mb-6">
                  <TranslatedText
                    translationKey="manifest.sectionTitle"
                    as="span"
                    className="block"
                  />
                </h2>
                <div className="w-12 h-px bg-gold-accent" />
              </div>

              <div className="space-y-6">
                <TranslatedText
                  as="p"
                  translationKey="manifest.p1"
                  className="text-[13px] text-grayText leading-loose montserrat"
                />
                <TranslatedText
                  as="p"
                  translationKey="manifest.p2"
                  className="text-[13px] text-grayText leading-loose montserrat"
                />
                <TranslatedText
                  as="p"
                  translationKey="manifest.p3"
                  className="text-[13px] text-grayText leading-loose montserrat"
                />
                <TranslatedText
                  as="p"
                  translationKey="manifest.p4"
                  className="text-[13px] text-grayText leading-loose montserrat"
                />
              </div>
            </div>

            {/* Colonne image portrait — 5 colonnes avec cadre décalé */}
            <div className="lg:col-span-5 relative">
              {/* Cadre décoratif doré décalé */}
              <div
                className="absolute border border-gold-accent/25"
                style={{ top: '24px', left: '-16px', right: '24px', bottom: '-24px' }}
                aria-hidden="true"
              />
              <div className="relative">
                <OptimizedBackgroundImage
                  src="/images/about/about_section1_photo2.webp"
                  alt="Œuvre InRealArt"
                  fill
                  quality={90}
                  priority={false}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="w-full aspect-[3/4]"
                />
                {/* Surimpression éditoriale */}
                <div className="absolute inset-0 flex items-end p-8 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                  <h3 className="text-3xl md:text-4xl serif italic text-white leading-tight">
                    <TranslatedText
                      translationKey="manifest.title"
                      as="span"
                    />
                  </h3>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Engagements — fond alterné ─── */}
      <section className="bg-backgroundGrey border-y border-borderColor w-full py-24 lg:py-32">
        <div className="max-w-screen-2xl mx-auto px-10">

          {/* En-tête de section */}
          <div className="border-b border-borderColor pb-14 mb-20">
            <TranslatedText
              translationKey="manifest.engagementsLabel"
              as="span"
              className="section-number block mb-6"
            />
            <div className="grid lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-7">
                <h2 className="text-5xl md:text-6xl xl:text-7xl serif italic leading-none text-textColor">
                  <TranslatedText
                    translationKey="manifest.p5"
                    as="span"
                  />
                </h2>
              </div>
              <div className="lg:col-span-5 lg:col-start-8">
                <TranslatedText
                  as="p"
                  translationKey="manifest.p6"
                  className="text-[13px] text-grayText leading-loose montserrat"
                />
              </div>
            </div>
          </div>

          {/* Grille des 4 engagements */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
            {BULLET_KEYS.map((key, index) => (
              <div
                key={key}
                className="border-t border-borderColor pt-12 md:pr-12 pb-12"
              >
                <span className="serif italic text-gold-accent text-4xl leading-none block mb-6">
                  {String(index + 1).padStart(2, '0')}.
                </span>
                <TranslatedText
                  as="p"
                  translationKey={key}
                  className="text-[13px] text-grayText leading-loose montserrat"
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── Signature finale ─── */}
      <section className="bg-backgroundColor w-full py-24 lg:py-32">
        <div className="max-w-screen-2xl mx-auto px-10">
          <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-8">

            <div className="w-px h-16 bg-gold-accent/40" aria-hidden="true" />

            <div className="relative">
              <OptimizedImage
                src="/images/manifest/signature_ira_gold.webp"
                alt="Signature manuscrite Team InRealArt"
                width={500}
                height={140}
                className="w-full max-w-sm md:max-w-md [&_img]:w-full [&_img]:h-auto [&_img]:object-contain"
              />
            </div>

            <TranslatedText
              as="p"
              translationKey="manifest.signature"
              className="section-number text-center"
            />

            <div className="w-px h-8 bg-borderColor" aria-hidden="true" />

            <a href="/about" className="btn-cta">
              <TranslatedText translationKey="nav.aboutInRealArt" />
            </a>

          </div>
        </div>
      </section>

    </main>
  )
}
