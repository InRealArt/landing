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
      <div className={`p-4 border ${error ? 'border-red-500' : 'border-[var(--border-light)]'} bg-[var(--canvas-bg)]`}>
        <label htmlFor={id} className="flex items-center cursor-pointer gap-3">
          <input
            type="checkbox"
            id={id}
            name={name}
            checked={checked}
            onChange={handleChange}
            className="w-3.5 h-3.5 accent-[var(--ink-black)] border-[var(--border-light)]"
          />
          <span className="text-[11px] uppercase tracking-[0.15em] font-montserrat text-[var(--gray-text)]">{label}</span>
        </label>
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
} 