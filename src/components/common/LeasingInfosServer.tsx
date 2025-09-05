'use client'
import LeasingInfos from './LeasingInfos'

interface LeasingInfosServerProps {
  titleKey?: string
  descriptionKey?: string
}

export default function LeasingInfosServer({ 
  titleKey = 'leasing.infos.title',
  descriptionKey = 'leasing.infos.description'
}: LeasingInfosServerProps) {
  return (
    <LeasingInfos 
      titleKey={titleKey}
      descriptionKey={descriptionKey}
    />
  )
}
