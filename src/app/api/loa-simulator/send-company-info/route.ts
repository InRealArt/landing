import { NextRequest, NextResponse } from 'next/server'
import { sendEmailViaBrevo, createAdminEmailTemplate, contactLabel } from '@/utils/emailTemplates'
import { loaSimulationWithRecaptchaSchema } from '@/utils/loaSimulatorSchema'
import { verifyRecaptchaToken } from '@/lib/recaptcha'

export async function POST(request: NextRequest) {
  try {
    const parsed = loaSimulationWithRecaptchaSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid request data' }, { status: 400 })
    }

    const { formData, leaseResults, comparison, recaptchaToken } = parsed.data
    // Notification d'un lead : seulement si le visiteur a laissé des coordonnées
    if (!formData.email && !formData.phoneNumber) {
      return NextResponse.json({ success: false, error: 'No contact details' }, { status: 400 })
    }
    if (!(await verifyRecaptchaToken(recaptchaToken))) {
      return NextResponse.json({ success: false, error: 'reCAPTCHA verification failed' }, { status: 403 })
    }

    // Send admin notification email with company info and calculation results
    await sendEmailViaBrevo(
      'teaminrealart@gmail.com',
      `Nouvelle simulation de leasing - ${contactLabel(formData)}`,
      createAdminEmailTemplate(formData, leaseResults, comparison)
    )

    console.log('✅ Company info sent to admin successfully')

    return NextResponse.json({
      success: true,
      message: 'Company information sent successfully'
    })

  } catch (error) {
    console.error('❌ Error sending company info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send company information' },
      { status: 500 }
    )
  }
}
