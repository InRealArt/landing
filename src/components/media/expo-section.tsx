import Image from 'next/image'
import { getLatestExpos, ExpoData } from '@/actions/expoActions'

function ExpoCard({ title, location, date, imageUrl, href }: ExpoData) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div
        className="border p-4 sm:p-6 transition-shadow duration-200 group-hover:shadow-md"
        style={{
          borderColor: 'var(--border-light)',
          background: 'var(--canvas-bg)',
        }}
      >
        {/* Mobile: stack vertically. sm+: side by side (image 1/3 + text 2/3) */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Image ratio 3/4 — full width on mobile, 1/3 on sm+ */}
          <div className="w-full sm:w-1/3 aspect-[3/4] bg-gray-100 overflow-hidden flex-shrink-0 relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            ) : null}
          </div>

          <div className="w-full sm:w-2/3 flex flex-col justify-between">
            <div>
              <h3
                className="serif text-lg sm:text-xl font-bold mb-1"
                style={{ color: 'var(--ink-black)' }}
              >
                {title}
              </h3>
              <p
                className="text-[11px] uppercase font-bold mb-1 tracking-widest montserrat"
                style={{ color: 'var(--gold-accent)' }}
              >
                {location}
              </p>
              {date && (
                <p
                  className="text-xs montserrat mb-3"
                  style={{ color: 'var(--gray-text)' }}
                >
                  {date}
                </p>
              )}
            </div>
            <div className="mt-4">
              <span
                className="btn-mag inline-flex items-center min-h-[44px]"
                style={{ color: 'var(--ink-black)' }}
              >
                Lire la fiche
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

export default async function ExpoSection() {
  const expos = await getLatestExpos()

  if (expos.length === 0) return null

  return (
    <section className="mb-16 md:mb-24 lg:mb-32">
      {/* Section header */}
      <div className="flex items-baseline gap-4 mb-8 md:mb-10">
        <h2
          className="serif text-2xl sm:text-3xl font-bold whitespace-nowrap"
          style={{ color: 'var(--ink-black)' }}
        >
          Dernières Expositions
        </h2>
        <div
          className="h-px flex-grow"
          style={{ background: 'var(--border-light)' }}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
        {expos.map((expo) => (
          <ExpoCard key={expo.title} {...expo} />
        ))}
      </div>
    </section>
  )
}
