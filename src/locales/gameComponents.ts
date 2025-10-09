export const gameTranslations = {
  en: {
    hero: {
      value: 'Value',
      dimensions: 'Dimensions',
      medium: 'Medium',
      participate: 'Participate'
    },
    artist: {
      title: 'A special collaboration bringing unique art to collectors',
      discoverArtist: 'Discover the Artist'
    },
    participation: {
      title: 'How to Participate'
    },
    registration: {
      title: 'Register to Win',
      fullName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      newsletter: 'I accept to be registered on the newsletter',
      register: 'Register Now',
      registering: 'Registering...',
      success: 'Thank you for registering! Check your email for confirmation.',
      errors: {
        nameRequired: 'Name is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email format',
        phoneRequired: 'Phone number is required',
        newsletterRequired: 'You must accept newsletter registration to participate',
        submitError: 'An error occurred. Please try again.'
      }
    }
  },
  fr: {
    hero: {
      value: 'Valeur',
      dimensions: 'Dimensions',
      medium: 'Medium',
      participate: 'Participer'
    },
    artist: {
      title: 'Une collaboration spéciale apportant de l\'art unique aux collectionneurs',
      discoverArtist: 'Découvrez l\'Artiste'
    },
    participation: {
      title: 'Comment Participer'
    },
    registration: {
      title: 'Inscrivez-vous pour Gagner',
      fullName: 'Nom Complet',
      email: 'Adresse Email',
      phone: 'Numéro de Téléphone',
      newsletter: 'J\'accepte de m\'inscrire à la newsletter',
      register: 'S\'inscrire Maintenant',
      registering: 'Inscription...',
      success: 'Merci de votre inscription ! Vérifiez votre email pour la confirmation.',
      errors: {
        nameRequired: 'Le nom est requis',
        emailRequired: 'L\'email est requis',
        emailInvalid: 'Format d\'email invalide',
        phoneRequired: 'Le numéro de téléphone est requis',
        newsletterRequired: 'Vous devez accepter l\'inscription à la newsletter pour participer',
        submitError: 'Une erreur est survenue. Veuillez réessayer.'
      }
    }
  }
} as const;
