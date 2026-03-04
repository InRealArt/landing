'use client'

import dynamic from 'next/dynamic'
import { TeamMemberData } from '@/actions/teamActions'
import SkeletonSlider from './SkeletonSlider'

const TeamClient = dynamic(() => import('./TeamClient'), {
  ssr: false,
  loading: () => <SkeletonSlider context="team" additionnalClassName="relative bg-gradient" />
})

interface TeamClientWrapperProps {
  members: TeamMemberData[]
}

export default function TeamClientWrapper({ members }: TeamClientWrapperProps) {
  return <TeamClient members={members} />
}
