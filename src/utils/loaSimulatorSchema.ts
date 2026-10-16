import { z } from 'zod'

/**
 * Schéma partagé des routes /api/loa-simulator/* (IRA-18).
 * Coordonnées facultatives : le résultat s'affiche sans elles ; longueurs bornées (contenu repris dans les e-mails).
 */
export const loaFormDataSchema = z.object({
  company: z.string().trim().max(120),
  email: z.union([z.literal(''), z.string().trim().email().max(254)]),
  phoneNumber: z.string().trim().max(30),
  taxRate: z.number().min(0).max(100),
  artworkValue: z.number().positive().max(1_000_000_000),
  leaseDuration: z.number().int().min(1).max(240),
  firstRentIncrease: z.boolean(),
})

export const loaSimulationSchema = z.object({
  formData: loaFormDataSchema,
  leaseResults: z.object({
    monthlyRent: z.number(),
    firstMonthRent: z.number(),
    totalLeaseAmount: z.number(),
    taxSavings: z.number(),
    netCostAfterTax: z.number(),
    monthlyTaxDeduction: z.number(),
  }),
  comparison: z.object({
    purchasePrice: z.number(),
    leaseCost: z.number(),
    savings: z.number(),
    savingsPercentage: z.number(),
  }),
})

/** Routes qui envoient un e-mail : jeton reCAPTCHA v3 obligatoire */
export const loaSimulationWithRecaptchaSchema = loaSimulationSchema.extend({
  recaptchaToken: z.string().min(1),
})
