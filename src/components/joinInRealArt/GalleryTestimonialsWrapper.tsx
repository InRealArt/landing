import { getTestimonialGalleries } from '@/actions/artistActions'
import ArtistTestimonials from './ArtistTestimonials'

export default async function GalleryTestimonialsWrapper() {
  const galleries = await getTestimonialGalleries()

  const testimonials = [
    {
      text: 'joinInRealArt.galleries.testimonials.gallery1.text',
      classementIcac: "",
      urlImageArtiste: galleries.find(a => a.surname?.toLowerCase().includes('leadouze'))?.imageUrl || '/images/team-member.webp',
      name: "Alexandre Leadouze, Galerie Leadouze, 16 avenue Matignon,   Paris",
    },
    {
      text: 'joinInRealArt.galleries.testimonials.gallery2.text',
      classementIcac: "",
      urlImageArtiste: galleries.find(a => a.surname?.toLowerCase().includes('arthema'))?.imageUrl || '/images/catherine_meulemans.webp',
      name: "Catherine Meulemans, Galerie ArtThema ",
    }
  ]

  return (
    <ArtistTestimonials
      testimonials={testimonials}
      titleKey="joinInRealArt.galleries.testimonials.title"
    />
  )
}
