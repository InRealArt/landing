'use client'

import { useEffect, useState } from 'react'
import { getRandomSimulatorImage } from '@/utils/randomSimulatorImage'

/**
 * Image de simulateur tirée au hasard une seule fois, après le montage.
 * Tirée pendant le rendu, elle différait entre serveur et client (erreur d'hydratation)
 * et changeait à chaque re-rendu. Vaut `null` tant que le tirage n'est pas fait.
 */
export function useRandomSimulatorImage(): string | null {
    const [src, setSrc] = useState<string | null>(null)

    useEffect(() => {
        setSrc(getRandomSimulatorImage())
    }, [])

    return src
}
