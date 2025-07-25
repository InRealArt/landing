import React from 'react';
import { Container } from '@/components/common/Container';

interface SimulatorLayoutProps {
  children: React.ReactNode;
}

export default function SimulatorLayout({ children }: SimulatorLayoutProps) {
  return (
    <div className="min-h-screen bg-backgroundColor">
      <Container>
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
} 