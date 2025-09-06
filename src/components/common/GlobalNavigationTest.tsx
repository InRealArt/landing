'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import Button from './Button'

export default function GlobalNavigationTest() {
  const pathname = usePathname()
  const [previousPage, setPreviousPage] = useState<string | null>(null)
  const currentPageRef = useRef<string | null>(null)

  useEffect(() => {
    console.log('🔄 GlobalNavigationTest effect:', { 
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

  const currentPage = pathname

  const handleTest = () => {
    console.log('🔍 Debug NavigationTracker global:', { previousPage, currentPage })
    
    const message = previousPage
      ? `Page précédente visitée : ${previousPage}`
      : "Aucune page précédente détectée (première visite ou actualisation)"

    toast.info(message, {
      duration: 5000,
      description: "NavigationTracker global en action !"
    })
  }

  // En développement seulement
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        text="🧪 Test Navigation"
        additionalClassName="bg-orange-500 hover:bg-orange-600 text-textColor px-4 py-2 rounded-lg shadow-lg"
        action={handleTest}
      />

      {/* Indicateur visuel de la navigation */}
      <div className="absolute -top-12 right-0 bg-backgroundColor/80 text-textColor px-2 py-1 rounded text-xs whitespace-nowrap">
        Prev: {previousPage || 'null'} | Current: {currentPage}
      </div>
    </div>
  )
}
