#!/usr/bin/env tsx

/**
 * Script pour nettoyer les données de test du système de sticky footer
 * Usage: npx tsx scripts/clean-sticky-footer.ts
 */

import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL as string }),
})

async function cleanStickyFooter() {
    try {
        console.log('🧹 Début du nettoyage des sticky footers...')

        // Compter les sticky footers existants
        const countBefore = await prisma.stickyFooter.count()
        console.log(`📊 Nombre de sticky footers avant nettoyage: ${countBefore}`)

        if (countBefore === 0) {
            console.log('ℹ️  Aucun sticky footer à nettoyer')
            return
        }

        // Supprimer tous les sticky footers
        const result = await prisma.stickyFooter.deleteMany({})
        console.log(`🗑️  ${result.count} sticky footer(s) supprimé(s)`)

        // Vérifier le nettoyage
        const countAfter = await prisma.stickyFooter.count()
        console.log(`📊 Nombre de sticky footers après nettoyage: ${countAfter}`)

        if (countAfter === 0) {
            console.log('✅ Nettoyage terminé avec succès !')
        } else {
            console.log('⚠️  Certains sticky footers n\'ont pas été supprimés')
        }

    } catch (error) {
        console.error('❌ Erreur lors du nettoyage:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

// Exécution du script
if (require.main === module) {
    cleanStickyFooter()
        .then(() => {
            console.log('✅ Script de nettoyage terminé')
            process.exit(0)
        })
        .catch((error) => {
            console.error('❌ Erreur fatale:', error)
            process.exit(1)
        })
}

export default cleanStickyFooter
