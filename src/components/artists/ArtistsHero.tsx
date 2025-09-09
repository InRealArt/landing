'use client'

import { useLanguageStore } from '@/store/languageStore'
import Hero from "@/components/common/Hero"

export default function ArtistsHero() {
  const { t } = useLanguageStore()
  
  return (
    <Hero
      backgroundImage="/images/artists/hero_artists.webp"
      alt={t('artists.title')}
      title={t('artists.hero.title')}
      subtitle={t('artists.hero.subtitle')}
    />
  )
}
