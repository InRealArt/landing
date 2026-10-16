/**
 * Sérialise un objet JSON-LD pour un <script type="application/ld+json">.
 * `<` est échappé : un contenu venant de la base (« </script> ») ne peut pas fermer la balise.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/** Texte brut pour le JSON-LD : balises HTML retirées, espaces normalisés */
export function toPlainText(html: string | null | undefined): string {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&') // en dernier : « &amp;lt; » doit donner « &lt; »
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * URL valide pour le JSON-LD : encode espaces et accents (« Ophélie SIMONET/x.webp »)
 * sans ré-encoder les séquences %XX déjà présentes. null si l'URL est inexploitable.
 */
export function toJsonLdUrl(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    return new URL(url).href
  } catch {
    return null
  }
}
