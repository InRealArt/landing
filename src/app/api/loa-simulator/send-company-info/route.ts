import { NextRequest, NextResponse } from 'next/server'
import { sendEmailViaBrevo, createAdminEmailTemplate } from '@/utils/emailTemplates'
import { FormData, LeaseResults, Comparison } from '@/utils/pdfGenerator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formData, leaseResults, comparison }: {
      formData: FormData
      leaseResults: LeaseResults
      comparison: Comparison
    } = body

    // Send admin notification email with company info and calculation results
    await sendEmailViaBrevo(
      'teaminrealart@gmail.com',
      `Nouvelle simulation de leasing - ${formData.company}`,
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