'use client'

import { useEffect, useRef } from 'react'
import { celebrate } from './anim'
import { ghostButton } from './ui'

interface Props {
  clientName: string
  celebrateOnMount: boolean
  onReview: () => void
}

export default function Done({ clientName, celebrateOnMount, onReview }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (celebrateOnMount) celebrate(ref.current)
  }, [celebrateOnMount])

  return (
    <div ref={ref} className="relative py-10 text-center">
      <div data-anim className="mx-auto mb-8 h-px w-16 bg-gold-accent" />
      <h1 data-anim data-step-heading tabIndex={-1} className="serif mb-6 text-5xl font-light leading-tight text-textColor outline-none sm:text-6xl">
        Merci, <em className="text-gold-accent">{clientName}</em>
      </h1>
      <p data-anim className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-textColor/80">
        Vos réponses ont bien été envoyées. Elles sont confidentielles et ne seront utilisées que pour réaliser votre audit. Vous recevrez votre diagnostic
        à l’issue de l’analyse. Vous pouvez fermer cette page.
      </p>
      <div data-anim>
        <button type="button" onClick={onReview} className={ghostButton}>Consulter mes réponses</button>
      </div>
    </div>
  )
}
