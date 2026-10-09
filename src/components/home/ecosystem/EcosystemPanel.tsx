'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CONTENT, GALLERY, tk, type SelectableId, type Visual } from './ecosystemData'
import styles from './HomeEcosystemHero.module.css'

interface EcosystemPanelProps {
  t: (key: string) => string
  selected: SelectableId | null
  onSelect: (id: SelectableId) => void
  onReset: () => void
  onTour: () => void
  onView: (index: number) => void
}

const isExternal = (href: string) => /^https?:\/\//.test(href)

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PrimaryAction({ href, children }: { href: string; children: ReactNode }) {
  if (isExternal(href)) {
    return (
      <a className={styles.btn} href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <Arrow />
      </a>
    )
  }
  return (
    <Link className={styles.btn} href={href}>
      {children}
      <Arrow />
    </Link>
  )
}

/** Visuel encadré ; si l'image ne charge pas, un cadre vide affiche sa légende */
export function FramedImage({ visual, title, sizes, className }: { visual: Visual; title: string; sizes: string; className: string }) {
  const [broken, setBroken] = useState(false)
  return (
    <span className={className} style={visual.focus ? ({ '--focus': visual.focus } as CSSProperties) : undefined}>
      {broken ? (
        <span className={styles.ph}>{title}</span>
      ) : (
        <Image src={visual.src} alt={title} fill sizes={sizes} onError={() => setBroken(true)} />
      )}
    </span>
  )
}

export default function EcosystemPanel({ t, selected, onSelect, onReset, onTour, onView }: EcosystemPanelProps) {
  const content = selected ? CONTENT[selected] : null
  const visuals = GALLERY[selected ?? 'default']
  const nodeName = (id: SelectableId) => t(tk(`nodes.${id}.label`))

  return (
    <div className={styles.panel}>
      {/* Annonce courte de la sélection, plutôt que de faire relire tout le panneau */}
      <p className="sr-only" role="status">
        {content ? t(`${content.key}.title`) : ''}
      </p>
      <div key={selected ?? 'default'} className={styles.panelInner}>
        {!content && (
          <>
            <div>
              <p className={styles.kicker}>{t(tk('panel.kicker'))}</p>
              <h2 className={styles.pTitle}>{t(tk('panel.title'))}</h2>
              <p className={styles.pIntro}>{t(tk('panel.intro'))}</p>
              <div className={styles.actions}>
                <PrimaryAction href={CONTENT.amp.href}>{t(tk('panel.cta'))}</PrimaryAction>
                <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={onTour}>
                  {t(tk('panel.tourCta'))}
                </button>
              </div>
            </div>
            <div className={styles.trio}>
              {(['reveal', 'amplify', 'connect'] as const).map((k) => (
                <div key={k}>
                  <h3>{t(tk(`panel.${k}`))}</h3>
                  <p>{t(tk(`panel.${k}Text`))}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {content && (
          <>
            <div>
              <p className={styles.kicker}>
                {content.type === 'pillar' ? t(`${content.key}.kicker`) : t(tk('panel.yourPath'))}
              </p>
              <h2 className={styles.pTitle}>{t(`${content.key}.title`)}</h2>
              <p className={styles.pIntro}>{t(`${content.key}.intro`)}</p>
              <div className={styles.actions}>
                <PrimaryAction href={content.href}>{t(`${content.key}.cta`)}</PrimaryAction>
                <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={onReset}>
                  {t(tk('panel.overview'))}
                </button>
              </div>
            </div>

            {content.type === 'pillar' ? (
              <dl className={styles.dl}>
                <dt>{t(tk('panel.forWho'))}</dt>
                <dd>{t(`${content.key}.forWho`)}</dd>
                <dt>{t(tk('panel.does'))}</dt>
                <dd>
                  <ul className={styles.list}>
                    {[1, 2, 3].map((i) => (
                      <li key={i}>{t(`${content.key}.does${i}`)}</li>
                    ))}
                  </ul>
                </dd>
                <dt>{t(tk('panel.proof'))}</dt>
                <dd className={styles.proof}>{t(`${content.key}.proof`)}</dd>
              </dl>
            ) : (
              <ol className={styles.route}>
                {content.steps.map(([id, textKey, sel]) => (
                  <li key={textKey} data-sel={sel ? 'true' : undefined}>
                    <button type="button" className={styles.routeNode} onClick={() => onSelect(id)}>
                      {nodeName(id)}
                    </button>
                    <p>{t(textKey)}</p>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}

        <div className={styles.hang}>
          {selected === 'artiste' && <p className={styles.kicker}>{t(tk('panel.signaturesTitle'))}</p>}
          <div className={styles.hangRow}>
            {visuals.map((v, i) => {
              const title = t(v.titleKey)
              return (
                <figure key={v.id} className={styles.hangItem}>
                  <button
                    type="button"
                    className={styles.frame}
                    onClick={() => onView(i)}
                    aria-label={`${t(tk('panel.enlarge'))} ${title}`}
                  >
                    <FramedImage
                      visual={v}
                      title={title}
                      className={styles.mat}
                      sizes="(max-width: 760px) 78vw, (max-width: 1240px) 30vw, 380px"
                    />
                  </button>
                  <figcaption className={styles.cartel}>
                    <b>{title}</b>
                    <span>{t(v.noteKey)}</span>
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
