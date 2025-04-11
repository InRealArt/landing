'use client'
import { useEffect } from 'react'
import Intro from "@/components/presale/Intro";
import ArtworkCard from "@/components/common/cards/ArtworkCardOrder";
import { usePresaleArtworkStore } from '@/store/usePresaleArtworkStore'
import { useLanguageStore } from '@/store/languageStore';

export default function Presale() {
  const { t } = useLanguageStore();
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
    price: artwork.price,
    order: artwork.order
  }))

  if (isLoading) {
    return (
      <>
        <Intro />
        <div className="relative max-w-90 xl:max-w-screen-xl m-auto mt-10 text-center">
          {t('team.loading')}
        </div>
      </>
    )
  }

  if (hasError) {
    return (
      <>
        <Intro />
        <div className="relative max-w-90 xl:max-w-screen-xl m-auto mt-10 text-center">
          {t('team.error')}
        </div>
      </>
    )
  }

  console.log(artworkImages);
  

  return (
    <>
      <Intro />
      <div className="relative max-w-90 xl:max-w-screen-xl m-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mt-10">{t('presale.onDemand')}</h1>
        </div>
        <div className="flex flex-wrap gap-4">
          {artworkImages.map((item, index) => <ArtworkCard key={`${item.name}-${index}`} {...item} />)}
        </div>
        {/* <BuyProcess /> */}
      </div>
    </>
  );
}
