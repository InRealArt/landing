/**
 * Utility functions for artwork leasing calculations (LOA pour œuvres d'art)
 */

export interface ArtworkLeaseInputs {
  company: string; // Entreprise
  email: string; // Adresse mail
  phoneNumber: string; // Numéro de téléphone
  taxRate: number; // Taux d'imposition personnalisé en %
  artworkValue: number; // Valeur de l'œuvre en € (HT)
  leaseDuration: number; // Durée du bail en mois
  firstRentIncrease: boolean; // Majoration du premier loyer (oui/non)
}

export interface ArtworkLeaseResults {
  monthlyRent: number; // Loyer mensuel
  firstMonthRent: number; // Premier loyer majoré
  totalLeaseAmount: number; // Montant total du bail
  taxSavings: number; // Économies fiscales
  netCostAfterTax: number; // Coût net après économies fiscales
  monthlyTaxDeduction: number; // Déduction fiscale mensuelle
}

export interface ArtworkLeaseComparison {
  purchasePrice: number; // Prix d'achat direct
  leaseCost: number; // Coût du leasing
  savings: number; // Économies avec le leasing
  savingsPercentage: number; // Pourcentage d'économies
}

/**
 * Fonction pour appliquer un coefficient de pondération selon la durée
 */
function getPonderationDuree(month: number): number {
  if (month <= 13) return 1;
  else if (month <= 24) return 1.008;
  else if (month <= 36) return 1.059;
  else if (month <= 48) return 1.115;
  else return 1.15; // Coefficient par défaut au-delà de 48 mois
}

/**
 * Calcule le leasing d'œuvres d'art selon la logique exacte du code original
 */
export function calculateArtworkLease(inputs: ArtworkLeaseInputs): ArtworkLeaseResults {
  const {
    artworkValue,
    leaseDuration,
    firstRentIncrease,
    taxRate
  } = inputs;

  // Calcul du montant de base (HT) + 20% frais partenaire
  let montantTotal = artworkValue * 1.2; // +20% frais partenaire

  // Appliquer le coefficient de pondération basé sur la durée
  const coefficient = getPonderationDuree(leaseDuration);
  montantTotal = montantTotal * coefficient;

  // Calcul du premier loyer majoré ou non
  const premierLoyer = firstRentIncrease ? (montantTotal / leaseDuration) * 3 : montantTotal / leaseDuration;

  // Calcul des mensualités restantes
  const mensualites = (montantTotal - premierLoyer) / (leaseDuration - 1);

  // Calcul de l'économie d'impôts et du coût réel
  const economieImpots = montantTotal * (taxRate / 100);
  const coutReel = montantTotal - economieImpots;

  // Déduction fiscale mensuelle moyenne
  const monthlyTaxDeduction = economieImpots / leaseDuration;

  return {
    monthlyRent: Math.round(mensualites * 100) / 100,
    firstMonthRent: Math.round(premierLoyer * 100) / 100,
    totalLeaseAmount: Math.round(montantTotal * 100) / 100,
    taxSavings: Math.round(economieImpots * 100) / 100,
    netCostAfterTax: Math.round(coutReel * 100) / 100,
    monthlyTaxDeduction: Math.round(monthlyTaxDeduction * 100) / 100
  };
}

/**
 * Compare leasing vs achat direct
 */
export function compareWithDirectPurchase(
  inputs: ArtworkLeaseInputs,
  leaseResults: ArtworkLeaseResults
): ArtworkLeaseComparison {
  const { artworkValue, taxRate } = inputs;

  // Prix d'achat direct (HT uniquement)
  const purchasePrice = artworkValue;

  // Avec l'achat direct, pas de déduction fiscale immédiate
  // (sauf si amortissement possible, mais plus complexe)
  const directPurchaseCost = purchasePrice;

  // Comparaison
  const savings = directPurchaseCost - leaseResults.netCostAfterTax;
  const savingsPercentage = (savings / directPurchaseCost) * 100;

  return {
    purchasePrice: Math.round(purchasePrice * 100) / 100,
    leaseCost: leaseResults.netCostAfterTax,
    savings: Math.round(savings * 100) / 100,
    savingsPercentage: Math.round(savingsPercentage * 100) / 100
  };
}

/**
 * Valide les inputs du formulaire
 */
export function validateArtworkLeaseInputs(inputs: Partial<ArtworkLeaseInputs>): string[] {
  const errors: string[] = [];

  if (!inputs.company?.trim()) {
    errors.push('Le nom de l\'entreprise est requis');
  }

  if (!inputs.email?.trim()) {
    errors.push('L\'adresse email est requise');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
    errors.push('L\'adresse email n\'est pas valide');
  }

  if (!inputs.phoneNumber?.trim()) {
    errors.push('Le numéro de téléphone est requis');
  }

  if (!inputs.artworkValue || inputs.artworkValue <= 0) {
    errors.push('La valeur des œuvres doit être supérieure à 0€');
  }

  if (!inputs.leaseDuration || inputs.leaseDuration < 12 || inputs.leaseDuration > 72) {
    errors.push('La durée du bail doit être entre 12 et 72 mois');
  }

  if (inputs.taxRate === undefined || inputs.taxRate < 0 || inputs.taxRate > 50) {
    errors.push('Le taux d\'imposition doit être entre 0 et 50%');
  }

  // firstRentIncrease est maintenant un boolean, pas besoin de validation numérique

  return errors;
}

/**
 * Options prédéfinies pour la majoration du premier loyer
 */
export const FIRST_RENT_INCREASE_OPTIONS = [
  { value: false, label: 'Non' },
  { value: true, label: 'Oui' }
];

/**
 * Options pour le type de montant
 */
export const AMOUNT_TYPE_OPTIONS = [
  { value: 'HT' as const, label: 'HT' },
  { value: 'TTC' as const, label: 'TTC' }
];

/**
 * Durées de bail recommandées
 */
export const LEASE_DURATION_OPTIONS = [
  { value: 12, label: '12 mois (1 an)' },
  { value: 24, label: '24 mois (2 ans)' },
  { value: 36, label: '36 mois (3 ans)' },
  { value: 48, label: '48 mois (4 ans)' },
  { value: 60, label: '60 mois (5 ans)' },
  { value: 72, label: '72 mois (6 ans)' }
];

/**
 * Formate un montant en euros
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Formate un pourcentage
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
} 