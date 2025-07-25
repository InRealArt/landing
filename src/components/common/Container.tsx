import { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className = '' }: ContainerProps) => {
  return (
    <div className={`container mx-auto px-4 ${className} pt-12 md:pt-20`}>
      {children}
    </div>
  )
} 