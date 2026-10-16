/**
 * Nom d'usage unique d'un artiste (IRA-13) : le pseudo s'il existe, sinon « Prénom Nom ».
 * À utiliser partout où un nom d'artiste est affiché (métadonnées, JSON-LD, cartes, fiches).
 */
export function getArtistDisplayName(artist: {
  pseudo?: string | null
  name?: string | null
  surname?: string | null
}): string {
  const pseudo = artist.pseudo?.trim()
  if (pseudo) return pseudo
  return [artist.name, artist.surname].map(part => part?.trim()).filter(Boolean).join(' ')
}
