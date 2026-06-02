'use server'

import { z } from 'zod'
import { sendEmailViaBrevo } from '@/utils/emailTemplates'
import { verifyRecaptchaToken } from '@/lib/recaptcha'

const mediaProductionSchema = z.object({
  name: z.string().min(2),
  projectType: z.enum(['portrait', 'reportage', 'campaign', 'other']),
  subject: z.string().min(2),
  date: z.string().min(1),
  email: z.string().email(),
  message: z.string().max(1000),
  rgpd: z.literal(true),
  recaptchaToken: z.string().optional(),
})

export type MediaProductionInput = z.infer<typeof mediaProductionSchema>

export type MediaProductionResult =
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

type ProductionData = Omit<MediaProductionInput, 'recaptchaToken'>

function buildEmailHtml(data: ProductionData): string {
  const gold = '#b89c72'
  const dark = '#131313'
  const gray = '#888888'
  const date = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const TYPE_LABELS: Record<string, string> = {
    portrait: 'Portrait artiste',
    reportage: 'Reportage événement',
    campaign: 'Campagne Full',
    other: 'Autre',
  }

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 16px 8px 0;color:${gray};font-size:11px;text-transform:uppercase;letter-spacing:0.12em;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;color:#222222;font-size:13px;vertical-align:top;">${value}</td>
    </tr>`

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8" /><title>Demande Production — InRealArt</title></head>
<body style="margin:0;padding:0;background-color:#f9f5ee;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f5ee;padding:40px 20px;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border:1px solid #e8e0d0;">
        <tr>
          <td style="background:${dark};padding:32px 40px;">
            <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:#ffffff;letter-spacing:0.4em;font-weight:300;">InRealArt</p>
            <p style="margin:8px 0 0;font-size:10px;text-transform:uppercase;letter-spacing:0.25em;color:${gold};">Média — Demande de production</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 24px;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:${gray};">Reçu le ${date}</p>
            <table style="width:100%;border-collapse:collapse;">
              ${row('Nom & structure', esc(data.name))}
              ${row('Email', `<a href="mailto:${esc(data.email)}" style="color:${gold};text-decoration:none;">${esc(data.email)}</a>`)}
              ${row('Type de projet', esc(TYPE_LABELS[data.projectType] ?? data.projectType))}
              ${row('Sujet / Artiste', esc(data.subject))}
              ${row('Date souhaitée', esc(data.date))}
              ${row('Précisions', `<span style="white-space:pre-wrap;">${esc(data.message)}</span>`)}
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function submitMediaProduction(input: MediaProductionInput): Promise<MediaProductionResult> {
  const parsed = mediaProductionSchema.safeParse(input)

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
      `Production — ${data.name.replace(/[^\w\s\-.,]/g, '')} · ${data.projectType}`,
      buildEmailHtml(data)
    )
    return { success: true }
  } catch {
    return { success: false, error: 'server_error' }
  }
}
