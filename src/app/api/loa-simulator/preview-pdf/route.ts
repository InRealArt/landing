import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateLeasingPDF, type FormData, type LeaseResults, type Comparison } from '@/utils/pdfGenerator'

// Schema for validating the request data
const previewPDFSchema = z.object({
  formData: z.object({
    company: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    taxRate: z.number(),
    artworkValue: z.number(),
    leaseDuration: z.number(),
    firstRentIncrease: z.boolean()
  }),
  leaseResults: z.object({
    monthlyRent: z.number(),
    firstMonthRent: z.number(),
    totalLeaseAmount: z.number(),
    taxSavings: z.number(),
    netCostAfterTax: z.number(),
    monthlyTaxDeduction: z.number()
  }),
  comparison: z.object({
    purchasePrice: z.number(),
    leaseCost: z.number(),
    savings: z.number(),
    savingsPercentage: z.number()
  })
})

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
        'Content-Disposition': `inline; filename="Preview-Leasing-${formData.company.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf"`,
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