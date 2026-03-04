'use client'

import dynamic from 'next/dynamic'

const ArtworkSliderClient = dynamic(() => import('./ArtworkSliderClient'), { ssr: false })

interface ArtworkSliderItem {
  id: number
  name: string
  image: {
    src: string
  }
}

interface ArtworkSliderClientWrapperProps {
  artworks: ArtworkSliderItem[]
}

export default function ArtworkSliderClientWrapper({ artworks }: ArtworkSliderClientWrapperProps) {
  return <ArtworkSliderClient artworks={artworks} />
}
