'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguageStore } from '@/store/languageStore'
import { useArtworksStore } from '@/store/useArtworksStore'
import { submitPresaleEmail } from '@/actions/emailActions'
import { toast } from 'sonner'

export default function ArtworkPage() {
  const params = useParams()
  const { t } = useLanguageStore()
  const { artworks, fetchArtworks, getArtworkBySlug } = useArtworksStore()
  const [artwork, setArtwork] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        const slug = params.id as string
        const foundArtwork = getArtworkBySlug(slug)
        console.log(foundArtwork);

        if (foundArtwork) {
          console.log('artwork', artwork);
          setArtwork(foundArtwork)
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
  }, [params.id, artworks.length, fetchArtworks, getArtworkBySlug, mounted])

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
          <Link href="/marketplace" className="text-purpleColor hover:underline">
            {t('artwork.backToMarketplace')}
          </Link>
        </div>
      </div>
    )
  }

  // Get the artwork name in the current language
  const artworkName = typeof artwork.name === 'string'
    ? artwork.name
    : (artwork.name && artwork.name.FR) || (artwork.name && Object.values(artwork.name)[0]) || '';

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      const result = await submitPresaleEmail(formData, artworkName)
      console.log(result);

      if (result.success) {
        toast.success(t('artwork.emailSuccess'));
        (e.target as HTMLFormElement).reset()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error(t('artwork.emailError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
            <p className="text-gray-400 mb-2">{t('artwork.year')}: <span className="text-white">2023</span></p>
            <p className="text-gray-400 mb-2">{t('artwork.medium')}: <span className="text-white">Digital</span></p>
            <p className="text-gray-400 mb-2">{t('artwork.dimensions')}: <span className="text-white">{artwork.size?.FR || 'N/A'}</span></p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">{t('artwork.description')}</h2>
            <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: artwork.description?.FR || 'No description available' }} />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">{t('artwork.tags')}</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-[#1A1A1A] text-white rounded-full text-sm">
                Digital Art
              </span>
              <span className="px-3 py-1 bg-[#1A1A1A] text-white rounded-full text-sm">
                NFT
              </span>
            </div>
          </div>

          <div className="border-t border-[#2D2A3D] pt-8">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-gray-400">{t('artwork.price')}</p>
                <p className="text-2xl font-bold text-white">€{artwork.price || 'N/A'}</p>
              </div>
              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                    {t('artwork.enterEmail')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-lg bg-[#1A1A1A] text-white border border-[#2D2A3D] focus:outline-none focus:border-purpleColor"
                    placeholder={t('artwork.emailPlaceholder')}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-3 rounded-lg font-medium bg-purpleColor text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('common.submitting') : t('artwork.register')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 