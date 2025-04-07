'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for validating the form data
const tokenFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required')
})

export type TokenFormData = z.infer<typeof tokenFormSchema>

export async function submitTokenForm(data: TokenFormData) {
  try {
    // Validate the form data
    const validatedData = tokenFormSchema.parse(data)

    // Check if email already exists
    const existingEntry = await prisma.emailToken.findFirst({
      where: { email: validatedData.email }
    })

    if (existingEntry) {
      return {
        success: false,
        message: 'This email is already registered for token allocation'
      }
    }

    // Create new entry in EmailToken table
    await prisma.emailToken.create({
      data: validatedData
    })

    return {
      success: true,
      message: 'Successfully registered for token allocation'
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Invalid form data',
        errors: error.errors
      }
    }

    console.error('Error submitting token form:', error)
    return {
      success: false,
      message: 'An error occurred while processing your request'
    }
  }
} 