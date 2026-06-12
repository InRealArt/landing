import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { generateStaticMetadata } from '@/utils/metadata'
import { getServerTranslations } from '@/utils/serverTranslations'
import type { TeamMemberData } from '@/actions/teamActions'
import { getImageUrl } from '@/lib/cloufare/r2/url'
import ExpertsSection from './components/ExpertsSection'
import ServicesGrid from './components/ServicesGrid'
import TestimonialSection from './components/TestimonialSection'
import ContactForm from './components/ContactForm'
import NewsletterInline from '@/components/common/NewsletterInline'
import PageFAQ from '@/components/common/FAQ/PageFAQ'

const language: 'fr' | 'en' = 'fr'
const { t } = getServerTranslations(language)

export const metadata: Metadata = generateStaticMetadata({
  title: t('services.metadata.title'),
  description: t('services.metadata.description'),
  keywords: [
    'consulting art',
    'coaching artiste',
    'gestion patrimoine artistique',
    'audit de carrière',
    'art advisor',
    'agent artiste',
  ],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/services`,
})

const EXPERT_NAMES = ['Maxime', 'Ania', 'Timothée']

const getServiceExperts = unstable_cache(
  async (): Promise<TeamMemberData[]> => {
    const members = await prisma.team.findMany({
      where: {
        firstName: { in: EXPERT_NAMES },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        photoUrl1: true,
        description: true,
        intro: true,
        linkedinUrl: true,
        instagramUrl: true,
        facebookUrl: true,
        githubUrl: true,
        twitterUrl: true,
        websiteUrl: true,
      },
    })
    return members.map(m => ({
      ...m,
      photoUrl1: getImageUrl(m.photoUrl1) ?? undefined
    })) as TeamMemberData[]
  },
  ['service-experts'],
  { revalidate: 3600, tags: ['team'] }
)

export default async function ServicesPage() {
  let experts: TeamMemberData[] = []
  try {
    experts = await getServiceExperts()
  } catch {
    // Graceful degradation: render page with fallback expert data baked into ExpertsSection
    experts = []
  }

  return (
    <>
    <main className="min-h-screen bg-backgroundColor text-textColor">
      {/* HERO */}
      <section className="pt-headerSize pb-24 px-10 bg-backgroundColor">
        <div className="max-w-screen-2xl mx-auto">
          <span className="block text-[10px] uppercase tracking-[0.5em] mb-6 montserrat text-grayText">
            {t('services.hero.eyebrow')}
          </span>
          <h1 className="serif text-6xl md:text-8xl mb-8 font-light text-textColor">
            {t('services.hero.title')}{' '}
            <br />
            <span className="italic text-gold-accent">
              {t('services.hero.titleAccent')}
            </span>
          </h1>
          <p className="text-[12px] uppercase tracking-[0.3em] max-w-2xl leading-relaxed montserrat text-grayText">
            {t('services.hero.description')}
          </p>
        </div>
      </section>

      {/* EXPERTS */}
      <ExpertsSection
        experts={experts}
        translations={{
          maxime: {
            specialty: t('services.experts.maxime.specialty'),
            fallbackRole: t('services.experts.maxime.fallbackRole'),
            intro: t('services.experts.maxime.intro'),
          },
          ania: {
            specialty: t('services.experts.ania.specialty'),
            fallbackRole: t('services.experts.ania.fallbackRole'),
            intro: t('services.experts.ania.intro'),
          },
          timothee: {
            specialty: t('services.experts.timothee.specialty'),
            fallbackRole: t('services.experts.timothee.fallbackRole'),
            intro: t('services.experts.timothee.intro'),
          },
        }}
      />

      {/* SERVICES GRID */}
      <ServicesGrid
        translations={{
          catalog: {
            eyebrow: t('services.catalog.eyebrow'),
            title: t('services.catalog.title'),
          },
          categories: {
            artists: {
              number: t('services.categories.artists.number'),
              label: t('services.categories.artists.label'),
            },
            corporate: {
              number: t('services.categories.corporate.number'),
              label: t('services.categories.corporate.label'),
            },
          },
          items: {
            careerAudit: {
              title: t('services.items.careerAudit.title'),
              description: t('services.items.careerAudit.description'),
              price: t('services.items.careerAudit.price'),
              priceUnit: t('services.items.careerAudit.priceUnit'),
              cta: t('services.items.careerAudit.cta'),
            },
            coaching: {
              title: t('services.items.coaching.title'),
              description: t('services.items.coaching.description'),
              price: t('services.items.coaching.price'),
              priceUnit: t('services.items.coaching.priceUnit'),
              cta: t('services.items.coaching.cta'),
            },
            pressKit: {
              title: t('services.items.pressKit.title'),
              description: t('services.items.pressKit.description'),
              price: t('services.items.pressKit.price'),
              priceUnit: t('services.items.pressKit.priceUnit'),
              cta: t('services.items.pressKit.cta'),
            },
            sourcing: {
              title: t('services.items.sourcing.title'),
              description: t('services.items.sourcing.description'),
              price: t('services.items.sourcing.price'),
              priceUnit: t('services.items.sourcing.priceUnit'),
              cta: t('services.items.sourcing.cta'),
            },
            taxOptimization: {
              title: t('services.items.taxOptimization.title'),
              description: t('services.items.taxOptimization.description'),
              price: t('services.items.taxOptimization.price'),
              priceUnit: t('services.items.taxOptimization.priceUnit'),
              cta: t('services.items.taxOptimization.cta'),
            },
          },
        }}
      />

      {/* TESTIMONIAL */}
      <TestimonialSection
        translations={{
          eyebrow: t('services.testimonial.eyebrow'),
          quote: t('services.testimonial.quote'),
          author: t('services.testimonial.author'),
          role: t('services.testimonial.role'),
        }}
      />

      {/* CONTACT CTA */}
      <ContactForm
        translations={{
          title: t('services.contact.title'),
          titleAccent: t('services.contact.titleAccent'),
          description: t('services.contact.description'),
          successMessage: t('services.contact.successMessage'),
          namePlaceholder: t('services.contact.namePlaceholder'),
          nameLabel: t('services.contact.nameLabel'),
          expertLabel: t('services.contact.expertLabel'),
          expertSelect: t('services.contact.expertSelect'),
          expertOptions: {
            maxime: t('services.contact.expertOptions.maxime'),
            ania: t('services.contact.expertOptions.ania'),
            timothee: t('services.contact.expertOptions.timothee'),
          },
          submitButton: t('services.contact.submitButton'),
        }}
      />
    </main>
    <PageFAQ pageName="services" />
    <NewsletterInline />
    </>
  )
}
