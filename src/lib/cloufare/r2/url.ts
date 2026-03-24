const FIREBASE_HOSTNAME = 'firebasestorage.googleapis.com'

/**
 * Convertit une URL Firebase Storage en URL R2 équivalente.
 * Extrait le chemin relatif du bucket Firebase et le préfixe avec l'URL publique R2.
 * Les deux buckets partagent la même arborescence de chemins.
 *
 * @param firebaseUrl - URL Firebase ex: "https://firebasestorage.googleapis.com/v0/b/BUCKET/o/artists%2Ffoo.webp?alt=media&token=..."
 * @returns URL R2 ex: "https://pub-xxx.r2.dev/artists/foo.webp" ou null si l'extraction échoue
 */
export function firebaseUrlToR2(firebaseUrl: string): string | null {
  try {
    const url = new URL(firebaseUrl)
    if (url.hostname !== FIREBASE_HOSTNAME) return null

    const match = url.pathname.match(/\/o\/(.+)$/)
    if (!match) return null

    const relativePath = decodeURIComponent(match[1])
    const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? ''
    return `${baseUrl}/${relativePath}`
  } catch {
    return null
  }
}

/**
 * Construit l'URL publique absolue depuis un chemin relatif stocké en BDD.
 *
 * Gère la période de transition :
 * - Les URLs Firebase sont converties vers R2 (même chemin, base différente)
 * - Les URLs R2 absolues sont retournées telles quelles
 * - Les chemins relatifs sont préfixés avec l'URL R2
 *
 * @param relativePath - chemin relatif ex: "artists/Jean Dupont/profile.webp"
 *                       ou URL absolue legacy ex: "https://firebasestorage.googleapis.com/..."
 * @returns URL absolue R2 ou null si la valeur d'entrée est vide/null/undefined
 */
export function getImageUrl(relativePath: string | null | undefined): string | null {
  if (!relativePath) return null

  if (relativePath.startsWith('https://') || relativePath.startsWith('http://')) {
    // Convertir les URLs Firebase vers R2
    try {
      const url = new URL(relativePath)
      if (url.hostname === FIREBASE_HOSTNAME) {
        return firebaseUrlToR2(relativePath) ?? relativePath
      }
    } catch {}
    // URL absolue non-Firebase (déjà R2 ou autre) : retourner telle quelle
    return relativePath
  }

  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? ''
  return `${baseUrl}/${relativePath}`
}
