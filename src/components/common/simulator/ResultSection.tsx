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
    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 flex flex-col gap-4 rounded-b-2xl lg:rounded-r-2xl lg:rounded-b-none">
      {hasResults ? children : defaultContent}
    </div>
  );
} 