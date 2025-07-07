import { FormData, LeaseResults, Comparison } from './pdfGenerator'

// User email template (sent to the client)
export const createUserEmailTemplate = (formData: FormData, leaseResults: LeaseResults, comparison: Comparison): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Votre simulation de leasing d'œuvres d'art</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
        }
        .header {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px 20px;
        }
        .highlight-box {
            background-color: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .highlight-box h3 {
            color: #0369a1;
            margin-top: 0;
        }
        .highlight-box ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .highlight-box li {
            margin: 8px 0;
            color: #374151;
        }
        .highlight-box strong {
            color: #1f2937;
        }
        .footer {
            background-color: #1f2937;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 8px 8px;
            font-size: 12px;
        }
        .cta-button {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            display: inline-block;
            margin: 20px 0;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 Votre simulation de leasing d'œuvres d'art</h1>
        </div>
        
        <div class="content">
            <p>Bonjour,</p>
            
            <p>Merci d'avoir utilisé notre simulateur de leasing d'œuvres d'art. Voici le résumé de votre simulation :</p>
            
            <div class="highlight-box">
                <h3>📊 Résultats de votre simulation</h3>
                <ul>
                    <li><strong>Entreprise :</strong> ${formData.company}</li>
                    <li><strong>Valeur des œuvres :</strong> ${leaseResults.totalLeaseAmount.toLocaleString('fr-FR')} €</li>
                    <li><strong>Durée du bail :</strong> ${formData.leaseDuration} mois</li>
                    <li><strong>Loyer mensuel :</strong> ${leaseResults.monthlyRent.toLocaleString('fr-FR')} €</li>
                    <li><strong>💰 Économies fiscales :</strong> <span style="color: #059669; font-weight: bold;">${leaseResults.taxSavings.toLocaleString('fr-FR')} €</span></li>
                    <li><strong>💡 Coût net après économies :</strong> ${leaseResults.netCostAfterTax.toLocaleString('fr-FR')} €</li>
                </ul>
            </div>
            
            <p><strong>📄 Vous trouverez en pièce jointe le rapport détaillé de votre simulation au format PDF.</strong></p>
            
            <p>Notre équipe d'experts est à votre disposition pour vous accompagner dans votre projet de leasing d'œuvres d'art. N'hésitez pas à nous contacter pour discuter de vos besoins spécifiques.</p>
            
            <p>Cordialement,<br>
            <strong>L'équipe InRealArt</strong></p>
        </div>
        
        <div class="footer">
            <p><strong>InRealArt</strong> - Leasing d'œuvres d'art</p>
            <p>Email: teaminrealart@gmail.com</p>
            <p>Transformez votre environnement professionnel avec des œuvres d'art exceptionnelles</p>
        </div>
    </div>
</body>
</html>
`

// Admin notification email template
export const createAdminEmailTemplate = (formData: FormData, leaseResults?: LeaseResults, comparison?: Comparison): string => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nouvelle simulation de leasing - ${formData.company}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
        }
        .header {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px 20px;
        }
        .info-box {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .info-box h3 {
            color: #6366f1;
            margin-top: 0;
        }
        .info-box ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .info-box li {
            margin: 8px 0;
            color: #374151;
        }
        .info-box strong {
            color: #1f2937;
        }
        .priority-high {
            background-color: #fef3c7;
            border-color: #f59e0b;
        }
        .priority-high h3 {
            color: #d97706;
        }
        .results-box {
            background-color: #ecfdf5;
            border-color: #10b981;
        }
        .results-box h3 {
            color: #065f46;
        }
        .footer {
            background-color: #1f2937;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 8px 8px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Nouvelle simulation de leasing</h1>
        </div>
        
        <div class="content">
            <p>Une nouvelle simulation de leasing d'œuvres d'art a été effectuée sur la plateforme.</p>
            
            <div class="info-box priority-high">
                <h3>👤 Informations du prospect</h3>
                <ul>
                    <li><strong>Entreprise :</strong> ${formData.company}</li>
                    <li><strong>Email :</strong> ${formData.email}</li>
                    <li><strong>Téléphone :</strong> ${formData.phoneNumber}</li>
                    <li><strong>Valeur des œuvres :</strong> ${formData.artworkValue.toLocaleString('fr-FR')} €</li>
                    <li><strong>Durée souhaitée :</strong> ${formData.leaseDuration} mois</li>
                    <li><strong>Taux d'imposition personnalisé :</strong> ${formData.taxRate}%</li>
                    <li><strong>Valeur des œuvres :</strong> ${formData.artworkValue}€ (HT)</li>
                    <li><strong>Majoration premier loyer :</strong> ${formData.firstRentIncrease ? 'Oui' : 'Non'}</li>
                </ul>
            </div>
            
            ${leaseResults && comparison ? `
            <div class="info-box results-box">
                <h3>📊 Résultats de la simulation</h3>
                <ul>
                    <li><strong>Loyer mensuel :</strong> ${leaseResults.monthlyRent.toLocaleString('fr-FR')} €</li>
                    <li><strong>Premier loyer :</strong> ${leaseResults.firstMonthRent.toLocaleString('fr-FR')} €</li>
                    <li><strong>Montant total du bail :</strong> ${leaseResults.totalLeaseAmount.toLocaleString('fr-FR')} €</li>
                    <li><strong>💰 Économies fiscales :</strong> <span style="color: #059669; font-weight: bold;">${leaseResults.taxSavings.toLocaleString('fr-FR')} €</span></li>
                    <li><strong>💡 Coût net après fiscalité :</strong> ${leaseResults.netCostAfterTax.toLocaleString('fr-FR')} €</li>
                    <li><strong>🎯 Économies vs achat direct :</strong> <span style="color: #059669; font-weight: bold;">${Math.abs(comparison.savings).toLocaleString('fr-FR')} €</span></li>
                </ul>
            </div>
            ` : ''}
            
            <div class="info-box">
                <h3>📋 Actions suggérées</h3>
                <ul>
                    <li>📞 Contacter le prospect dans les 24h</li>
                    <li>📧 Le client a reçu sa simulation par email${leaseResults ? ' avec le PDF' : ''}</li>
                    <li>🎯 Préparer une proposition commerciale personnalisée</li>
                    <li>📅 Programmer un rendez-vous de suivi</li>
                </ul>
            </div>
            
            <p><strong>Action recommandée :</strong> Contacter ce prospect rapidement car il a manifesté un intérêt concret pour nos services de leasing.</p>
        </div>
        
        <div class="footer">
            <p><strong>InRealArt</strong> - Notification automatique</p>
            <p>Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
        </div>
    </div>
</body>
</html>
`

// Fallback email templates (when PDF generation fails)
export const createFallbackUserEmailTemplate = (formData: FormData, leaseResults: LeaseResults, comparison: Comparison): string => {
    return createUserEmailTemplate(formData, leaseResults, comparison)
        .replace('Vous trouverez en pièce jointe le rapport détaillé', 'Nous vous enverrons prochainement le rapport détaillé')
        .replace('📄 Vous trouverez en pièce jointe le rapport détaillé de votre simulation au format PDF.', '📄 Nous vous enverrons le rapport détaillé de votre simulation au format PDF dans les plus brefs délais.')
}

export const createFallbackAdminEmailTemplate = (formData: FormData): string => {
    return createAdminEmailTemplate(formData)
        .replace('Le client a reçu sa simulation par email avec le PDF', 'Le client a reçu sa simulation par email (PDF à envoyer manuellement)')
}

// Email service function
export async function sendEmailViaBrevo(to: string, subject: string, htmlContent: string, attachments?: any[]) {
    const brevoApiKey = process.env.NEXT_PUBLIC_BREVO_API_KEY

    if (!brevoApiKey) {
        throw new Error('BREVO_API_KEY not configured')
    }

    const emailData = {
        sender: {
            name: "InRealArt",
            email: "teaminrealart@gmail.com"
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
        ...(attachments && attachments.length > 0 && { attachment: attachments })
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': brevoApiKey
        },
        body: JSON.stringify(emailData)
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Brevo API error: ${errorData.message || response.statusText}`)
    }

    return response.json()
} 