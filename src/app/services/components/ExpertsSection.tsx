'use client'

import FirebaseImage from '@/components/common/FirebaseImage'
import { TeamMemberData } from '@/actions/teamActions'

interface ExpertMeta {
  specialty: string
  fallbackRole: string
  intro: string
}

interface ExpertsSectionProps {
  experts: TeamMemberData[]
  translations: {
    maxime: ExpertMeta
    ania: ExpertMeta
    timothee: ExpertMeta
  }
}

export default function ExpertsSection({ experts, translations }: ExpertsSectionProps) {
  const EXPERT_META: Array<{ firstName: string; lastName: string; meta: ExpertMeta }> = [
    { firstName: 'Maxime', lastName: 'Girard', meta: translations.maxime },
    { firstName: 'Ania', lastName: 'Chrusciany', meta: translations.ania },
    { firstName: 'Timothée', lastName: 'Roy', meta: translations.timothee },
  ]

  return (
    <section className="py-24 px-10 bg-cardBackground">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid md:grid-cols-3 gap-16">
          {EXPERT_META.map(({ firstName, lastName, meta }) => {
            const member = experts.find(
              (e) =>
                e.firstName.toLowerCase() === firstName.toLowerCase() &&
                e.lastName.toLowerCase() === lastName.toLowerCase()
            )
            const fullName = `${firstName} ${lastName}`
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
                        {firstName[0]}{lastName[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <span className="text-xs uppercase tracking-widest font-bold text-gold-accent">
                  {meta.specialty}
                </span>
                <h2 className="serif text-4xl mt-2 text-textColor">
                  {fullName}
                </h2>
                <p className="text-xs uppercase tracking-widest mb-6 italic text-grayText">
                  {role}
                </p>
                <p className="text-sm leading-relaxed montserrat text-grayText">
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
