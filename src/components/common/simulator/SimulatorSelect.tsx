import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SimulatorSelectProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
  placeholder?: string;
  error?: string;
}

export default function SimulatorSelect({
  label,
  id,
  name,
  value,
  onChange,
  options,
  required = false,
  placeholder,
  error,
}: SimulatorSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-xs uppercase tracking-[0.12em] sm:tracking-[0.2em] text-[var(--gray-text)] mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          // Sans label visible, le placeholder sert de nom accessible (sans l'astérisque : `required` l'annonce déjà)
          aria-label={label ? undefined : placeholder?.replace(/\s*\*$/, '')}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full px-4 py-3.5 sm:py-3 pr-10 min-h-12 border ${error ? 'border-red-500' : 'border-[var(--border-light)]'} bg-[var(--canvas-bg)] focus:border-[var(--ink-black)] focus:outline-none text-[var(--ink-black)] appearance-none font-montserrat text-base sm:text-sm transition-colors duration-200`}
        >
          {placeholder && (
            <option value="" disabled className="text-[var(--gray-text)]">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="bg-white text-[var(--ink-black)]"
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--gray-text)] pointer-events-none" />
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
} 