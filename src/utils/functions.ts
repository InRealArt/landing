import { ArtWork, TeamMemberData } from "@/types/types";
import { ref } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function transformArtworksPhotos(
  artworks: ArtWork[]
): Promise<ArtWork[]> {
  const promises = artworks.map(async (artwork) => {
    return {
      ...artwork,
      url: await getUrlPhoto(artwork.image),
      url2: await getUrlPhoto(artwork.image2),
      mockups:
        artwork.mockups?.length > 0
          ? await Promise.all(
            artwork.mockups.map(async (art) => await getUrlPhoto(art))
          )
          : [],
    };
  });

  return Promise.all(promises);
}


export async function getUrlPhoto(photo: string): Promise<string> {
  if (photo === "") {
    return "";
  }

  let imageRef: any = null;
  try {
    imageRef = ref(storage, photo);
    const urlPhoto = await getDownloadURL(imageRef);
    return urlPhoto;
  } catch (error) {
    return "";
  }
}

export async function transformMemberPhotos(members: TeamMemberData): Promise<TeamMemberData> {
  const promises = members.map(async member => ({
    ...member,
    photo: await getUrlPhoto(member.photo)
  }))
  return Promise.all(promises);
}

// Regex pour valider l'email
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

/**
 * Valide une adresse email avec une expression régulière
 * @param email L'adresse email à valider
 * @returns true si l'email est valide, false sinon
 */
export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email)
}

/**
 * Converts a string to a URL-friendly slug
 * @param str The string to convert to a slug
 * @returns The slugified string
 */
export const stringToSlug = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-'); // Replace multiple - with single -
};
