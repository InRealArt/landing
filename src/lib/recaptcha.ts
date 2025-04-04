/**
 * Utilitaire pour la gestion de Google reCAPTCHA v3
 */

// Vérifie si un token reCAPTCHA est valide
export async function verifyRecaptchaToken(token: string): Promise<boolean> {
    try {
        // Clé secrète reCAPTCHA (à récupérer depuis les variables d'environnement)
        const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY

        if (!recaptchaSecretKey) {
            console.error('La clé secrète reCAPTCHA n\'est pas configurée')
            return false
        }

        // Appel à l'API de vérification de Google
        const response = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${token}`,
            { method: 'POST' }
        )

        const data = await response.json()

        // Vérification du score (0.0 à 1.0, où 1.0 est probablement humain)
        // On peut ajuster le seuil selon les besoins
        if (data.success && data.score >= 0.5) {
            return true
        }

        return false
    } catch (error) {
        console.error('Erreur lors de la vérification du token reCAPTCHA:', error)
        return false
    }
}

// Hook client pour exécuter reCAPTCHA
export const executeRecaptcha = async (): Promise<string> => {
    // Vérifier si l'API reCAPTCHA est chargée
    if (typeof window === 'undefined' || !window.grecaptcha || !window.grecaptcha.execute) {
        throw new Error('reCAPTCHA n\'est pas chargé')
    }

    try {
        // Clé site reCAPTCHA (à récupérer depuis les variables d'environnement côté client)
        const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

        if (!recaptchaSiteKey) {
            throw new Error('La clé site reCAPTCHA n\'est pas configurée')
        }

        // Exécuter reCAPTCHA et récupérer le token
        const token = await window.grecaptcha.execute(recaptchaSiteKey, { action: 'newsletter_subscribe' })
        return token
    } catch (error) {
        console.error('Erreur lors de l\'exécution de reCAPTCHA:', error)
        throw error
    }
}

// Fonction pour charger le script reCAPTCHA v3
export const loadRecaptchaScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Vérifier si le script est déjà chargé
        if (typeof window !== 'undefined' && window.grecaptcha && window.grecaptcha.ready) {
            window.grecaptcha.ready(() => resolve())
            return
        }

        try {
            // Clé site reCAPTCHA
            const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

            if (!recaptchaSiteKey) {
                reject(new Error('La clé site reCAPTCHA n\'est pas configurée'))
                return
            }

            // Créer un élément script
            const script = document.createElement('script')
            script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`
            script.async = true
            script.defer = true

            // Gérer les événements pour résoudre ou rejeter la promesse
            script.onload = () => {
                if (window.grecaptcha) {
                    window.grecaptcha.ready(() => resolve())
                } else {
                    reject(new Error('reCAPTCHA n\'a pas pu être chargé'))
                }
            }
            script.onerror = () => reject(new Error('Erreur lors du chargement de reCAPTCHA'))

            // Ajouter le script à la page
            document.head.appendChild(script)
        } catch (error) {
            reject(error)
        }
    })
}

// Ajout du type pour l'objet window pour TypeScript
declare global {
    interface Window {
        grecaptcha: {
            ready: (callback: () => void) => void
            execute: (siteKey: string, options: { action: string }) => Promise<string>
        }
    }
} 