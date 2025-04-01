'use client'
import { useEffect } from 'react'
import Intro from "@/components/presale/Intro";
import ArtworkCard from "@/components/common/cards/ArtworkCardOrder";
import Button from "@/components/common/Button";
import BuyProcess from "@/components/presale/BuyProcess";
import { usePresaleArtworkStore } from '@/store/usePresaleArtworkStore'

export default function Presale() {
  const { 
    artworks,
    fetchPresaleArtworks, 
    isLoading, 
    hasError 
  } = usePresaleArtworkStore()

  useEffect(() => {
    fetchPresaleArtworks()
  }, [fetchPresaleArtworks])

  const artworkImages = artworks.map(artwork => ({
    image: { src: artwork.url },
    name: artwork.name,
    price: artwork.price
  }))

  if (isLoading) {
    return (
      <>
        <Intro />
        <div className="relative max-w-90 xl:max-w-screen-xl m-auto mt-10 text-center">
          Chargement des œuvres...
        </div>
      </>
    )
  }

  if (hasError) {
    return (
      <>
        <Intro />
        <div className="relative max-w-90 xl:max-w-screen-xl m-auto mt-10 text-center">
          Erreur lors du chargement des œuvres
        </div>
      </>
    )
  }

  return (
    <>
      <Intro />
      <div className="relative max-w-90 xl:max-w-screen-xl m-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mt-10">Presales on demand</h1>
          <Button additionalClassName="mt-10" text="Voir tout" />
        </div>
        <div className="flex flex-wrap gap-4">
          {artworkImages.map((item, index) => <ArtworkCard key={`${item.name}-${index}`} {...item} />)}
        </div>
        {/* <BuyProcess /> */}
      </div>
    </>
  );
}
