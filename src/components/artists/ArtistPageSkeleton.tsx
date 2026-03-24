'use client'


/*
 * Shimmer animation for both themes:
 * – Light: soft gray wash over near-white background
 * – Dark:  charcoal wash over card-dark background
 * CSS vars are set per data-theme so the same .ira-shimmer class
 * works in both modes without any Tailwind dark: variant.
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

// Skeleton for the artist profile hero (full-bleed image section)
function HeroBackgroundSkeleton() {
  return (
    <div className="relative h-[560px] lg:h-[700px] w-full overflow-hidden bg-backgroundColor">

      {/* Gradient overlay using CSS vars */}
      <div className="absolute inset-0 bg-gradient-to-t from-backgroundColor via-backgroundColor/80 to-transparent z-10" />

      {/* Skeleton card pinned to bottom-left (mirrors ArtistProfileHero layout) */}
      <div className="relative z-20 h-full flex items-end pb-8 lg:pb-12">
        <div className="max-w-90 xl:max-w-screen-xl mx-auto w-full px-4">
          <div className="relative max-w-sm h-80 lg:h-[500px] overflow-hidden bg-cardBackground border border-borderColor">
            {/* Tags row */}
            <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap gap-2">
              <div className="ira-shimmer h-5 w-16 rounded-full" />
              <div className="ira-shimmer h-5 w-20 rounded-full" />
              <div className="ira-shimmer h-5 w-14 rounded-full" />
            </div>

            {/* Name + location at bottom */}
            <div className="absolute bottom-4 left-4 right-4 z-10 space-y-3">
              <div className="ira-shimmer h-5 w-32 rounded" />
              <div className="space-y-2">
                <div className="ira-shimmer h-7 w-44 rounded" />
                <div className="ira-shimmer h-7 w-36 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Skeleton for the artist info section (biography intro + photo)
function ArtistInfoSkeleton() {
  return (
    <section className="pt-32 pb-16">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Left: text content */}
          <div className="space-y-6">
            <div className="ira-shimmer h-3 w-48 rounded" />
            <div className="space-y-2">
              <div className="ira-shimmer h-7 w-64 rounded" />
              <div className="ira-shimmer h-7 w-56 rounded" />
            </div>
            <div className="space-y-2">
              <div className="ira-shimmer h-3 w-full rounded" />
              <div className="ira-shimmer h-3 w-full rounded" />
              <div className="ira-shimmer h-3 w-3/4 rounded" />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="ira-shimmer h-5 w-16 rounded-full" />
              <div className="ira-shimmer h-5 w-20 rounded-full" />
              <div className="ira-shimmer h-5 w-14 rounded-full" />
            </div>
          </div>

          {/* Right: portrait */}
          <div className="flex justify-center lg:justify-end">
            <div className="max-w-sm w-full">
              <div className="ira-shimmer w-full h-80 border border-borderColor" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Skeleton for the artworks grid section
function ArtistArtworksSkeleton() {
  return (
    <section className="relative max-w-90 xl:max-w-screen-xl m-auto py-16">
      <div className="px-4">
        {/* Section title */}
        <div className="mb-8">
          <div className="ira-shimmer h-7 w-64 rounded mx-auto" />
        </div>

        {/* 3-col artwork grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <div className="ira-shimmer w-full h-64 border border-borderColor" />
              <div className="space-y-2">
                <div className="ira-shimmer h-3 w-3/4 rounded" />
                <div className="ira-shimmer h-3 w-1/2 rounded" />
              </div>
              <div className="ira-shimmer h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Skeleton for the biography / CV section
function ArtistBiographySkeleton() {
  return (
    <section className="py-16 lg:py-24 bg-backgroundGrey border-y border-borderColor">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section heading */}
        <div className="text-center mb-16">
          <div className="ira-shimmer h-9 w-64 rounded mx-auto mb-4" />
          <div className="ira-shimmer w-20 h-px mx-auto" />
        </div>

        {/* 3-col layout: sticky portrait + 2-col biography content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Portrait */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="ira-shimmer w-full h-96 lg:h-[600px] border border-borderColor" />
            </div>
          </div>

          {/* Biography entries — two columns */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="ira-shimmer h-5 w-48 rounded" />
                  <div className="space-y-2">
                    <div className="ira-shimmer h-3 w-full rounded" />
                    <div className="ira-shimmer h-3 w-full rounded" />
                    <div className="ira-shimmer h-3 w-3/4 rounded" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="ira-shimmer h-5 w-40 rounded" />
                  <div className="space-y-2">
                    <div className="ira-shimmer h-3 w-full rounded" />
                    <div className="ira-shimmer h-3 w-5/6 rounded" />
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="ira-shimmer h-5 w-44 rounded" />
                  <div className="space-y-2">
                    <div className="ira-shimmer h-3 w-full rounded" />
                    <div className="ira-shimmer h-3 w-full rounded" />
                    <div className="ira-shimmer h-3 w-2/3 rounded" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="ira-shimmer h-5 w-36 rounded" />
                  <div className="space-y-2">
                    <div className="ira-shimmer h-3 w-full rounded" />
                    <div className="ira-shimmer h-3 w-4/5 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Main artist profile page skeleton
export default function ArtistPageSkeleton() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shimmerStyles }} />
      <div className="min-h-screen bg-backgroundColor">
        <HeroBackgroundSkeleton />
        <ArtistInfoSkeleton />
        <ArtistArtworksSkeleton />
        <ArtistBiographySkeleton />
      </div>
    </>
  )
}
