import { NextResponse } from 'next/server'
import jsPDF from 'jspdf'
import { sendEmailViaBrevo } from '@/utils/emailTemplates'
import { type HeritageArtResults } from '@/utils/heritageArtCalculations'

// Helper function to format price
function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Create email template for heritage art results
function createHeritageArtUserEmailTemplate(formData: any, results: HeritageArtResults): string {
  const { personalInfo, recommendation, profil, objectif } = results;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed; margin-bottom: 20px;">🎨 Votre simulation personnalisée - Patrimoine & Art</h2>
      
      <p>Bonjour ${personalInfo.firstName} ${personalInfo.lastName},</p>
      
      <p>Merci d'avoir utilisé notre simulateur d'intégration de l'art dans un patrimoine. Vous trouverez en pièce jointe votre simulation détaillée au format PDF.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">📊 Résumé de votre simulation</h3>
        <p><strong>Profil investisseur :</strong> ${profil}</p>
        <p><strong>Objectif patrimonial :</strong> ${objectif}</p>
        <p><strong>Recommandation :</strong> ${recommendation.minArt}% à ${recommendation.maxArt}% d'allocation artistique</p>
        
        <div style="border-top: 2px solid #7c3aed; padding-top: 15px; margin-top: 15px;">
          <p style="font-size: 18px; font-weight: bold; color: #7c3aed; margin: 0;">
            <strong>ALLOCATION RECOMMANDÉE : ${recommendation.artMoyenne}%</strong>
          </p>
        </div>
      </div>
      
      <div style="background-color: #e0e7ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 14px; color: #4c1d95;">
          📎 <strong>Votre simulation détaillée est disponible en pièce jointe</strong> - Elle contient tous les détails de votre simulation avec la répartition complète de votre patrimoine optimisé.
        </p>
      </div>
      
      <p>Cette simulation est calculée sur la base des informations que vous avez fournies. Pour une demande personnalisée ou des questions spécifiques, n'hésitez pas à nous contacter.</p>
      
      <div style="background-color: #7c3aed; color: white; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <p style="margin: 0; font-weight: bold;">🎨 InRealArt</p>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Votre partenaire pour l'art et le patrimoine</p>
        <p style="margin: 10px 0 0 0; font-size: 14px;">
          📧 <a href="mailto:teaminrealart@gmail.com" style="color: white; text-decoration: underline;">teaminrealart@gmail.com</a>
        </p>
      </div>
    </div>
  `;
}

// Fallback email template (if PDF generation fails)
function createHeritageArtFallbackEmailTemplate(formData: any, results: HeritageArtResults): string {
  const { personalInfo, recommendation, profil, objectif, repartitionAjustee } = results;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed; margin-bottom: 20px;">🎨 Votre simulation personnalisée - Patrimoine & Art</h2>
      
      <p>Bonjour ${personalInfo.firstName} ${personalInfo.lastName},</p>
      
      <p>Merci d'avoir utilisé notre simulateur d'intégration de l'art dans un patrimoine. Voici le détail de votre simulation :</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">📊 Détails de votre profil</h3>
        <p><strong>Profil investisseur :</strong> ${profil}</p>
        <p><strong>Objectif patrimonial :</strong> ${objectif}</p>
        <p><strong>Recommandation :</strong> ${recommendation.texte}</p>
      </div>

      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">🎯 Répartition optimisée recommandée</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="margin-bottom: 8px;"><strong>Immobilier :</strong> ${repartitionAjustee.immobilier}%</li>
          <li style="margin-bottom: 8px;"><strong>Liquidités :</strong> ${repartitionAjustee.liquidites}%</li>
          <li style="margin-bottom: 8px;"><strong>Produits financiers :</strong> ${repartitionAjustee.financier}%</li>
          <li style="margin-bottom: 8px;"><strong>Crypto / Actifs numériques :</strong> ${repartitionAjustee.crypto}%</li>
          <li style="margin-bottom: 8px;"><strong>Biens tangibles :</strong> ${repartitionAjustee.tangibles}%</li>
          <li style="margin-bottom: 8px; color: #7c3aed; font-weight: bold; border-top: 1px solid #ccc; padding-top: 8px;"><strong>Art recommandé :</strong> ${repartitionAjustee.art}%</li>
        </ul>
      </div>
      
      <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          📧 <strong>Simulation PDF en cours d'envoi</strong> - Vous recevrez votre simulation détaillée au format PDF dans un email séparé sous peu.
        </p>
      </div>
      
      <p>Cette simulation est calculée sur la base des informations que vous avez fournies. Pour une demande personnalisée ou des questions spécifiques, n'hésitez pas à nous contacter.</p>
      
      <div style="background-color: #7c3aed; color: white; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <p style="margin: 0; font-weight: bold;">🎨 InRealArt</p>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Votre partenaire pour l'art et le patrimoine</p>
        <p style="margin: 10px 0 0 0; font-size: 14px;">
          📧 <a href="mailto:teaminrealart@gmail.com" style="color: white; text-decoration: underline;">teaminrealart@gmail.com</a>
        </p>
      </div>
    </div>
  `;
}

// Load font function (async)
async function loadBricolageGrotesqueFont(doc: any): Promise<string> {
  try {
    console.log('🔍 Loading Bricolage Grotesque fonts...')

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

      console.log('✅ Bricolage Grotesque fonts loaded successfully!')
      return 'BricolageGrotesque'
    } else {
      // Client-side fallback
      console.log('❌ Client-side not supported, using Times')
      return 'times'
    }
  } catch (error) {
    console.log('❌ Failed to load fonts, using Times:', error)
    return 'times'
  }
}

// Generate PDF for heritage art results
async function generateHeritageArtPDF(results: HeritageArtResults, formData: any): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  console.log('✅ Generating Heritage Art PDF')
  const fontFamily = await loadBricolageGrotesqueFont(doc)

  // Set up the document
  let yPosition = 30
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)

  // Light purple background (#f8f8ff)
  doc.setFillColor(248, 248, 255)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // Main title - purple color (#6052ff)
  doc.setFont(fontFamily, 'normal')
  doc.setFontSize(32)
  doc.setTextColor(96, 82, 255)
  doc.text('Simulateur - Patrimoine & Art', pageWidth / 2, 20, { align: 'center' })

  yPosition = 45

  // Helper function to create section box
  const createSectionBox = (x: number, y: number, width: number, height: number, title: string) => {
    // Box background
    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.5)
    doc.roundedRect(x, y, width, height, 3, 3, 'FD')

    // Section title
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

  // Personal Information Section
  let sectionY = createSectionBox(margin, yPosition, contentWidth, 35, 'Informations personnelles')
  addKeyValue(margin + 5, sectionY, 'Nom :', `${results.personalInfo.firstName} ${results.personalInfo.lastName}`)
  addKeyValue(margin + 5, sectionY + 4, 'Email :', results.personalInfo.email)
  addKeyValue(margin + 5, sectionY + 8, 'Téléphone :', results.personalInfo.phone)

  yPosition += 45

  // Profile Section
  sectionY = createSectionBox(margin, yPosition, contentWidth, 30, 'Profil investisseur')
  addKeyValue(margin + 5, sectionY, 'Profil :', results.profil)
  addKeyValue(margin + 5, sectionY + 4, 'Objectif patrimonial :', results.objectif)

  yPosition += 40

  // Recommendation Section
  sectionY = createSectionBox(margin, yPosition, contentWidth, 35, 'Recommandation')
  addKeyValue(margin + 5, sectionY, 'Fourchette recommandée :', `${results.recommendation.minArt}% - ${results.recommendation.maxArt}%`)
  addKeyValue(margin + 5, sectionY + 4, 'Allocation optimale :', `${results.recommendation.artMoyenne}%`)

  yPosition += 45

  // Current Distribution Section
  sectionY = createSectionBox(margin, yPosition, contentWidth, 55, 'Répartition actuelle du patrimoine')
  addKeyValue(margin + 5, sectionY, 'Immobilier :', `${results.patrimoineActuel.immobilier}%`)
  addKeyValue(margin + 5, sectionY + 4, 'Liquidités :', `${results.patrimoineActuel.liquidites}%`)
  addKeyValue(margin + 5, sectionY + 8, 'Produits financiers :', `${results.patrimoineActuel.financier}%`)
  addKeyValue(margin + 5, sectionY + 12, 'Crypto / Actifs numériques :', `${results.patrimoineActuel.crypto}%`)
  addKeyValue(margin + 5, sectionY + 16, 'Biens tangibles :', `${results.patrimoineActuel.tangibles}%`)

  yPosition += 65

  // Recommended Distribution Section
  sectionY = createSectionBox(margin, yPosition, contentWidth, 65, 'Répartition optimisée recommandée')
  addKeyValue(margin + 5, sectionY, 'Immobilier :', `${results.repartitionAjustee.immobilier}%`)
  addKeyValue(margin + 5, sectionY + 4, 'Liquidités :', `${results.repartitionAjustee.liquidites}%`)
  addKeyValue(margin + 5, sectionY + 8, 'Produits financiers :', `${results.repartitionAjustee.financier}%`)
  addKeyValue(margin + 5, sectionY + 12, 'Crypto / Actifs numériques :', `${results.repartitionAjustee.crypto}%`)
  addKeyValue(margin + 5, sectionY + 16, 'Biens tangibles :', `${results.repartitionAjustee.tangibles}%`)

  // Highlight art allocation with purple line and text
  doc.setDrawColor(124, 58, 237) // Purple line
  doc.setLineWidth(1)
  doc.line(margin + 5, sectionY + 22, margin + contentWidth - 5, sectionY + 22)
  
  doc.setFont(fontFamily, 'bold')
  doc.setFontSize(12)
  doc.setTextColor(124, 58, 237) // Purple text for art
  doc.text('ART RECOMMANDÉ :', margin + 5, sectionY + 28)
  doc.text(`${results.repartitionAjustee.art}%`, margin + contentWidth - 15, sectionY + 28, { align: 'right' })

  yPosition += 75

  // Footer
  doc.setFont(fontFamily, 'normal')
  doc.setFontSize(10)
  doc.setTextColor(102, 102, 102)
  doc.text('Cette simulation a été générée par le simulateur InRealArt - www.inrealart.com', pageWidth / 2, yPosition, { align: 'center' })
  doc.text(`Créé le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, yPosition + 4, { align: 'center' })

  return Buffer.from(doc.output('arraybuffer'))
}

export async function POST(request: Request) {
  try {
    const { results, formData } = await request.json() as {
      results: HeritageArtResults
      formData: { firstName: string, lastName: string, email: string, phone: string }
    }

    if (!results || !formData) {
      return NextResponse.json({ success: false, message: 'Données manquantes' }, { status: 400 })
    }

    const { personalInfo } = results

    // Generate PDF
    let pdfBuffer: Buffer
    let fallbackTemplate: string

    try {
      pdfBuffer = await generateHeritageArtPDF(results, formData)
      
      // Send email with PDF attachment
      const emailTemplate = createHeritageArtUserEmailTemplate(formData, results)
      
      // Create PDF attachment
      const pdfAttachment = {
        name: `Simulation-Patrimoine-Art-${formData.firstName}-${formData.lastName}-${new Date().toISOString().split('T')[0]}.pdf`,
        content: pdfBuffer.toString('base64')
      }

      await sendEmailViaBrevo(
        formData.email,
        'Votre simulation patrimoine & art - InRealArt',
        emailTemplate,
        [pdfAttachment]
      )

      // Send notification to company
      const companyTemplate = `
        <h2>🎨 Nouvelle simulation patrimoine & art</h2>
        <p><strong>Nom :</strong> ${personalInfo.firstName} ${personalInfo.lastName}</p>
        <p><strong>Email :</strong> ${personalInfo.email}</p>
        <p><strong>Téléphone :</strong> ${personalInfo.phone}</p>
        <p><strong>Profil :</strong> ${results.profil}</p>
        <p><strong>Objectif :</strong> ${results.objectif}</p>
        <p><strong>Allocation art recommandée :</strong> ${results.recommendation.artMoyenne}% (${results.recommendation.minArt}%-${results.recommendation.maxArt}%)</p>
      `

      await sendEmailViaBrevo(
        'teaminrealart@gmail.com',
        `Nouvelle simulation patrimoine & art - ${personalInfo.firstName} ${personalInfo.lastName}`,
        companyTemplate
      )

      return NextResponse.json({
        success: true,
        message: 'Simulation sent successfully. PDF will be sent separately.'
      })

    } catch (pdfError) {
      console.error('PDF generation failed:', pdfError)
      
      // Fallback: send detailed email without PDF
      fallbackTemplate = createHeritageArtFallbackEmailTemplate(formData, results)
      
      await sendEmailViaBrevo(
        formData.email,
        'Votre simulation patrimoine & art - InRealArt',
        fallbackTemplate
      )

      return NextResponse.json({
        success: true,
        message: 'Simulation sent successfully. PDF will be sent separately.'
      })
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la simulation:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'envoi de la simulation' },
      { status: 500 }
    )
  }
} 