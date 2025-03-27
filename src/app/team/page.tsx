'use client'

import { useEffect } from 'react'
import TeamContent from "@/components/team/TeamContent"
import { useTeamStore } from "@/store/useTeamStore"

export default function Team() {
  const { members, fetchTeamMembers } = useTeamStore()

  useEffect(() => {
    fetchTeamMembers()
  }, [fetchTeamMembers])

  return (
    <>
      <div className="relative max-w-90 xl:max-w-screen-xl m-auto mt-headerSize">
        <TeamContent members={members} />
      </div>
    </>
  )
}
