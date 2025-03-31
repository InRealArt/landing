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
  type?: "button" | "submit" | "reset"
};

const Button = ({
  text,
  additionalClassName,
  action,
  link,
  icon,
  disabled,
  center,
  type = "button"
}: Props) => {
  const className = ` ${additionalClassName ?? ''} ${center ? 'justify-center' : ''} inline-flex border bg-backgroundColor p-4 gap-4 rounded-xl `;

  if (link)
    return (
      <Link className={className} href={link} onClick={action}>
        <span className='unbounded font-semibold'>{text}</span>
        {icon}
      </Link>
    );

  return (
    <button
      disabled={disabled}
      className={className}
      type={type}
      onClick={action}
    >
      <span className='unbounded font-semibold'>{text}</span>
      {icon}
    </button>
  );
};

export default Button;
