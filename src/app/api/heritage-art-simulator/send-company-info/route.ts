import { NextResponse } from 'next/server'
import { sendEmailViaBrevo } from '@/utils/emailTemplates'
import { type HeritageArtResults } from '@/utils/heritageArtCalculations'

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

    // Template for company notification
    const companyTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed; margin-bottom: 20px;">🎯 Demande de contact - Simulateur Patrimoine & Art</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">👤 Informations du prospect</h3>
          <p><strong>Nom :</strong> ${personalInfo.firstName} ${personalInfo.lastName}</p>
          <p><strong>Email :</strong> ${personalInfo.email}</p>
          <p><strong>Téléphone :</strong> ${personalInfo.phone}</p>
        </div>

        <div style="background-color: #e0e7ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">📊 Profil investisseur</h3>
          <p><strong>Profil :</strong> ${results.profil}</p>
          <p><strong>Objectif patrimonial :</strong> ${results.objectif}</p>
          <p><strong>Allocation art recommandée :</strong> ${results.recommendation.artMoyenne}% (fourchette: ${results.recommendation.minArt}%-${results.recommendation.maxArt}%)</p>
        </div>

        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">🎯 Patrimoine actuel</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Immobilier :</strong> ${results.patrimoineActuel.immobilier}%</li>
            <li><strong>Liquidités :</strong> ${results.patrimoineActuel.liquidites}%</li>
            <li><strong>Produits financiers :</strong> ${results.patrimoineActuel.financier}%</li>
            <li><strong>Crypto / Actifs numériques :</strong> ${results.patrimoineActuel.crypto}%</li>
            <li><strong>Biens tangibles :</strong> ${results.patrimoineActuel.tangibles}%</li>
          </ul>
        </div>

        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            <strong>Action requise :</strong> Ce prospect souhaite être contacté par un expert pour discuter de l'intégration de l'art dans son patrimoine.
          </p>
        </div>

        <div style="background-color: #7c3aed; color: white; padding: 15px; border-radius: 8px;">
          <p style="margin: 0; font-weight: bold;">📞 Prochaines étapes</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">
            1. Contacter le prospect dans les 24h<br>
            2. Présenter les solutions InRealArt adaptées à son profil<br>
            3. Proposer un accompagnement personnalisé
          </p>
        </div>
      </div>
    `

    // Template for user confirmation
    const userTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed; margin-bottom: 20px;">🎨 Demande de contact reçue - InRealArt</h2>
        
        <p>Bonjour ${personalInfo.firstName} ${personalInfo.lastName},</p>
        
        <p>Nous avons bien reçu votre demande de contact suite à votre simulation d'intégration de l'art dans votre patrimoine.</p>
        
        <div style="background-color: #e0e7ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">📊 Récapitulatif de votre profil</h3>
          <p><strong>Profil investisseur :</strong> ${results.profil}</p>
          <p><strong>Objectif patrimonial :</strong> ${results.objectif}</p>
          <p><strong>Allocation art recommandée :</strong> ${results.recommendation.artMoyenne}%</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">👨‍💼 Prochaines étapes</h3>
          <p>Un de nos experts en art et patrimoine vous contactera dans les <strong>24 heures</strong> pour :</p>
          <ul>
            <li>Analyser en détail votre situation patrimoniale</li>
            <li>Vous présenter des solutions d'investissement artistique adaptées</li>
            <li>Répondre à toutes vos questions</li>
            <li>Vous accompagner dans vos démarches</li>
          </ul>
        </div>

        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            📞 <strong>Nous vous appellerons au :</strong> ${personalInfo.phone}
          </p>
        </div>

        <p>En attendant, n'hésitez pas à explorer notre plateforme et découvrir nos œuvres d'art exclusives.</p>
        
        <div style="background-color: #7c3aed; color: white; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 0; font-weight: bold;">🎨 InRealArt</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Votre partenaire pour l'art et le patrimoine</p>
          <p style="margin: 10px 0 0 0; font-size: 14px;">
            📧 <a href="mailto:teaminrealart@gmail.com" style="color: white; text-decoration: underline;">teaminrealart@gmail.com</a>
          </p>
        </div>
      </div>
    `

    // Send notification to company
    await sendEmailViaBrevo(
      'teaminrealart@gmail.com',
      `🎯 Demande contact patrimoine & art - ${personalInfo.firstName} ${personalInfo.lastName}`,
      companyTemplate
    )

    // Send confirmation to user
    await sendEmailViaBrevo(
      formData.email,
      'Demande de contact reçue - InRealArt',
      userTemplate
    )

    return NextResponse.json({
      success: true,
      message: 'Demande de contact envoyée avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande de contact:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'envoi de la demande de contact' },
      { status: 500 }
    )
  }
} 