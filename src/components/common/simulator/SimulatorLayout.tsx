import React from 'react';
import { Container } from '@/components/common/Container';

interface SimulatorLayoutProps {
  children: React.ReactNode;
}

export default function SimulatorLayout({ children }: SimulatorLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--canvas-bg)]">
      <Container>
        <div className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 border border-[var(--border-light)]">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
} 