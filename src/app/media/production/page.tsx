import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import { getServerTranslations } from '@/utils/serverTranslations'
import MediaProductionForm from '@/components/media/production/MediaProductionForm'
import MediaProductionFAQ from '@/components/media/MediaProductionFAQ'

const { t: tFr } = getServerTranslations('fr')

export const metadata: Metadata = generateStaticMetadata({
  title: tFr('media.productionContact.metadata.title'),
  description: tFr('media.productionContact.metadata.description'),
  keywords: ['production vidéo art', 'interview artiste', 'aftermovie galerie', 'InRealArt production'],
  canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://inrealart.com'}/media/production`,
})

export default function MediaProductionPage() {

  return (
    <main className="min-h-screen bg-backgroundColor text-textColor">

      {/* Hero */}
      <section className="relative bg-backgroundColor border-b border-borderColor pt-headerSize pb-20">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-accent/40 to-transparent" aria-hidden="true" />
        <div className="max-w-screen-2xl mx-auto px-10 pt-16">
          <span className="section-number">{tFr('media.productionContact.hero.eyebrow')}</span>
          <h1 className="serif text-5xl md:text-7xl lg:text-8xl font-light leading-none text-textColor mt-4 mb-6">
            {tFr('media.productionContact.hero.title')}
            <br />
            <em className="italic text-gold-accent">{tFr('media.productionContact.hero.titleAccent')}</em>
          </h1>
          <div className="flex items-center gap-4 mt-8 max-w-2xl">
            <div className="w-12 h-px bg-gold-accent shrink-0" />
            <p className="text-[12px] uppercase tracking-[0.25em] text-grayText montserrat leading-relaxed">
              {tFr('media.productionContact.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-24 lg:py-32">
        <div className="max-w-screen-2xl mx-auto px-10">
          <div className="max-w-3xl">
            <MediaProductionForm />
          </div>
        </div>
      </section>

    </main>
    <MediaProductionFAQ />
  )
}
