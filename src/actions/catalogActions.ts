'use server'

import { z } from 'zod'
import { verifyRecaptchaToken } from '@/lib/recaptcha'
import frTranslations from '@/locales/fr.json'
import enTranslations from '@/locales/en.json'
import { getBrevoCatalogListId, BREVO_CONTACT_ATTRIBUTES } from '@/config/brevoConfig'

// Validation Zod pour les données d'entrée
const CatalogDownloadSchema = z.object({
    email: z
        .string()
        .email({ message: 'emailInvalid' })
        .trim()
        .toLowerCase(),
    recaptchaToken: z
        .string()
        .optional()
})

// Type pour la réponse de l'action
export type CatalogDownloadResult = {
    success: boolean
    message: string
    errors?: {
        email?: string[]
        recaptcha?: string[]
        general?: string[]
    }
}

// Fonction de traduction centralisée pour les messages catalogue
function getCatalogMessage(key: string, language: string = 'fr'): string {
    const translations = language.toLowerCase() === 'en' ? enTranslations : frTranslations

    // Accéder aux messages de traduction de manière sécurisée
    const presaleMessages = (translations as any).presale?.messages
    const message = presaleMessages?.[key]

    return message || presaleMessages?.internalError || 'Une erreur interne s\'est produite.'
}

/**
 * Server action sécurisée pour le téléchargement du catalogue
 * @param formData - Les données du formulaire
 * @returns Résultat de l'opération
 */
export async function downloadCatalog(formData: FormData): Promise<CatalogDownloadResult> {
    try {
        // Extraction des données du formulaire
        const rawData = {
            email: formData.get('email') as string,
            recaptchaToken: formData.get('recaptchaToken') as string || undefined,
            language: formData.get('language') as string || 'fr' // Défaut en français
        }

        // Validation des données avec Zod
        const validatedFields = CatalogDownloadSchema.safeParse(rawData)

        if (!validatedFields.success) {
            // Traduire les erreurs de validation
            const translatedErrors: any = {}
            if (validatedFields.error.flatten().fieldErrors.email) {
                // Utiliser la clé de traduction pour l'erreur d'email
                const emailErrorKey = validatedFields.error.flatten().fieldErrors.email?.[0]
                if (emailErrorKey === 'emailInvalid') {
                    const translations = rawData.language.toLowerCase() === 'en' ? enTranslations : frTranslations
                    const presaleForm = (translations as any).presale?.form
                    translatedErrors.email = [presaleForm?.emailInvalid || 'Invalid email address']
                } else {
                    const translations = rawData.language.toLowerCase() === 'en' ? enTranslations : frTranslations
                    const presaleForm = (translations as any).presale?.form
                    translatedErrors.email = [presaleForm?.emailInvalid || 'Invalid email address']
                }
            }

            return {
                success: false,
                message: getCatalogMessage('invalidData', rawData.language),
                errors: translatedErrors
            }
        }

        const { email, recaptchaToken } = validatedFields.data

        // Vérification reCAPTCHA si un token est fourni
        if (recaptchaToken) {
            const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken)
            if (!isRecaptchaValid) {
                return {
                    success: false,
                    message: getCatalogMessage('recaptchaFailed', rawData.language),
                    errors: {
                        recaptcha: [getCatalogMessage('recaptchaFailed', rawData.language)]
                    }
                }
            }
        }

        // Ajouter le contact à Brevo
        const brevoResult = await addContactToBrevoForCatalog(email, rawData.language)

        if (!brevoResult.success) {
            return {
                success: false,
                message: brevoResult.message,
                errors: {
                    general: [brevoResult.message]
                }
            }
        }

        return {
            success: true,
            message: getCatalogMessage('success', rawData.language)
        }

    } catch (error) {
        console.error('❌ Erreur lors du téléchargement du catalogue:', error)

        // Extraire la langue depuis le formData pour le catch
        const language = (formData.get('language') as string) || 'fr'

        return {
            success: false,
            message: getCatalogMessage('internalError', language),
            errors: {
                general: [getCatalogMessage('internalError', language)]
            }
        }
    }
}

/**
 * Ajoute un contact à la base de données Brevo pour le catalogue
 * @param email - L'adresse email du contact
 * @returns Résultat de l'opération
 */
async function addContactToBrevoForCatalog(email: string, language: string = 'fr'): Promise<{ success: boolean; message: string }> {
    const { addContactToBrevo } = await import('@/utils/brevoService');
    
    const brevoListId = getBrevoCatalogListId(language);
    
    const result = await addContactToBrevo({
        email,
        listId: brevoListId,
        language,
        source: BREVO_CONTACT_ATTRIBUTES.CATALOG_SOURCE
    });

    if (!result.success && result.message.includes('configuration')) {
        return {
            success: false,
            message: getCatalogMessage('configurationError', language)
        };
    }

    if (!result.success && result.message.includes('unavailable')) {
        return {
            success: false,
            message: getCatalogMessage('serviceUnavailable', language)
        };
    }

    if (!result.success) {
        return {
            success: false,
            message: getCatalogMessage('downloadError', language)
        };
    }

    return {
        success: true,
        message: getCatalogMessage('success', language)
    };
}
