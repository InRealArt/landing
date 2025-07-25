export type ProfilInvestisseur = 'Prudent' | 'Équilibré' | 'Dynamique';
export type Objectif = 'Diversification' | 'Transmission' | 'Fiscalité' | 'Passion';

export interface HeritageArtFormData {
  // Répartition actuelle du patrimoine (%)
  immobilier: number;
  liquidites: number;
  financier: number;
  crypto: number;
  tangibles: number;
  profil: ProfilInvestisseur;
  objectif: Objectif;
  // Informations personnelles
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface HeritageArtResults {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  patrimoineActuel: {
    immobilier: number;
    liquidites: number;
    financier: number;
    crypto: number;
    tangibles: number;
    total: number;
  };
  profil: ProfilInvestisseur;
  objectif: Objectif;
  recommendation: {
    texte: string;
    minArt: number;
    maxArt: number;
    artMoyenne: number;
  };
  repartitionAjustee: {
    immobilier: number;
    liquidites: number;
    financier: number;
    crypto: number;
    tangibles: number;
    art: number;
  };
  chartData: {
    labels: string[];
    data: number[];
    colors: string[];
  };
}

// Matrice des recommandations [min%, max%]
const matrice: Record<ProfilInvestisseur, Record<Objectif, [number, number]>> = {
  Prudent: {
    Diversification: [3, 5],
    Transmission: [2, 3],
    Fiscalité: [3, 5],
    Passion: [4, 6],
  },
  Équilibré: {
    Diversification: [5, 10],
    Transmission: [4, 6],
    Fiscalité: [5, 8],
    Passion: [7, 12],
  },
  Dynamique: {
    Diversification: [10, 15],
    Transmission: [6, 8],
    Fiscalité: [8, 12],
    Passion: [10, 20],
  },
};

export function calculateHeritageArtRecommendation(formData: HeritageArtFormData): HeritageArtResults {
  const { immobilier, liquidites, financier, crypto, tangibles, profil, objectif } = formData;
  
  // Vérifier que le total fait 100%
  const total = immobilier + liquidites + financier + crypto + tangibles;
  if (total !== 100) {
    throw new Error(`La répartition ne totalise pas 100% (actuellement : ${total}%)`);
  }

  // Obtenir la fourchette de base
  const [min, max] = matrice[profil][objectif];
  
  // Calculer la concentration (valeur max parmi les 5 catégories)
  const repartition = [immobilier, liquidites, financier, crypto, tangibles];
  const concentration = Math.max(...repartition);

  // Ajustement selon la concentration
  let ajustement = 0;
  if (concentration >= 80) ajustement = 2;
  else if (concentration >= 60) ajustement = 1;

  const minArt = min + ajustement;
  const maxArt = max + ajustement;
  const artMoyenne = Math.round((minArt + maxArt) / 2);

  // Texte de recommandation
  const texte = `Sur la base de votre profil ${profil.toLowerCase()} et de la concentration actuelle de votre patrimoine, nous vous recommandons d'allouer entre ${minArt}% et ${maxArt}% de votre patrimoine à l'art.`;

  // Calculer la répartition ajustée
  const totalSansArt = 100 - artMoyenne;
  const repartitionAjustee = {
    immobilier: Math.round((immobilier * totalSansArt) / 100),
    liquidites: Math.round((liquidites * totalSansArt) / 100),
    financier: Math.round((financier * totalSansArt) / 100),
    crypto: Math.round((crypto * totalSansArt) / 100),
    tangibles: Math.round((tangibles * totalSansArt) / 100),
    art: artMoyenne,
  };

  // Données pour le graphique
  const chartData = {
    labels: ['Immobilier', 'Liquidités', 'Financier', 'Crypto', 'Tangibles', 'Art recommandé'],
    data: [
      repartitionAjustee.immobilier,
      repartitionAjustee.liquidites,
      repartitionAjustee.financier,
      repartitionAjustee.crypto,
      repartitionAjustee.tangibles,
      repartitionAjustee.art,
    ],
    colors: ['#7E57C2', '#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#FFD54F'],
  };

  return {
    personalInfo: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
    },
    patrimoineActuel: {
      immobilier,
      liquidites,
      financier,
      crypto,
      tangibles,
      total,
    },
    profil,
    objectif,
    recommendation: {
      texte,
      minArt,
      maxArt,
      artMoyenne,
    },
    repartitionAjustee,
    chartData,
  };
}

export function formatPercentage(value: number): string {
  return `${value}%`;
} 