'use client'

import dynamic from 'next/dynamic'
import { ArtistData } from '@/actions/artistActions'

const ArtistSliderClient = dynamic(() => import('./ArtistSliderClient'), { ssr: false })

interface ArtistSliderClientWrapperProps {
  artists: ArtistData[]
}

export default function ArtistSliderClientWrapper({ artists }: ArtistSliderClientWrapperProps) {
  return <ArtistSliderClient artists={artists} />
}
