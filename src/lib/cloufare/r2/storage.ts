"use client"

import { getImageUrl } from './url'


/**
 * Obtient une presigned PUT URL depuis la Route Handler et retourne {uploadUrl, relativePath}
 */
async function getPresignedUploadUrl(
    storagePath: string,
    contentType: string
): Promise<{ uploadUrl: string; relativePath: string }> {
    const response = await fetch('/api/r2/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storagePath, contentType }),
    })

    if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || `Erreur HTTP ${response.status} lors de la génération de la presigned URL`)
    }

    return response.json()
}



/**
 * Extrait le chemin de stockage à partir d'une URL Firebase
 * Conservée pour la future migration BDD (les URLs existantes sont encore Firebase)
 *
 * @param url - URL Firebase Storage ou R2
 * @returns Le chemin de stockage extrait ou null si non trouvé
 */
export function extractFirebaseStoragePath(url: string): string | null {
    try {
        console.log('🔍 [extractFirebaseStoragePath] Extraction du chemin depuis:', url);

        // Les URLs Firebase Storage contiennent généralement un paramètre token
        // Format: https://firebasestorage.googleapis.com/v0/b/BUCKET/o/PATH?alt=media&token=TOKEN
        // Le PATH peut être encodé (ex: artists%2FJean%20Dupont%2Fmarketplace%2Fclose_up%2F...)

        // Essayer plusieurs patterns pour être plus robuste
        let match = url.match(/firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/([^?]+)/);

        if (!match) {
            // Essayer un autre format possible
            match = url.match(/\/o\/([^?]+)/);
        }

        if (!match) {
            // Essayer avec le format gs://
            if (url.startsWith('gs://')) {
                const gsMatch = url.match(/gs:\/\/[^/]+\/(.+)/);
                if (gsMatch && gsMatch[1]) {
                    const decodedPath = decodeURIComponent(gsMatch[1]);
                    console.log('✅ [extractFirebaseStoragePath] Chemin extrait (gs://):', decodedPath);
                    return decodedPath;
                }
            }
        }

        if (match && match[1]) {
            // Décoder l'URL (Firebase encode les '/' en '%2F' et les espaces en '%20')
            let decodedPath = match[1];
            try {
                decodedPath = decodeURIComponent(decodedPath);
                // Si le décodage a fonctionné mais qu'il y a encore des %2F, essayer une deuxième fois
                if (decodedPath.includes('%2F') || decodedPath.includes('%20')) {
                    decodedPath = decodeURIComponent(decodedPath);
                }
            } catch (decodeError) {
                console.warn('⚠️ [extractFirebaseStoragePath] Erreur lors du décodage, utilisation du chemin brut:', decodeError);
            }

            console.log('✅ [extractFirebaseStoragePath] Chemin extrait:', decodedPath);
            return decodedPath;
        }

        console.error('❌ [extractFirebaseStoragePath] Aucun match trouvé dans l\'URL');
        console.error('❌ [extractFirebaseStoragePath] Format d\'URL attendu: https://firebasestorage.googleapis.com/v0/b/BUCKET/o/PATH?alt=media&token=TOKEN');
        return null;
    } catch (error) {
        console.error('❌ [extractFirebaseStoragePath] Erreur lors de l\'extraction du chemin Firebase:', error);
        return null;
    }
}


/**
 * ensureFolderExists — R2 n'a pas de notion de dossier vide.
 * Retourne toujours true pour maintenir la compatibilité avec les composants existants.
 *
 * @param _folderPath - Chemin du répertoire (ignoré)
 * @param _name - Prénom de l'artiste (ignoré)
 * @param _surname - Nom de l'artiste (ignoré)
 * @returns Promise<true>
 */
export async function ensureFolderExists(
    _folderPath: string,
    _name: string,
    _surname: string
): Promise<boolean> {
    // R2 n'a pas de notion de dossier vide : les "dossiers" sont implicites.
    // On retourne toujours true pour maintenir la compatibilité.
    return true
}

