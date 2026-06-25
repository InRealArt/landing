export function FeaturedSliderSkeleton() {
  return (
    <section className="py-24 lg:py-32 bg-backgroundColor border-y border-borderColor">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10">
        {/* Header skeleton */}
        <div className="flex items-end justify-between mb-16 pb-6 border-b border-borderColor">
          <div>
            <div className="h-3 w-24 bg-backgroundGrey animate-pulse mb-4" />
            <div className="h-12 w-64 bg-backgroundGrey animate-pulse" />
          </div>
          <div className="h-3 w-12 bg-backgroundGrey animate-pulse hidden sm:block" />
        </div>

        {/* Slide skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-[4/5] bg-backgroundGrey animate-pulse" />
          <div className="hidden lg:flex flex-col justify-center space-y-6">
            <div>
              <div className="h-2 w-20 bg-backgroundGrey animate-pulse mb-3" />
              <div className="h-10 w-full bg-backgroundGrey animate-pulse" />
            </div>
            <div className="h-3 w-40 bg-backgroundGrey animate-pulse" />
            <div className="h-10 w-32 bg-backgroundGrey animate-pulse" />
          </div>
        </div>

        {/* Dots skeleton */}
        <div className="flex justify-center gap-3 mt-12">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-1 w-2 bg-backgroundGrey animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  )
}
