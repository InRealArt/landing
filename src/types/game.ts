export type GameLang = 'en' | 'fr';

export interface GameArtwork {
  name: string;
  value: number;
  dimensions: string;
  image: string;
}

export interface GameArtist {
  name: string;
  image: string;
  bio?: Record<GameLang, string>;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };
}

export interface GamePage {
  slug: string;
  active: boolean;
  startDate: string;
  endDate: string;
  artwork: GameArtwork;
  artist: GameArtist;
  title: Record<GameLang, string>;
  description: Record<GameLang, string>;
  howToParticipate: Record<GameLang, {
    steps: string[];
  }>;
  termsAndConditions: Record<GameLang, string[]>;
  theme?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}
