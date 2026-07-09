'use client'

import { useMemo } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import TeamSlider from './TeamSlider'
import SkeletonSlider from './SkeletonSlider'
import { TeamMemberData } from '@/actions/teamActions'

interface TeamClientProps {
  members: TeamMemberData[]
}

export default function TeamClient({ members }: TeamClientProps) {
  const { t, language } = useTranslation()

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
        intro,
        description,
        socials: [] as Array<{ link: string; icon: string }>
      }
    })
  }, [members, language])

  return (
    <section className="mt-0 pt-24 pb-24 max-w-full w-full">
      <div className="max-w-90 xl:max-w-screen-xl md:flex flex-col w-full mx-auto px-4 items-start">
        <h1 className="text-6xl md:text-8xl serif text-textColor">{t('home.team.heading')}<span className="italic text-gold-accent">{t('home.team.headingHighlight')}</span></h1>
        <p className="text-xs uppercase tracking-[0.3em] text-grayText mt-4">{t('home.team.subtitle')}</p>
      </div>

      {formattedMembers.length > 0 ? (
        <TeamSlider members={formattedMembers} />
      ) : (
        <SkeletonSlider context="team" additionnalClassName="relative bg-gradient" />
      )}
    </section>
  )
}
