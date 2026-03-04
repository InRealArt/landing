'use client'

import dynamic from 'next/dynamic'

const MediaPartners = dynamic(() => import('./MediaPartners'), { ssr: false })

export default function MediaPartnersWrapper() {
  return <MediaPartners />
}
