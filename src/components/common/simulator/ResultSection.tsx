import React from 'react';

interface ResultSectionProps {
  children?: React.ReactNode;
  hasResults: boolean;
  defaultContent: React.ReactNode;
}

export default function ResultSection({ 
  children, 
  hasResults, 
  defaultContent 
}: ResultSectionProps) {
  return (
    <div className="bg-[var(--soft-gray)] border-t border-[var(--border-light)] lg:border-t-0 lg:border-l p-8 flex flex-col gap-4">
      {hasResults ? children : defaultContent}
    </div>
  );
} 