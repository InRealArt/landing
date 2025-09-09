'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import OptimizedContentImage from '@/components/common/OptimizedContentImage'
import { useLanguageStore } from '@/store/languageStore'
import { useArtworksStore } from '@/store/useArtworksStore'
import { getArtistById, ArtistData as PrismaArtistData } from '@/actions/artistActions'
import { submitPresaleEmail } from '@/actions/emailActions'
import { toast } from 'sonner'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { validateEmail } from '@/utils/functions'
import { generateCreativeWorkJsonLd, generateBreadcrumbJsonLd } from '@/utils/metadata'
import { Lang } from '@/types/types'
import { ArtistInfoSection, ArtistArtworkCarousel } from '@/components/artists'
import { ArtistData } from '@/store/useArtistStore'

interface Props {
  artworkId: string
}

export default function ArtworkPageClient({ artworkId }: Props) {
  const { t, language } = useLanguageStore()
  const { artworks, fetchArtworks, getArtworkBySlug, getArtworksByArtistId } = useArtworksStore()
  const [artwork, setArtwork] = useState<any>(null)
  const [artist, setArtist] = useState<ArtistData | null>(null)
  const [artistArtworks, setArtistArtworks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [sanitizedDescription, setSanitizedDescription] = useState('');

  // Use mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const loadArtwork = async () => {
      try {
        // Fetch artworks if not already loaded
        if (artworks.length === 0) {
          await fetchArtworks()
        }

        // Get the artwork by slug
        const foundArtwork = getArtworkBySlug(artworkId)
        console.log("foundArtwork", foundArtwork)
        if (foundArtwork) {
          setArtwork(foundArtwork)
          
          // Récupérer les données complètes de l'artiste par son ID
          if (foundArtwork.artistId) {
            console.log("Loading artist with ID:", foundArtwork.artistId)
            const foundArtist = await getArtistById(foundArtwork.artistId)
            console.log("foundArtist", foundArtist)
            if (foundArtist) {
              // Transformer les données pour correspondre à l'interface ArtistData du store
              const transformedArtist: ArtistData = {
                id: foundArtist.id,
                artistId: foundArtist.artistId,
                name: `${foundArtist.name} ${foundArtist.surname}`,
                photo: foundArtist.imageUrl,
                role: foundArtist.artworkStyle || 'Artiste',
                intro: foundArtist.intro || '',
                description: foundArtist.description || '',
                secondaryImageUrl: foundArtist.secondaryImageUrl || '',
                slug: foundArtist.slug,
                countryCode: foundArtist.countryCode,
                countryName: foundArtist.countryName,
                mediumTags: foundArtist.mediumTags || [],
                birthYear: foundArtist.birthYear,
                biographyHeader1: foundArtist.biographyHeader1,
                biographyText1: foundArtist.biographyText1,
                biographyHeader2: foundArtist.biographyHeader2,
                biographyText2: foundArtist.biographyText2,
                biographyHeader3: foundArtist.biographyHeader3,
                biographyText3: foundArtist.biographyText3,
                biographyHeader4: foundArtist.biographyHeader4,
                biographyText4: foundArtist.biographyText4,
                artworkImages: foundArtist.artworkImages ? JSON.parse(JSON.stringify(foundArtist.artworkImages)) : []
              }
              setArtist(transformedArtist)

              // Récupérer les artworks de l'artiste pour le carousel
              try {
                const artworks = await getArtworksByArtistId(foundArtist.artistId)
                console.log("Artist artworks:", artworks)
                setArtistArtworks(artworks)
              } catch (error) {
                console.error('Error loading artist artworks:', error)
                setArtistArtworks([])
              }
            }
          }
          
          // Sanitize description when artwork is loaded
          if (foundArtwork.description?.FR) {
            const importDOMPurify = async () => {
              const DOMPurify = (await import('dompurify')).default;
              setSanitizedDescription(DOMPurify.sanitize(foundArtwork.description?.FR));
            };
            importDOMPurify();
          }
        }
      } catch (error) {
        console.error('Error loading artwork:', error)
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      loadArtwork()
    }
  }, [artworkId, artworks.length, fetchArtworks, getArtworkBySlug, mounted])

  // Show a loading state until the component is mounted
  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purpleColor"></div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purpleColor"></div>
        </div>
      </div>
    )
  }

  if (!artwork) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-textColor mb-4">{t('artwork.notFound')}</h1>
          <Link href="/artists" className="text-purpleColor hover:underline">
            {t('artwork.backToArtists')}
          </Link>
        </div>
      </div>
    )
  }

  const artworkName = typeof artwork.name === 'string' 
    ? artwork.name 
    : artwork.name[language as Lang] || artwork.name.FR || Object.values(artwork.name)[0] || 'Sans titre'

  const artworkDescription = typeof artwork.description === 'string'
    ? artwork.description
    : artwork.description[language as Lang] || artwork.description.FR || Object.values(artwork.description)[0] || ''

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: generateCreativeWorkJsonLd(
            artworkName,
            sanitizedDescription || artworkDescription || 'Œuvre d\'art unique',
            artwork.url,
            artwork.artistName,
            artwork.dateCreated,
            artwork.medium,
            artwork.width && artwork.height ? `${artwork.width} x ${artwork.height} cm` : undefined
          )
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: generateBreadcrumbJsonLd([
            { name: 'Accueil', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com' },
            { name: 'Œuvres', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/artworks` },
            { name: artworkName }
          ])
        }}
      />
      
      <div className="container mx-auto px-4 py-8 pt-headerSize">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Artwork image */}
          <div className="relative rounded-lg overflow-hidden bg-[#1A1A1A]">
            <OptimizedContentImage
              src={artwork.url}
              alt={artworkName}
              width={800}
              height={800}
              className="w-full h-auto"
              priority={true}
              isDecorative={false}
            />
          </div>

          {/* Artwork details */}
          <div>
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-textColor unbounded">{artworkName}</h1>
            </div>

            <div className="mb-8">
              <p className="text-grayText mb-2">{t('artwork.by')} <span className="text-textColor">{artwork.artistName}</span></p>
              <p className="text-grayText mb-2">{t('artwork.dimensions')}: <span className="text-textColor">
                {artwork.width && artwork.height 
                  ? `${artwork.width} x ${artwork.height} cm` 
                  : 'N/A'
                }
              </span></p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-textColor mb-4">{t('artwork.description')}</h2>
              <p className="text-grayText" dangerouslySetInnerHTML={{ __html: sanitizedDescription || 'No description available' }} />
            </div>

            {/* Additional artwork details would go here */}
          </div>
        </div>
      </div>

      {/* Section d'informations sur l'artiste */}
      {artist && <ArtistInfoSection artist={artist} />}

      {/* Carousel des artworks de l'artiste */}
      {artist && artistArtworks.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <ArtistArtworkCarousel 
            artistName={artist.name}
            artworks={artistArtworks.map(artwork => ({
              id: artwork.id.toString(),
              name: typeof artwork.name === 'string' 
                ? artwork.name 
                : artwork.name[language as Lang] || artwork.name.FR || Object.values(artwork.name)[0] || 'Sans titre',
              price: artwork.price,
              image: {
                src: artwork.url
              }
            }))}
          />
        </div>
      )}
    </>
  )
} 