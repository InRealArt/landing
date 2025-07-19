import React from 'react';

interface FormSectionProps {
  children: React.ReactNode;
}

export default function FormSection({ children }: FormSectionProps) {
  return (
    <div className="lg:sticky lg:top-20 lg:self-start">
      {children}
    </div>
  );
} 