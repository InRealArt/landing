export default function ArtistSliderSkeleton() {
  return (
    <section className="mt-12">
      <div className="flex gap-4 overflow-hidden justify-center">
        {[...Array(5)].map((_, index) => (
          <div 
            key={index} 
            className="p-2 border rounded-lg bg-cardBackground min-w-[280px] md:min-w-[320px] flex-shrink-0"
          >
            <div className="bg-gray-300 animate-pulse h-52 md:h-80 w-full rounded-lg mb-4" />
            <div className="h-5 bg-gray-300 animate-pulse rounded-md w-3/4 mb-2" />
          </div>
        ))}
      </div>
    </section>
  )
}

