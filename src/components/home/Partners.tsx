'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { usePartnersStore } from '@/store/usePartnersStore'
import { useLanguageStore } from '@/store/languageStore'
import { useRouter } from 'next/navigation'

// Composant Skeleton pour l'état de chargement
function PartnersSkeleton() {
  const t = useLanguageStore(state => state.t)
  
  return (
    <section className="mt-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-textColor mb-4">
          {t('home.partners.title')}
        </h2>
        <p className="text-grayText text-lg">
          {t('home.partners.description')}
        </p>
      </div>
      <div className="flex gap-6 overflow-hidden justify-center flex-wrap">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="p-4 border rounded-lg bg-cardBackground min-w-[200px] md:min-w-[250px] flex-shrink-0">
            <div className="bg-gray-300 animate-pulse h-32 md:h-40 w-full rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-300 animate-pulse rounded-md w-3/4 mb-2"></div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Partners() {
  const { partners, isLoading, hasError, fetchPartners } = usePartnersStore()
  const t = useLanguageStore(state => state.t)
  const router = useRouter()

  useEffect(() => {
    fetchPartners()
  }, [fetchPartners])

  const handlePartnerClick = (slug: string) => {
    router.push(`/artists/${slug}`)
  }

  if (isLoading) {
    return <PartnersSkeleton />
  }

  if (hasError) {
    return (
      <section className="mt-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-textColor mb-4">
            {t('home.partners.title')}
          </h2>
          <div className="flex justify-center items-center p-8">
            <p className="text-grayText">{t('home.partners.loadingError')}</p>
          </div>
        </div>
      </section>
    )
  }

  if (partners.length === 0) {
    return (
      <section className="mt-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-textColor mb-4">
            {t('home.partners.title')}
          </h2>
          <div className="flex justify-center items-center p-8">
            <p className="text-grayText">{t('home.partners.noPartners')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-textColor mb-4">
          {t('home.partners.title')}
        </h2>
        <p className="text-grayText text-lg">
          {t('home.partners.description')}
        </p>
      </div>
      
      <div className="flex gap-6 overflow-x-auto justify-center flex-wrap pb-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            onClick={() => handlePartnerClick(partner.slug)}
            className="group cursor-pointer p-4 border rounded-lg bg-cardBackground min-w-[200px] md:min-w-[250px] flex-shrink-0 hover:bg-cardBackground/80 transition-colors duration-300"
          >
            <div className="relative h-32 md:h-40 w-full rounded-lg overflow-hidden mb-4">
              <Image
                src={partner.photo}
                alt={partner.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 200px, 250px"
              />
            </div>
            <h3 className="text-textColor font-semibold text-lg mb-2 truncate">
              {partner.name}
            </h3>
            {partner.countryName && (
              <p className="text-grayText text-xs mt-2">
                {partner.countryName}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Partners
