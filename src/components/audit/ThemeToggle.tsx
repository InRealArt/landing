'use client'

import { useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

// Clé propre à l'audit : on n'hérite pas du thème clair par défaut du site.
const THEME_KEY = 'audit-theme'

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

const getTheme = (): Theme => (document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark')

/** Sélecteur de thème discret : le header du site n'est pas présent sur les pages d'audit. */
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'dark' as Theme)

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      // Stockage indisponible : le thème reste valable pour la session
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'}
      className="flex h-11 w-11 items-center justify-center text-textColor/80 transition-colors hover:text-gold-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        {theme === 'dark' ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
          </>
        ) : (
          <path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z" />
        )}
      </svg>
    </button>
  )
}
