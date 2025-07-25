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
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          className={`w-full px-4 py-4 rounded-lg border-2 ${error ? 'border-red-500' : 'border-gray-700'} bg-gray-800 focus:border-purple-500 focus:outline-none text-white appearance-none font-unbounded`}
        >
          {placeholder && (
            <option value="" disabled className="text-gray-400">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="bg-gray-800 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
} 