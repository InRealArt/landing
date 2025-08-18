import { ArtistCategoryGridSkeleton } from '@/components/artists/ArtistCategoryGrid'

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Skeleton */}
      <section className="relative w-full h-96 md:h-[500px] bg-gradient-to-r from-gray-800 to-gray-900 animate-pulse">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4 text-center">
            <div className="h-16 bg-white/10 rounded-lg mb-6 animate-pulse"></div>
            <div className="h-6 bg-white/10 rounded-lg max-w-3xl mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Grid Skeleton */}
      <div className="py-16">
        <ArtistCategoryGridSkeleton />
      </div>
    </div>
  )
}
