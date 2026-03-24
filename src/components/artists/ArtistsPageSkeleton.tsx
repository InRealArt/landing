'use client'

/*
 * Shimmer vars are already injected by ArtistPageSkeleton when that skeleton
 * is active. This file re-declares them so it can be used independently.
 * The keyframe name `ira-shimmer` is shared — duplicate @keyframes declarations
 * are harmless; the browser uses the last one parsed.
 */
const shimmerStyles = `
  @keyframes ira-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: calc(400px + 100%) 0; }
  }

  .ira-shimmer {
    background: linear-gradient(
      90deg,
      var(--shimmer-base)      25%,
      var(--shimmer-highlight) 50%,
      var(--shimmer-base)      75%
    );
    background-size: 400px 100%;
    animation: ira-shimmer 1.6s ease-in-out infinite;
  }

  [data-theme='light'] {
    --shimmer-base:      #eeeeee;
    --shimmer-highlight: #f8f8f8;
  }
  [data-theme='dark'] {
    --shimmer-base:      #252525;
    --shimmer-highlight: #2e2e2e;
  }
`

// Skeleton for the artists list hero
function ArtistsHeroSkeleton() {
  return (
    <section className="pt-48 pb-12 px-4 sm:px-10 bg-backgroundColor">
      <div className="max-w-screen-xl mx-auto">
        <div className="border-b border-borderColor pb-12">
          {/* section-number label */}
          <div className="ira-shimmer h-3 w-24 rounded mb-6" />
          {/* Heading */}
          <div className="ira-shimmer h-16 md:h-24 w-3/4 rounded mb-4" />
          {/* Descriptor */}
          <div className="ira-shimmer h-3 w-96 max-w-full rounded mt-6" />
        </div>
      </div>
    </section>
  )
}

// Skeleton for the artists grid section — mirrors ArtistsGrid layout
function ArtistsGridSkeleton() {
  const skeletons = Array.from({ length: 16 })
  return (
    <section className="py-32 px-4 sm:px-10 bg-backgroundColor">
      <div className="max-w-screen-xl mx-auto">
        {/* Controls bar */}
        <div className="flex items-end justify-between pb-6 mb-16 border-b border-borderColor">
          <div className="ira-shimmer h-4 w-32 rounded" />
          <div className="ira-shimmer h-3 w-24 rounded" />
        </div>

        {/* Artist grid — aspect-[3/4] cards, same 4-col layout as real grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 sm:gap-x-12 gap-y-16 sm:gap-y-20">
          {skeletons.map((_, i) => (
            <div key={i}>
              <div className="ira-shimmer aspect-[3/4] w-full mb-6 border border-borderColor" />
              <div className="space-y-2 text-center">
                <div className="ira-shimmer h-3 w-3/4 mx-auto rounded" />
                <div className="ira-shimmer h-3 w-1/2 mx-auto rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Main artists list page skeleton
export default function ArtistsPageSkeleton() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shimmerStyles }} />
      <div className="min-h-screen bg-backgroundColor">
        <ArtistsHeroSkeleton />
        <ArtistsGridSkeleton />
      </div>
    </>
  )
}
