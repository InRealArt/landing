import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface SimulatorInputProps {
  label: string;
  id: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'number';
  value: string | number;
  onChange: (value: string | number) => void;
  required?: boolean;
  min?: number;
  max?: number;
  step?: string;
  placeholder?: string;
  error?: string;
}

export default function SimulatorInput({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  min,
  max,
  step,
  placeholder,
  error
}: SimulatorInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(newValue);
  };

  const handlePhoneChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-grayText mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {type === 'tel' ? (
        <PhoneInput
          international
          countryCallingCodeEditable={false}
          defaultCountry="FR"
          value={value as string}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          className={`phone-input-container phone-input-container-simulator w-full ${error ? 'border-red-500' : ''}`}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={`w-full px-4 py-4 rounded-lg border-2 ${error ? 'border-red-500' : 'border-gray-700'} bg-backgroundGrey focus:border-purple-500 focus:outline-none text-textColor placeholder-gray-400 font-unbounded`}
        />
      )}
      
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
} 