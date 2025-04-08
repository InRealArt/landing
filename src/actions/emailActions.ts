'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function submitPresaleEmail(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const validatedData = emailSchema.parse({ email })

    // Check if email already exists
    const existingEmail = await prisma.emailPresale.findFirst({
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
    await prisma.emailPresale.create({
      data: {
        email: validatedData.email,
        presaleId: 1,
      },
    })

    return {
      success: true,
      message: 'Successfully registered for presale',
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      }
    }

    return {
      success: false,
      message: 'An error occurred while processing your request',
    }
  }
} 