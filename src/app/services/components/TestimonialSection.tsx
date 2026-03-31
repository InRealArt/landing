interface TestimonialSectionProps {
  translations: {
    eyebrow: string
    quote: string
    author: string
    role: string
  }
}

export default function TestimonialSection({ translations }: TestimonialSectionProps) {
  return (
    <section
      className="py-40 px-10 overflow-hidden relative"
      style={{ backgroundColor: '#111', color: '#fff' }}
    >
      {/* Decorative oversized quote */}
      <div
        className="absolute top-10 left-10 serif leading-none select-none pointer-events-none"
        style={{
          fontSize: '20rem',
          opacity: 0.08,
          color: 'var(--gold-accent)',
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        &ldquo;
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span
          className="block text-[10px] uppercase tracking-[0.5em] italic mb-12 montserrat"
          style={{ color: '#666' }}
        >
          {translations.eyebrow}
        </span>

        <blockquote>
          <p className="serif text-3xl md:text-5xl italic leading-tight mb-12">
            &ldquo;{translations.quote}&rdquo;
          </p>

          <footer className="flex flex-col items-center">
            <div
              className="w-12 mb-6"
              style={{ height: '1px', backgroundColor: 'var(--gold-accent)' }}
              aria-hidden="true"
            />
            <p className="text-[11px] uppercase tracking-[0.4em] font-bold montserrat">
              {translations.author}
            </p>
            <p
              className="text-[9px] uppercase tracking-widest mt-1 montserrat"
              style={{ color: '#555' }}
            >
              {translations.role}
            </p>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
