'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { getImageUrl } from '@/lib/cloufare/r2/url'

const MAX_RETRIES = 4
const BASE_DELAY_MS = 800

export type ImageStatus = 'loading' | 'retrying' | 'ready' | 'error'

function resolveImageSrc(src: string): string {
  return getImageUrl(src) ?? src
}

function withCacheBuster(src: string, attempt: number): string {
  if (attempt === 0) return src
  try {
    const url = new URL(src)
    url.searchParams.set('_r', String(attempt))
    return url.toString()
  } catch {
    return src
  }
}

interface UseCloudStorageImageReturn {
  src: string
  status: ImageStatus
  onLoad: () => void
  onError: () => void
  imgRef: (node: HTMLImageElement | null) => void
}

export function useCloudStorageImage(rawSrc: string): UseCloudStorageImageReturn {
  // Resolve once per rawSrc change and track it as a ref so callbacks stay
  // stable without being recreated on every render.
  const cleanSrcRef = useRef(resolveImageSrc(rawSrc))

  const [src, setSrc] = useState(() => cleanSrcRef.current)
  const [status, setStatus] = useState<ImageStatus>('loading')
  const retryCount = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Bug fix 2: when rawSrc changes (e.g. slot reuse), reset state to match.
  const prevRawSrc = useRef(rawSrc)
  useEffect(() => {
    if (rawSrc === prevRawSrc.current) return
    prevRawSrc.current = rawSrc
    const next = resolveImageSrc(rawSrc)
    cleanSrcRef.current = next
    retryCount.current = 0
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setSrc(next)
    setStatus('loading')
  }, [rawSrc])

  // Bug fix 3: clear pending retry timer on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const onLoad = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setStatus('ready')
  }, [])

  const onError = useCallback(() => {
    if (retryCount.current >= MAX_RETRIES) {
      setStatus('error')
      return
    }

    retryCount.current += 1
    setStatus('retrying')

    const delay = BASE_DELAY_MS * Math.pow(2, retryCount.current - 1)
    timerRef.current = setTimeout(() => {
      setSrc(withCacheBuster(cleanSrcRef.current, retryCount.current))
    }, delay)
  }, [])

  // Bug fix 1: if the browser has already cached the image, the <img> element
  // is `complete` the moment it is mounted — the onLoad event never fires.
  // This ref callback checks img.complete right after the element is attached
  // to the DOM and transitions to 'ready' immediately in that case.
  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (!node) return
    if (node.complete && node.naturalWidth > 0) {
      setStatus('ready')
    }
  }, [])

  return { src, status, onLoad, onError, imgRef }
}
