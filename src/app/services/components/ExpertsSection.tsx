'use client'

import FirebaseImage from '@/components/common/FirebaseImage'
import { TeamMemberData } from '@/actions/teamActions'

interface ExpertMeta {
  firstName: string
  lastName: string
  specialty: string
  fallbackRole: string
  intro: string
}

const EXPERT_META: ExpertMeta[] = [
  {
    firstName: 'Maxime',
    lastName: 'Girard',
    specialty: 'Marketing & Growth',
    fallbackRole: 'Chief Marketing Officer',
    intro:
      "Spécialiste du positionnement de marque dans le luxe. Maxime transforme l'identité artistique en un actif narratif puissant capable de conquérir les marchés internationaux.",
  },
  {
    firstName: 'Ania',
    lastName: 'Chrusciany',
    specialty: 'Curation & Expertise',
    fallbackRole: 'Art Advisor',
    intro:
      "Conseil en acquisition et valorisation de collections. Ania décrypte les courants émergents pour sécuriser vos investissements et sublimer vos espaces.",
  },
  {
    firstName: 'Timothée',
    lastName: 'Roy',
    specialty: 'Management & Agenting',
    fallbackRole: "Agent d'Artiste",
    intro:
      "Le pivot entre l'atelier et la galerie. Timothée gère les carrières, négocie les contrats et assure la visibilité institutionnelle des talents InRealArt.",
  },
]

interface ExpertsSectionProps {
  experts: TeamMemberData[]
}

export default function ExpertsSection({ experts }: ExpertsSectionProps) {
  return (
    <section className="py-24 px-10 bg-cardBackground">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid md:grid-cols-3 gap-16">
          {EXPERT_META.map((meta) => {
            const member = experts.find(
              (e) =>
                e.firstName.toLowerCase() === meta.firstName.toLowerCase() &&
                e.lastName.toLowerCase() === meta.lastName.toLowerCase()
            )
            const fullName = `${meta.firstName} ${meta.lastName}`
            const role = member?.role || meta.fallbackRole
            const photoUrl = member?.photoUrl1 ?? null

            return (
              <div
                key={fullName}
                className="group"
                style={{ transition: 'transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)' }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-10px)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                }}
              >
                {/* Photo */}
                <div className="aspect-[3/4] mb-8 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 bg-borderColor relative">
                  {photoUrl ? (
                    <FirebaseImage
                      src={photoUrl}
                      alt={fullName}
                      className="w-full h-full"
                      imgClassName="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="serif text-6xl font-light select-none text-gold-accent opacity-40">
                        {meta.firstName[0]}{meta.lastName[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <span className="text-[9px] uppercase tracking-widest font-bold text-gold-accent">
                  {meta.specialty}
                </span>
                <h2 className="serif text-4xl mt-2 text-textColor">
                  {fullName}
                </h2>
                <p className="text-[10px] uppercase tracking-widest mb-6 italic text-grayText">
                  {role}
                </p>
                <p className="text-[13px] leading-relaxed montserrat text-grayText">
                  {meta.intro}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
