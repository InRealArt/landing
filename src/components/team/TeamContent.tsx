'use client'

import BioSlider from '@/components/common/slider/BioSlider'
import TeamCard from '@/components/common/cards/TeamCard'
import { TeamMemberData } from '@/types/types'

interface TeamContentProps {
  members: TeamMemberData
}

export default function TeamContent({ members }: TeamContentProps) {
  if (!members || members.length === 0) {
    return <div className="text-center py-10">Aucun membre d'équipe trouvé.</div>
  }

  const teamItems = members.map(member => ({
    socials: [],
    image: { src: member.photo },
    name: member.name,
    role: member.role.FR,
    intro: member.text1.FR,
    description: member.text2.FR
  }))

  return (
    <>
      <BioSlider items={teamItems} title="Découvrez notre équipe" />
      <div className="mt-20">
        <h1 className='text-2xl lg:text-6xl bricolage-grotesque font-medium mb-6'>Rencontrez toute l&apos;équipe</h1>
        <div className="flex flex-wrap gap-4">
          {teamItems.map((item) =>
            <TeamCard key={item.name} {...item} additionalClassName="w-full lg:w-cardLarge" />
          )}
        </div>
      </div>
    </>
  )
} 