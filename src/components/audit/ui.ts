// Classes Tailwind partagées par les composants du formulaire d'audit (tokens du site uniquement).

export const fieldClass =
  'w-full min-h-[48px] rounded-sm border border-textColor/30 bg-cardBackground px-4 py-3 text-base text-textColor placeholder:text-textColor/40 transition-colors duration-200 focus:border-gold-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent/60'

export const labelClass = 'mb-2 block text-xs uppercase tracking-[0.25em] text-textColor/70'

export const primaryButton =
  'inline-flex min-h-[48px] items-center justify-center gap-2 bg-gold-accent px-8 text-xs font-semibold uppercase tracking-[0.25em] text-black transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent focus-visible:ring-offset-2 focus-visible:ring-offset-backgroundColor disabled:cursor-not-allowed disabled:opacity-40'

export const ghostButton =
  'inline-flex min-h-[48px] items-center justify-center gap-2 border border-textColor/30 px-6 text-xs uppercase tracking-[0.25em] text-textColor transition-colors duration-200 hover:border-gold-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent focus-visible:ring-offset-2 focus-visible:ring-offset-backgroundColor disabled:cursor-not-allowed disabled:opacity-40'
