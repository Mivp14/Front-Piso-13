import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 16,
  className = ''
}) => {
  return (
    <Loader2 
      className={`animate-spin ${className}`}
      size={size}
    />
  );
}; 