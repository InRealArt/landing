import type { SaveState } from './useAutosave'

const LABELS: Record<SaveState, string> = {
  idle: '',
  pending: 'Modifications en attente…',
  saving: 'Enregistrement…',
  saved: 'Enregistré',
  error: 'Non enregistré',
  locked: 'Questionnaire déjà envoyé',
  invalid: 'Un champ dépasse la longueur autorisée',
}

export default function SaveIndicator({ state, onRetry }: { state: SaveState; onRetry: () => void }) {
  return (
    <p aria-live="polite" className="flex min-h-[1.5rem] items-center gap-2 text-xs uppercase tracking-[0.2em] text-textColor/70">
      {state !== 'idle' && (
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${state === 'saved' ? 'bg-gold-accent' : state === 'error' || state === 'invalid' ? 'bg-textColor' : 'animate-pulse bg-textColor/40 motion-reduce:animate-none'}`}
        />
      )}
      {LABELS[state]}
      {state === 'error' && (
        <button type="button" onClick={onRetry} className="min-h-[44px] underline underline-offset-4 hover:text-gold-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent">
          Réessayer
        </button>
      )}
    </p>
  )
}
