export interface Artist {
  id: string;
  name: string;
  role: string;
  intro: string;
  description: string;
  photo: string;
  artworks: Artwork[];
}

export interface Artwork {
  id: string;
  name: string;
  url: string;
  price: number;
  artistId: string;
} 