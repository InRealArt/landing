'use client'

import { useLanguageStore } from '@/store/languageStore'

export default function JoinInRealArtHero() {
  const { t } = useLanguageStore()

  // The title already contains "InRealArt" — we split on it to apply the gold italic style.
  // Fallback renders the full title without splitting if the word is absent.
  const titleRaw = t('joinInRealArt.header.title')
  const splitIndex = titleRaw.indexOf('InRealArt')
  const hasSplit = splitIndex !== -1
  const titleBefore = hasSplit ? titleRaw.slice(0, splitIndex) : titleRaw
  const titleAfter = hasSplit ? titleRaw.slice(splitIndex + 'InRealArt'.length) : ''

  return (
    <header className="pt-[calc(var(--header-height,90px)+4rem)] md:pt-[calc(var(--header-height,90px)+6rem)] lg:pt-[calc(var(--header-height,90px)+8rem)] pb-16 md:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-10">
      <div className="max-w-screen-2xl mx-auto text-center">
        <span className="text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-grayText mb-6 block font-[family-name:var(--font-montserrat)]">
          {t('joinInRealArt.header.label')}
        </span>
        <h1 className="text-[2.25rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-[family-name:var(--font-cormorant)] font-light leading-tight mb-8 text-textColor">
          {titleBefore}
          {hasSplit && <span className="italic text-[#b89c72]">InRealArt</span>}
          {titleAfter}
        </h1>
        <p className="text-[11px] sm:text-[12px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-grayText max-w-2xl mx-auto leading-relaxed font-[family-name:var(--font-montserrat)]">
          {t('joinInRealArt.header.description')}
        </p>
      </div>
    </header>
  )
}
