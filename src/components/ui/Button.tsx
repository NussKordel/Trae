import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl focus:ring-primary-500/50 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-offset-gray-900',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 shadow-md hover:shadow-lg focus:ring-gray-500/50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 dark:focus:ring-offset-gray-900',
      outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500/50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-400 dark:hover:text-gray-900 dark:focus:ring-offset-gray-900',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500/50 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-offset-gray-900',
      danger: 'bg-error-600 hover:bg-error-700 text-white shadow-lg hover:shadow-xl focus:ring-error-500/50 dark:bg-error-500 dark:hover:bg-error-600 dark:focus:ring-offset-gray-900'
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm min-h-[36px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[48px]',
      xl: 'px-10 py-5 text-xl min-h-[56px]'
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
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
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };