'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguageStore } from '@/store/languageStore'
import { useArtworksStore } from '@/store/useArtworksStore'
import { submitPresaleEmail } from '@/actions/emailActions'
import { toast } from 'sonner'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { validateEmail } from '@/utils/functions'
import { generateCreativeWorkJsonLd, generateBreadcrumbJsonLd } from '@/utils/metadata'
import { Lang } from '@/types/types'

interface Props {
  artworkId: string
}

export default function ArtworkPageClient({ artworkId }: Props) {
  const { t, language } = useLanguageStore()
  const { artworks, fetchArtworks, getArtworkBySlug } = useArtworksStore()
  const [artwork, setArtwork] = useState<any>(null)
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

        if (foundArtwork) {
          setArtwork(foundArtwork)
          
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
          <h1 className="text-2xl font-bold text-white mb-4">{t('artwork.notFound')}</h1>
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
          <div className="relative aspect-square rounded-lg overflow-hidden bg-[#1A1A1A]">
            <Image
              src={artwork.url}
              alt={artworkName}
              fill
              className="object-cover"
            />
          </div>

          {/* Artwork details */}
          <div>
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-white unbounded">{artworkName}</h1>
            </div>

            <div className="mb-8">
              <p className="text-gray-400 mb-2">{t('artwork.by')} <span className="text-white">{artwork.artistName}</span></p>
              <p className="text-gray-400 mb-2">{t('artwork.dimensions')}: <span className="text-white">
                {artwork.width && artwork.height 
                  ? `${artwork.width} x ${artwork.height} cm` 
                  : 'N/A'
                }
              </span></p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">{t('artwork.description')}</h2>
              <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: sanitizedDescription || 'No description available' }} />
            </div>

            {/* Additional artwork details would go here */}
          </div>
        </div>
      </div>
    </>
  )
} 