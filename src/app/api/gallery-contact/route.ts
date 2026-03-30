import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmailViaBrevo } from '@/utils/emailTemplates'

// ─── Zod schema ──────────────────────────────────────────────────────────────

const galleryContactSchema = z.object({
  galleryName: z.string().min(2, 'validationErrors.galleryName.min'),
  email: z.string().email('validationErrors.email.invalid'),
  profile: z.string().min(10, 'validationErrors.profile.min'),
})

// ─── Email template ───────────────────────────────────────────────────────────

function createGalleryContactEmailHtml(
  data: z.infer<typeof galleryContactSchema>
): string {
  const gold = '#b89c72'
  const dark = '#131313'
  const mid = '#1d1c1c'
  const light = '#f5f0e8'
  const gray = '#888888'
  const date = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const row = (label: string, value: string | undefined | null) => {
    if (!value) return ''
    return `
      <tr>
        <td style="padding:8px 16px 8px 0;color:${gray};font-size:11px;text-transform:uppercase;letter-spacing:0.12em;white-space:nowrap;vertical-align:top;">${label}</td>
        <td style="padding:8px 0;color:#222222;font-size:13px;vertical-align:top;">${value}</td>
      </tr>`
  }

  const section = (number: string, title: string, rows: string) => `
    <div style="margin-bottom:32px;">
      <div style="border-bottom:1px solid #e8e0d0;padding-bottom:10px;margin-bottom:16px;display:flex;align-items:baseline;gap:12px;">
        <span style="font-family:Georgia,serif;font-style:italic;color:${gold};font-size:22px;">${number}</span>
        <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.25em;color:${dark};font-weight:700;">${title}</span>
      </div>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
    </div>`

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Demande de partenariat galerie — InRealArt</title>
</head>
<body style="margin:0;padding:0;background-color:#f9f5ee;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f5ee;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:${dark};padding:40px 40px 32px;">
              <div style="border-bottom:1px solid ${gold};padding-bottom:24px;margin-bottom:24px;">
                <p style="margin:0 0 6px;font-size:9px;text-transform:uppercase;letter-spacing:0.3em;color:${gold};">InRealArt</p>
                <h1 style="margin:0;font-family:Georgia,serif;font-style:italic;font-weight:400;font-size:32px;color:#ffffff;line-height:1.2;">Demande de partenariat<br /><em style="color:${gold};">Galerie</em></h1>
              </div>
              <p style="margin:0;font-size:11px;color:${gray};text-transform:uppercase;letter-spacing:0.15em;">${date}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px 40px 32px;">

              ${section('01', 'Informations de la galerie', [
                row('Nom de la galerie', data.galleryName),
                row('Email de contact', `<a href="mailto:${data.email}" style="color:${gold};text-decoration:none;">${data.email}</a>`),
                row('Profil et artistes', data.profile.replace(/\n/g, '<br />')),
              ].join(''))}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${light};padding:24px 40px;border-top:1px solid #e8e0d0;">
              <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:${dark};font-weight:700;">InRealArt</p>
              <p style="margin:0;font-size:11px;color:${gray};">Ce message est généré automatiquement suite à la soumission du formulaire de contact galerie.</p>
              <p style="margin:8px 0 0;font-size:11px;color:${mid};">
                <a href="https://inrealart.com" style="color:${gold};text-decoration:none;">inrealart.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = galleryContactSchema.parse(body)

    // Send notification email
    const htmlContent = createGalleryContactEmailHtml(data)
    await sendEmailViaBrevo(
      'teaminrealart@gmail.com',
      `Demande de partenariat galerie — ${data.galleryName}`,
      htmlContent
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[gallery-contact] error:', error)

    if (error instanceof z.ZodError) {
      // Map Zod errors to translatable keys
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const field = err.path[0] as string
        if (!errors[field]) {
          errors[field] = err.message
        }
      })
      return NextResponse.json(
        { success: false, message: 'validationErrors.generic.invalidData', errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'validationErrors.generic.internalError' },
      { status: 500 }
    )
  }
}
