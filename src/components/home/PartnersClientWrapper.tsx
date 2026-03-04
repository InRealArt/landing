'use client'

import dynamic from 'next/dynamic'
import { PartnerItem } from './PartnersClient'

const PartnersClient = dynamic(() => import('./PartnersClient'), { ssr: false })

interface PartnersClientWrapperProps {
  partners: PartnerItem[]
}

export default function PartnersClientWrapper({ partners }: PartnersClientWrapperProps) {
  return <PartnersClient partners={partners} />
}
