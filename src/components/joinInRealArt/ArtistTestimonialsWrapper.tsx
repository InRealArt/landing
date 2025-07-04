'use client'

import { getTestimonialArtists } from '@/actions/artistActions'
import ArtistTestimonials from './ArtistTestimonials'
import { useLanguageStore } from '@/store/languageStore'
import { useEffect, useState } from 'react'

export default function ArtistTestimonialsWrapper() {
  const { t } = useLanguageStore()
  const [artists, setArtists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artistsData = await getTestimonialArtists()
        setArtists(artistsData)
      } catch (error) {
        console.error('Error fetching artists:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchArtists()
  }, [])
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  // Créer le tableau de testimonials à partir des données des artistes et des traductions
  const testimonials = [
    {
      text: t('joinInRealArt.artists.testimonials.artist1.text'),
      classementIcac: "",
      urlImageArtiste: artists.find(artist => artist.name.toLowerCase().includes('marc'))?.imageUrl || '/images/team-member.png',
      nomArtiste: "Peltzer",
      prenomArtiste: "Marc"
    },
    {
      text: t('joinInRealArt.artists.testimonials.artist2.text'),
      classementIcac: "",
      urlImageArtiste: artists.find(artist => artist.name.toLowerCase().includes('nadine'))?.imageUrl || '/images/team-member.png',
      nomArtiste: "LePrince",
      prenomArtiste: "Nadine"
    },
    {
      text: t('joinInRealArt.artists.testimonials.artist3.text'),
      urlImageArtiste: artists.find(artist => artist.name.toLowerCase().includes('ekaterina'))?.imageUrl || '/images/team-member.png',
      nomArtiste: "Ekaterina",
      prenomArtiste: ""
    }
  ]
  
  return (
    <ArtistTestimonials 
      testimonials={testimonials}
      titleKey="joinInRealArt.artists.testimonials.title"
    />
  )
} 