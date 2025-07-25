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
        <legend className="block text-sm font-medium text-gray-300 mb-3 font-unbounded">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </legend>
        <div className={`${inline ? 'flex flex-wrap gap-4' : 'space-y-3'} p-4 rounded-lg border-2 ${error ? 'border-red-500' : 'border-gray-700'} bg-gray-800`}>
          {options.map((option) => (
            <label
              key={option.value}
              className={`flex items-center cursor-pointer ${inline ? 'flex-shrink-0' : ''} ${
                option.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                disabled={option.disabled}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500 focus:ring-2"
              />
              <span className="ml-3 text-white font-unbounded">{option.label}</span>
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