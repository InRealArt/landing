'use server'

import { z } from 'zod'
import { sendEmailViaBrevo } from '@/utils/emailTemplates'
import { verifyRecaptchaToken } from '@/lib/recaptcha'

const briefSchema = z.object({
  company: z.string().min(2),
  projectType: z.enum(['ugc', 'campaign', 'partnership', 'event']),
  vertical: z.enum(['luxury', 'lifestyle', 'cultural', 'institutional', 'other']),
  platforms: z.array(z.enum(['instagram', 'tiktok', 'youtube', 'linkedin', 'print'])).min(1),
  budget: z.enum(['under2k', '2to5k', '5to15k', 'above15k']),
  deadline: z.string().min(1),
  description: z.string().max(500),
  email: z.string().email(),
  rgpd: z.literal(true),
  recaptchaToken: z.string().optional(),
})

export type AgenceBriefInput = z.infer<typeof briefSchema>

export type AgenceBriefResult =
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

type BriefData = Omit<AgenceBriefInput, 'recaptchaToken'>

function buildEmailHtml(data: BriefData): string {
  const gold = '#b89c72'
  const dark = '#131313'
  const gray = '#888888'
  const date = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const BUDGET_LABELS: Record<string, string> = {
    under2k: '< 2 000 €', '2to5k': '2 000 – 5 000 €',
    '5to15k': '5 000 – 15 000 €', above15k: '15 000 €+',
  }

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 16px 8px 0;color:${gray};font-size:11px;text-transform:uppercase;letter-spacing:0.12em;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;color:#222222;font-size:13px;vertical-align:top;">${value}</td>
    </tr>`

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8" /><title>Brief Agence — InRealArt</title></head>
<body style="margin:0;padding:0;background-color:#f9f5ee;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f5ee;padding:40px 20px;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border:1px solid #e8e0d0;">
        <tr>
          <td style="background:${dark};padding:32px 40px;">
            <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:#ffffff;letter-spacing:0.4em;font-weight:300;">InRealArt</p>
            <p style="margin:8px 0 0;font-size:10px;text-transform:uppercase;letter-spacing:0.25em;color:${gold};">Agence Créateurs — Nouveau brief</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 24px;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:${gray};">Reçu le ${date}</p>
            <table style="width:100%;border-collapse:collapse;">
              ${row('Entreprise', esc(data.company))}
              ${row('Email', `<a href="mailto:${esc(data.email)}" style="color:${gold};text-decoration:none;">${esc(data.email)}</a>`)}
              ${row('Type de projet', esc(data.projectType))}
              ${row('Verticale', esc(data.vertical))}
              ${row('Plateformes', esc(data.platforms.join(', ')))}
              ${row('Budget', esc(BUDGET_LABELS[data.budget] ?? data.budget))}
              ${row('Deadline', esc(data.deadline))}
              ${row('Description', `<span style="white-space:pre-wrap;">${esc(data.description)}</span>`)}
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function submitAgenceBrief(input: AgenceBriefInput): Promise<AgenceBriefResult> {
  const parsed = briefSchema.safeParse(input)

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
      `Brief Agence — ${data.company.replace(/[^\w\s\-.,]/g, '')} · ${data.projectType}`,
      buildEmailHtml(data)
    )
    return { success: true }
  } catch {
    return { success: false, error: 'server_error' }
  }
}
