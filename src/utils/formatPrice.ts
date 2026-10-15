const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

/** « 24 000 € » ; null si pas de prix exploitable */
export function formatPrice(price: number | null | undefined): string | null {
  if (price == null || price <= 0) return null
  return eur.format(price)
}
