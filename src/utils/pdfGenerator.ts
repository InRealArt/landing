// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' €'
}

// Types for the PDF generation
export interface FormData {
  company: string
  email: string
  phoneNumber: string
  taxRate: number
  artworkValue: number
  leaseDuration: number
  firstRentIncrease: boolean
}

export interface LeaseResults {
  monthlyRent: number
  firstMonthRent: number
  totalLeaseAmount: number
  taxSavings: number
  netCostAfterTax: number
  monthlyTaxDeduction: number
}

export interface Comparison {
  purchasePrice: number
  leaseCost: number
  savings: number
  savingsPercentage: number
}

async function loadBricolageGrotesqueFont(doc: any): Promise<string> {
  try {
    console.log('🔍 Loading Bricolage Grotesque fonts (Regular and Bold)...')
    
    // Check if we're running on server-side (Node.js) or client-side (browser)
    if (typeof window === 'undefined') {
      // Server-side: Use Node.js file system
      const { readFileSync } = await import('fs')
      const { join } = await import('path')
      
      // Load Regular font
      const regularFontPath = join(process.cwd(), 'public', 'fonts', 'BricolageGrotesque-Regular.ttf')
      const regularFontBuffer = readFileSync(regularFontPath)
      const regularFontBase64 = regularFontBuffer.toString('base64')
      
      // Load Bold font  
      const boldFontPath = join(process.cwd(), 'public', 'fonts', 'BricolageGrotesque-SemiBold.ttf')
      const boldFontBuffer = readFileSync(boldFontPath)
      const boldFontBase64 = boldFontBuffer.toString('base64')
      
      // Add fonts to jsPDF
      doc.addFileToVFS('BricolageGrotesque-Regular.ttf', regularFontBase64)
      doc.addFont('BricolageGrotesque-Regular.ttf', 'BricolageGrotesque', 'normal')
      
      doc.addFileToVFS('BricolageGrotesque-Bold.ttf', boldFontBase64)
      doc.addFont('BricolageGrotesque-Bold.ttf', 'BricolageGrotesque', 'bold')
      
      // Test if fonts work
      doc.setFont('BricolageGrotesque', 'normal')
      doc.setFont('BricolageGrotesque', 'bold')
      
      console.log('✅ Bricolage Grotesque fonts loaded successfully (server-side)!')
      return 'BricolageGrotesque'
      
    } else {
      // Client-side: Use fetch with full URL
      
      // Load Regular font
      const regularResponse = await fetch('/fonts/BricolageGrotesque_48pt-Regular.ttf')
      if (!regularResponse.ok) {
        throw new Error(`Failed to load regular font: ${regularResponse.status}`)
      }
      const regularArrayBuffer = await regularResponse.arrayBuffer()
      const regularBase64 = Buffer.from(regularArrayBuffer).toString('base64')
      
      // Load Bold font
      const boldResponse = await fetch('/fonts/BricolageGrotesque_48pt-Bold.ttf')
      if (!boldResponse.ok) {
        throw new Error(`Failed to load bold font: ${boldResponse.status}`)
      }
      const boldArrayBuffer = await boldResponse.arrayBuffer()
      const boldBase64 = Buffer.from(boldArrayBuffer).toString('base64')
      
      // Add fonts to jsPDF
      doc.addFileToVFS('BricolageGrotesque-Regular.ttf', regularBase64)
      doc.addFont('BricolageGrotesque-Regular.ttf', 'BricolageGrotesque', 'normal')
      
      doc.addFileToVFS('BricolageGrotesque-Bold.ttf', boldBase64)
      doc.addFont('BricolageGrotesque-Bold.ttf', 'BricolageGrotesque', 'bold')
      
      // Test if fonts work
      doc.setFont('BricolageGrotesque', 'normal')
      doc.setFont('BricolageGrotesque', 'bold')
      
      console.log('✅ Bricolage Grotesque fonts loaded successfully (client-side)!')
      return 'BricolageGrotesque'
    }
    
  } catch (error) {
    console.log('❌ Failed to load Bricolage Grotesque fonts, using Times New Roman:', error)
    return 'times'
  }
}

// Simple PDF generation using Times New Roman font

// Generate PDF using jsPDF
export async function generateLeasingPDF(
  formData: FormData, 
  leaseResults: LeaseResults, 
  comparison: Comparison
): Promise<Buffer> {
  try {

    // Use jsPDF which is more reliable in serverless environments
    const { jsPDF } = await import('jspdf')
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    // Use Times New Roman - simple and reliable
    console.log('✅ Using Times New Roman font for PDF')
    const fontFamily = await loadBricolageGrotesqueFont(doc)
    console.log('fontFamily', fontFamily);
    
    
    // Colors for PDF design
    // Using specific RGB values directly where needed
    
    // Set up the document
    let yPosition = 30
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    const margin = 20
    const contentWidth = pageWidth - (margin * 2)
    
    // Light purple background (#f8f8ff)
    doc.setFillColor(248, 248, 255)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')
    
    // Main title - Times New Roman with purple color (#6052ff)
    doc.setFont(fontFamily, 'normal')
    doc.setFontSize(32)
    doc.setTextColor(96, 82, 255)
    doc.text('Rapport de simulation', pageWidth / 2, 20, { align: 'center' })
    doc.setFont(fontFamily, 'normal')
    doc.setFontSize(32)
    doc.setTextColor(96, 82, 255)
    doc.text('leasing d\'œuvres d\'art', pageWidth / 2, 32, { align: 'center' })
    
    yPosition = 50
    
    // Helper function to create section box
    const createSectionBox = (x: number, y: number, width: number, height: number, title: string) => {
      // Box background
      doc.setFillColor(255, 255, 255)
      doc.setDrawColor(226, 232, 240)
      doc.setLineWidth(0.5)
      doc.roundedRect(x, y, width, height, 3, 3, 'FD')
      
      // Section title - Times New Roman
       doc.setFont(fontFamily, 'bold')
      doc.setFontSize(14)
      doc.setTextColor(51, 51, 51)
      doc.text(title, x + 5, y + 8)
      
      return y + 15 // Return starting position for content
    }
    
    // Helper function to add key-value pair
    const addKeyValue = (x: number, y: number, key: string, value: string) => {
       doc.setFont(fontFamily, 'normal')
      doc.setFontSize(10)
      doc.setTextColor(102, 102, 102)
      doc.text(key, x, y)
      
       doc.setFont(fontFamily, 'normal')
      doc.setTextColor(51, 51, 51)
      doc.setFontSize(10)
      doc.text(value, margin + contentWidth - 15, y, { align: 'right' })
    }
    
    // Client Information Section
    let sectionY = createSectionBox(margin, yPosition, contentWidth, 40, 'Informations client')
    addKeyValue(margin + 5, sectionY, 'Entreprise :', formData.company)
    addKeyValue(margin + 5, sectionY + 4, 'Email :', formData.email)
    addKeyValue(margin + 5, sectionY + 8, 'Téléphone :', formData.phoneNumber)
    addKeyValue(margin + 5, sectionY + 12, 'Taux d\'imposition :', `${formData.taxRate}%`)
    
    yPosition += 50 // Reduced spacing
    
    // Lease Parameters Section
    sectionY = createSectionBox(margin, yPosition, contentWidth, 30, 'Paramètre du bail')
    addKeyValue(margin + 5, sectionY, 'Valeur des œuvres :', `${formatCurrency(formData.artworkValue)} (HT)`)
    addKeyValue(margin + 5, sectionY + 4, 'Durée du bail :', `${formData.leaseDuration} mois`)
    addKeyValue(margin + 5, sectionY + 8, 'Majoration premier loyer :', formData.firstRentIncrease ? 'Oui' : 'Non')
    
    yPosition += 40 // Reduced spacing
    
    // Lease Results Section
    sectionY = createSectionBox(margin, yPosition, contentWidth, 35, 'Résultats du leasing')
    addKeyValue(margin + 5, sectionY, 'Premier loyer :', formatCurrency(leaseResults.firstMonthRent))
    addKeyValue(margin + 5, sectionY + 4, 'Loyers mensuels :', formatCurrency(leaseResults.monthlyRent))
    addKeyValue(margin + 5, sectionY + 8, 'Montant total du bail :', formatCurrency(leaseResults.totalLeaseAmount))
    
    yPosition += 50 // Reduced spacing
    
    // Tax Advantages Section (clean white section like others)
    sectionY = createSectionBox(margin, yPosition, contentWidth, 35, 'Avantages Fiscaux')
    addKeyValue(margin + 5, sectionY, 'Économies fiscales totales :', formatCurrency(leaseResults.taxSavings))
    addKeyValue(margin + 5, sectionY + 4, 'Déduction mensuelle :', formatCurrency(leaseResults.monthlyTaxDeduction))
    addKeyValue(margin + 5, sectionY + 8, 'Coût net après fiscalité :', formatCurrency(leaseResults.netCostAfterTax))
    
    yPosition += 45 // Reduced spacing
    
    // Comparison Section
    sectionY = createSectionBox(margin, yPosition, contentWidth, 35, 'Comparaison leasing vs achat direct')
    addKeyValue(margin + 5, sectionY, 'Prix d\'achat direct :', formatCurrency(comparison.purchasePrice))
    addKeyValue(margin + 5, sectionY + 4, 'Coût net du leasing :', formatCurrency(comparison.leaseCost))
    addKeyValue(margin + 5, sectionY + 8, 'Économies avec le leasing :', formatCurrency(Math.abs(comparison.savings)))
    
    // Footer (clean white background) - dynamic positioning
    yPosition += 44 // Add space after last section
    
    // Footer text - Times New Roman (black text on white background)
     doc.setFont(fontFamily, 'normal')
    doc.setFontSize(10)
    doc.setTextColor(102, 102, 102)
    doc.text('Ce rapport a été généré par le simulateur InRealArt - www.inrealart.com', pageWidth / 2, yPosition, { align: 'center' })
    doc.text(`Créé le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, yPosition + 4, { align: 'center' })
    
    // Convert to buffer
    const pdfArrayBuffer = doc.output('arraybuffer')
    return Buffer.from(pdfArrayBuffer)
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('PDF generation failed')
  }
}

// Backward compatibility wrapper for existing components
export async function generateLeaseResultsPDF(data: {
  leaseResults: LeaseResults
  comparison: Comparison
  formData: FormData
}): Promise<void> {
  try {
    const pdfBuffer = await generateLeasingPDF(data.formData, data.leaseResults, data.comparison)
    
    // Create a blob and trigger download
    if (typeof window !== 'undefined') {
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Rapport-Leasing-${data.formData.company.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
} 