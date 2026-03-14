'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

const MAX_RETRIES = 8
const BASE_DELAY_MS = 500

export type ImageStatus = 'loading' | 'retrying' | 'ready' | 'error'

function stripFirebaseToken(src: string): string {
  if (!src) return src
  try {
    const url = new URL(src)
    if (url.hostname === 'firebasestorage.googleapis.com') {
      url.searchParams.delete('token')
      return url.toString()
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

interface UseFirebaseImageReturn {
  src: string
  status: ImageStatus
  onLoad: () => void
  onError: () => void
}

export function useFirebaseImage(rawSrc: string): UseFirebaseImageReturn {
  const cleanSrc = stripFirebaseToken(rawSrc)
  const [src, setSrc] = useState(cleanSrc)
  const [status, setStatus] = useState<ImageStatus>('loading')
  const retryCount = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reset quand la source change + annule tout timer en cours
  useEffect(() => {
    setSrc(cleanSrc)
    setStatus('loading')
    retryCount.current = 0
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [cleanSrc])

  // Cleanup au unmount
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

    const exponential = BASE_DELAY_MS * Math.pow(2, retryCount.current - 1)
    const jitter = Math.random() * 300
    const delay = Math.min(exponential + jitter, 15_000)
    timerRef.current = setTimeout(() => {
      setSrc(withCacheBuster(cleanSrc, retryCount.current))
    }, delay)
  }, [cleanSrc])

  return { src, status, onLoad, onError }
}
