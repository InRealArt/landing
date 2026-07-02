import { getArtistsStudioData } from '@/actions/artistsStudioActions'
import ArtistsStudioPageClient from './ArtistsStudioPageClient'

export default async function ArtistsStudioPage() {
  const artists = await getArtistsStudioData()

  return <ArtistsStudioPageClient artists={artists} />
}
