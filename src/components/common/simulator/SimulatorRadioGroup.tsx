import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SimulatorRadioGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  error?: string;
  inline?: boolean;
}

export default function SimulatorRadioGroup({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error,
  inline = false,
}: SimulatorRadioGroupProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <fieldset>
        <legend className="block text-xs uppercase tracking-[0.2em] text-[var(--gray-text)] mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </legend>
        <div className={`${inline ? 'flex flex-wrap gap-3' : 'space-y-3'} p-4 border ${error ? 'border-red-500' : 'border-[var(--border-light)]'} bg-[var(--canvas-bg)]`}>
          {options.map((option) => (
            <label
              key={option.value}
              className={`flex items-center cursor-pointer ${inline ? 'flex-shrink-0' : ''} ${
                option.disabled ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                disabled={option.disabled}
                className="w-3.5 h-3.5 accent-[var(--ink-black)] border-[var(--border-light)]"
              />
              <span className={`ml-3 text-sm uppercase tracking-[0.15em] font-montserrat transition-colors ${value === option.value ? 'text-[var(--ink-black)]' : 'text-[var(--gray-text)]'}`}>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
} 