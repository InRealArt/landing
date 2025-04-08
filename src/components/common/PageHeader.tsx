import React from 'react';
import { Container } from './Container';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  className = '' 
}) => {
  return (
    <div className={`py-12 ${className}`}>
      <Container>
        <div className="max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-gray-600 mt-2">
              {subtitle}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}; 