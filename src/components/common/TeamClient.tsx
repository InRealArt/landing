'use client'

import { useMemo } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import TeamSlider from './TeamSlider'
import SkeletonSlider from './SkeletonSlider'
import { TeamMemberData } from '@/actions/teamActions'

interface TeamClientProps {
  members: TeamMemberData[]
}

export default function TeamClient({ members }: TeamClientProps) {
  const { t, language } = useLanguageStore()

  // Dériver les membres traduits depuis les données serveur selon la langue active.
  // Pas de refetch — les traductions sont déjà embarquées dans la prop.
  const formattedMembers = useMemo(() => {
    return members.map(member => {
      const lang = language.toLowerCase()
      const role = member.translations?.role?.[lang] ?? member.role
      const intro = member.translations?.intro?.[lang] ?? member.intro ?? ''
      const description = member.translations?.description?.[lang] ?? member.description ?? ''

      return {
        name: `${member.firstName} ${member.lastName}`,
        image: { src: member.photoUrl1 ?? '' },
        role,
        socials: [] as Array<{ link: string; icon: string }>
      }
    })
  }, [members, language])

  return (
    <section className="mt-36 max-w-screen-2xl m-auto">
      <div className="max-w-90 xl:max-w-screen-xl md:flex justify-between w-full m-auto items-center">
        <h1 className="bricolage-grotesque text-4xl md:text-5xl">{t('home.team.title')}</h1>
      </div>

      {formattedMembers.length > 0 ? (
        <TeamSlider members={formattedMembers} />
      ) : (
        <SkeletonSlider context="team" additionnalClassName="relative bg-gradient" />
      )}
    </section>
  )
}
