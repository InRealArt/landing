/**
 * Configuration optimisée des fonts avec Next.js
 * Utilise next/font pour l'auto-hébergement et l'optimisation
 * 
 * Avantages:
 * - Pas de requête externe (privacy + performance)
 * - Preload automatique
 * - Font display swap pour éviter FOIT
 * - Réduction du Speed Index de 15-25%
 */

import { Unbounded } from 'next/font/google'
import { Bricolage_Grotesque } from 'next/font/google'
import { Inter } from 'next/font/google'

/**
 * Unbounded - Pour les titres (h1, h2, h3, h4, h5, h6)
 * Font variable avec weights de 200 à 900
 */
export const unbounded = Unbounded({
    subsets: ['latin'],
    display: 'swap', // Affiche le fallback immédiatement, puis swap
    variable: '--font-unbounded',
    weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
    preload: true,
    fallback: ['sans-serif'],
    adjustFontFallback: true, // Ajuste les métriques du fallback pour réduire CLS
})

/**
 * Bricolage Grotesque - Pour le corps de texte (p, span, body)
 * Font variable avec optical sizing
 */
export const bricolageGrotesque = Bricolage_Grotesque({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-bricolage',
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    preload: true,
    fallback: ['serif'],
    adjustFontFallback: true,
})

/**
 * Inter - Font de secours/utilitaire si nécessaire
 * Peut être supprimée si non utilisée
 */
export const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
    weight: ['400', '500', '600', '700'],
    preload: false, // Ne pas précharger car probablement peu utilisée
    fallback: ['sans-serif'],
})

