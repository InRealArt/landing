'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'

export interface PartnerItem {
  id: number
  slug: string
  name: string
  photo: string
  countryName: string | null | undefined
}

interface PartnersClientProps {
  partners: PartnerItem[]
}

export default function PartnersClient({ partners }: PartnersClientProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const handlePartnerClick = (slug: string) => {
    router.push(`/artists/${slug}`)
  }

  if (partners.length === 0) {
    return (
      <section className="mt-12 py-12 px-4">
        <div className="text-center">
          <h2 className="text-5xl md:text-7xl serif italic leading-tight text-textColor mb-4" suppressHydrationWarning>
            {t('home.partners.title')}
          </h2>
          <div className="flex justify-center items-center p-8">
            <p className="text-grayText" suppressHydrationWarning>{t('home.partners.noPartners')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-12 py-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-5xl md:text-7xl serif italic leading-tight text-textColor mb-4" suppressHydrationWarning>
          {t('home.partners.title')}
        </h2>
        <p className="text-grayText text-lg" suppressHydrationWarning>
          {t('home.partners.description')}
        </p>
      </div>

      <div className="flex gap-6 justify-center flex-wrap pb-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            onClick={() => handlePartnerClick(partner.slug)}
            className="group cursor-pointer p-4 border rounded-lg bg-cardBackground border-borderColor min-w-[160px] md:min-w-[200px] lg:min-w-[250px] flex-shrink-0 hover:opacity-80 transition-opacity duration-300"
          >
            <div className="relative h-32 md:h-40 w-full rounded-lg overflow-hidden mb-4">
              <Image
                src={partner.photo}
                alt={partner.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 250px"
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
