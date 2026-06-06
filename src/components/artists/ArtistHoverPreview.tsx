'use client'

import { useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/lib/cloufare/r2/url'

interface ArtistPreviewData {
  slug: string
  fullName: string
  surname: string
  pseudo: string
  imageUrl: string | null
  artworkImageUrls: string[]
}

interface Props {
  artists: ArtistPreviewData[]
}

const PORTRAIT_W = 160
const PORTRAIT_H = 200
const ARTWORK_W = 160
const ARTWORK_H = 200

export default function ArtistRosterWithPreview({ artists }: Props) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const [anchorPos, setAnchorPos] = useState({ x: 0, y: 0 })
  const listRef = useRef<HTMLUListElement>(null)

  const hoveredArtist = hoveredSlug ? artists.find(a => a.slug === hoveredSlug) : null

  const previewImages = useMemo(() => {
    const images: { url: string; alt: string; isPortrait: boolean }[] = []
    if (!hoveredArtist) return images
    const portraitUrl = getImageUrl(hoveredArtist.imageUrl)
    if (portraitUrl) images.push({ url: portraitUrl, alt: hoveredArtist.fullName, isPortrait: true })
    for (const rawUrl of hoveredArtist.artworkImageUrls.slice(0, 3)) {
      const url = getImageUrl(rawUrl)
      if (url) images.push({ url, alt: hoveredArtist.fullName, isPortrait: false })
    }
    return images
  }, [hoveredArtist])

  function handleMouseEnter(slug: string, e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const MAX_PANEL_W = PORTRAIT_W + 3 * ARTWORK_W + 3 * 8
    const x = Math.min(rect.right + 16, window.innerWidth - MAX_PANEL_W - 16)
    setAnchorPos({ x, y: rect.top + rect.height / 2 })
    setHoveredSlug(slug)
  }

  return (
    <>
      <ul
        ref={listRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0"
      >
        {artists.map(artist => {
          const isHovered = hoveredSlug === artist.slug
          const isOther = hoveredSlug !== null && !isHovered
          return (
            <li key={artist.slug}>
              <Link
                href={`/artists/${artist.slug}`}
                className="inline-flex items-center py-2.5 pr-4 focus-visible:outline-none"
                onMouseEnter={(e) => handleMouseEnter(artist.slug, e)}
                onMouseLeave={() => setHoveredSlug(null)}
              >
                <span
                  className="text-sm uppercase tracking-[0.2em] bricolage-grotesque leading-snug font-bold transition-all duration-300"
                  style={{
                    color: isHovered ? '#b89c72' : 'var(--text)',
                    opacity: isOther ? 0.25 : 1,
                  }}
                >
                  {artist.fullName}
                </span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="ml-2 flex-shrink-0 transition-all duration-200"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateX(0)' : 'translateX(-4px)',
                    color: '#b89c72',
                  }}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Preview panel — anchored to right end of hovered <a>, vertically centered */}
      {hoveredArtist && previewImages.length > 0 && (
        <div
          className="fixed z-50 pointer-events-none flex gap-2 items-end"
          style={{
            left: anchorPos.x,
            top: anchorPos.y,
            transform: 'translateY(-50%)',
          }}
        >
          {previewImages.map((img, i) => {
            const w = img.isPortrait ? PORTRAIT_W : ARTWORK_W
            const h = img.isPortrait ? PORTRAIT_H : ARTWORK_H
            return (
              <div
                key={`${hoveredSlug}-${i}`}
                className="relative flex-shrink-0 overflow-hidden bg-black/10"
                style={{ width: w, height: h }}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="200px"
                  className="object-cover"
                  style={{
                    animation: 'revealTopToBottom 400ms cubic-bezier(0.4,0,0.2,1) forwards',
                    animationDelay: `${i * 80}ms`,
                  }}
                  unoptimized
                />
              </div>
            )
          })}
        </div>
      )}

    </>
  )
}
