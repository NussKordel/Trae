import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400 dark:text-gray-500">
                {leftIcon}
              </div>
            </div>
          )}
          
          <input
            id={inputId}
            className={cn(
              'w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 bg-white',
              'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:focus:border-primary-400 dark:focus:ring-primary-400/50',
              'placeholder:text-gray-500 dark:placeholder:text-gray-400',
              'min-h-[48px]',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-error-500 focus:border-error-500 focus:ring-error-500/50 dark:border-error-400 dark:focus:border-error-400 dark:focus:ring-error-400/50',
              className
            )}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="text-gray-400 dark:text-gray-500">
                {rightIcon}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-error-600 dark:text-error-400">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };