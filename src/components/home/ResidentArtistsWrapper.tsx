import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import ResidentArtists from './ResidentArtists'

async function ResidentArtistsContent() {
  const landingArtists = await prisma.landingArtist.findMany({
    where: {
      isTopArtist: true,
    },
    select: {
      id: true,
      slug: true,
      imageUrl: true,
      mediumTags: true,
      artist: {
        select: {
          name: true,
          surname: true,
          pseudo: true,
        },
      },
    },
  })

  const artists = landingArtists.map((la) => ({
    id: la.id,
    slug: la.slug,
    name: la.artist.name ?? '',
    surname: la.artist.surname ?? '',
    pseudo: la.artist.pseudo ?? '',
    imageUrl: la.imageUrl,
    mediumTags: la.mediumTags ?? undefined,
  }))

  return <ResidentArtists artists={artists} />
}

export default function ResidentArtistsWrapper() {
  return (
    <Suspense
      fallback={
        <div className="w-full bg-backgroundGrey py-28 lg:py-40">
          <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">
            <div className="text-center mb-24">
              <div className="h-4 w-32 mx-auto bg-cardBackground animate-pulse rounded" />
              <div className="h-16 w-64 mx-auto bg-cardBackground animate-pulse rounded mt-6" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-20">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="opacity-0">
                  <div className="aspect-[3/4] mb-8 bg-cardBackground animate-pulse rounded" />
                  <div className="h-4 w-full bg-cardBackground animate-pulse rounded" />
                  <div className="h-3 w-2/3 mx-auto bg-cardBackground animate-pulse rounded mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ResidentArtistsContent />
    </Suspense>
  )
}
