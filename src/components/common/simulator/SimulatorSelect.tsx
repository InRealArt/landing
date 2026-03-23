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
        <label htmlFor={id} className="block text-[10px] uppercase tracking-[0.2em] text-[var(--gray-text)] mb-2">
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
          className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-[var(--border-light)]'} bg-[var(--canvas-bg)] focus:border-[var(--ink-black)] focus:outline-none text-[var(--ink-black)] appearance-none font-montserrat text-sm transition-colors duration-200`}
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
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
} 