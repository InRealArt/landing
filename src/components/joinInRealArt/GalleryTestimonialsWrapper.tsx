import { getTestimonialGalleries } from '@/actions/artistActions'
import ArtistTestimonials from './ArtistTestimonials'

export default async function GalleryTestimonialsWrapper() {
  const galleries = await getTestimonialGalleries()

  const leadouzeImage = galleries.find(a => a.surname?.toLowerCase().includes('leadouze'))?.imageUrl
  const arthemaImage = galleries.find(a => a.surname?.toLowerCase().includes('arthema'))?.imageUrl

  const testimonials = [
    {
      textKey: 'joinInRealArt.galleries.testimonials.gallery1.text',
      urlImageArtiste: leadouzeImage || '/images/team-member.webp',
      name: 'Galerie Leadouze',
      role: 'Galerie Leadouze, Paris',
    },
    {
      textKey: 'joinInRealArt.galleries.testimonials.gallery2.text',
      urlImageArtiste: arthemaImage || '/images/catherine_meulemans.webp',
      name: 'Catherine Meulemans',
      role: 'Galerie Arthema, Bruxelles',
    },
  ]

  return (
    <ArtistTestimonials
      testimonials={testimonials}
      titleKey="joinInRealArt.galleries.testimonials.title"
      sectionLabelKey="joinInRealArt.galleries.testimonials.sectionLabel"
    />
  )
}
