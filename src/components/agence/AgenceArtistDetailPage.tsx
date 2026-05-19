'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import type { UgcArtistProfileData } from '@/actions/ugcActions'
import { getImageUrl } from '@/lib/cloufare/r2/url'

interface Props {
  artist: UgcArtistProfileData
}

function displayName(artist: UgcArtistProfileData): string {
  if (artist.pseudo) return artist.pseudo
  const parts = [artist.name, artist.surname].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : '—'
}

function formatMetric(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`
  return value.toLocaleString()
}

function SocialIcon({ network }: { network: string }) {
  switch (network) {
    case 'INSTAGRAM':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'TIKTOK':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.16 8.16 0 0 0 4.78 1.52V7.12a4.85 4.85 0 0 1-1.01-.43z" />
        </svg>
      )
    case 'YOUTUBE':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14C4.45 20.5 12 20.5 12 20.5s7.55 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.81zM9.75 15.52V8.48L15.5 12l-5.75 3.52z" />
        </svg>
      )
    case 'FACEBOOK':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z" />
        </svg>
      )
    case 'TWITTER_X':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    case 'LINKEDIN':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    case 'TWITCH':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
        </svg>
      )
    default:
      return null
  }
}

const SOCIAL_LABELS: Record<string, string> = {
  INSTAGRAM: 'Instagram',
  TIKTOK: 'TikTok',
  YOUTUBE: 'YouTube',
  FACEBOOK: 'Facebook',
  TWITTER_X: 'X / Twitter',
  LINKEDIN: 'LinkedIn',
  PINTEREST: 'Pinterest',
  SNAPCHAT: 'Snapchat',
  TWITCH: 'Twitch',
  REDDIT: 'Reddit',
  DISCORD: 'Discord',
  TELEGRAM: 'Telegram',
  THREADS: 'Threads',
  BEHANCE: 'Behance',
  DEVIANTART: 'DeviantArt',
  ARTSTATION: 'ArtStation',
}

const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogv'])
const VIDEO_HOSTS = ['youtube.com', 'youtu.be', 'vimeo.com', 'tiktok.com', 'instagram.com/reel']

function isVideoUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (VIDEO_HOSTS.some((h) => parsed.hostname.includes(h) || parsed.pathname.includes(h))) return true
    const ext = parsed.pathname.split('.').pop()?.toLowerCase() ?? ''
    return VIDEO_EXTENSIONS.has(ext)
  } catch {
    const ext = url.split('?')[0].split('.').pop()?.toLowerCase() ?? ''
    return VIDEO_EXTENSIONS.has(ext)
  }
}

function splitMediaUrls(rawUrls: string[]): { photos: string[]; videos: string[] } {
  const photos: string[] = []
  const videos: string[] = []
  for (const url of rawUrls) {
    const resolved = getImageUrl(url)
    if (!resolved) continue
    if (isVideoUrl(url)) videos.push(resolved)
    else photos.push(resolved)
  }
  return { photos, videos }
}

function useSanitizedHtml(raw: string | null) {
  const [html, setHtml] = useState('')
  useEffect(() => {
    if (!raw) return
    // DOMPurify imported dynamically (client-only) to sanitize HTML from the database
    import('dompurify').then(({ default: DOMPurify }) => {
      setHtml(DOMPurify.sanitize(raw))
    })
  }, [raw])
  return html
}

export default function AgenceArtistDetailPage({ artist }: Props) {
  const { t } = useTranslation()
  const name = displayName(artist)
  const profileImage = getImageUrl(artist.profileImageUrl)
  const metrics = artist.socialMetrics
  const networks = metrics?.socialNetworks ?? []
  const { photos, videos } = splitMediaUrls(artist.mediaUrls)
  const sanitizedPresentation = useSanitizedHtml(artist.presentation)

  // Refs for GSAP targets
  const heroPortraitRef = useRef<HTMLDivElement>(null)
  const heroInfoRef = useRef<HTMLDivElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)
  const presentationRef = useRef<HTMLDivElement>(null)
  const metricsRef = useRef<HTMLDivElement>(null)
  const reelsRef = useRef<HTMLDivElement>(null)
  const photosRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let ctx: ReturnType<typeof import('gsap').gsap.context> | undefined

    import('gsap').then(({ gsap }) =>
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)

        ctx = gsap.context(() => {
          // ── Hero portrait: clip-path reveal left→right ──────────────────────
          if (heroPortraitRef.current) {
            gsap.fromTo(
              heroPortraitRef.current,
              { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
              {
                clipPath: 'inset(0 0% 0 0)',
                duration: 1.2,
                ease: 'expo.out',
                delay: 0.1,
              }
            )
          }

          // ── Hero info: staggered fade-up on children ─────────────────────────
          if (heroInfoRef.current) {
            const children = heroInfoRef.current.querySelectorAll<HTMLElement>(
              '[data-anim]'
            )
            gsap.fromTo(
              children,
              { opacity: 0, y: 28 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power3.out',
                stagger: 0.1,
                delay: 0.4,
              }
            )
          }

          // ── Tags "Son univers": fade-in section + marquee infini ─────────────
          if (tagsRef.current) {
            // Fade-in de la section entière
            gsap.fromTo(tagsRef.current, { opacity: 0 }, {
              opacity: 1, duration: 0.8, ease: 'power2.out',
              scrollTrigger: { trigger: tagsRef.current, start: 'top 88%', once: true },
            })

            // Marquee piste 1 → gauche (forward)
            const track1 = tagsRef.current.querySelector<HTMLElement>('[data-marquee-track="forward"]')
            if (track1) {
              const w = track1.scrollWidth / 4 // 4 copies = un quart = 1 loop
              gsap.fromTo(track1, { x: 0 }, {
                x: -w,
                duration: 28,
                ease: 'none',
                repeat: -1,
              })
            }

            // Marquee piste 2 → droite (reverse)
            const track2 = tagsRef.current.querySelector<HTMLElement>('[data-marquee-track="reverse"]')
            if (track2) {
              const w2 = track2.scrollWidth / 4
              gsap.fromTo(track2, { x: -w2 }, {
                x: 0,
                duration: 22,
                ease: 'none',
                repeat: -1,
              })
            }
          }

          // ── Présentation: label slide-in + text fade-up ──────────────────────
          if (presentationRef.current) {
            const label = presentationRef.current.querySelector('[data-anim-label]')
            const body = presentationRef.current.querySelector('[data-anim-body]')
            if (label) {
              gsap.fromTo(
                label,
                { opacity: 0, x: -32 },
                {
                  opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
                  scrollTrigger: { trigger: label, start: 'top 88%', once: true },
                }
              )
            }
            if (body) {
              gsap.fromTo(
                body,
                { opacity: 0, y: 24 },
                {
                  opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.15,
                  scrollTrigger: { trigger: body, start: 'top 88%', once: true },
                }
              )
            }
          }

          // ── Métriques: header fade-up + count-up on metric values ────────────
          if (metricsRef.current) {
            const header = metricsRef.current.querySelector('[data-anim-header]')
            const cards = metricsRef.current.querySelectorAll<HTMLElement>('[data-anim-metric]')

            if (header) {
              gsap.fromTo(
                header,
                { opacity: 0, y: 24 },
                {
                  opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
                  scrollTrigger: { trigger: header, start: 'top 88%', once: true },
                }
              )
            }

            cards.forEach((card) => {
              const numEl = card.querySelector<HTMLElement>('[data-count]')
              const rawVal = numEl?.dataset.count

              gsap.fromTo(
                card,
                { opacity: 0, y: 36 },
                {
                  opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
                  scrollTrigger: { trigger: card, start: 'top 88%', once: true },
                  onStart() {
                    // Count-up: animate from 0 to displayed value
                    if (!numEl || !rawVal) return
                    const isFloat = rawVal.includes('.')
                    const suffix = rawVal.replace(/[\d.]/g, '')
                    const numeric = parseFloat(rawVal)
                    if (isNaN(numeric)) return
                    gsap.fromTo(
                      { val: 0 },
                      { val: numeric },
                      {
                        duration: 1.4,
                        ease: 'power2.out',
                        onUpdate() {
                          const v = (this as unknown as gsap.core.Tween).targets()[0] as { val: number }
                          numEl.textContent = (isFloat
                            ? v.val.toFixed(1)
                            : Math.round(v.val).toString()
                          ) + suffix
                        },
                      }
                    )
                  },
                }
              )
            })
          }

          // ── Reels: stagger fade-up ────────────────────────────────────────────
          if (reelsRef.current) {
            const header = reelsRef.current.querySelector('[data-anim-header]')
            const items = reelsRef.current.querySelectorAll<HTMLElement>('[data-anim-item]')
            if (header) {
              gsap.fromTo(header, { opacity: 0, y: 20 }, {
                opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
                scrollTrigger: { trigger: header, start: 'top 90%', once: true },
              })
            }
            if (items.length) {
              gsap.fromTo(items, { opacity: 0, y: 40, scale: 0.97 }, {
                opacity: 1, y: 0, scale: 1,
                duration: 0.7, ease: 'power3.out', stagger: 0.12,
                scrollTrigger: { trigger: reelsRef.current, start: 'top 85%', once: true },
              })
            }
          }

          // ── Photos: stagger fade-up ───────────────────────────────────────────
          if (photosRef.current) {
            const header = photosRef.current.querySelector('[data-anim-header]')
            const items = photosRef.current.querySelectorAll<HTMLElement>('[data-anim-item]')
            if (header) {
              gsap.fromTo(header, { opacity: 0, y: 20 }, {
                opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
                scrollTrigger: { trigger: header, start: 'top 90%', once: true },
              })
            }
            if (items.length) {
              gsap.fromTo(items, { opacity: 0, y: 32 }, {
                opacity: 1, y: 0,
                duration: 0.55, ease: 'power2.out', stagger: 0.06,
                scrollTrigger: { trigger: photosRef.current, start: 'top 85%', once: true },
              })
            }
          }

          // ── CTA footer: fade-up ───────────────────────────────────────────────
          if (ctaRef.current) {
            gsap.fromTo(ctaRef.current, { opacity: 0, y: 24 }, {
              opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: ctaRef.current, start: 'top 90%', once: true },
            })
          }
        })
      })
    )

    return () => {
      ctx?.revert()
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((st) => st.kill())
      })
    }
  }, [])

  return (
    <main className="pt-headerSize min-h-screen bg-backgroundColor text-textColor">

      {/* Hero */}
      <section className="border-b border-borderColor">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr]">

            {/* Portrait — clip-path reveal */}
            <div
              ref={heroPortraitRef}
              className="relative aspect-[3/4] lg:aspect-auto lg:min-h-[600px] bg-cardBackground overflow-hidden"
              style={{ clipPath: 'inset(0 100% 0 0)' }}
            >
              {profileImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={profileImage}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-backgroundGrey" />
              )}
            </div>

            {/* Info panel — stagger children */}
            <div ref={heroInfoRef} className="flex flex-col px-10 lg:px-16 py-12 gap-8">

              <div data-anim>
                <Link
                  href="/agence/artists"
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] montserrat text-grayText hover:text-gold-accent transition-colors duration-300"
                >
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M10 6H2M6 2L2 6l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t('agence.artists.detail.backToList')}
                </Link>
              </div>

              <div className="flex flex-col gap-6 flex-1">
                <div data-anim>
                  <h1 className="serif text-5xl md:text-6xl font-light leading-tight text-textColor">
                    {name}
                  </h1>
                  {artist.title && (
                    <p className="mt-2 text-[11px] uppercase tracking-[0.4em] montserrat text-grayText">
                      {artist.title}
                    </p>
                  )}
                </div>

                {artist.description && (
                  <p data-anim className="text-[13px] text-grayText leading-relaxed montserrat max-w-lg">
                    {artist.description}
                  </p>
                )}

                {networks.length > 0 && (
                  <div data-anim className="flex flex-wrap gap-2">
                    {networks.map((net) => (
                      <span
                        key={net}
                        className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] montserrat border border-borderColor text-textColor px-3 py-1.5 hover:border-gold-accent hover:text-gold-accent transition-colors duration-200"
                      >
                        <SocialIcon network={net} />
                        {SOCIAL_LABELS[net] ?? net}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Son univers — double marquee */}
      {artist.tags.length > 0 && (
        <section ref={tagsRef} className="border-b border-borderColor py-14 overflow-hidden" style={{ opacity: 0 }}>

          {/* Eyebrow — centré, au-dessus des pistes */}
          <div className="max-w-screen-2xl mx-auto px-10 mb-10">
            <div className="flex items-center gap-5">
              <span className="h-px bg-borderColor flex-1" />
              <span className="text-[9px] uppercase tracking-[0.6em] montserrat text-grayText/60 whitespace-nowrap">
                {t('agence.artists.detail.tagsLabel')}
              </span>
              <span className="h-px bg-borderColor flex-1" />
            </div>
          </div>

          {/* Piste 1 — défilement gauche, grande typo serif */}
          <div className="flex overflow-hidden py-3">
            <div data-marquee-track="forward" className="flex shrink-0 gap-12 items-center whitespace-nowrap will-change-transform">
              {[...artist.tags, ...artist.tags, ...artist.tags, ...artist.tags].map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-4">
                  <span className="serif text-4xl md:text-5xl lg:text-6xl font-light text-textColor leading-[1.2] tracking-tight">
                    {tag}
                  </span>
                  <span className="text-gold-accent text-2xl leading-none select-none">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* Piste 2 — défilement droite, typo montserrat uppercase, outline */}
          <div className="flex overflow-visible py-4">
            <div data-marquee-track="reverse" className="flex shrink-0 gap-10 items-center whitespace-nowrap will-change-transform">
              {[...artist.tags, ...artist.tags, ...artist.tags, ...artist.tags].map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-4">
                  <span
                    className="montserrat text-2xl md:text-3xl font-semibold uppercase tracking-[0.15em] leading-none"
                    style={{ WebkitTextStroke: '1px var(--border-color)', color: 'transparent' }}
                  >
                    {tag}
                  </span>
                  <span className="text-borderColor text-lg leading-none select-none">·</span>
                </span>
              ))}
            </div>
          </div>

        </section>
      )}

      {/* Présentation */}
      {artist.presentation && (
        <section className="border-b border-borderColor py-20 lg:py-28">
          <div className="max-w-screen-2xl mx-auto px-10" ref={presentationRef}>
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 lg:gap-20">
              <div data-anim-label className="flex flex-col gap-3" style={{ opacity: 0 }}>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-[0.5em] montserrat text-gold-accent">01</span>
                  <span className="flex-1 h-px bg-borderColor" />
                </div>
                <p className="serif text-2xl font-light text-textColor">
                  {t('agence.artists.detail.presentationLabel')}
                </p>
              </div>

              {/* HTML sanitized content — raw comes from trusted admin input, sanitized via DOMPurify */}
              <div
                data-anim-body
                style={{ opacity: 0 }}
                className="max-w-2xl text-[15px] leading-relaxed text-textColor [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:text-grayText [&_strong]:text-textColor [&_strong]:font-medium [&_p]:mb-4 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: sanitizedPresentation }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Métriques */}
      {metrics && (
        <section className="border-b border-borderColor py-20 lg:py-28 bg-backgroundGrey">
          <div className="max-w-screen-2xl mx-auto px-10" ref={metricsRef}>
            <div data-anim-header className="mb-14" style={{ opacity: 0 }}>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] uppercase tracking-[0.5em] montserrat text-gold-accent">
                  {t('agence.artists.detail.metricsNumber')}
                </span>
                <span className="h-px bg-borderColor w-12" />
              </div>
              <h2 className="serif text-4xl md:text-5xl font-light leading-tight text-textColor">
                {t('agence.artists.detail.metricsTitle')}{' '}
                <em className="not-italic text-gold-accent">{t('agence.artists.detail.metricsTitleAccent')}</em>
              </h2>
              <p className="mt-3 text-[12px] montserrat text-grayText">
                {t('agence.artists.detail.metricsSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-borderColor">
              {[
                { value: formatMetric(metrics.totalAudience), label: t('agence.artists.metrics.audience'), sub: t('agence.artists.detail.audienceSub') },
                { value: formatMetric(metrics.averageEngagement), label: t('agence.artists.metrics.engagement'), sub: t('agence.artists.detail.engagementSub') },
                { value: formatMetric(metrics.totalConsumption), label: t('agence.artists.metrics.consumption'), sub: t('agence.artists.detail.consumptionSub') },
              ].map(({ value, label, sub }) => (
                <div
                  key={label}
                  data-anim-metric
                  className="bg-backgroundColor px-10 py-12 flex flex-col gap-2"
                  style={{ opacity: 0 }}
                >
                  <span
                    data-count={value}
                    className="serif text-5xl md:text-6xl font-light text-textColor"
                  >
                    {value}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.4em] montserrat text-gold-accent">{label}</span>
                  <span className="text-[11px] montserrat text-grayText">{sub}</span>
                </div>
              ))}
            </div>

            {networks.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <span className="text-[10px] uppercase tracking-[0.35em] montserrat text-grayText">
                  {t('agence.artists.detail.activePlatforms')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {networks.map((net) => (
                    <span
                      key={net}
                      className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] montserrat border border-borderColor text-grayText px-3 py-1"
                    >
                      <SocialIcon network={net} />
                      {SOCIAL_LABELS[net] ?? net}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Reels / Vidéos */}
      {videos.length > 0 && (
        <section className="border-b border-borderColor py-20 lg:py-28">
          <div className="max-w-screen-2xl mx-auto px-10" ref={reelsRef}>
            <div data-anim-header className="flex items-end justify-between mb-12 pb-10 border-b border-borderColor" style={{ opacity: 0 }}>
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] uppercase tracking-[0.5em] montserrat text-gold-accent">03</span>
                  <span className="h-px bg-borderColor w-8" />
                  <span className="text-[10px] uppercase tracking-[0.35em] montserrat text-grayText">
                    {t('agence.artists.detail.reelsLabel')}
                  </span>
                </div>
                <h2 className="serif text-4xl font-light text-textColor">
                  {t('agence.artists.detail.reelsTitle')}{' '}
                  <em className="not-italic text-gold-accent">{t('agence.artists.detail.reelsTitleAccent')}</em>
                </h2>
              </div>
              <span className="text-[11px] montserrat text-grayText">
                {videos.length} {t('agence.artists.detail.reelsCount')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((url, i) => (
                <div
                  key={i}
                  data-anim-item
                  className="relative aspect-[9/16] overflow-hidden bg-cardBackground"
                  style={{ opacity: 0 }}
                >
                  <video
                    src={url}
                    muted
                    loop
                    playsInline
                    controls
                    className="w-full h-full object-cover"
                    aria-label={`Reel ${name} #${i + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shooting éditorial / Photos */}
      {photos.length > 0 && (
        <section className="border-b border-borderColor py-20 lg:py-28">
          <div className="max-w-screen-2xl mx-auto px-10" ref={photosRef}>
            <div data-anim-header className="flex items-end justify-between mb-12 pb-10 border-b border-borderColor" style={{ opacity: 0 }}>
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] uppercase tracking-[0.5em] montserrat text-gold-accent">
                    {videos.length > 0 ? '04' : '03'}
                  </span>
                  <span className="h-px bg-borderColor w-8" />
                  <span className="text-[10px] uppercase tracking-[0.35em] montserrat text-grayText">
                    {t('agence.artists.detail.galleryLabel')}
                  </span>
                </div>
                <h2 className="serif text-4xl font-light text-textColor">
                  {t('agence.artists.detail.galleryTitle')}{' '}
                  <em className="not-italic text-gold-accent">{t('agence.artists.detail.galleryTitleAccent')}</em>
                </h2>
              </div>
              <span className="text-[11px] montserrat text-grayText">
                {photos.length} {t('agence.artists.detail.galleryCount')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {photos.map((url, i) => (
                <div
                  key={i}
                  data-anim-item
                  className="relative aspect-square overflow-hidden bg-cardBackground group"
                  style={{ opacity: 0 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${t('agence.artists.detail.galleryAlt')} ${name} #${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="py-20 lg:py-28 bg-backgroundGrey">
        <div
          ref={ctaRef}
          className="max-w-screen-2xl mx-auto px-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
          style={{ opacity: 0 }}
        >
          <div>
            <h2 className="serif text-3xl md:text-4xl font-light text-textColor">
              {t('agence.artists.detail.ctaTitle')}{' '}
              <em className="not-italic text-gold-accent">{name}</em>
              {' ?'}
            </h2>
            <p className="mt-3 text-[13px] montserrat text-grayText max-w-lg">
              {t('agence.artists.detail.ctaSubtitle')}
            </p>
          </div>
          <Link
            href="/agence#brief"
            className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] montserrat border border-gold-accent text-textColor px-8 py-4 hover:bg-gold-accent hover:text-white transition-all duration-300 whitespace-nowrap"
          >
            {t('agence.artists.detail.ctaButton')}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

    </main>
  )
}
