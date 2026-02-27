'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getArtistsMentionedInPost } from '@/actions/artistActions'
import { useLanguageStore } from '@/store/languageStore'
import { ArtistData } from '@/actions/artistActions'

interface Props {
  postTitle: string
  postMetaKeywords: string[]
  postListTags: string[]
  postMetaDescription: string
}

export default function PostRelatedArtists({ postTitle, postMetaKeywords, postListTags, postMetaDescription }: Props) {
  const { language } = useLanguageStore()
  const [artists, setArtists] = useState<ArtistData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const result = await getArtistsMentionedInPost(postTitle, postMetaKeywords, postListTags, postMetaDescription)
        if (!cancelled) setArtists(result)
      } catch {
        // silent fail
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [postTitle, postMetaKeywords, postListTags, postMetaDescription])

  if (!loading && artists.length === 0) return null

  return (
    <section className="mt-12 pt-10 border-t border-borderColor">
      <div className="flex items-center gap-3 mb-6">
        <span className="block w-1 h-6 rounded-full bg-purpleColor flex-shrink-0" aria-hidden="true" />
        <h2 className="text-xl font-medium italic text-textColor">
          {language === 'fr' ? 'Artistes dans cet article' : 'Artists in this article'}
        </h2>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-36 animate-pulse">
              <div className="w-36 h-36 rounded-xl bg-backgroundGrey" />
              <div className="mt-2 h-3 bg-backgroundGrey rounded w-3/4 mx-auto" />
              <div className="mt-1 h-3 bg-backgroundGrey rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {artists.map(artist => {
            const displayName = `${artist.name} ${artist.surname}`
            const tags = artist.mediumTags?.slice(0, 2).join(' · ') || artist.artworkStyle || ''
            return (
              <Link
                key={artist.id}
                href={`/artists/${artist.slug}`}
                className="group flex-shrink-0 flex flex-col items-center text-center w-36"
              >
                <div className="relative w-36 h-36 rounded-xl overflow-hidden ring-2 ring-transparent
                  transition-all duration-300
                  group-hover:ring-purpleColor group-hover:shadow-[0_0_20px_rgba(96,82,255,0.3)]
                  group-hover:scale-[1.03]">
                  <Image
                    src={artist.imageUrl}
                    alt={displayName}
                    fill
                    sizes="144px"
                    className="object-cover object-top"
                    quality={85}
                  />
                </div>
                <p className="mt-2 text-sm font-semibold text-textColor leading-tight group-hover:text-purpleColor transition-colors duration-200">
                  {displayName}
                </p>
                {tags && (
                  <p className="text-xs text-grayText mt-0.5 leading-tight">{tags}</p>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
