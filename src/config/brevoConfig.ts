/**
 * Configuration des listes Brevo
 * Centralise les ID des listes pour éviter la duplication et faciliter la maintenance
 */

export const BREVO_LIST_IDS = {
    // Listes newsletter
    NEWSLETTER: {
        FR: 14,
        EN: 17
    },
    // Listes catalogue
    CATALOG: {
        FR: 25,
        EN: 26
    }
} as const

/**
 * Obtient l'ID de liste Brevo pour la newsletter selon la langue
 * @param language - Code de langue ('fr' ou 'en')
 * @returns ID de la liste newsletter Brevo correspondante
 */
export function getBrevoNewsletterListId(language: string): number {
    return language.toLowerCase() === 'en' ? BREVO_LIST_IDS.NEWSLETTER.EN : BREVO_LIST_IDS.NEWSLETTER.FR
}

/**
 * Obtient l'ID de liste Brevo pour le catalogue selon la langue
 * @param language - Code de langue ('fr' ou 'en')
 * @returns ID de la liste catalogue Brevo correspondante
 */
export function getBrevoCatalogListId(language: string): number {
    return language.toLowerCase() === 'en' ? BREVO_LIST_IDS.CATALOG.EN : BREVO_LIST_IDS.CATALOG.FR
}

/**
 * Configuration des attributs de contact Brevo
 */
export const BREVO_CONTACT_ATTRIBUTES = {
    // Source par défaut pour les inscriptions newsletter
    NEWSLETTER_SOURCE: 'Website Newsletter Popup',
    // Source pour les téléchargements de catalogue
    CATALOG_SOURCE: 'Website Catalog Download'
} as const

/**
 * Types pour la sécurité TypeScript
 */
export type BrevoNewsletterListId = typeof BREVO_LIST_IDS.NEWSLETTER[keyof typeof BREVO_LIST_IDS.NEWSLETTER]
export type BrevoCatalogListId = typeof BREVO_LIST_IDS.CATALOG[keyof typeof BREVO_LIST_IDS.CATALOG]
export type BrevoContactSource = typeof BREVO_CONTACT_ATTRIBUTES[keyof typeof BREVO_CONTACT_ATTRIBUTES]
