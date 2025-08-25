export default function Loading() {
  return (
    <div className="mt-headerSize animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 bg-gray-300 rounded-lg"></div>
        <div className="relative z-10 max-w-90 xl:max-w-screen-xl m-auto h-full flex items-end pb-8">
          <div className="flex items-end gap-6">
            {/* Avatar Skeleton */}
            <div className="w-32 h-32 bg-gray-400 rounded-full"></div>
            <div className="space-y-3">
              <div className="h-8 w-64 bg-gray-400 rounded"></div>
              <div className="h-4 w-48 bg-gray-400 rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="max-w-90 xl:max-w-screen-xl m-auto py-12">
        <div className="space-y-8">
          {/* Info Section */}
          <div className="space-y-4">
            <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
          </div>

          {/* Artworks Section */}
          <div>
            <div className="h-8 w-48 bg-gray-300 rounded mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="aspect-square bg-gray-300 rounded-lg"></div>
                  <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Biography Section */}
          <div className="space-y-4">
            <div className="h-8 w-40 bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
            <div className="h-4 w-4/5 bg-gray-300 rounded"></div>
          </div>
        </div>
      </section>
    </div>
  )
}
