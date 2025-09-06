import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white' | 'current';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
  text
}) => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const variants = {
    primary: 'text-primary-600 dark:text-primary-400',
    secondary: 'text-gray-600 dark:text-gray-400',
    white: 'text-white',
    current: 'text-current'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <svg
        className={cn(
          'animate-spin',
          sizes[size],
          variants[variant]
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      
      {text && (
        <p className={cn(
          'mt-2 font-medium',
          textSizes[size],
          variants[variant]
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

// Overlay spinner for full-screen loading
interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  text = 'Loading...',
  size = 'lg'
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl">
        <LoadingSpinner size={size} text={text} className="text-center" />
      </div>
    </div>
  );
};

// Inline loading state for buttons or small components
const InlineSpinner: React.FC<{ size?: 'xs' | 'sm' | 'md' }> = ({ size = 'sm' }) => {
  return (
    <LoadingSpinner
      size={size}
      variant="current"
      className="inline-flex"
    />
  );
};

export { LoadingSpinner, LoadingOverlay, InlineSpinner };
export type { LoadingSpinnerProps, LoadingOverlayProps };