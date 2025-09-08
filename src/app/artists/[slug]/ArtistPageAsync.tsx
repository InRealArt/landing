import { Suspense } from 'react'
import ArtistPageClient from './ArtistPageClient'
import ArtistPageSkeleton from '@/components/artists/ArtistPageSkeleton'

interface Props {
  slug: string
}

// Composant asynchrone qui simule un délai pour déclencher Suspense
async function ArtistPageContent({ slug }: Props) {
  // Simuler un délai pour voir l'effet Suspense
  // Dans un vrai projet, ce serait ici qu'on ferait les appels API
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return <ArtistPageClient slug={slug} />
}

export default function ArtistPageAsync({ slug }: Props) {
  return (
    <Suspense fallback={<ArtistPageSkeleton />}>
      <ArtistPageContent slug={slug} />
    </Suspense>
  )
}
