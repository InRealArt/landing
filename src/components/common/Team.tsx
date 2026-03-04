import { Suspense } from 'react'
import { getTeamMembers } from '@/actions/teamActions'
import TeamSkeleton from './TeamSkeleton'
import TeamClientWrapper from './TeamClientWrapper'

async function TeamContent() {
  const members = await getTeamMembers()
  return <TeamClientWrapper members={members} />
}

export default function Team() {
  return (
    <Suspense fallback={<TeamSkeleton />}>
      <TeamContent />
    </Suspense>
  )
}
