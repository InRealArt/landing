import React from 'react';

interface ResultSectionProps {
  children?: React.ReactNode;
  hasResults: boolean;
  defaultContent: React.ReactNode;
  sectionRef?: React.Ref<HTMLDivElement>;
}

export default function ResultSection({ 
  children, 
  hasResults, 
  defaultContent,
  sectionRef
}: ResultSectionProps) {
  return (
    <div
      ref={sectionRef}
      className={`bg-[var(--soft-gray)] border-t border-[var(--border-light)] lg:border-t-0 lg:border-l p-4 sm:p-8 flex-col gap-4 scroll-mt-24 ${hasResults ? 'flex' : 'hidden lg:flex'}`}
    >
      {hasResults ? children : defaultContent}
    </div>
  );
} 