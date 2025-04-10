'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyRecaptchaToken } from '@/lib/recaptcha'

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function submitPresaleEmail(formData: FormData, artworkName: string) {

  try {
    const email = formData.get('email') as string
    const artworkId = formData.get('artworkId') as string
    const recaptchaToken = formData.get('recaptchaToken') as string
    const validatedData = emailSchema.parse({ email })

    // Vérifier le token reCAPTCHA s'il est fourni
    if (recaptchaToken) {
      const isValidRecaptcha = await verifyRecaptchaToken(recaptchaToken)
      if (!isValidRecaptcha) {
        return {
          success: false,
          message: 'Validation reCAPTCHA échouée',
        }
      }
    }

    // Check if email already exists
    const existingEmail = await prisma.emailPresaleArtwork.findFirst({
      where: {
        email: validatedData.email,
      },
    })

    if (existingEmail) {
      return {
        success: false,
        message: 'Email already registered',
      }
    }

    // Create new email entry
    await prisma.emailPresaleArtwork.create({
      data: {
        email: validatedData.email,
        slugArtwork: artworkName,
        presaleArtworkId: Number(artworkId)
      },
    })

    return {
      success: true,
      message: 'Successfully registered for presale',
    }
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }


    return {
      success: false,
      message: 'An error occurred while processing your request',
      error: error,
    }
  }
} 