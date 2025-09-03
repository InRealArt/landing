import type { Metadata } from 'next'
import OptimizedImage from '@/components/common/OptimizedImage'
import { Container } from '@/components/common/Container'
import { generateStaticMetadata } from '@/utils/metadata'
import TranslatedText from '@/components/common/TranslatedText'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Manifeste — InRealArt',
  description:
    "Notre manifeste pour rendre l'art, la culture et le patrimoine accessibles, responsables et créateurs de valeur durable.",
  keywords: [
    'manifeste InRealArt',
    'art responsable',
    'tokenisation',
    'patrimoine',
    'culture',
    'impact',
  ],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/manifest`,
})

export default function ManifestPage() {
  return (
    <main className="text-white">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 relative">
          {/* Left: text */}
          <section>
            <TranslatedText
              as="h1"
              translationKey="manifest.title"
              className="text-3xl md:text-5xl font-semibold leading-tight"
            />
            <TranslatedText
              as="p"
              translationKey="manifest.p1"
              className="mt-6 text-base md:text-lg text-gray-300 leading-relaxed"
            />
            <TranslatedText
              as="p"
              translationKey="manifest.p2"
              className="mt-4 text-base md:text-lg text-gray-300 leading-relaxed"
            />

            <TranslatedText
              as="p"
              translationKey="manifest.p3"
              className="mt-4 text-base md:text-lg text-gray-300 leading-relaxed"
            />

            <TranslatedText
              as="p"
              translationKey="manifest.p4"
              className="mt-4 text-base md:text-lg text-gray-300 leading-relaxed"
            />

            <ul className="mt-6 space-y-3 text-gray-200">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white/80" />
                <TranslatedText translationKey="manifest.bullets.access" />
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white/80" />
                <TranslatedText translationKey="manifest.bullets.support" />
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white/80" />
                <TranslatedText translationKey="manifest.bullets.bridges" />
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white/80" />
                <TranslatedText translationKey="manifest.bullets.traceability" />
              </li>
            </ul>

            <TranslatedText
              as="p"
              translationKey="manifest.p5"
              className="mt-6 text-base md:text-lg text-gray-300 leading-relaxed"
            />
            <TranslatedText
              as="p"
              translationKey="manifest.p6"
              className="mt-4 text-base md:text-lg text-gray-300 leading-relaxed"
            />
          </section>

          {/* Right: image */}
          <aside className="relative w-full overflow-hidden rounded-xl shadow-2xl h-[560px] md:sticky md:top-headerSize">
            <OptimizedImage
              src="/images/art-salon-background.png"
              alt="InRealArt exhibition space"
              width={800}
              height={560}
              className="w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:object-center"
              priority
            />
          </aside>
        </div>
      </Container>
    </main>
  )
}