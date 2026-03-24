import Image from 'next/image'

const SERVICES = [
  'Interviews d\u2019artistes premium',
  'Aftermovies d\u2019événements culturels',
]

export default function MarianSection() {
  return (
    <section
      className="mb-16 md:mb-24 lg:mb-32 py-10 sm:py-14 lg:py-16 px-4 sm:px-8 lg:px-12 border"
      style={{
        background: 'var(--soft-gray)',
        borderColor: 'var(--border-light)',
      }}
    >
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left column — text */}
        <div>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 sm:mb-6 block montserrat"
            style={{ color: 'var(--gold-accent)' }}
          >
            Service Production
          </span>

          <h2
            className="serif text-[clamp(1.75rem,4vw,2.5rem)] mb-4 sm:mb-6"
            style={{ color: 'var(--ink-black)' }}
          >
            Marian&nbsp;: Production Vidéo &amp; Interviews
          </h2>

          <p
            className="text-sm mb-6 sm:mb-8 leading-relaxed montserrat"
            style={{ color: 'var(--gray-text)' }}
          >
            Que ce soit pour un événement ou une interview,{' '}
            <strong style={{ color: 'var(--ink-black)' }}>Marian</strong> est disponible pour
            toutes vos demandes de création audiovisuelle externes à InRealArt.
          </p>

          <ul className="text-[11px] uppercase tracking-widest space-y-4 mb-8 sm:mb-10 montserrat">
            {SERVICES.map((service) => (
              <li
                key={service}
                className="flex items-center gap-3"
                style={{ color: 'var(--ink-black)' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: 'var(--gold-accent)' }}
                />
                {service}
              </li>
            ))}
          </ul>

          <a
            href="mailto:marian@inrealart.com"
            className="btn-action inline-flex items-center min-h-[44px]"
          >
            Faire votre demande à Marian
          </a>
        </div>

        {/* Right column — image */}
        <div className="hidden lg:block">
          <div
            className="aspect-[4/5] overflow-hidden shadow-xl relative"
            style={{ border: '8px solid var(--canvas-bg)' }}
          >
            <Image
              src="/images/media/media.avif"
              alt="Marian Production"
              fill
              className="object-cover grayscale"
              sizes="(max-width: 1024px) 0px, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
