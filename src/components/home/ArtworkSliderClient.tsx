'use client'

import Slider from './Slider'

interface ArtworkSliderItem {
  id: number
  name: string
  image: {
    src: string
  }
}

interface ArtworkSliderClientProps {
  artworks: ArtworkSliderItem[]
}

export default function ArtworkSliderClient({ artworks }: ArtworkSliderClientProps) {
  if (artworks.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        Aucune œuvre disponible
      </div>
    )
  }

  return <Slider context="artwork" items={artworks} isReverse />
}
