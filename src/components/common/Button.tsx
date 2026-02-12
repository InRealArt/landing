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
  const className = ` ${additionalClassName ?? ''} ${center ? 'justify-center' : ''} ${additionalClassName?.includes('bg-purpleColor') ? 'text-white' : ''} inline-flex border bg-backgroundColor p-4 gap-4 rounded-xl items-center`;

  if (link)
    return (
      <Link className={className} href={link} onClick={action} download={download} target={target} {...rest}>
        {iconBefore && icon}
        <span className='unbounded font-semibold text-sm'>{text}</span>
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
      <span className='unbounded font-semibold text-sm'>{text}</span>
      {!iconBefore && icon}
    </button>
  );
};

export default Button;
