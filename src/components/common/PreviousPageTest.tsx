'use client'

import { useState } from 'react'
import { useNavigation } from './NavigationTracker'
import { toast } from 'sonner'
import Button from './Button'

export default function PreviousPageTest() {
  const { previousPage, currentPage } = useNavigation()
  const [isVisible, setIsVisible] = useState(false)

  const handleTest = () => {
    console.log('🔍 Debug NavigationTracker:', { previousPage, currentPage })
    
    const message = previousPage
      ? `Page précédente visitée : ${previousPage}`
      : "Aucune page précédente détectée (première visite ou actualisation)"

    toast.info(message, {
      duration: 5000,
      description: "NavigationTracker en action !"
    })
  }

  // En développement seulement
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        text="🧪 Test PreviousPage"
        additionalClassName="bg-orange-500 hover:bg-orange-600 text-textColor px-4 py-2 rounded-lg shadow-lg"
        action={handleTest}
      />

      {/* Indicateur visuel de la page précédente */}
      <div className="absolute -top-12 right-0 bg-backgroundColor/80 text-textColor px-2 py-1 rounded text-xs whitespace-nowrap">
        Prev: {previousPage || 'null'} | Current: {currentPage}
      </div>
    </div>
  )
}
