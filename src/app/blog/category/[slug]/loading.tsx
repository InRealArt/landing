export default function BlogCategoryLoading() {
  return (
    <main className="min-h-screen pt-headerSize text-textColor">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden">
        <div
          className="h-full bg-purpleColor"
          style={{ animation: 'ira-progress 1.8s ease-in-out infinite' }}
        />
        <style>{`
          @keyframes ira-progress {
            0%   { transform: translateX(-100%); }
            50%  { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>

      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4 py-16">
        {/* Category heading */}
        <div className="mb-12">
          <div className="h-10 w-48 rounded bg-backgroundGrey animate-pulse mb-3" />
          <div className="h-4 w-64 rounded bg-backgroundGrey animate-pulse" />
        </div>

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-borderColor overflow-hidden bg-cardBackground"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-video bg-backgroundGrey animate-pulse overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: `ira-shimmer 2s ease-in-out ${i * 120}ms infinite`,
                  }}
                />
              </div>

              {/* Card body */}
              <div className="p-5 space-y-3">
                {/* Tags row */}
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded-full bg-backgroundGrey animate-pulse" />
                  <div className="h-5 w-20 rounded-full bg-backgroundGrey animate-pulse" />
                </div>
                {/* Title */}
                <div className="h-5 w-full rounded bg-backgroundGrey animate-pulse" />
                <div className="h-5 w-4/5 rounded bg-backgroundGrey animate-pulse" />
                {/* Excerpt */}
                <div className="h-4 w-full rounded bg-backgroundGrey animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-backgroundGrey animate-pulse" />
                {/* Meta */}
                <div className="flex gap-3 pt-1">
                  <div className="h-3 w-20 rounded bg-backgroundGrey animate-pulse" />
                  <div className="h-3 w-16 rounded bg-backgroundGrey animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-12">
          <div className="h-4 w-32 rounded bg-backgroundGrey animate-pulse" />
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
