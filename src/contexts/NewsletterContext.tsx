'use client'

import { createContext, useContext, useCallback, useEffect, useState } from 'react'
import { 
  isUserNotInterested, 
  hasPopupBeenShown, 
  markUserAsNotInterested, 
  markPopupAsShown, 
  resetNewsletterConditions,
  shouldShowPopup,
  enableNewsletterPopupDebug
} from '@/utils/newsletterUtils'

interface NewsletterContextType {
  // État de la popup
  isModalOpen: boolean
  showModal: () => void
  closeModal: () => void
  
  // Configuration du timer
  sessionTime: number
  delayInSeconds: number
  
  // Statut du timer
  isTimerActive: boolean
  hasTriggered: boolean
  
  // Actions
  markAsNotInterested: () => void
  onSubscriptionSuccess: () => void
  resetTimer: () => void
}

const NewsletterContext = createContext<NewsletterContextType | undefined>(undefined)

export function useNewsletter() {
  const context = useContext(NewsletterContext)
  if (context === undefined) {
    throw new Error('useNewsletter must be used within a NewsletterProvider')
  }
  return context
}

interface NewsletterProviderProps {
  children: React.ReactNode
  delayInSeconds?: number
  disabled?: boolean
}

export function NewsletterProvider({ 
  children, 
  delayInSeconds = 30, 
  disabled = false 
}: NewsletterProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialisation côté client uniquement pour éviter les problèmes d'hydratation
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const checkConditions = () => {
      const notInterested = isUserNotInterested()
      const popupShown = hasPopupBeenShown()
      const canShowPopup = shouldShowPopup()
      
      console.log('🔍 Newsletter conditions:', {
        notInterested,
        popupShown,
        canShowPopup,
        disabled,
        delayInSeconds
      })
      
      // Si l'utilisateur n'est pas intéressé OU a déjà vu la popup OU est désactivé
      if (!canShowPopup || disabled) {
        console.log('❌ Newsletter timer désactivé')
        setIsTimerActive(false)
        setHasTriggered(true)
        return
      }
      
      // Sinon, on active le timer
      console.log('✅ Newsletter timer activé pour', delayInSeconds, 'secondes')
      setIsTimerActive(true)
      setHasTriggered(false)
    }
    
    checkConditions()
    setIsInitialized(true)
    
    // Activer le mode debug en développement
    if (process.env.NODE_ENV === 'development') {
      enableNewsletterPopupDebug()
    }
  }, [delayInSeconds, disabled])

  // Gestion du timer de session
  useEffect(() => {
    if (!isInitialized || !isTimerActive || hasTriggered) return
    
    console.log('▶️ Timer de session démarré')
    
    const interval = setInterval(() => {
      setSessionTime(prev => {
        const newTime = prev + 1
        console.log(`⏰ Session: ${newTime}/${delayInSeconds}s`)
        
        if (newTime >= delayInSeconds && !hasTriggered) {
          console.log('🚀 Délai atteint! Affichage de la popup')
          setHasTriggered(true)
          setIsModalOpen(true)
          
          // Marquer comme montré dans la session
          markPopupAsShown()
        }
        
        return newTime
      })
    }, 1000)
    
    return () => {
      console.log('🛑 Timer de session nettoyé')
      clearInterval(interval)
    }
  }, [isInitialized, isTimerActive, hasTriggered, delayInSeconds])

  // Actions
  const showModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const markAsNotInterested = useCallback(() => {
    markUserAsNotInterested()
    setIsModalOpen(false)
    setIsTimerActive(false)
  }, [])

  const onSubscriptionSuccess = useCallback(() => {
    console.log('✅ Abonnement réussi!')
    markPopupAsShown()
    setIsModalOpen(false)
    setIsTimerActive(false)
  }, [])

  const resetTimer = useCallback(() => {
    resetNewsletterConditions()
    setSessionTime(0)
    setHasTriggered(false)
    setIsTimerActive(true)
    console.log('🔄 Timer réinitialisé')
  }, [])

  // Nettoyage à la fermeture de la page
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Persister l'état si nécessaire
      console.log('📝 Sauvegarde de l\'état avant fermeture')
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const contextValue: NewsletterContextType = {
    isModalOpen,
    showModal,
    closeModal,
    sessionTime,
    delayInSeconds,
    isTimerActive,
    hasTriggered,
    markAsNotInterested,
    onSubscriptionSuccess,
    resetTimer
  }

  return (
    <NewsletterContext.Provider value={contextValue}>
      {children}
    </NewsletterContext.Provider>
  )
} 