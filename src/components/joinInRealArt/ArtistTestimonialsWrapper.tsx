import { getTestimonialArtists } from '@/actions/artistActions'
import ArtistTestimonials from './ArtistTestimonials'

export default async function ArtistTestimonialsWrapper() {
  const artists = await getTestimonialArtists()
  
  return <ArtistTestimonials artists={artists} />
} 