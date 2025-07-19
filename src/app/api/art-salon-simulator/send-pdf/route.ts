import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmailViaBrevo } from '@/utils/emailTemplates'
import { generateArtSalonPDF } from '@/utils/pdfGenerator'

// Schema for validating the request data
const sendPDFSchema = z.object({
  formData: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string()
  }),
  results: z.object({
    personalInfo: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      phone: z.string()
    }),
    salonDetails: z.object({
      name: z.string(),
      formula: z.string(),
      days: z.number(),
      persons: z.number(),
      accommodationComfort: z.string(),
      professionalSupport: z.boolean()
    }),
    breakdown: z.object({
      transport: z.number(),
      accommodation: z.number(),
      pass: z.number(),
      comfortSupplement: z.number(),
      total: z.number()
    }),
    totalPersons: z.number()
  })
})

// Create email template for art salon results
function createArtSalonUserEmailTemplate(formData: any, results: any): string {
  const { personalInfo, salonDetails, breakdown } = results;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed; margin-bottom: 20px;">🎟️ Votre estimation personnalisée - Salon d'art</h2>
      
      <p>Bonjour ${personalInfo.firstName} ${personalInfo.lastName},</p>
      
      <p>Merci d'avoir utilisé notre simulateur de coûts pour les salons d'art. Vous trouverez en pièce jointe votre devis détaillé au format PDF.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">📍 Résumé de votre estimation</h3>
        <p><strong>Salon :</strong> ${salonDetails.name}</p>
        <p><strong>Formule :</strong> ${salonDetails.formula}</p>
        <p><strong>Durée :</strong> ${salonDetails.days} jour(s)</p>
        <p><strong>Nombre de personnes :</strong> ${results.totalPersons}${salonDetails.professionalSupport ? ' (+1 accompagnement professionnel)' : ''}</p>
        
        <div style="border-top: 2px solid #7c3aed; padding-top: 15px; margin-top: 15px;">
          <p style="font-size: 18px; font-weight: bold; color: #7c3aed; margin: 0;">
            <strong>TOTAL ESTIMÉ : ${formatPrice(breakdown.total)}</strong>
          </p>
        </div>
      </div>
      
      <div style="background-color: #e0e7ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 14px; color: #4c1d95;">
          📎 <strong>Votre devis détaillé est disponible en pièce jointe</strong> - Il contient tous les détails de votre estimation avec la répartition complète des coûts.
        </p>
      </div>
      
      <p>Cette estimation est calculée sur la base des informations que vous avez fournies. Pour une demande personnalisée ou des questions spécifiques, n'hésitez pas à nous contacter.</p>
      
      <div style="background-color: #7c3aed; color: white; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <p style="margin: 0; font-weight: bold;">🎨 InRealArt</p>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Votre partenaire pour l'art et les salons d'art</p>
        <p style="margin: 10px 0 0 0; font-size: 14px;">
          📧 <a href="mailto:teaminrealart@gmail.com" style="color: white; text-decoration: underline;">teaminrealart@gmail.com</a>
        </p>
      </div>
    </div>
  `;
}

// Fallback email template (if PDF generation fails)
function createArtSalonFallbackEmailTemplate(formData: any, results: any): string {
  const { personalInfo, salonDetails, breakdown } = results;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed; margin-bottom: 20px;">🎟️ Votre estimation personnalisée - Salon d'art</h2>
      
      <p>Bonjour ${personalInfo.firstName} ${personalInfo.lastName},</p>
      
      <p>Merci d'avoir utilisé notre simulateur de coûts pour les salons d'art. Voici le détail de votre estimation :</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">📍 Détails du salon</h3>
        <p><strong>Salon :</strong> ${salonDetails.name}</p>
        <p><strong>Formule :</strong> ${salonDetails.formula}</p>
        <p><strong>Durée :</strong> ${salonDetails.days} jour(s)</p>
        <p><strong>Nombre de personnes :</strong> ${results.totalPersons}</p>
        <p><strong>Confort hébergement :</strong> ${salonDetails.accommodationComfort}</p>
        <p><strong>Accompagnement professionnel :</strong> ${salonDetails.professionalSupport ? 'Oui' : 'Non'}</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">💰 Détail des coûts</h3>
        <p><strong>Transport :</strong> ${formatPrice(breakdown.transport)}</p>
        <p><strong>Hébergement :</strong> ${formatPrice(breakdown.accommodation)}</p>
        <p><strong>Pass salon :</strong> ${formatPrice(breakdown.pass)}</p>
        ${breakdown.comfortSupplement > 0 ? `<p><strong>Supplément confort :</strong> ${formatPrice(breakdown.comfortSupplement)}</p>` : ''}
        
        <div style="border-top: 2px solid #7c3aed; padding-top: 10px; margin-top: 15px;">
          <p style="font-size: 18px; font-weight: bold; color: #7c3aed;">
            <strong>TOTAL : ${formatPrice(breakdown.total)}</strong>
          </p>
        </div>
      </div>
      
      <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          📧 <strong>Devis PDF en cours d'envoi</strong> - Vous recevrez votre devis détaillé au format PDF dans un email séparé sous peu.
        </p>
      </div>
      
      <p>Cette estimation est calculée sur la base des informations que vous avez fournies. Pour une demande personnalisée ou des questions spécifiques, n'hésitez pas à nous contacter.</p>
      
      <div style="background-color: #7c3aed; color: white; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <p style="margin: 0; font-weight: bold;">🎨 InRealArt</p>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Votre partenaire pour l'art et les salons d'art</p>
        <p style="margin: 10px 0 0 0; font-size: 14px;">
          📧 <a href="mailto:teaminrealart@gmail.com" style="color: white; text-decoration: underline;">teaminrealart@gmail.com</a>
        </p>
      </div>
    </div>
  `;
}

// Helper function to format prices
function formatPrice(amount: number): string {
  return amount.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate the request data
    const result = sendPDFSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
          errors: result.error.format(),
        },
        { status: 400 }
      )
    }

    const { formData, results } = result.data

    try {
      // Try to generate PDF
      const pdfBuffer = await generateArtSalonPDF(formData, results)
      
      // Create PDF attachment
      const pdfAttachment = {
        name: `Devis-Salon-Art-${formData.firstName}-${formData.lastName}-${new Date().toISOString().split('T')[0]}.pdf`,
        content: pdfBuffer.toString('base64')
      }

      // Send email to user with PDF attachment
      await sendEmailViaBrevo(
        formData.email,
        'Votre devis salon d\'art - InRealArt',
        createArtSalonUserEmailTemplate(formData, results),
        [pdfAttachment]
      )

      return NextResponse.json({
        success: true,
        message: 'PDF sent successfully'
      })

    } catch (pdfError) {
      console.error('PDF generation failed, sending email without PDF:', pdfError)
      
      // Fallback: send email without PDF but mention it will be sent separately
      const fallbackTemplate = createArtSalonFallbackEmailTemplate(formData, results)

      // Send email without PDF
      await sendEmailViaBrevo(
        formData.email,
        'Votre estimation salon d\'art - InRealArt',
        fallbackTemplate
      )

      return NextResponse.json({
        success: true,
        message: 'Estimation sent successfully. PDF will be sent separately.'
      })
    }

  } catch (error) {
    console.error('Error sending emails:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to process request'
      },
      { status: 500 }
    )
  }
} 