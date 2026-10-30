import { z } from 'zod'

const percentage = z.number().min(0).max(100)

/**
 * Saisies du simulateur Patrimoine envoyées aux routes /api/heritage-art-simulator/*.
 * Le serveur recalcule la recommandation à partir de ces saisies : il ne fait pas confiance
 * aux résultats calculés dans le navigateur. Longueurs bornées (contenu repris dans les e-mails).
 */
export const heritageArtInputsSchema = z.object({
  immobilier: percentage,
  liquidites: percentage,
  financier: percentage,
  tangibles: percentage,
  profil: z.enum(['Prudent', 'Équilibré', 'Dynamique']),
  objectif: z.enum(['Diversification', 'Transmission', 'Fiscalité', 'Passion']),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(1).max(30),
}).refine(
  ({ immobilier, liquidites, financier, tangibles }) => immobilier + liquidites + financier + tangibles === 100,
  { message: 'La répartition doit totaliser 100%' }
)

/** Routes qui envoient un e-mail : jeton reCAPTCHA v3 obligatoire */
export const heritageArtRequestSchema = z.object({
  formData: heritageArtInputsSchema,
  recaptchaToken: z.string().min(1),
})
