'use client'

import { getTestimonialArtists, getTestimonialGalleries } from '@/actions/artistActions'
import ArtistTestimonials from './ArtistTestimonials'
import { useLanguageStore } from '@/store/languageStore'
import { useEffect, useState } from 'react'

export default function GalleryTestimonialsWrapper() {
  const { t } = useLanguageStore()
  const [artists, setArtists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artistsData = await getTestimonialGalleries()
        setArtists(artistsData)
      } catch (error) {
        console.error('Error fetching galleries:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchArtists()
  }, [])
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  // Créer le tableau de testimonials pour les galeries à partir des traductions
  const testimonials = [
    {
      text: t('joinInRealArt.galleries.testimonials.gallery1.text'),
      classementIcac: "",
      urlImageArtiste: artists.find(artist => artist.surname.toLowerCase().includes('leadouze'))?.imageUrl || '/images/team-member.png',
      nomArtiste: "Leadouze",
      prenomArtiste: ""
    },
    {
      text: t('joinInRealArt.galleries.testimonials.gallery2.text'),
      classementIcac: "",
      urlImageArtiste: artists.find(artist => artist.surname.toLowerCase().includes('arthema'))?.imageUrl || '/images/team-member.png',
      nomArtiste: "ArtThema",
      prenomArtiste: ""
    }
  ]
  
  return (
    <ArtistTestimonials 
      testimonials={testimonials}
      titleKey="joinInRealArt.galleries.testimonials.title"
    />
  )
} 