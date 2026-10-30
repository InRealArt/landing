'use client'

import { useEffect } from 'react'
import { useRecaptchaContext } from '@/contexts/RecaptchaContext'

/**
 * Hook personnalisé pour charger et utiliser reCAPTCHA de manière lazy
 * 
 * Stratégie de chargement:
 * - Sur interaction utilisateur (hover/focus) : charge reCAPTCHA en arrière-plan
 * - Sur soumission de formulaire : charge reCAPTCHA si pas encore chargé
 * 
 * @param options Options de configuration
 * @returns Fonction executeRecaptcha et état de chargement
 */
export function useLazyRecaptcha(options?: {
    preloadOnInteraction?: boolean // Précharger sur hover/focus (défaut: true)
    interactionTarget?: 'form' | 'input' | 'button' // Cible de l'interaction (défaut: 'form')
}) {
    const { loadRecaptcha, executeRecaptcha } = useRecaptchaContext()

    const preloadOnInteraction = options?.preloadOnInteraction !== false
    const interactionTarget = options?.interactionTarget || 'form'

    // Précharger reCAPTCHA sur interaction utilisateur
    useEffect(() => {
        if (!preloadOnInteraction) return

        const handleInteraction = () => {
            // Charger en arrière-plan sans bloquer
            loadRecaptcha().catch(() => {
                // Ignorer les erreurs silencieusement
            })
        }

        let target: HTMLElement | null = null

        // Trouver la cible selon le type
        if (interactionTarget === 'form') {
            target = document.querySelector('form')
        } else if (interactionTarget === 'input') {
            target = document.querySelector('input[type="email"]')
        } else if (interactionTarget === 'button') {
            target = document.querySelector('button[type="submit"]')
        }

        if (target) {
            // Écouter les événements d'interaction
            target.addEventListener('mouseenter', handleInteraction, { once: true })
            target.addEventListener('focusin', handleInteraction, { once: true })
            target.addEventListener('touchstart', handleInteraction, { once: true })

            return () => {
                target?.removeEventListener('mouseenter', handleInteraction)
                target?.removeEventListener('focusin', handleInteraction)
                target?.removeEventListener('touchstart', handleInteraction)
            }
        }
    }, [preloadOnInteraction, interactionTarget, loadRecaptcha])

    return {
        // Charge reCAPTCHA si nécessaire, renvoie null en cas d'échec
        executeRecaptcha,
        loadRecaptcha
    }
}

