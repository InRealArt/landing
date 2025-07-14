/**
 * Utilitaires pour la gestion de la popup newsletter
 */

// Clés de stockage
export const STORAGE_KEYS = {
    NOT_INTERESTED: 'newsletter-not-interested',
    POPUP_SHOWN: 'newsletter-popup-shown'
} as const

/**
 * Vérifie si l'utilisateur a indiqué ne pas être intéressé
 */
export function isUserNotInterested(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(STORAGE_KEYS.NOT_INTERESTED) === 'true'
}

/**
 * Vérifie si la popup a déjà été montrée dans cette session
 */
export function hasPopupBeenShown(): boolean {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem(STORAGE_KEYS.POPUP_SHOWN) === 'true'
}

/**
 * Marque l'utilisateur comme pas intéressé
 */
export function markUserAsNotInterested(): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.NOT_INTERESTED, 'true')
    console.log('👤 Utilisateur marqué comme pas intéressé')
}

/**
 * Marque la popup comme montrée dans cette session
 */
export function markPopupAsShown(): void {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(STORAGE_KEYS.POPUP_SHOWN, 'true')
    console.log('📺 Popup marquée comme montrée')
}

/**
 * Réinitialise toutes les conditions de la popup (pour les tests)
 */
export function resetNewsletterConditions(): void {
    if (typeof window === 'undefined') return

    localStorage.removeItem(STORAGE_KEYS.NOT_INTERESTED)
    sessionStorage.removeItem(STORAGE_KEYS.POPUP_SHOWN)

    console.log('🔄 Conditions de la popup réinitialisées')
}

/**
 * Vérifie si la popup doit être affichée
 */
export function shouldShowPopup(): boolean {
    return !isUserNotInterested() && !hasPopupBeenShown()
}

/**
 * Fonction utilitaire pour les tests - accessible depuis la console
 */
export function enableNewsletterPopupDebug(): void {
    if (typeof window === 'undefined') return

    // Rendre les fonctions disponibles globalement pour les tests
    Object.assign(window, {
        resetNewsletterConditions,
        isUserNotInterested,
        hasPopupBeenShown,
        shouldShowPopup,
        markUserAsNotInterested,
        markPopupAsShown
    })

    console.log('🛠️ Debug newsletter popup activé!')
    console.log('Fonctions disponibles:')
    console.log('- resetNewsletterConditions()')
    console.log('- isUserNotInterested()')
    console.log('- hasPopupBeenShown()')
    console.log('- shouldShowPopup()')
    console.log('- markUserAsNotInterested()')
    console.log('- markPopupAsShown()')
} 