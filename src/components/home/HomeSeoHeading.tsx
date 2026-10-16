'use client'

import { useTranslation } from '@/hooks/useTranslation'

/**
 * H1 de la page d'accueil, rendu dans le HTML initial (avant le hero streamé).
 * Le hero (HomeHero) est chargé après des requêtes base de données : son titre arrive en fin de
 * document et change de claim ; ce titre stable est celui que les moteurs lisent en premier.
 */
export default function HomeSeoHeading() {
  const { t } = useTranslation()
  return <h1 className="sr-only">{t('exhibitions.hero.claimCollector')}</h1>
}
