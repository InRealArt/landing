import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { generateStaticMetadata } from '@/utils/metadata'
import type { TeamMemberData } from '@/actions/teamActions'
import ExpertsSection from './components/ExpertsSection'
import ServicesGrid from './components/ServicesGrid'
import TestimonialSection from './components/TestimonialSection'
import ContactForm from './components/ContactForm'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Expertises & Consulting — Accompagnement artistique de haut niveau',
  description:
    'Consulting, coaching de carrière et gestion de patrimoine artistique. Nos experts fusionnent vision marketing, expertise curatoriale et gestion d\'actifs pour bâtir des trajectoires pérennes.',
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
    return members
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
    <main className="min-h-screen bg-backgroundColor text-textColor">
      {/* HERO */}
      <section className="pt-headerSize pb-24 px-10 bg-backgroundColor">
        <div className="max-w-screen-2xl mx-auto">
          <span className="block text-[10px] uppercase tracking-[0.5em] mb-6 montserrat text-grayText">
            Accompagnement Stratégique
          </span>
          <h1 className="serif text-6xl md:text-8xl mb-8 font-light text-textColor">
            L&apos;Intelligence{' '}
            <br />
            <span className="italic text-gold-accent">
              au service de l&apos;Art.
            </span>
          </h1>
          <p className="text-[12px] uppercase tracking-[0.3em] max-w-2xl leading-relaxed montserrat text-grayText">
            Consulting de haut niveau, coaching de carrière et gestion de patrimoine artistique.
            Nos experts fusionnent vision marketing, expertise curatoriale et gestion d&apos;actifs
            pour bâtir des trajectoires pérennes.
          </p>
        </div>
      </section>

      {/* EXPERTS */}
      <ExpertsSection experts={experts} />

      {/* SERVICES GRID */}
      <ServicesGrid />

      {/* TESTIMONIAL */}
      <TestimonialSection />

      {/* CONTACT CTA */}
      <ContactForm />
    </main>
  )
}
