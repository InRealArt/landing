import { NextRequest, NextResponse } from 'next/server'
import { sendEmailViaBrevo } from '@/utils/emailTemplates'
import { ArtSalonInputs, ArtSalonResults } from '@/utils/artSalonCalculations'

// Create email template for art salon results
function createArtSalonAdminEmailTemplate(formData: ArtSalonInputs, results: ArtSalonResults): string {
  const { personalInfo, salonDetails, breakdown } = results;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed; margin-bottom: 20px;">🎟️ Nouvelle simulation de salon d'art</h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">Informations personnelles</h3>
        <p><strong>Nom:</strong> ${personalInfo.firstName} ${personalInfo.lastName}</p>
        <p><strong>Email:</strong> ${personalInfo.email}</p>
        <p><strong>Téléphone:</strong> ${personalInfo.phone}</p>
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">Détails du salon</h3>
        <p><strong>Salon:</strong> ${salonDetails.name}</p>
        <p><strong>Formule:</strong> ${salonDetails.formula}</p>
        <p><strong>Durée:</strong> ${salonDetails.days} jours</p>
        <p><strong>Nombre de personnes:</strong> ${salonDetails.persons}</p>
        ${salonDetails.accommodationComfort ? `<p><strong>Confort:</strong> ${salonDetails.accommodationComfort}</p>` : ''}
        <p><strong>Accompagnement pro:</strong> ${salonDetails.professionalSupport ? 'Oui' : 'Non'}</p>
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">Détail des coûts</h3>
        <p><strong>Transport:</strong> ${breakdown.transport}€</p>
        <p><strong>Hébergement:</strong> ${breakdown.accommodation}€</p>
        <p><strong>Pass salon:</strong> ${breakdown.pass}€</p>
        ${breakdown.comfortSupplement > 0 ? `<p><strong>Supplément confort:</strong> ${breakdown.comfortSupplement}€</p>` : ''}
        <hr style="margin: 15px 0;">
        <p style="font-size: 18px; font-weight: bold; color: #7c3aed;">
          <strong>TOTAL TTC: ${breakdown.total}€</strong>
        </p>
      </div>

      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        Email envoyé automatiquement depuis le simulateur de salon d'art InRealArt
      </p>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formData, results }: {
      formData: ArtSalonInputs
      results: ArtSalonResults
    } = body

    // Send admin notification email with company info and calculation results
    await sendEmailViaBrevo(
      'teaminrealart@gmail.com',
      `Nouvelle simulation salon d'art - ${formData.firstName} ${formData.lastName}`,
      createArtSalonAdminEmailTemplate(formData, results)
    )

    console.log('✅ Art salon info sent to admin successfully')

    return NextResponse.json({ 
      success: true, 
      message: 'Art salon information sent successfully' 
    })

  } catch (error) {
    console.error('❌ Error sending art salon info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send art salon information' },
      { status: 500 }
    )
  }
} 