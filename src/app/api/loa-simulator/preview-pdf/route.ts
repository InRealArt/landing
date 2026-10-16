import { NextResponse } from 'next/server'
import { loaSimulationSchema } from '@/utils/loaSimulatorSchema'
import { generateLeasingPDF } from '@/utils/pdfGenerator'

const previewPDFSchema = loaSimulationSchema

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate the request data
    const result = previewPDFSchema.safeParse(body)
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

    const { formData, leaseResults, comparison } = result.data

    // Generate PDF
    const pdfBuffer = await generateLeasingPDF(formData, leaseResults, comparison)
    
    // Return PDF as response to open in browser
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Preview-Leasing-${formData.company.trim() ? `${formData.company.trim().replace(/\s+/g, '-')}-` : ''}${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    })

  } catch (error) {
    console.error('Error generating PDF preview:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate PDF preview'
      },
      { status: 500 }
    )
  }
} 