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
    try {
        // Configuration de l'API Brevo
        const brevoApiKey = process.env.BREVO_API_KEY

        // Obtenir l'ID de liste catalogue selon la langue
        const brevoListId = getBrevoCatalogListId(language)

        if (!brevoApiKey) {
            console.error('❌ Clé API Brevo manquante')
            return {
                success: false,
                message: getCatalogMessage('configurationError', language)
            }
        }

        // Utilisation de l'API Brevo avec fetch
        const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': brevoApiKey
            },
            body: JSON.stringify({
                email,
                listIds: [brevoListId],
                updateEnabled: true, // Met à jour le contact s'il existe déjà
                attributes: {
                    FIRSTNAME: '', // Peut être étendu si nécessaire
                    LASTNAME: '',
                    LANGUAGE: language.toUpperCase(),
                    SOURCE: BREVO_CONTACT_ATTRIBUTES.CATALOG_SOURCE
                }
            })
        })

        if (!brevoResponse.ok) {
            const errorData = await brevoResponse.json().catch(() => ({}))

            // Gestion des erreurs spécifiques de Brevo
            if (brevoResponse.status === 400 && errorData.code === 'duplicate_parameter') {
                return {
                    success: true,
                    message: getCatalogMessage('success', language)
                }
            }

            // Gestion des erreurs d'IP non autorisée (401)
            if (brevoResponse.status === 401) {
                console.error('❌ Erreur IP Brevo: 401', errorData)
                return {
                    success: false,
                    message: getCatalogMessage('serviceUnavailable', language)
                }
            }

            console.error('❌ Erreur API Brevo:', brevoResponse.status, errorData)
            return {
                success: false,
                message: getCatalogMessage('downloadError', language)
            }
        }

        // Vérifier si la réponse contient du JSON avant de parser
        let responseData = null
        const contentType = brevoResponse.headers.get('content-type')

        if (contentType && contentType.includes('application/json')) {
            try {
                const responseText = await brevoResponse.text()
                if (responseText && responseText.trim()) {
                    responseData = JSON.parse(responseText)
                    console.log(`✅ Contact ajouté avec succès à Brevo pour catalogue (liste ${brevoListId} - ${language.toUpperCase()}):`, responseData.id || 'ID non fourni')
                } else {
                    console.log(`✅ Contact ajouté avec succès à Brevo pour catalogue (liste ${brevoListId} - ${language.toUpperCase()}) - réponse vide`)
                }
            } catch (parseError) {
                console.log(`✅ Contact ajouté avec succès à Brevo pour catalogue (liste ${brevoListId} - ${language.toUpperCase()}) - JSON non parsable, mais succès confirmé`)
            }
        } else {
            console.log(`✅ Contact ajouté avec succès à Brevo pour catalogue (liste ${brevoListId} - ${language.toUpperCase()}) - pas de JSON retourné`)
        }

        return {
            success: true,
            message: getCatalogMessage('success', language)
        }

    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout du contact à Brevo pour catalogue:', error)
        return {
            success: false,
            message: getCatalogMessage('connectionError', language)
        }
    }
}
