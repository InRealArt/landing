'use server'

interface BrevoContactOptions {
  email: string;
  listId: number;
  language?: string;
  source?: string;
  firstName?: string;
  lastName?: string;
  additionalAttributes?: Record<string, any>;
}

/**
 * Generic function to add a contact to Brevo
 * @param options - Contact options including email, listId, language, source, etc.
 * @returns Result of the operation
 */
export async function addContactToBrevo(options: BrevoContactOptions): Promise<{ success: boolean; message: string }> {
  const {
    email,
    listId,
    language = 'fr',
    source = 'Website',
    firstName = '',
    lastName = '',
    additionalAttributes = {}
  } = options;

  try {
    // Configuration de l'API Brevo
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      console.error('❌ Clé API Brevo manquante');
      return {
        success: false,
        message: language === 'en' 
          ? 'Service configuration error'
          : 'Configuration manquante pour l\'abonnement'
      };
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
        listIds: [listId],
        updateEnabled: true, // Met à jour le contact s'il existe déjà
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: lastName,
          LANGUAGE: language.toUpperCase(),
          SOURCE: source,
          ...additionalAttributes
        }
      })
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json().catch(() => ({}));

      // Gestion des erreurs spécifiques de Brevo
      if (brevoResponse.status === 400 && errorData.code === 'duplicate_parameter') {
        return {
          success: true,
          message: language === 'en'
            ? 'Contact already exists'
            : 'Contact déjà existant'
        };
      }

      // Gestion des erreurs d'IP non autorisée (401)
      if (brevoResponse.status === 401) {
        console.error('❌ Erreur IP Brevo: 401', errorData);
        return {
          success: false,
          message: language === 'en'
            ? 'Service temporarily unavailable'
            : 'Service temporairement indisponible'
        };
      }

      console.error('❌ Erreur API Brevo:', brevoResponse.status, errorData);
      return {
        success: false,
        message: language === 'en'
          ? 'Error adding contact'
          : 'Erreur lors de l\'ajout du contact'
      };
    }

    // Vérifier si la réponse contient du JSON avant de parser
    let responseData = null;
    const contentType = brevoResponse.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      try {
        const responseText = await brevoResponse.text();
        if (responseText && responseText.trim()) {
          responseData = JSON.parse(responseText);
          console.log(`✅ Contact ajouté avec succès à Brevo (liste ${listId} - ${language.toUpperCase()}):`, responseData.id || 'ID non fourni');
        } else {
          console.log(`✅ Contact ajouté avec succès à Brevo (liste ${listId} - ${language.toUpperCase()}) - réponse vide`);
        }
      } catch (parseError) {
        console.log(`✅ Contact ajouté avec succès à Brevo (liste ${listId} - ${language.toUpperCase()}) - JSON non parsable, mais succès confirmé`);
      }
    } else {
      console.log(`✅ Contact ajouté avec succès à Brevo (liste ${listId} - ${language.toUpperCase()}) - pas de JSON retourné`);
    }

    return {
      success: true,
      message: language === 'en'
        ? 'Contact added successfully'
        : 'Contact ajouté avec succès'
    };

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout du contact à Brevo:', error);
    return {
      success: false,
      message: language === 'en'
        ? 'Connection error to subscription service'
        : 'Erreur de connexion au service d\'abonnement'
    };
  }
}
