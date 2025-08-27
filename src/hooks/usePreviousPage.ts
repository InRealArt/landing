'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

/**
 * Hook pour tracker la page précédente visitée
 * @returns La page précédente visitée par l'utilisateur
 */
export function usePreviousPage(): string | null {
    const pathname = usePathname()
    const router = useRouter()
    const [previousPage, setPreviousPage] = useState<string | null>(null)
    const currentPageRef = useRef<string | null>(null)

    useEffect(() => {
        console.log('🔄 usePreviousPage effect:', {
            pathname,
            currentPageRef: currentPageRef.current,
            previousPage
        })

        // Si c'est le premier rendu, on sauvegarde le pathname actuel
        if (currentPageRef.current === null) {
            currentPageRef.current = pathname
            console.log('📝 Premier rendu, sauvegarde:', pathname)
            return
        }

        // Si le pathname a changé, on sauvegarde l'ancien comme page précédente
        if (currentPageRef.current !== pathname) {
            console.log('🔄 Changement de page:', {
                de: currentPageRef.current,
                vers: pathname
            })
            setPreviousPage(currentPageRef.current)
            currentPageRef.current = pathname
        }
    }, [pathname, previousPage])

    // Log à chaque rendu pour debug
    console.log('🎯 usePreviousPage rendu:', { pathname, previousPage })

    return previousPage
}
