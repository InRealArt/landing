export default function MediaPageHeader() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-8 border-b border-black/5 dark:border-white/5">
      <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400 montserrat">
        InRealArt Média
      </span>
      <h1 className="serif text-[clamp(2rem,6vw,3.75rem)] mt-4 italic" style={{ color: 'var(--ink-black)' }}>
        L&apos;Observatoire de la Création
      </h1>
    </div>
  )
}
