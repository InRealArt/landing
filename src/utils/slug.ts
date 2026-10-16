/**
 * Slug d'URL : « L'Ascension de l'Amour » → « lascension-de-lamour ».
 * Source unique pour les fiches œuvres (/artwork/<slug>), le sitemap et le JSON-LD.
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD') // Décompose les caractères accentués
    .replace(/[̀-ͯ]/g, '') // Retire les accents
    .replace(/[^\w\s-]/g, '') // Retire les caractères spéciaux
    .replace(/\s+/g, '-') // Espaces → -
    .replace(/-+/g, '-') // -- → -
}
