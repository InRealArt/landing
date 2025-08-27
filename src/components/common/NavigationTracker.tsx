'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface NavigationContextType {
  previousPage: string | null
  currentPage: string | null
}

const NavigationContext = createContext<NavigationContextType>({
  previousPage: null,
  currentPage: null
})

export const useNavigation = () => useContext(NavigationContext)

const NavigationTracker = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const [previousPage, setPreviousPage] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<string | null>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    console.log('🔄 NavigationTracker effect:', { 
      pathname, 
      currentPage, 
      previousPage,
      isFirstRender: isFirstRender.current
    })

    if (isFirstRender.current) {
      // Premier rendu
      setCurrentPage(pathname)
      isFirstRender.current = false
      console.log('📝 Premier rendu, page actuelle:', pathname)
    } else if (currentPage !== pathname) {
      // Changement de page
      console.log('🔄 Changement de page:', { 
        de: currentPage, 
        vers: pathname 
      })
      setPreviousPage(currentPage)
      setCurrentPage(pathname)
    }
  }, [pathname, currentPage, previousPage])

  const contextValue: NavigationContextType = {
    previousPage,
    currentPage
  }

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}

export default NavigationTracker
