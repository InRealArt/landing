import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { verifyRecaptchaToken } from '@/lib/recaptcha'

// Schema de validation pour l'email
const subscribeSchema = z.object({
    email: z.string().email('Email invalide'),
    recaptchaToken: z.string().optional(),
})

// Initialisation de Prisma
const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        // Analyser le corps de la requête
        const body = await request.json()

        // Valider les données reçues
        const result = subscribeSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Données invalides',
                    errors: result.error.format(),
                },
                { status: 400 }
            )
        }

        const { email, recaptchaToken } = result.data

        // Valider reCAPTCHA si un token est fourni
        if (recaptchaToken) {
            const isValidRecaptcha = await verifyRecaptchaToken(recaptchaToken)
            if (!isValidRecaptcha) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Validation reCAPTCHA échouée',
                    },
                    { status: 400 }
                )
            }
        }

        // Vérifier si l'email existe déjà
        const existingEmail = await prisma.emailNewsLetter.findUnique({
            where: { email },
        })

        if (existingEmail) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Cet email est déjà inscrit à notre newsletter',
                },
                { status: 409 }
            )
        }

        // Enregistrer l'email dans la base de données
        await prisma.emailNewsLetter.create({
            data: { email },
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Inscription à la newsletter réussie',
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Erreur lors de l\'inscription à la newsletter:', error)

        return NextResponse.json(
            {
                success: false,
                message: 'Une erreur s\'est produite lors de l\'inscription',
            },
            { status: 500 }
        )
    }
} 