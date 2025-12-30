export type Formule = 'standard' | 'premium' | 'VIP';

export interface Tarif {
  transportPerPerson: number;
  hotelPerNight: number;
  pass: number;
}

export interface SalonConfig {
  name: string;
  image: string;
  location: 'france' | 'europe' | 'hors_europe';
  standard: Tarif;
  premium?: Tarif;
  VIP?: Tarif;
}

export const salons: Record<string, SalonConfig> = {
  'artbasel-paris': {
    name: 'Art Basel Paris',
    location: 'france',
    image: '/images/art-basel.jpeg',
    standard: {
      transportPerPerson: 100,
      hotelPerNight: 120,
      pass: 110,
    },
    premium: {
      transportPerPerson: 100,
      hotelPerNight: 120,
      pass: 650,
    },
    VIP: {
      transportPerPerson: 100,
      hotelPerNight: 120,
      pass: 1300,
    },
  },
  'artgeneve': {
    name: 'Artgenève',
    location: 'europe',
    image: '/images/artgeneve.webp',
    standard: {
      transportPerPerson: 150,
      hotelPerNight: 130,
      pass: 20, 
    },
    premium: {
      transportPerPerson: 150,
      hotelPerNight: 130,
      pass: 0,
    },
    VIP: {
      transportPerPerson: 150,
      hotelPerNight: 130,
      pass: 0,
    },
  },
    'salonAutomne': {
    name: "Salon d'automne",
    location: 'europe',
    image: '/images/salonautomne.webp',
    standard: {
      transportPerPerson: 120,
      hotelPerNight: 120,
      pass: 70, 
    },
  },
    'artParis': {
    name: 'Art Paris',
    location: 'europe',
    image: '/images/art3f.webp',
    standard: {
      transportPerPerson: 120,
      hotelPerNight: 130,
      pass: 35, 
    },
    premium: {
      transportPerPerson: 120,
      hotelPerNight: 130,
      pass: 85,
    },
    VIP: {
      transportPerPerson: 120,
      hotelPerNight: 130,
      pass: 900,
    },
  },
    'expo4art': {
    name: 'Expo4Art',
    location: 'europe',
    image: '/images/expo4art.webp',
    standard: {
      transportPerPerson: 120,
      hotelPerNight: 130,
      pass: 0, 
    },
  },
    'fabParis': {
    name: 'FAB Paris',
    location: 'europe',
    image: '/images/fabParis.webp',
    standard: {
      transportPerPerson: 120,
      hotelPerNight: 130,
      pass: 30, 
    },
    premium: {
      transportPerPerson: 120,
      hotelPerNight: 130,
      pass: 55,
    },
  },
    'siacMarseille': {
    name: 'SIAC Marseille',
    location: 'europe',
    image: '/images/siacMarseille.webp',
    standard: {
      transportPerPerson: 100,
      hotelPerNight: 120,
      pass: 10, 
    },
  },
    'art-o-rama': {
    name: 'Art-o-rama',
    location: 'europe',
    image: '/images/art-o-rama.webp',
    standard: {
      transportPerPerson: 100,
      hotelPerNight: 120,
      pass: 12, 
    },
  },
    'art3fMarseille': {
    name: 'art3f Marseille',
    location: 'europe',
    image: '/images/art3f.webp',
    standard: {
      transportPerPerson: 100,
      hotelPerNight: 120,
      pass: 10, 
    },
  },
    'art3fMonaco': {
    name: 'art3f Monaco',
    location: 'europe',
    image: '/images/art3f.webp',
    standard: {
      transportPerPerson: 120,
      hotelPerNight: 120,
      pass: 10, 
    },
  },
    'art3fParis': {
    name: 'art3f Paris',
    location: 'europe',
    image: '/images/art3f.webp',
    standard: {
      transportPerPerson: 120,
      hotelPerNight: 120,
      pass: 10, 
    },
  },
    'art3fBarcelone': {
    name: 'art3f Barcelone',
    location: 'europe',
    image: '/images/art3f.webp',
    standard: {
      transportPerPerson: 150,
      hotelPerNight: 130,
      pass: 10, 
    },
  },
    'art3fLausanne': {
    name: 'art3f Lausanne',
    location: 'europe',
    image: '/images/art3f.webp',
    standard: {
      transportPerPerson: 150,
      hotelPerNight: 130,
      pass: 10, 
    },
  },
    'art3fBordeaux': {
    name: 'art3f Bordeaux',
    location: 'europe',
    image: '/images/art3f.webp',
    standard: {
      transportPerPerson: 120,
      hotelPerNight: 120,
      pass: 10, 
    },
  },
    'art3fLyon': {
    name: 'art3f Lyon',
    location: 'europe',
    image: '/images/art3f.webp',
    standard: {
      transportPerPerson: 120,
      hotelPerNight: 120,
      pass: 10, 
    },
  },
    'artShopping': {
    name: 'art Shopping',
    location: 'europe',
    image: '/images/artShopping.webp',
    standard: {
      transportPerPerson: 120,
      hotelPerNight: 120,
      pass: 10, 
    },
  },
};


// Additional costs based on accommodation comfort
export const accommodationComfortCosts: Record<string, number> = {
  basic: 0,
  comfort: 40,       // +40€ per night per person
  luxury: 100,       // +100€ per night per person
};

export type ArtSalonInputs = {
  // Personal info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Salon selection
  salonId: string;
  formula: Formule;
  days: number;
  persons: number;
  accommodationComfort: keyof typeof accommodationComfortCosts;
  professionalSupport: boolean;
};

export interface ArtSalonResults {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  salonDetails: {
    name: string;
    formula: Formule;
    days: number;
    persons: number;
    accommodationComfort: string;
    professionalSupport: boolean;
  };
  breakdown: {
    transport: number;
    accommodation: number;
    pass: number;
    comfortSupplement: number;
    total: number;
  };
  totalPersons: number;
}

export function calculateSalonCost(params: ArtSalonInputs): ArtSalonResults {
  const salon = salons[params.salonId];
  if (!salon) {
    throw new Error(`Salon ${params.salonId} not found`);
  }

  const rates = salon[params.formula];
  if (!rates) {
    throw new Error(`Formula ${params.formula} not available for salon ${params.salonId}`);
  }

  const totalPersons = params.professionalSupport ? params.persons + 1 : params.persons;
  const nights = Math.max(0, params.days - 1);
  
  // Calculate breakdown
  const transport = rates.transportPerPerson * totalPersons;
  const accommodationBase = rates.hotelPerNight * nights * totalPersons;
  const comfortSupplement = accommodationComfortCosts[params.accommodationComfort] * nights * totalPersons;
  const accommodation = accommodationBase + comfortSupplement;
  const pass = rates.pass * totalPersons;
  const total = transport + accommodation + pass;

  return {
    personalInfo: {
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      phone: params.phone,
    },
    salonDetails: {
      name: salon.name,
      formula: params.formula,
      days: params.days,
      persons: params.persons,
      accommodationComfort: params.accommodationComfort,
      professionalSupport: params.professionalSupport,
    },
    breakdown: {
      transport,
      accommodation,
      pass,
      comfortSupplement,
      total,
    },
    totalPersons,
  };
}

// Utility function to check if formulas should be disabled for a salon
export function getAvailableFormulas(salonId: string): Formule[] {
  const salon = salons[salonId];
  if (!salon) {
    return ['standard']; // Fallback to standard only if salon not found
  }

  const availableFormulas: Formule[] = ['standard']; // Standard is always available
  
  if (salon.premium) {
    availableFormulas.push('premium');
  }
  
  if (salon.VIP) {
    availableFormulas.push('VIP');
  }
  
  return availableFormulas;
}

// Format price for display
export function formatPrice(price: number): string {
  return price.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
} 