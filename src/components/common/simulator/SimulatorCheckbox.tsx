import React from 'react';

interface SimulatorCheckboxProps {
  label: string;
  id: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export default function SimulatorCheckbox({
  label,
  id,
  name,
  checked,
  onChange,
  error,
}: SimulatorCheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div>
      <div className={`p-4 rounded-lg border-2 ${error ? 'border-red-500' : 'border-gray-700'} bg-backgroundGrey`}>
        <label htmlFor={id} className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            id={id}
            name={name}
            checked={checked}
            onChange={handleChange}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
          />
          <span className="ml-3 text-textColor font-unbounded">{label}</span>
        </label>
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
} 