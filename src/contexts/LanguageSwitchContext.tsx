'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { useLanguageStore } from '@/store/languageStore'

type Language = 'fr' | 'en'

/**
 * Handler qui remplace le comportement natif du bouton de langue.
 * Il reçoit la langue cible et doit se charger lui-même de l'appliquer
 * (typiquement via `setLanguage`) en plus de son traitement spécifique.
 */
type LanguageSwitchHandler = (targetLanguage: Language) => void | Promise<void>

interface LanguageSwitchContextValue {
    /** Enregistre une surcharge. Retourne la fonction de désinscription. */
    registerOverride: (handler: LanguageSwitchHandler) => () => void
    /** Comportement à déclencher au clic : la surcharge si présente, sinon le natif. */
    switchLanguage: (targetLanguage: Language) => void | Promise<void>
}

const LanguageSwitchContext = createContext<LanguageSwitchContextValue | null>(null)

export function LanguageSwitchProvider({ children }: { children: React.ReactNode }) {
    // La surcharge vit dans une ref, pas dans un state : elle n'est lue qu'au
    // moment du clic, aucun rendu ne dépend d'elle. Un state provoquerait un
    // nouveau `value` de contexte à chaque enregistrement, donc une boucle
    // infinie avec l'effet de `useLanguageSwitchOverride`.
    const overrideRef = useRef<LanguageSwitchHandler | null>(null)

    const registerOverride = useCallback((handler: LanguageSwitchHandler) => {
        overrideRef.current = handler

        return () => {
            if (overrideRef.current === handler) {
                overrideRef.current = null
            }
        }
    }, [])

    const switchLanguage = useCallback((targetLanguage: Language) => {
        const override = overrideRef.current
        if (override) return override(targetLanguage)

        // Lecture directe du store : garde `switchLanguage` stable.
        return useLanguageStore.getState().setLanguage(targetLanguage)
    }, [])

    // `registerOverride` et `switchLanguage` sont stables : le contexte ne
    // change jamais d'identité et ne réveille aucun consommateur.
    const value = useMemo(
        () => ({ registerOverride, switchLanguage }),
        [registerOverride, switchLanguage]
    )

    return (
        <LanguageSwitchContext.Provider value={value}>
            {children}
        </LanguageSwitchContext.Provider>
    )
}

/**
 * À utiliser dans le bouton de changement de langue.
 * Retombe sur le comportement natif si aucun provider n'est monté.
 */
export function useLanguageSwitch(): (targetLanguage: Language) => void | Promise<void> {
    const context = useContext(LanguageSwitchContext)
    const setLanguage = useLanguageStore((state) => state.setLanguage)

    return context?.switchLanguage ?? setLanguage
}

/**
 * Surcharge le bouton de langue tant que le composant appelant est monté.
 * Le comportement natif est automatiquement restauré au démontage.
 */
export function useLanguageSwitchOverride(handler: LanguageSwitchHandler) {
    const context = useContext(LanguageSwitchContext)

    // Garde le handler courant dans une ref pour ne pas réenregistrer
    // la surcharge à chaque rendu si l'appelant passe une closure inline.
    const handlerRef = useRef(handler)
    handlerRef.current = handler

    useEffect(() => {
        if (!context) return

        return context.registerOverride((targetLanguage) => handlerRef.current(targetLanguage))
    }, [context])
}
