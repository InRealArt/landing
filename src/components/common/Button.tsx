import React, { JSX } from 'react';
import Link from 'next/link';

type Props = {
  text: string;
  additionalClassName?: string;
  action?: (() => void) | ((e: unknown) => void);
  link?: string;
  icon?: JSX.Element;
  disabled?: boolean;
  center?: boolean;
  type?: "button" | "submit" | "reset";
  iconBefore?: boolean;
  download?: boolean;
  target?: string;
  'data-umami-event'?: string;
};

// Boutons formulaires techniques : ne pas appliquer le style DA
const FORM_BUTTON_MARKERS = ['py-4', 'text-lg', 'rounded-lg', 'disabled:'];

const isCta = (
  additionalClassName: string | undefined,
  type: 'button' | 'submit' | 'reset',
): boolean => {
  if (!additionalClassName?.includes('bg-purpleColor')) return false;
  // Les boutons de soumission ou réinitialisation de formulaire gardent leur style d'origine
  if (type === 'submit' || type === 'reset') return false;
  return !FORM_BUTTON_MARKERS.some((marker) => additionalClassName.includes(marker));
};

const Button = ({
  text,
  additionalClassName,
  action,
  link,
  icon,
  disabled,
  center,
  type = "button",
  download = false,
  iconBefore = false,
  target = '_self',
  ...rest
}: Props) => {
  const useCta = isCta(additionalClassName, type);

  // Filtrer bg-purpleColor des classes additionnelles pour btn-cta (évite conflit couleur)
  const extraClasses = useCta
    ? (additionalClassName ?? '').replace('bg-purpleColor', '').trim()
    : additionalClassName ?? '';

  const className = useCta
    ? `btn-cta ${extraClasses}`.trim()
    : `${extraClasses} ${center ? 'justify-center' : ''} inline-flex border bg-backgroundColor p-4 gap-4 rounded-xl items-center`.trim();

  const textClassName = useCta
    ? 'text-[0.6rem] uppercase tracking-[0.25em]'
    : 'unbounded font-semibold text-sm';

  if (link)
    return (
      <Link className={className} href={link} onClick={action} download={download} target={target} {...rest}>
        {iconBefore && icon}
        <span className={textClassName}>{text}</span>
        {!iconBefore && icon}
      </Link>
    );

  return (
    <button
      disabled={disabled}
      className={className}
      type={type}
      onClick={action}
      {...rest}
    >
      {iconBefore && icon}
      <span className={textClassName}>{text}</span>
      {!iconBefore && icon}
    </button>
  );
};

export default Button;
