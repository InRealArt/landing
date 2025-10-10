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
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      newsletter: 'I accept to be registered on the newsletter',
      register: 'Register Now',
      registering: 'Registering...',
      success: 'Thank you very much for your participation!\n\nThe draw will take place soon, and you will be contacted if you are among the winners.\nDon\'t forget to follow us on social media to stay informed about our upcoming draws and not miss anything!',
      errors: {
        firstNameRequired: 'First name is required',
        lastNameRequired: 'Last name is required',
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
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Adresse Email',
      phone: 'Numéro de Téléphone',
      newsletter: 'J\'accepte de m\'inscrire à la newsletter',
      register: 'S\'inscrire Maintenant',
      registering: 'Inscription...',
      success: 'Merci beaucoup pour votre participation !\n\nLe tirage au sort aura lieu prochainement, et vous serez recontacté(e) si vous faites partie des gagnants.\nN\'oubliez pas de nous suivre sur les réseaux sociaux pour être informé(e) de nos prochains tirages au sort et ne rien manquer !',
      errors: {
        firstNameRequired: 'Le prénom est requis',
        lastNameRequired: 'Le nom est requis',
        emailRequired: 'L\'email est requis',
        emailInvalid: 'Format d\'email invalide',
        phoneRequired: 'Le numéro de téléphone est requis',
        newsletterRequired: 'Vous devez accepter l\'inscription à la newsletter pour participer',
        submitError: 'Une erreur est survenue. Veuillez réessayer.'
      }
    }
  }
} as const;
