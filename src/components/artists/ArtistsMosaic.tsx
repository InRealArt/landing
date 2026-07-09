'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import FirebaseImage from '@/components/common/FirebaseImage'
import { useTranslation } from '@/hooks/useTranslation'

interface MosaicArtist {
  slug: string
  name: string
  imageUrl: string
}

interface Props {
  artists: MosaicArtist[]
}

/*
 * Aspect-ratio categories used to assign grid spans.
 *
 * Ratios are detected via a hidden <img> probe element that loads the same src
 * as the FirebaseImage. This avoids any dependency on FirebaseImage internals.
 * Before detection, images default to 'square'.
 */
type RatioCategory = 'portrait' | 'square' | 'landscape'

function getRatioCategory(ratio: number): RatioCategory {
  if (ratio < 0.75) return 'portrait'
  if (ratio > 1.25) return 'landscape'
  return 'square'
}

/*
 * Grid span definitions per ratio category.
 * The mosaic uses a 12-column grid. Row height is driven by minHeight on the
 * grid container divided evenly across `maxRow` tracks.
 *
 *   portrait  → tall & narrow  (2 cols × 3 rows)
 *   square    → medium         (3 cols × 2 rows)
 *   landscape → wide & short   (4 cols × 2 rows)
 */
interface SpanDef {
  cols: number
  rows: number
}

const SPANS: Record<RatioCategory, SpanDef> = {
  portrait:  { cols: 2, rows: 3 },
  square:    { cols: 3, rows: 2 },
  landscape: { cols: 4, rows: 2 },
}

/*
 * Greedy bin-packer: split artists into frames where each frame consumes at
 * most MAX_COL_UNITS_PER_FRAME column-units (12 cols × 3 row tracks = 36).
 */
const MAX_COL_UNITS_PER_FRAME = 12 * 3

function packIntoFrames(
  artists: MosaicArtist[],
  categories: Record<string, RatioCategory>,
): MosaicArtist[][] {
  const frames: MosaicArtist[][] = []
  let currentFrame: MosaicArtist[] = []
  let usedColUnits = 0

  for (const artist of artists) {
    const cat = categories[artist.slug] ?? 'square'
    const { cols } = SPANS[cat]

    if (usedColUnits + cols > MAX_COL_UNITS_PER_FRAME && currentFrame.length > 0) {
      frames.push(currentFrame)
      currentFrame = []
      usedColUnits = 0
    }

    currentFrame.push(artist)
    usedColUnits += cols
  }

  if (currentFrame.length > 0) frames.push(currentFrame)
  return frames.length > 0 ? frames : [[]]
}

/*
 * Compute explicit CSS gridColumn / gridRow placement for each artist in a
 * frame using a row-fill algorithm on a 12-column grid.
 */
interface CellPlacement {
  col: string
  row: string
}

function computePlacements(
  artists: MosaicArtist[],
  categories: Record<string, RatioCategory>,
): CellPlacement[] {
  // rowFill[r] = next free column in row r+1 (1-indexed), supports up to 6 rows
  const rowFill: number[] = [1, 1, 1, 1, 1, 1]
  const placements: CellPlacement[] = []

  for (const artist of artists) {
    const cat = categories[artist.slug] ?? 'square'
    const { cols, rows } = SPANS[cat]

    let placedRow = -1
    let placedCol = -1

    for (let r = 0; r <= rowFill.length - rows; r++) {
      // The start column for this cell is the max fill across all spanned rows
      let startCol = rowFill[r]
      for (let dr = 1; dr < rows; dr++) {
        startCol = Math.max(startCol, rowFill[r + dr])
      }
      if (startCol + cols - 1 <= 12) {
        placedRow = r + 1
        placedCol = startCol
        break
      }
    }

    // Fallback (shouldn't occur with correct frame budgets)
    if (placedRow === -1) {
      placedRow = 1
      placedCol = 1
    }

    for (let dr = 0; dr < rows; dr++) {
      rowFill[placedRow - 1 + dr] = placedCol + cols
    }

    placements.push({
      col: `${placedCol} / ${placedCol + cols}`,
      row: `${placedRow} / ${placedRow + rows}`,
    })
  }

  return placements
}

// Mobile layout: simple 2-column portrait grid (first 6 artists)
const MOBILE_CELL_CLASSES = [
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
]

export default function ArtistsMosaic({ artists }: Props) {
  const { t } = useTranslation()

  // slug → detected aspect ratio category (populated lazily via image probe)
  const [ratioCategories, setRatioCategories] = useState<Record<string, RatioCategory>>({})
  const [frameIndex, setFrameIndex] = useState(0)

  const handleProbeLoad = useCallback(
    (slug: string, e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget
      const ratio = img.naturalWidth / img.naturalHeight
      if (!isFinite(ratio) || ratio <= 0) return
      const cat = getRatioCategory(ratio)
      setRatioCategories(prev => (prev[slug] === cat ? prev : { ...prev, [slug]: cat }))
    },
    [],
  )

  const frames = packIntoFrames(artists, ratioCategories)
  const totalFrames = frames.length
  const safeIndex = Math.min(frameIndex, totalFrames - 1)
  const frameArtists = frames[safeIndex] ?? []
  const placements = computePlacements(frameArtists, ratioCategories)

  const maxRow = frameArtists.reduce((acc, artist) => {
    return Math.max(acc, SPANS[ratioCategories[artist.slug] ?? 'square'].rows)
  }, 2)

  const prev = useCallback(() => {
    setFrameIndex(i => (i - 1 + totalFrames) % totalFrames)
  }, [totalFrames])

  const next = useCallback(() => {
    setFrameIndex(i => (i + 1) % totalFrames)
  }, [totalFrames])

  return (
    <section className="bg-backgroundColor border-b border-borderColor px-8 sm:px-16 lg:px-28">

      {/*
       * Hidden image probes for ALL artists (not just the current frame) so
       * that ratio detection runs eagerly. These are aria-hidden, display:none,
       * and have no visual footprint.
       */}
      <div aria-hidden="true" className="hidden">
        {artists.map(artist => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={artist.slug}
            src={artist.imageUrl}
            alt=""
            onLoad={e => handleProbeLoad(artist.slug, e)}
          />
        ))}
      </div>

      {/* ── Desktop mosaic (md+) ── */}
      <div
        className="hidden md:grid gap-px bg-borderColor"
        style={{
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: `repeat(${maxRow}, 1fr)`,
          minHeight: '55vh',
        }}
      >
        {frameArtists.map((artist, i) => {
          const placement = placements[i]
          return (
            <Link
              key={artist.slug}
              href={`/artists/${artist.slug}`}
              className="group relative overflow-hidden bg-backgroundColor"
              style={{ gridColumn: placement.col, gridRow: placement.row }}
              aria-label={artist.name}
            >
              <FirebaseImage
                src={artist.imageUrl}
                alt={artist.name}
                className="absolute inset-0 w-full h-full"
                imgClassName="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
              {/* Name overlay — slides up on hover */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-t from-black/80 via-black/30 to-transparent px-5 pt-16 pb-5"
              >
                <p className="text-white text-sm uppercase tracking-[0.25em] bricolage-grotesque leading-none font-bold drop-shadow-lg">
                  {artist.name}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── Mobile grid (< md): 2-col portrait layout ── */}
      <div
        className="md:hidden grid grid-cols-2 gap-px bg-borderColor"
        style={{ gridAutoRows: '220px' }}
      >
        {frameArtists.slice(0, 6).map((artist, i) => (
          <Link
            key={artist.slug}
            href={`/artists/${artist.slug}`}
            className={`group relative overflow-hidden bg-backgroundColor ${MOBILE_CELL_CLASSES[i] ?? 'col-span-1'}`}
            aria-label={artist.name}
          >
            <FirebaseImage
              src={artist.imageUrl}
              alt={artist.name}
              className="absolute inset-0 w-full h-full"
              imgClassName="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            {/* Always-visible name label on mobile (no hover state on touch) */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-10 pb-3"
            >
              <p className="text-white text-xs uppercase tracking-[0.25em] bricolage-grotesque leading-none">
                {artist.name}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Navigation ── */}
      {totalFrames > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-borderColor">
          <p className="section-number !mb-0">
            {safeIndex + 1} / {totalFrames}
          </p>

          <div className="flex items-center">
            <button
              onClick={prev}
              aria-label={t('artists.mosaic.prev')}
              className="group flex items-center justify-center w-10 h-10 border border-borderColor hover:border-textColor transition-colors duration-200"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="text-grayText group-hover:text-textColor transition-colors duration-200"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label={t('artists.mosaic.next')}
              className="group flex items-center justify-center w-10 h-10 border border-borderColor hover:border-textColor border-l-0 transition-colors duration-200"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="text-grayText group-hover:text-textColor transition-colors duration-200"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
