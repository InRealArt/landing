/**
 * Utility functions for LOA (Leasing avec Option d'Achat) calculations
 */

export interface LoaInputs {
  vehiclePrice: number; // Prix du véhicule
  downPayment: number; // Apport initial
  leaseDuration: number; // Durée en mois
  interestRate: number; // Taux d'intérêt annuel (%)
  residualValue: number; // Valeur résiduelle (%)
  insuranceCost?: number; // Coût assurance mensuel (optionnel)
  maintenanceCost?: number; // Coût entretien mensuel (optionnel)
}

export interface LoaResults {
  monthlyPayment: number; // Mensualité LOA
  totalLeaseCost: number; // Coût total du leasing
  residualAmount: number; // Montant de rachat final
  totalCostWithPurchase: number; // Coût total si rachat
  totalInterest: number; // Intérêts totaux
  depreciationCost: number; // Coût de dépréciation
  financingCost: number; // Coût de financement
}

export interface PurchaseComparison {
  loanMonthlyPayment: number; // Mensualité crédit classique
  totalLoanCost: number; // Coût total crédit
  totalLoanInterest: number; // Intérêts crédit
  savings: number; // Économies (positif = LOA moins cher, négatif = crédit moins cher)
  savingsPercentage: number; // Pourcentage d'économies
}

/**
 * Calcule les mensualités et coûts d'un LOA
 */
export function calculateLoa(inputs: LoaInputs): LoaResults {
  const {
    vehiclePrice,
    downPayment,
    leaseDuration,
    interestRate,
    residualValue,
    insuranceCost = 0,
    maintenanceCost = 0
  } = inputs;

  // Montant financé
  const financedAmount = vehiclePrice - downPayment;
  
  // Valeur résiduelle en euros
  const residualAmount = vehiclePrice * (residualValue / 100);
  
  // Montant à amortir pendant la durée du lease
  const depreciationAmount = financedAmount - residualAmount;
  
  // Taux mensuel
  const monthlyRate = interestRate / 100 / 12;
  
  // Calcul de la mensualité de dépréciation
  const depreciationPayment = depreciationAmount / leaseDuration;
  
  // Calcul du coût de financement mensuel
  // Le coût de financement s'applique sur la somme du capital financé et de la valeur résiduelle
  const financingPayment = (financedAmount + residualAmount) * monthlyRate;
  
  // Mensualité totale (sans assurance/entretien)
  const baseMonthlyPayment = depreciationPayment + financingPayment;
  
  // Mensualité avec services optionnels
  const monthlyPayment = baseMonthlyPayment + insuranceCost + maintenanceCost;
  
  // Coût total du leasing (mensualités + apport)
  const totalLeaseCost = (monthlyPayment * leaseDuration) + downPayment;
  
  // Coût total si rachat à la fin
  const totalCostWithPurchase = totalLeaseCost + residualAmount;
  
  // Intérêts totaux
  const totalInterest = financingPayment * leaseDuration;
  
  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalLeaseCost: Math.round(totalLeaseCost * 100) / 100,
    residualAmount: Math.round(residualAmount * 100) / 100,
    totalCostWithPurchase: Math.round(totalCostWithPurchase * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    depreciationCost: Math.round(depreciationAmount * 100) / 100,
    financingCost: Math.round(totalInterest * 100) / 100
  };
}

/**
 * Calcule un crédit classique pour comparaison
 */
export function calculateLoan(
  vehiclePrice: number,
  downPayment: number,
  loanDuration: number,
  interestRate: number
): PurchaseComparison {
  const loanAmount = vehiclePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  
  // Formule de calcul des mensualités d'un prêt
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, loanDuration)) /
    (Math.pow(1 + monthlyRate, loanDuration) - 1);
  
  const totalPayments = monthlyPayment * loanDuration;
  const totalCost = totalPayments + downPayment;
  const totalInterest = totalPayments - loanAmount;
  
  return {
    loanMonthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalLoanCost: Math.round(totalCost * 100) / 100,
    totalLoanInterest: Math.round(totalInterest * 100) / 100,
    savings: 0, // Will be calculated in comparison
    savingsPercentage: 0 // Will be calculated in comparison
  };
}

/**
 * Compare LOA vs crédit classique
 */
export function compareLoanOptions(
  loaResults: LoaResults,
  loanResults: PurchaseComparison
): PurchaseComparison {
  const savings = loanResults.totalLoanCost - loaResults.totalCostWithPurchase;
  const savingsPercentage = (savings / loanResults.totalLoanCost) * 100;
  
  return {
    ...loanResults,
    savings: Math.round(savings * 100) / 100,
    savingsPercentage: Math.round(savingsPercentage * 100) / 100
  };
}

/**
 * Valide les inputs du formulaire
 */
export function validateLoaInputs(inputs: Partial<LoaInputs>): string[] {
  const errors: string[] = [];
  
  if (!inputs.vehiclePrice || inputs.vehiclePrice <= 0) {
    errors.push('Le prix du véhicule doit être supérieur à 0');
  }
  
  if (inputs.downPayment && inputs.downPayment < 0) {
    errors.push('L\'apport ne peut pas être négatif');
  }
  
  if (inputs.vehiclePrice && inputs.downPayment && inputs.downPayment >= inputs.vehiclePrice) {
    errors.push('L\'apport doit être inférieur au prix du véhicule');
  }
  
  if (!inputs.leaseDuration || inputs.leaseDuration <= 0 || inputs.leaseDuration > 120) {
    errors.push('La durée doit être entre 1 et 120 mois');
  }
  
  if (!inputs.interestRate || inputs.interestRate < 0 || inputs.interestRate > 50) {
    errors.push('Le taux d\'intérêt doit être entre 0 et 50%');
  }
  
  if (!inputs.residualValue || inputs.residualValue <= 0 || inputs.residualValue >= 100) {
    errors.push('La valeur résiduelle doit être entre 1 et 99%');
  }
  
  if (inputs.insuranceCost && inputs.insuranceCost < 0) {
    errors.push('Le coût d\'assurance ne peut pas être négatif');
  }
  
  if (inputs.maintenanceCost && inputs.maintenanceCost < 0) {
    errors.push('Le coût d\'entretien ne peut pas être négatif');
  }
  
  return errors;
}

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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
} 