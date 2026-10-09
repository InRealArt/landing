'use client'

import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { tk, type Visual } from './ecosystemData'
import { FramedImage } from './EcosystemPanel'
import styles from './HomeEcosystemHero.module.css'

import 'swiper/css'

interface EcosystemLightboxProps {
  t: (key: string) => string
  visuals: Visual[]
  index: number | null
  onIndexChange: (index: number | null) => void
}

export default function EcosystemLightbox({ t, visuals, index, onIndexChange }: EcosystemLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (index !== null && !dialog.open) dialog.showModal()
    if (index === null && dialog.open) dialog.close()
  }, [index])

  return (
    <dialog
      ref={dialogRef}
      className={styles.lb}
      aria-label={t(tk('panel.viewer'))}
      onClose={() => onIndexChange(null)}
      onClick={(e) => e.target === dialogRef.current && onIndexChange(null)}
    >
      {/* Le carrousel est monté à l'ouverture pour démarrer sur le visuel cliqué */}
      {index !== null && (
        <LightboxCarousel t={t} visuals={visuals} initialIndex={index} onIndexChange={onIndexChange} />
      )}
    </dialog>
  )
}

function LightboxCarousel({
  t,
  visuals,
  initialIndex,
  onIndexChange,
}: {
  t: (key: string) => string
  visuals: Visual[]
  initialIndex: number
  onIndexChange: (index: number | null) => void
}) {
  const [main, setMain] = useState<SwiperType | null>(null)
  const [current, setCurrent] = useState(initialIndex)
  const multiple = visuals.length > 1

  const visual = visuals[current]
  const title = t(visual.titleKey)

  return (
    <div className={styles.lbInner}>
      <div className={styles.lbFrame}>
        <Swiper
          className={styles.lbSwiper}
          modules={[A11y, Keyboard]}
          initialSlide={initialIndex}
          speed={600}
          spaceBetween={16}
          rewind={multiple}
          allowTouchMove={multiple}
          keyboard={{ enabled: true }}
          a11y={{ prevSlideMessage: t(tk('panel.prev')), nextSlideMessage: t(tk('panel.next')) }}
          onSwiper={setMain}
          onSlideChange={(s) => {
            setCurrent(s.activeIndex)
            onIndexChange(s.activeIndex)
          }}
        >
          {visuals.map((v) => (
            <SwiperSlide key={v.id}>
              <FramedImage visual={v} title={t(v.titleKey)} className={styles.lbMat} sizes="(max-width: 1100px) 94vw, 1100px" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {multiple && (
        <div className={styles.lbThumbs}>
          {visuals.map((v, i) => (
            <button
              key={v.id}
              type="button"
              className={styles.lbThumb}
              aria-label={t(v.titleKey)}
              aria-current={i === current ? 'true' : undefined}
              onClick={() => main?.slideTo(i)}
            >
              <FramedImage visual={v} title={t(v.titleKey)} className={styles.lbThumbMat} sizes="120px" />
            </button>
          ))}
        </div>
      )}

      <div className={styles.lbFoot}>
        <div className={styles.cartel} aria-live="polite">
          {multiple && (
            <span className={styles.lbCount}>
              {String(current + 1).padStart(2, '0')} / {String(visuals.length).padStart(2, '0')}
            </span>
          )}
          <b>{title}</b>
          <span>{t(visual.noteKey)}</span>
        </div>
        <div className={styles.lbNav}>
          {multiple && (
            <>
              <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={() => main?.slidePrev()}>
                {t(tk('panel.prev'))}
              </button>
              <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={() => main?.slideNext()}>
                {t(tk('panel.next'))}
              </button>
            </>
          )}
          <button type="button" className={styles.btn} onClick={() => onIndexChange(null)}>
            {t(tk('panel.close'))}
          </button>
        </div>
      </div>
    </div>
  )
}
