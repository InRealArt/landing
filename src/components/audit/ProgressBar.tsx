'use client'

import { useEffect, useRef } from 'react'
import { loadGsap } from '@/lib/gsap'
import { prefersReducedMotion } from './anim'

interface Props {
  /** 0 à 100 */
  percent: number
  label: string
}

export default function ProgressBar({ percent, label }: Props) {
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    void loadGsap().then(({ gsap }) => {
      if (cancelled || !fillRef.current) return
      gsap.to(fillRef.current, { width: `${percent}%`, duration: prefersReducedMotion() ? 0 : 0.8, ease: 'power3.out' })
    })
    return () => {
      cancelled = true
    }
  }, [percent])

  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percent)} aria-label={label} className="h-0.5 w-full bg-textColor/15">
      <div ref={fillRef} className="h-full bg-gold-accent" style={{ width: `${percent}%` }} />
    </div>
  )
}
