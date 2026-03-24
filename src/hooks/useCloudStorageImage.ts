'use client'

import { useState, useCallback, useRef } from 'react'
import { firebaseUrlToR2 } from '@/lib/cloufare/r2/url'

const MAX_RETRIES = 4
const BASE_DELAY_MS = 800

export type ImageStatus = 'loading' | 'retrying' | 'ready' | 'error'

function resolveImageSrc(src: string): string {
  if (!src) return src
  try {
    const url = new URL(src)
    if (url.hostname === 'firebasestorage.googleapis.com') {
      return firebaseUrlToR2(src) ?? src
    }
  } catch {}
  return src
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
}

export function useCloudStorageImage(rawSrc: string): UseCloudStorageImageReturn {
  const cleanSrc = resolveImageSrc(rawSrc)
  const [src, setSrc] = useState(cleanSrc)
  const [status, setStatus] = useState<ImageStatus>('loading')
  const retryCount = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
      setSrc(withCacheBuster(cleanSrc, retryCount.current))
    }, delay)
  }, [cleanSrc])

  return { src, status, onLoad, onError }
}
