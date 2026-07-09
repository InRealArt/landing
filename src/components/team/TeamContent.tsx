'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import TeamCard from '@/components/common/cards/TeamCard'
import TeamModal from '@/components/team/TeamModal'
import { useTranslation } from '@/hooks/useTranslation'
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
  const { t, language } = useTranslation()
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
        <p className="text-sm uppercase tracking-[0.3em] text-grayText">{t('team.noMembers')}</p>
      </div>
    )
  }

  return (
    <>
      {/* Member grid */}
      <section className="pb-32 px-10 bg-backgroundColor">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {teamItems.map(item => (
              <TeamCard
                key={item.id}
                {...item}
                onViewMore={() => { setSelectedMember(item); setIsModalOpen(true) }}
              />
            ))}

            {/* Recruitment slot */}
            <Link
              href="/contact"
              className="member-card group flex flex-col items-center justify-center border border-dashed border-borderColor hover:border-textColor aspect-[3/4] mb-5 transition-colors duration-500 cursor-pointer"
            >
              <span className="serif text-3xl italic text-grayText/30 group-hover:text-textColor transition-colors duration-500">+</span>
              <span className="text-[8px] uppercase tracking-[0.3em] text-grayText/50 group-hover:text-textColor mt-2 montserrat transition-colors duration-500">
                {t('team.joinUs')}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy section */}
      <section className="py-24 px-10 bg-[var(--background-grey)]">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="serif text-4xl italic mb-6 text-textColor">
              {t('team.philosophy.title1')}<br />{t('team.philosophy.title2')}
            </h2>
            <p className="text-sm text-grayText leading-relaxed montserrat mb-8 max-w-md">
              {t('team.philosophy.description')}
            </p>
            <Link
              href="/manifest"
              className="inline-block py-[0.8rem] px-[1.6rem] border border-textColor text-[0.6rem] uppercase tracking-[0.25em] montserrat bg-transparent hover:bg-textColor hover:text-backgroundColor transition-all duration-500 cubic-bezier(0.19,1,0.22,1)"
            >
              {t('team.philosophy.cta')}
            </Link>
          </div>
          <div className="hidden md:block h-px bg-borderColor" />
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
