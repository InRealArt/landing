export default function MediaPageHeader() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-8 border-b" style={{ borderColor: 'var(--border-light)' }}>
      <span className="text-[10px] uppercase tracking-[0.4em] montserrat" style={{ color: 'var(--gray-text)' }}>
        InRealArt Média
      </span>
      <h1 className="serif text-[clamp(2rem,6vw,3.75rem)] mt-4 italic" style={{ color: 'var(--text)' }}>
        L&apos;Observatoire de la Création
      </h1>
    </div>
  )
}
