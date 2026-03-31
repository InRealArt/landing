'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
import { useLanguageStore } from '@/store/languageStore'
import TranslatedText from '@/components/common/TranslatedText'
import FirebaseImage from '@/components/common/FirebaseImage'
import { TeamMemberData } from '@/actions/teamActions'

const TEAM_PARAGRAPHS = [
  {
    titleKey: 'about.team.paragraph1',
    descKey: 'about.team.paragraph1Description',
  },
  {
    titleKey: 'about.team.paragraph2',
    descKey: 'about.team.paragraph2Description',
  },
  {
    titleKey: 'about.team.paragraph3',
    descKey: 'about.team.paragraph3Description',
  },
] as const

interface Props {
  members: TeamMemberData[]
}

export default function AboutTeam({ members }: Props) {
  const { t, language } = useLanguageStore()

  const lang = language.toLowerCase()

  // Filtrer pour afficher uniquement Timothée Roy, Maxime Girard et Gilles Bruno
  const targetLastNames = ['Roy', 'Girard', 'Bruno']
  const teamMembers = members
    .filter(member => targetLastNames.includes(member.lastName))
    .sort((a, b) => {
      const order = { Roy: 0, Girard: 1, Bruno: 2 }
      return (order[a.lastName as keyof typeof order] ?? 99) - (order[b.lastName as keyof typeof order] ?? 99)
    })
    .map(member => ({
      id: member.id,
      name: `${member.firstName} ${member.lastName}`,
      role: member.translations?.role?.[lang] || member.role,
      photoUrl: member.photoUrl1 || '',
    }))

  return (
    <section className="bg-backgroundColor w-full py-24 lg:py-32">
      <div className="max-w-screen-2xl mx-auto px-10">

        {/* En-tête */}
        <div className="border-b border-borderColor pb-14 mb-20">
          <span className="section-number block mb-6">
            ÉQUIPE
          </span>
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <TranslatedText
                translationKey="about.team.title"
                as="h2"
                className="text-6xl md:text-7xl xl:text-8xl serif italic leading-none text-textColor"
                allowHtml={true}
              />
            </div>
            <div className="lg:col-span-4 lg:col-start-9 flex justify-end items-end">
              <a href="/team" className="btn-cta">
                {t('about.team.buttonText')}
              </a>
            </div>
          </div>
        </div>

        {/* Grille des 3 photos des membres de l'équipe */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="group"
            >
              {/* Photo avec effet grayscale */}
              <div
                className="relative overflow-hidden bg-[#f8f8f8] mb-5 aspect-[3/4]"
                style={{
                  filter: 'grayscale(100%)',
                  transition: 'filter 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <FirebaseImage
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Rôle et nom */}
              <span className="text-[8px] uppercase tracking-[0.3em] text-[#b89c72] font-bold montserrat block">
                {member.role}
              </span>
              <h3 className="serif text-xl italic mt-1 text-textColor">{member.name}</h3>
            </div>
          ))}
        </div>

        {/* Grille des 3 paragraphes — style expertise cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {TEAM_PARAGRAPHS.map(({ titleKey, descKey }) => (
            <div
              key={titleKey}
              className="border-t border-borderColor pt-12 md:pr-12 pb-12"
            >
              <div className="w-8 h-px bg-gold-accent mb-8" />
              <TranslatedText
                translationKey={titleKey}
                as="h3"
                className="montserrat font-semibold text-textColor text-base mb-4 leading-snug"
                allowHtml={true}
              />
              <TranslatedText
                translationKey={descKey}
                as="p"
                className="text-[13px] text-grayText leading-loose montserrat"
                allowHtml={true}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
