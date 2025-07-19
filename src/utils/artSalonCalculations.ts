export type Formule = 'standard' | 'premium' | 'VIP';

export interface Tarif {
  transportPerPerson: number;
  hotelPerNight: number;
  pass: number;
}

export interface SalonConfig {
  name: string;
  location: 'france' | 'europe' | 'hors_europe';
  standard: Tarif;
  premium: Tarif;
  VIP: Tarif;
}

export const salons: Record<string, SalonConfig> = {
  'artbasel-paris': {
    name: 'Art Basel Paris',
    location: 'france',
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
  if (salonId === 'artgeneve') {
    return ['standard'];
  }
  return ['standard', 'premium', 'VIP'];
}

// Format price for display
export function formatPrice(price: number): string {
  return price.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
} 