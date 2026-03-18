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

interface Props {
  initialMembers: TeamMemberData[]
}

export default function TeamContent({ initialMembers }: Props) {
  const { t, language } = useLanguageStore()
  const [selectedMember, setSelectedMember] = useState<any>(null)
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
    return <div className="text-center py-10">{t('team.noMembers')}</div>
  }

  return (
    <>
      <div className="mt-20">
        <div className="max-w-90 xl:max-w-screen-xl mx-auto">
          <h1 className='text-2xl lg:text-6xl bricolage-grotesque font-medium mb-6'>{t('team.meetTeam')}</h1>
          <div className="flex flex-wrap gap-4">
            {teamItems.map(item => (
              <TeamCard
                key={item.name}
                {...item}
                additionalClassName="w-full lg:w-cardLarge"
                onViewMore={() => { setSelectedMember(item); setIsModalOpen(true) }}
              />
            ))}
          </div>
        </div>
      </div>

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
