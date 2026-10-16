import { NextResponse } from 'next/server'
import { loaSimulationWithRecaptchaSchema } from '@/utils/loaSimulatorSchema'
import { verifyRecaptchaToken } from '@/lib/recaptcha'
import { generateLeasingPDF } from '@/utils/pdfGenerator'
import { 
  createUserEmailTemplate, 
  createFallbackUserEmailTemplate, 
  sendEmailViaBrevo 
} from '@/utils/emailTemplates'

const sendPDFSchema = loaSimulationWithRecaptchaSchema

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

    const { formData, leaseResults, comparison, recaptchaToken } = result.data
    // Envoi d'un e-mail vers l'adresse saisie : e-mail obligatoire ici, et anti-robot (reCAPTCHA v3)
    if (!formData.email) {
      return NextResponse.json({ success: false, message: 'Email required' }, { status: 400 })
    }
    if (!(await verifyRecaptchaToken(recaptchaToken))) {
      return NextResponse.json({ success: false, message: 'reCAPTCHA verification failed' }, { status: 403 })
    }

    try {
      // Try to generate PDF
      const pdfBuffer = await generateLeasingPDF(formData, leaseResults, comparison)
      
      // Create PDF attachment
      const pdfAttachment = {
        name: `Rapport-Leasing-${formData.company.trim() ? `${formData.company.trim().replace(/\s+/g, '-')}-` : ''}${new Date().toISOString().split('T')[0]}.pdf`,
        content: pdfBuffer.toString('base64')
      }

      // Send email to user with PDF attachment
      await sendEmailViaBrevo(
        formData.email,
        'Votre simulation de leasing d\'œuvres d\'art - InRealArt',
        createUserEmailTemplate(formData, leaseResults, comparison),
        [pdfAttachment]
      )

      // Note: Admin notification is now sent immediately after calculation via /send-company-info route

      return NextResponse.json({
        success: true,
        message: 'PDF sent successfully'
      })

    } catch (pdfError) {
      console.error('PDF generation failed, sending email without PDF:', pdfError)
      
      // Fallback: send email without PDF but mention it will be sent separately
      const fallbackUserTemplate = createFallbackUserEmailTemplate(formData, leaseResults, comparison)

      // Send email without PDF
      await sendEmailViaBrevo(
        formData.email,
        'Votre simulation de leasing d\'œuvres d\'art - InRealArt',
        fallbackUserTemplate
      )

      // Note: Admin notification is now sent immediately after calculation via /send-company-info route

      return NextResponse.json({
        success: true,
        message: 'Simulation sent successfully. PDF will be sent separately.'
      })
    }

  } catch (error) {
    console.error('Error sending emails:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send emails'
      },
      { status: 500 }
    )
  }
} 