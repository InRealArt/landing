/** Compteur discret, affiché seulement à partir de 90 % de la limite. */
export default function CharCount({ length, max }: { length: number; max: number }) {
  if (length < max * 0.9) return null
  return (
    <p aria-live="polite" className="mt-1 text-right text-xs text-textColor/70">
      {length}/{max}{length >= max ? ' · limite atteinte' : ''}
    </p>
  )
}
