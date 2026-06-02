'use server'

import { z } from 'zod'
import { sendEmailViaBrevo } from '@/utils/emailTemplates'
import { verifyRecaptchaToken } from '@/lib/recaptcha'

const capitalContactSchema = z.object({
  company: z.string().min(2),
  sector: z.enum(['hotel', 'real_estate', 'sme', 'large_group', 'other']),
  companySize: z.enum(['s1', 's2', 's3', 's4']),
  budget: z.enum(['b1', 'b2', 'b3', 'b4']),
  need: z.enum(['leasing', 'investment', 'advisory', 'other']),
  message: z.string().max(1000),
  email: z.string().email(),
  rgpd: z.literal(true),
  recaptchaToken: z.string().optional(),
})

export type CapitalContactInput = z.infer<typeof capitalContactSchema>

export type CapitalContactResult =
  | { success: true }
  | { success: false; error: 'invalid_data' | 'recaptcha_failed' | 'server_error' }

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

type ContactData = Omit<CapitalContactInput, 'recaptchaToken'>

function buildEmailHtml(data: ContactData): string {
  const gold = '#b89c72'
  const dark = '#131313'
  const gray = '#888888'
  const date = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const SECTOR_LABELS: Record<string, string> = {
    hotel: 'Hôtellerie', real_estate: 'Immobilier',
    sme: 'PME', large_group: 'Grand groupe', other: 'Autre',
  }
  const SIZE_LABELS: Record<string, string> = {
    s1: '1–10', s2: '10–50', s3: '50–250', s4: '250+',
  }
  const BUDGET_LABELS: Record<string, string> = {
    b1: '< 5 000 €', b2: '5 000 – 20 000 €', b3: '20 000 – 50 000 €', b4: '50 000 €+',
  }
  const NEED_LABELS: Record<string, string> = {
    leasing: "Leasing d'œuvres", investment: 'Investissement',
    advisory: 'Conseil', other: 'Autre',
  }

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 16px 8px 0;color:${gray};font-size:11px;text-transform:uppercase;letter-spacing:0.12em;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;color:#222222;font-size:13px;vertical-align:top;">${value}</td>
    </tr>`

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8" /><title>Contact Capital — InRealArt</title></head>
<body style="margin:0;padding:0;background-color:#f9f5ee;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f5ee;padding:40px 20px;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border:1px solid #e8e0d0;">
        <tr>
          <td style="background:${dark};padding:32px 40px;">
            <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:#ffffff;letter-spacing:0.4em;font-weight:300;">InRealArt</p>
            <p style="margin:8px 0 0;font-size:10px;text-transform:uppercase;letter-spacing:0.25em;color:${gold};">Capital — Nouvelle demande</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 24px;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:${gray};">Reçu le ${date}</p>
            <table style="width:100%;border-collapse:collapse;">
              ${row('Entreprise', esc(data.company))}
              ${row('Email', `<a href="mailto:${esc(data.email)}" style="color:${gold};text-decoration:none;">${esc(data.email)}</a>`)}
              ${row('Secteur', esc(SECTOR_LABELS[data.sector] ?? data.sector))}
              ${row('Taille', esc(SIZE_LABELS[data.companySize] ?? data.companySize))}
              ${row('Budget LOA', esc(BUDGET_LABELS[data.budget] ?? data.budget))}
              ${row('Besoin', esc(NEED_LABELS[data.need] ?? data.need))}
              ${row('Message', `<span style="white-space:pre-wrap;">${esc(data.message)}</span>`)}
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function submitCapitalContact(input: CapitalContactInput): Promise<CapitalContactResult> {
  const parsed = capitalContactSchema.safeParse(input)

  if (!parsed.success) {
    return { success: false, error: 'invalid_data' }
  }

  const { recaptchaToken, ...data } = parsed.data

  if (recaptchaToken) {
    const isValid = await verifyRecaptchaToken(recaptchaToken)
    if (!isValid) {
      return { success: false, error: 'recaptcha_failed' }
    }
  }

  try {
    await sendEmailViaBrevo(
      'teaminrealart@gmail.com',
      `Capital Contact — ${data.company.replace(/[^\w\s\-.,]/g, '')} · ${data.need}`,
      buildEmailHtml(data)
    )
    return { success: true }
  } catch {
    return { success: false, error: 'server_error' }
  }
}
