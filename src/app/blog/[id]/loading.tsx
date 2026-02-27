export default function BlogPostLoading() {
  return (
    <main className="min-h-screen pt-headerSize text-textColor">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden">
        <div
          className="h-full bg-purpleColor"
          style={{
            width: '100%',
            animation: 'ira-progress 1.8s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes ira-progress {
            0%   { transform: translateX(-100%); }
            50%  { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>

      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4 py-12">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-10">
          <div className="h-4 w-24 rounded bg-backgroundGrey animate-pulse" />
          <div className="h-4 w-3 rounded bg-backgroundGrey animate-pulse" />
          <div className="h-4 w-32 rounded bg-backgroundGrey animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
          {/* Main content */}
          <div>
            {/* Category pill */}
            <div className="h-6 w-28 rounded-full bg-purpleColor/20 animate-pulse mb-6" />

            {/* Title */}
            <div className="space-y-3 mb-6">
              <div className="h-9 w-full rounded bg-backgroundGrey animate-pulse" />
              <div className="h-9 w-4/5 rounded bg-backgroundGrey animate-pulse" />
              <div className="h-9 w-3/5 rounded bg-backgroundGrey animate-pulse" />
            </div>

            {/* Meta row: date · read time · author */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-4 w-24 rounded bg-backgroundGrey animate-pulse" />
              <div className="h-4 w-2 rounded-full bg-backgroundGrey animate-pulse" />
              <div className="h-4 w-20 rounded bg-backgroundGrey animate-pulse" />
              <div className="h-4 w-2 rounded-full bg-backgroundGrey animate-pulse" />
              <div className="h-4 w-28 rounded bg-backgroundGrey animate-pulse" />
            </div>

            {/* Hero image */}
            <div className="relative w-full aspect-[16/9] rounded-xl bg-backgroundGrey animate-pulse mb-10 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
                  animation: 'ira-shimmer 2s ease-in-out infinite',
                  backgroundSize: '200% 100%',
                }}
              />
            </div>

            {/* Article body lines */}
            <div className="space-y-3">
              {[100, 95, 88, 100, 72, 90, 83, 100, 67, 91, 78, 100, 55].map(
                (w, i) => (
                  <div
                    key={i}
                    className="h-4 rounded bg-backgroundGrey animate-pulse"
                    style={{
                      width: `${w}%`,
                      animationDelay: `${i * 60}ms`,
                    }}
                  />
                )
              )}

              {/* Mid-article subheading */}
              <div className="h-7 w-2/5 rounded bg-backgroundGrey animate-pulse mt-8 mb-4" />

              {[100, 89, 95, 74, 100, 82].map((w, i) => (
                <div
                  key={`b${i}`}
                  className="h-4 rounded bg-backgroundGrey animate-pulse"
                  style={{ width: `${w}%`, animationDelay: `${i * 60}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-height)+2rem)] space-y-6">
              {/* Related posts card */}
              <div className="rounded-xl border border-borderColor p-6">
                <div className="h-5 w-36 rounded bg-backgroundGrey animate-pulse mb-5" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 mb-4">
                    <div className="shrink-0 w-16 h-16 rounded-lg bg-backgroundGrey animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full rounded bg-backgroundGrey animate-pulse" />
                      <div className="h-4 w-3/4 rounded bg-backgroundGrey animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {[60, 80, 55, 70, 90].map((w, i) => (
                  <div
                    key={i}
                    className="h-7 rounded-full bg-backgroundGrey animate-pulse"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @keyframes ira-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </main>
  )
}
