import { getTestimonialArtists } from '@/actions/artistActions'
import ArtistTestimonials from './ArtistTestimonials'

export default async function ArtistTestimonialsWrapper() {
  const artists = await getTestimonialArtists()

  const testimonials = [
    {
      text: 'joinInRealArt.artists.testimonials.artist1.text',
      classementIcac: "",
      urlImageArtiste: artists.find(a => a.name.toLowerCase().includes('catherine'))?.imageUrl || '/images/team-member.webp',
      name: 'joinInRealArt.artists.testimonials.artist1.name',
    },
    {
      text: 'joinInRealArt.artists.testimonials.artist3.text',
      urlImageArtiste: artists.find(a => a.name.toLowerCase().includes('martin'))?.imageUrl || '/images/team-member.webp',
      name: 'joinInRealArt.artists.testimonials.artist3.name',
    },
    {
      text: 'joinInRealArt.artists.testimonials.artist4.text',
      urlImageArtiste: artists.find(a => a.name.toLowerCase().includes('jean-paul'))?.imageUrl || '/images/team-member.webp',
      name: 'joinInRealArt.artists.testimonials.artist4.name',
    }
  ]

  return (
    <ArtistTestimonials
      testimonials={testimonials}
      titleKey="joinInRealArt.artists.testimonials.title"
    />
  )
}
