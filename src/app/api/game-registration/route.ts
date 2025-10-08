import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmailViaBrevo } from '@/utils/emailTemplates';

// Schema for request validation
const registrationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().min(1),
  gameSlug: z.string(),
  artworkName: z.string(),
});

import { createGameRegistrationUserTemplate, createGameRegistrationAdminTemplate } from '@/utils/emailTemplates';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registrationSchema.parse(body);
    const { email, name, phone, artworkName } = validatedData;

    // Detect language from email content (you might want to pass this from the frontend)
    const language = email.endsWith('.fr') ? 'fr' : 'en';

    try {
      // Send confirmation email to user
      const userEmailContent = createGameRegistrationUserTemplate(name, artworkName, language);
      await sendEmailViaBrevo(
        email,
        userEmailContent.subject,
        userEmailContent.html
      );
      console.log('User confirmation email sent successfully');

      // Send notification email to admin
      const adminEmailContent = createGameRegistrationAdminTemplate(name, email, phone, artworkName, language);
      await sendEmailViaBrevo(
        process.env.ADMIN_EMAIL || 'teaminrealart@gmail.com',
        adminEmailContent.subject,
        adminEmailContent.html
      );
      console.log('Admin notification email sent successfully');
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      throw new Error('Failed to send emails');
    }

    return NextResponse.json(
      { message: language === 'fr' ? 'Inscription réussie' : 'Registration successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data provided' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
