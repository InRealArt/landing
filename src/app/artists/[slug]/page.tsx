'use client'
import { useEffect, useState } from 'react'
import ArtworkCard from '@/components/common/cards/ArtworkCardOrder'
import Button from '@/components/common/Button'
import { ArrowRight } from 'lucide-react'
import { useArtistStore } from '@/store/useArtistStore'
import { useParams } from 'next/navigation'
import { useLanguageStore } from '@/store/languageStore'
export default function ArtistPage() {
  const params = useParams()
  const slug = params.slug as string
  const { fetchArtists, isLoading, hasError, artists, getArtistBySlug } = useArtistStore()
  const [artist, setArtist] = useState<any>(null)
  const { t } = useLanguageStore()
  useEffect(() => {
    const loadArtist = async () => {
      await fetchArtists()
      const foundArtist = getArtistBySlug(slug)
      setArtist(foundArtist)
    }
    
    loadArtist()
  }, [fetchArtists, getArtistBySlug, slug])

  // S'assurer que artworkImages est un tableau avant d'utiliser map
  const artworkImages = (() => {
    if (!artist || !artist.artworkImages) return []
    
    // Traiter le cas où artworkImages est une chaîne JSON
    let artworkImagesArray = artist.artworkImages
    
    if (typeof artworkImagesArray === 'string') {
      try {
        artworkImagesArray = JSON.parse(artworkImagesArray)
      } catch (e) {
        console.error('Erreur lors du parsing des artworkImages:', e)
        return []
      }
    }
    
    // Vérifier si c'est un tableau maintenant
    if (!Array.isArray(artworkImagesArray)) {
      // Si ce n'est toujours pas un tableau, essayer de le convertir en tableau
      artworkImagesArray = artworkImagesArray ? [artworkImagesArray] : []
    }
    
    // Maintenant on peut utiliser map en toute sécurité
    return artworkImagesArray.map((artwork: any) => ({
      name: artwork.name || 'Sans titre',
      price: artwork.price || 0,
      image: { src: artwork.image || artwork.url || '' }
    }))
  })()

  if (isLoading) {
    return <div className="mt-headerSize text-center">Chargement de l&quot;artiste...</div>
  }

  if (hasError || !artist) {
    return <div className="mt-headerSize text-center">Artiste non trouvé</div>
  }

  return (
    <>
      <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-headerSize">
        {/* Version sans Swiper pour bioslider */}
        <div>
          <h1 className='text-2xl lg:text-6xl bricolage-grotesque font-medium mb-6'>{t('artistPage.whoIs')} {artist.name} ?</h1>
          <div className='w-full rounded-lg h-full flex flex-col lg:flex-row bg-cardBackground'>
            <div 
              className='bg-cover bg-no-repeat bg-center h-96 lg:h-auto w-full lg:w-1/3 rounded-lg' 
              style={{ backgroundImage: `url('${artist.photo}')` }} 
            />
            <div className='p-6 lg:px-20 lg:pt-20 lg:pb-6 flex-1 flex flex-col gap-6'>
              {artist.intro && <h1 className='inter font-bold text-base md:text-lg text-white'>&ldquo;{artist.intro}&rdquo;</h1>}
              <h2 className='inter text-xs font-medium md:text-base'>{artist.description}</h2>
              <div>
                <p className='inter font-bold text-base text-white mb-2'>{artist.name}</p>
                <p className='inter text-base font-medium'>{artist.role}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h1 className='text-2xl lg:text-6xl bricolage-grotesque font-medium mb-6'>{t('artistPage.discover')} {artist.name}</h1>
          <div className="flex flex-wrap gap-4">
            {artworkImages.map((item: any, index: number) => 
              <ArtworkCard key={`${item.name}-${index}`} {...item} />
            )}
          </div>
        </div>

        <section className="flex flex-col md:flex-row justify-between gap-10 md:gap-20 items-center mt-32">
          <div className="flex-1">
            <h1 className="bricolage-grotesque text-6xl mb-3">{t('artistPage.expert')}</h1>
            <p className="bricolage-grotesque text-base">{t('artistPage.expertDescription')}</p>
          </div>
          <div className="flex-1">
            <p className="bricolage-grotesque text-base mb-5">{t('artistPage.expertDescription2')}</p>
            <Button text={t('artistPage.seeMarketplace')} additionalClassName="bg-purpleColor" icon={<ArrowRight />} />
          </div>
        </section>
      </section>
    </>
  )
} 