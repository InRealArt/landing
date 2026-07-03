'use server'

import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/cloufare/r2/url'
import { ArtistMedium, ArtistStudio } from '@/types/artistsStudio'

type OpeningHourEntry = {
  day?: string
  openTime?: string
  closeTime?: string
}

const MEDIUM_COLORS: Record<ArtistMedium, string> = {
  peinture: '#E11D48',
  sculpture: '#0D9488',
  photographie: '#D97706',
  dessin: '#4F46E5',
  autre: '#7C3AED',
}

// Mappe le libellé libre d'ArtistSpecialty vers l'une des 5 catégories connues de la carte
function mapSpecialtyToMedium(specialtyName: string | undefined): ArtistMedium {
  if (!specialtyName) return 'autre'
  const normalized = specialtyName.toLowerCase()
  if (normalized.includes('peintur')) return 'peinture'
  if (normalized.includes('sculpt')) return 'sculpture'
  if (normalized.includes('photo')) return 'photographie'
  if (normalized.includes('dessin') || normalized.includes('illustrat')) return 'dessin'
  return 'autre'
}

function formatOpeningHours(openingHours: unknown): { openPublic: boolean; hours: string } {
  if (!Array.isArray(openingHours) || openingHours.length === 0) {
    return { openPublic: false, hours: '' }
  }
  const entries = openingHours as OpeningHourEntry[]
  const validEntries = entries.filter((e) => e.day && e.openTime && e.closeTime)
  if (validEntries.length === 0) {
    return { openPublic: false, hours: '' }
  }
  const hours = validEntries.map((e) => `${e.day} : ${e.openTime} – ${e.closeTime}`).join(' • ')
  return { openPublic: true, hours }
}

function buildArtistName(artist: { name: string | null; surname: string | null; pseudo: string | null }): string {
  if (artist.pseudo) return artist.pseudo
  return [artist.name, artist.surname].filter(Boolean).join(' ')
}

// Retire le paramètre authuser (lié à une session GMB) des liens copiés depuis le Gestionnaire de fiches
function sanitizeGoogleBusinessProfileUrl(url: string | null): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    parsed.searchParams.delete('authuser')
    return parsed.toString()
  } catch {
    return url
  }
}

export async function getArtistsStudioData(): Promise<ArtistStudio[]> {
  try {
    const studios = await prisma.artitudeArtist.findMany({
      include: {
        artist: {
          include: {
            LandingArtist: true,
            artistSpecialties: {
              include: {
                artistSpecialty: true,
              },
            },
          },
        },
        images: true,
      },
    })

    return studios.map((studio) => {
      const { artist } = studio
      const landingArtist = artist.LandingArtist[0]
      const specialtyName = artist.artistSpecialties[0]?.artistSpecialty.name
      const medium = mapSpecialtyToMedium(specialtyName)
      const { openPublic, hours } = formatOpeningHours(studio.openingHours)

      const coverImage = getImageUrl(studio.images?.coverImage)
      const fallbackPhoto = getImageUrl(artist.imageUrl)
      const photo = coverImage ?? fallbackPhoto ?? ''

      const galleryPaths = [
        ...(studio.images?.exteriorImages ?? []),
        ...(studio.images?.interiorImages ?? []),
        ...(studio.images?.artistImages ?? []),
        ...(studio.images?.otherImages ?? []),
      ]
      const gallery = galleryPaths
        .map((path) => getImageUrl(path))
        .filter((url): url is string => Boolean(url))

      return {
        id: studio.id,
        name: buildArtistName(artist),
        medium,
        mediumLabel: specialtyName ?? '',
        city: studio.city,
        lat: studio.latitude ? studio.latitude.toNumber() : null,
        lng: studio.longitude ? studio.longitude.toNumber() : null,
        openPublic,
        tagline: landingArtist?.quoteFromInRealArt ?? landingArtist?.intro ?? '',
        bio: landingArtist?.description ?? landingArtist?.biographyText1 ?? '',
        photo,
        gallery,
        hours,
        color: MEDIUM_COLORS[medium],
        googleBusinessProfileUrl: sanitizeGoogleBusinessProfileUrl(studio.googleBusinessProfileUrl),
      } satisfies ArtistStudio
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des ateliers d'artistes:", error)
    throw new Error('Impossible de récupérer les ateliers d\'artistes')
  }
}
