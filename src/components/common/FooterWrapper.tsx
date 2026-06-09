import { getArtists } from '@/actions/artistActions'
import Footer from './Footer'

export default async function FooterWrapper() {
  let residentArtists: { label: string; slug: string }[] = []

  try {
    const artists = await getArtists(false)
    residentArtists = artists.map((a) => ({
      label: `${a.name} ${a.surname}`.trim(),
      slug: a.slug,
    }))
  } catch {
    // Footer reste fonctionnel sans la liste
  }

  return <Footer residentArtists={residentArtists} />
}
