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
  
    return {
      success: false,
      message: 'An error occurred while processing your request'
    }
} 