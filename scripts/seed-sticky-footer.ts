#!/usr/bin/env tsx

/**
 * Script pour insérer des données de test pour le système de sticky footer
 * Usage: npx tsx scripts/seed-sticky-footer.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedStickyFooter() {
    try {
        console.log('🌱 Début du seeding des sticky footers...')

        // Exemple 1: Sticky footer global (toutes les pages)
        const globalStickyFooter = await prisma.stickyFooter.create({
            data: {
                activeOnAllPages: true,
                activeOnSpecificPages: false,
                specificPages: [],
                endValidityDate: new Date('2024-12-31'),
                title: '🎨 Nouvelle collection disponible !',
                text: 'Découvrez notre nouvelle collection d\'œuvres d\'art contemporain. Des pièces uniques d\'artistes émergents.',
                textButton: 'Explorer la collection',
                buttonUrl: '/marketplace'
            }
        })
        console.log('✅ Sticky footer global créé:', globalStickyFooter.id)

        // Exemple 2: Sticky footer pour pages spécifiques (artistes)
        const artistsStickyFooter = await prisma.stickyFooter.create({
            data: {
                activeOnAllPages: false,
                activeOnSpecificPages: true,
                specificPages: ['artists', 'joinInRealArt_artists'],
                endValidityDate: null, // Pas de date de fin
                title: '👨‍🎨 Rejoignez notre communauté d\'artistes',
                text: 'Partagez vos créations avec une communauté passionnée et vendez vos œuvres en toute sécurité.',
                textButton: 'Devenir artiste',
                buttonUrl: '/joinInRealArt/artists'
            }
        })
        console.log('✅ Sticky footer artistes créé:', artistsStickyFooter.id)

        // Exemple 3: Sticky footer promotionnel temporaire
        const promotionalStickyFooter = await prisma.stickyFooter.create({
            data: {
                activeOnAllPages: false,
                activeOnSpecificPages: true,
                specificPages: ['marketplace', 'usecase'],
                endValidityDate: new Date('2024-03-31'), // Promotion de 3 mois
                title: '🔥 Promotion limitée !',
                text: 'Profitez de 20% de réduction sur votre première acquisition d\'œuvre d\'art. Offre valable jusqu\'au 31 mars.',
                textButton: 'Profiter de l\'offre',
                buttonUrl: '/marketplace?promo=20off'
            }
        })
        console.log('✅ Sticky footer promotionnel créé:', promotionalStickyFooter.id)

        // Exemple 4: Sticky footer pour simulateurs
        const simulatorStickyFooter = await prisma.stickyFooter.create({
            data: {
                activeOnAllPages: false,
                activeOnSpecificPages: true,
                specificPages: ['loa_simulator', 'heritage_art_simulator'],
                endValidityDate: null,
                title: '💡 Besoin d\'aide ?',
                text: 'Utilisez nos simulateurs pour mieux comprendre les mécanismes de l\'art et de l\'investissement.',
                textButton: 'Voir les simulateurs',
                buttonUrl: '/usecase'
            }
        })
        console.log('✅ Sticky footer simulateurs créé:', simulatorStickyFooter.id)

        // Exemple 5: Sticky footer pour la page d'accueil uniquement
        const homeStickyFooter = await prisma.stickyFooter.create({
            data: {
                activeOnAllPages: false,
                activeOnSpecificPages: true,
                specificPages: ['root'],
                endValidityDate: new Date('2024-06-30'),
                title: '🚀 In Real Art - L\'avenir de l\'art',
                text: 'Rejoignez la révolution de l\'art numérique et découvrez comment investir dans l\'art de demain.',
                textButton: 'Commencer maintenant',
                buttonUrl: '/joinInRealArt'
            }
        })
        console.log('✅ Sticky footer accueil créé:', homeStickyFooter.id)

        console.log('🎉 Seeding terminé avec succès !')
        console.log('\n📊 Résumé:')
        console.log('- 1 sticky footer global (toutes les pages)')
        console.log('- 4 sticky footers ciblés (pages spécifiques)')
        console.log('- 2 sticky footers avec date de fin')
        console.log('- 3 sticky footers permanents')

    } catch (error) {
        console.error('❌ Erreur lors du seeding:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

// Exécution du script
if (require.main === module) {
    seedStickyFooter()
        .then(() => {
            console.log('✅ Script terminé avec succès')
            process.exit(0)
        })
        .catch((error) => {
            console.error('❌ Erreur fatale:', error)
            process.exit(1)
        })
}

export default seedStickyFooter

