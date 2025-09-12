'use server'

import { z } from 'zod'
import { verifyRecaptchaToken } from '@/lib/recaptcha'
import { getBrevoNewsletterListId, BREVO_CONTACT_ATTRIBUTES } from '@/config/brevoConfig'

// Validation Zod pour les données d'entrée
const NewsletterSubscriptionSchema = z.object({
    email: z
        .string()
        .email({ message: 'Adresse email invalide' })
        .trim()
        .toLowerCase(),
    recaptchaToken: z
        .string()
        .optional()
})

// Type pour la réponse de l'action
export type NewsletterActionResult = {
    success: boolean
    message: string
    errors?: {
        email?: string[]
        recaptcha?: string[]
        general?: string[]
    }
}

// Fonction de traduction centralisée pour les messages newsletter
function getNewsletterMessage(key: string, language: string = 'fr'): string {
    const isEnglish = language.toLowerCase() === 'en'

    const messages = {
        success: isEnglish
            ? 'Thank you! You are now subscribed to our newsletter'
            : 'Merci ! Vous êtes maintenant abonné(e) à notre newsletter',

        alreadySubscribed: isEnglish
            ? 'You are already subscribed to our newsletter'
            : 'Vous êtes déjà abonné à notre newsletter',

        invalidData: isEnglish
            ? 'Invalid data'
            : 'Données invalides',

        recaptchaFailed: isEnglish
            ? 'reCAPTCHA verification failed'
            : 'Échec de la vérification reCAPTCHA',

        configurationError: isEnglish
            ? 'Service configuration error'
            : 'Configuration manquante pour l\'abonnement',

        serviceUnavailable: isEnglish
            ? 'Service temporarily unavailable. Please try again later.'
            : 'Service temporairement indisponible. Veuillez réessayer plus tard.',

        subscriptionError: isEnglish
            ? 'Error during subscription. Please try again.'
            : 'Erreur lors de l\'abonnement. Veuillez réessayer.',

        connectionError: isEnglish
            ? 'Connection error to subscription service'
            : 'Erreur de connexion au service d\'abonnement',

        internalError: isEnglish
            ? 'An internal error occurred. Please try again later.'
            : 'Une erreur interne s\'est produite. Veuillez réessayer plus tard.'
    }

    return messages[key as keyof typeof messages] || messages.internalError
}

/**
 * Server action sécurisée pour l'abonnement à la newsletter
 * @param formData - Les données du formulaire
 * @returns Résultat de l'opération
 */
export async function subscribeToNewsletter(formData: FormData): Promise<NewsletterActionResult> {
    try {
        // Extraction des données du formulaire
        const rawData = {
            email: formData.get('email') as string,
            recaptchaToken: formData.get('recaptchaToken') as string || undefined,
            language: formData.get('language') as string || 'fr' // Défaut en français
        }

        // Validation des données avec Zod
        const validatedFields = NewsletterSubscriptionSchema.safeParse(rawData)

        if (!validatedFields.success) {
            return {
                success: false,
                message: getNewsletterMessage('invalidData', rawData.language),
                errors: validatedFields.error.flatten().fieldErrors
            }
        }

        const { email, recaptchaToken } = validatedFields.data

        // Vérification reCAPTCHA si un token est fourni
        if (recaptchaToken) {
            const isRecaptchaValid = await verifyRecaptchaToken(recaptchaToken)
            if (!isRecaptchaValid) {
                return {
                    success: false,
                    message: getNewsletterMessage('recaptchaFailed', rawData.language),
                    errors: {
                        recaptcha: [getNewsletterMessage('recaptchaFailed', rawData.language)]
                    }
                }
            }
        }

        // Intégration avec l'API Brevo
        const brevoResult = await addContactToBrevo(email, rawData.language)

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
            message: getNewsletterMessage('success', rawData.language)
        }

    } catch (error) {
        console.error('❌ Erreur lors de l\'abonnement à la newsletter:', error)

        // Extraire la langue depuis le formData pour le catch
        const language = (formData.get('language') as string) || 'fr'

        return {
            success: false,
            message: getNewsletterMessage('internalError', language),
            errors: {
                general: [getNewsletterMessage('internalError', language)]
            }
        }
    }
}

/**
 * Ajoute un contact à la base de données Brevo
 * @param email - L'adresse email du contact
 * @returns Résultat de l'opération
 */
async function addContactToBrevo(email: string, language: string = 'fr'): Promise<{ success: boolean; message: string }> {
    try {
        // Configuration de l'API Brevo
        const brevoApiKey = process.env.BREVO_API_KEY

        // Obtenir l'ID de liste newsletter selon la langue
        const brevoListId = getBrevoNewsletterListId(language)

        if (!brevoApiKey) {
            console.error('❌ Clé API Brevo manquante')
            return {
                success: false,
                message: getNewsletterMessage('configurationError', language)
            }
        }

        // Utilisation de l'API Brevo avec fetch (pour éviter les dépendances externes)
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
                    SOURCE: BREVO_CONTACT_ATTRIBUTES.NEWSLETTER_SOURCE
                }
            })
        })

        if (!brevoResponse.ok) {
            const errorData = await brevoResponse.json().catch(() => ({}))

            // Gestion des erreurs spécifiques de Brevo
            if (brevoResponse.status === 400 && errorData.code === 'duplicate_parameter') {
                return {
                    success: true,
                    message: getNewsletterMessage('alreadySubscribed', language)
                }
            }

            // Gestion des erreurs d'IP non autorisée (401)
            if (brevoResponse.status === 401) {
                console.error('❌ Erreur IP Brevo: 401', errorData)
                console.error('💡 Solution: Désactiver les restrictions IP dans Brevo ou configurer les IP ranges de Vercel')
                console.error('📖 Voir docs/vercel-ip-ranges.md pour plus d\'informations')

                return {
                    success: false,
                    message: getNewsletterMessage('serviceUnavailable', language)
                }
            }

            console.error('❌ Erreur API Brevo:', brevoResponse.status, errorData)
            return {
                success: false,
                message: getNewsletterMessage('subscriptionError', language)
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
                    console.log(`✅ Contact ajouté avec succès à Brevo (liste ${brevoListId} - ${language.toUpperCase()}):`, responseData.id || 'ID non fourni')
                } else {
                    console.log(`✅ Contact ajouté avec succès à Brevo (liste ${brevoListId} - ${language.toUpperCase()}) - réponse vide`)
                }
            } catch (parseError) {
                console.log(`✅ Contact ajouté avec succès à Brevo (liste ${brevoListId} - ${language.toUpperCase()}) - JSON non parsable, mais succès confirmé`)
            }
        } else {
            console.log(`✅ Contact ajouté avec succès à Brevo (liste ${brevoListId} - ${language.toUpperCase()}) - pas de JSON retourné`)
        }

        return {
            success: true,
            message: getNewsletterMessage('success', language)
        }

    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout du contact à Brevo:', error)
        return {
            success: false,
            message: getNewsletterMessage('connectionError', language)
        }
    }
}

/**
 * Version alternative utilisant le SDK Brevo (à utiliser après installation du package)
 * Décommentez cette fonction et commentez la version fetch ci-dessus
 */
/*
async function addContactToBrevoSDK(email: string, language: string = 'fr'): Promise<{ success: boolean; message: string }> {
  try {
    const brevo = require('@getbrevo/brevo')
    
    // Configuration de l'API
    const apiInstance = new brevo.ContactsApi()
    const apiKey = apiInstance.authentications['api-key']
    apiKey.apiKey = process.env.BREVO_API_KEY

    // Déterminer l'ID de liste selon la langue
    const getListIdByLanguage = (lang: string): number => {
        return lang.toLowerCase() === 'en' ? 15 : 14 // 15 pour EN, 14 pour FR
    }

    // Création du contact
    const createContact = new brevo.CreateContact()
    createContact.email = email
    createContact.listIds = [getListIdByLanguage(language)]
    createContact.updateEnabled = true
    createContact.attributes = {
      FIRSTNAME: '',
      LASTNAME: '',
      LANGUAGE: language.toUpperCase(),
      SOURCE: 'Website Newsletter Popup'
    }

    const response = await apiInstance.createContact(createContact)
    console.log('✅ Contact créé avec succès:', response.id)

    return {
      success: true,
      message: getNewsletterMessage('success', language)
    }

  } catch (error: any) {
    if (error.response && error.response.statusCode === 400) {
      // Contact déjà existant
      return {
        success: true,
        message: getNewsletterMessage('alreadySubscribed', language)
      }
    }

    console.error('❌ Erreur SDK Brevo:', error)
    return {
      success: false,
      message: getNewsletterMessage('subscriptionError', language)
    }
  }
}
*/ 