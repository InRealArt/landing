import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendEmailViaBrevo } from '@/utils/emailTemplates'

// ─── Zod schema ──────────────────────────────────────────────────────────────

const artistApplicationSchema = z.object({
  // Section 1
  fullName: z.string().min(2),
  artistName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(4),
  portfolioLinks: z.string().min(2),

  // Section 2
  careerDescription: z.string().min(10),
  stylesAndMediums: z.string().min(5),
  artisticMessage: z.string().min(10),

  // Section 3
  hasPhysicalWorks: z.boolean(),
  physicalWorksCount: z.string().optional(),
  canProduceWorks: z.string().optional(),
  worksProducedPerYear: z.string().optional(),
  worksSoldLastYear: z.string().optional(),
  averageSellingPrice: z.string().optional(),
  annualRevenue: z.string().optional(),
  worksSoldAnnually: z.string().optional(),
  seasonalPatterns: z.string().optional(),
  directVsGalleryPercent: z.string().optional(),
  salesChannels: z.string().optional(),
  marketplacePresence: z.string().optional(),
  newsletterSubscribers: z.string().optional(),
  socialMediaFollowers: z.string().optional(),
  websiteUniqueVisitors: z.string().optional(),

  // Section 4
  hasLegalRestrictions: z.boolean(),
  willingToPromote: z.boolean(),
})

// ─── Email template ───────────────────────────────────────────────────────────

function createArtistApplicationEmailHtml(
  data: z.infer<typeof artistApplicationSchema>
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

  const boolLabel = (val: boolean) => (val ? 'Oui' : 'Non')

  const section = (number: string, title: string, rows: string) => `
    <div style="margin-bottom:32px;">
      <div style="border-bottom:1px solid #e8e0d0;padding-bottom:10px;margin-bottom:16px;display:flex;align-items:baseline;gap:12px;">
        <span style="font-family:Georgia,serif;font-style:italic;color:${gold};font-size:22px;">${number}</span>
        <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.25em;color:${dark};font-weight:700;">${title}</span>
      </div>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
    </div>`

  const optionalSection3Rows = [
    data.hasPhysicalWorks && data.physicalWorksCount ? row('Œuvres disponibles', data.physicalWorksCount) : '',
    !data.hasPhysicalWorks && data.canProduceWorks ? row('Capacité de production', data.canProduceWorks) : '',
    row('Production / an', data.worksProducedPerYear),
    row('Vendues (12 mois)', data.worksSoldLastYear),
    row('Prix de vente moyen', data.averageSellingPrice),
    row('CA annuel', data.annualRevenue),
    row('Vendues / an', data.worksSoldAnnually),
    row('Saisonnalité', data.seasonalPatterns),
    row('Vente directe vs galeries', data.directVsGalleryPercent),
    row('Canaux de vente', data.salesChannels),
    row('Marketplaces', data.marketplacePresence),
    row('Abonnés newsletter', data.newsletterSubscribers),
    row('Abonnés réseaux sociaux', data.socialMediaFollowers),
    row('Visiteurs uniques site', data.websiteUniqueVisitors),
  ].join('')

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nouvelle candidature artiste — InRealArt</title>
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
                <h1 style="margin:0;font-family:Georgia,serif;font-style:italic;font-weight:400;font-size:32px;color:#ffffff;line-height:1.2;">Nouvelle candidature<br /><em style="color:${gold};">artiste</em></h1>
              </div>
              <p style="margin:0;font-size:11px;color:${gray};text-transform:uppercase;letter-spacing:0.15em;">${date}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px 40px 32px;">

              ${section('01', 'Informations personnelles', [
                row('Nom complet', data.fullName),
                row("Nom d'artiste", data.artistName),
                row('Email', `<a href="mailto:${data.email}" style="color:${gold};text-decoration:none;">${data.email}</a>`),
                row('Téléphone', data.phone),
                row('Portfolio / Liens', data.portfolioLinks.replace(/\n/g, '<br />')),
              ].join(''))}

              ${section('02', 'Présentation artistique', [
                row('Parcours', data.careerDescription.replace(/\n/g, '<br />')),
                row('Styles & médiums', data.stylesAndMediums.replace(/\n/g, '<br />')),
                row('Message artistique', data.artisticMessage.replace(/\n/g, '<br />')),
              ].join(''))}

              ${section('03', 'Informations sur les œuvres', [
                row('Œuvres physiques disponibles', boolLabel(data.hasPhysicalWorks)),
                optionalSection3Rows,
              ].join(''))}

              ${section('04', 'Aspects juridiques', [
                row('Restrictions légales', boolLabel(data.hasLegalRestrictions)),
                row('Prêt à promouvoir', boolLabel(data.willingToPromote)),
              ].join(''))}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${light};padding:24px 40px;border-top:1px solid #e8e0d0;">
              <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:${dark};font-weight:700;">InRealArt</p>
              <p style="margin:0;font-size:11px;color:${gray};">Ce message est généré automatiquement suite à la soumission du formulaire de candidature artiste.</p>
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
    const data = artistApplicationSchema.parse(body)

    // Persist to database
    await prisma.artistApplicationForm.create({ data })

    // Send notification email (fire-and-forget — do not block response on email failure)
    const htmlContent = createArtistApplicationEmailHtml(data)
    sendEmailViaBrevo(
      'teaminrealart@gmail.com',
      `Nouvelle candidature artiste — ${data.fullName}`,
      htmlContent
    ).catch((err) => console.error('[artist-application] email error:', err))

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[artist-application] error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Données invalides', errors: error.flatten() },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Erreur interne' },
      { status: 500 }
    )
  }
}
