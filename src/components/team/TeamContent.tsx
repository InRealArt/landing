'use client'

import { useMemo, useState } from 'react'
import TeamCard from '@/components/common/cards/TeamCard'
import TeamModal from '@/components/team/TeamModal'
import { useLanguageStore } from '@/store/languageStore'
import { TeamMemberData } from '@/actions/teamActions'

interface SocialLink {
  link: string
  icon: string
}

interface ResolvedMember {
  id: number
  socials: SocialLink[]
  image: { src: string }
  name: string
  role: string
  intro: string
  description: string
}

interface Props {
  initialMembers: TeamMemberData[]
}

export default function TeamContent({ initialMembers }: Props) {
  const { t, language } = useLanguageStore()
  const [selectedMember, setSelectedMember] = useState<ResolvedMember | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const lang = language.toLowerCase()

  // Resolve translations client-side — no re-fetch on language switch
  const teamItems = useMemo(() =>
    initialMembers.map(member => {
      const role = member.translations?.role?.[lang] || member.role
      const intro = member.translations?.intro?.[lang] || member.intro || ''
      const description = member.translations?.description?.[lang] || member.description || ''

      const socials: SocialLink[] = []
      if (member.linkedinUrl) socials.push({ link: member.linkedinUrl, icon: '/icons/linkedin.svg' })
      if (member.instagramUrl) socials.push({ link: member.instagramUrl, icon: '/icons/instagram.svg' })
      if (member.facebookUrl) socials.push({ link: member.facebookUrl, icon: '/icons/facebook.svg' })
      if (member.githubUrl) socials.push({ link: member.githubUrl, icon: '/icons/github.svg' })
      if (member.twitterUrl) socials.push({ link: member.twitterUrl, icon: '/icons/twitter.svg' })
      if (member.websiteUrl) socials.push({ link: member.websiteUrl, icon: '/icons/globe.svg' })

      return {
        id: member.id,
        socials,
        image: { src: member.photoUrl1 || '' },
        name: `${member.firstName} ${member.lastName}`,
        role,
        intro,
        description,
      }
    }),
    [initialMembers, lang]
  )

  if (teamItems.length === 0) {
    return (
      <div className="max-w-screen-2xl mx-auto px-10 py-32">
        <p className="text-[11px] uppercase tracking-[0.3em] text-grayText">{t('team.noMembers')}</p>
      </div>
    )
  }

  return (
    <>
      {/* Section header — editorial style from design charter */}
      <section className="py-24 lg:py-32 px-10 bg-backgroundColor">
        <div className="max-w-screen-2xl mx-auto">
          {/* Section label + title block with border separator */}
          <div className="border-b border-borderColor pb-14 mb-20">
            <span className="section-number">{t('team.sectionLabel')}</span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl serif">
              {t('team.meetTeamLine1')}{' '}
              <span className="italic text-gold-accent">{t('team.meetTeamLine2')}</span>
            </h2>
            <p className="text-[11px] uppercase tracking-[0.3em] text-grayText mt-8 max-w-xl leading-relaxed">
              {t('team.hero.subtitle')}
            </p>
          </div>

          {/* Member grid — 2 cols mobile, 3 cols md, 4 cols xl */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
            {teamItems.map(item => (
              <TeamCard
                key={item.id}
                {...item}
                onViewMore={() => { setSelectedMember(item); setIsModalOpen(true) }}
              />
            ))}
          </div>
        </div>
      </section>

      {selectedMember && (
        <TeamModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedMember(null) }}
          member={selectedMember}
        />
      )}
    </>
  )
}
