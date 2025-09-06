import React from 'react';
import { UseFormRegister, FieldError, Path } from 'react-hook-form';
import { Input } from '@/components/ui';
import { cn } from '@/lib/utils';

interface FormFieldProps<T extends Record<string, any>> {
  name: Path<T>;
  label: string;
  type?: 'text' | 'email' | 'number' | 'tel' | 'password';
  placeholder?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helperText?: string;
}

export function FormField<T extends Record<string, any>>({
  name,
  label,
  type = 'text',
  placeholder,
  register,
  error,
  required = false,
  disabled = false,
  className,
  helperText
}: FormFieldProps<T>) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        error={error?.message}
        disabled={disabled}
        {...register(name, {
          valueAsNumber: type === 'number'
        })}
      />
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

// Select field component
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps<T extends Record<string, any>> {
  name: Path<T>;
  label: string;
  options: SelectOption[];
  register: UseFormRegister<T>;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helperText?: string;
  placeholder?: string;
}

export function FormSelect<T extends Record<string, any>>({
  name,
  label,
  options,
  register,
  error,
  required = false,
  disabled = false,
  className,
  helperText,
  placeholder = 'Select an option'
}: FormSelectProps<T>) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <select
        id={name}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100',
          'dark:focus:ring-primary-400 dark:focus:border-primary-400',
          'disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-700',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          'transition-colors duration-200'
        )}
        {...register(name)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

// Multi-select checkbox group
interface FormCheckboxGroupProps<T extends Record<string, any>> {
  name: Path<T>;
  label: string;
  options: SelectOption[];
  register: UseFormRegister<T>;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helperText?: string;
}

export function FormCheckboxGroup<T extends Record<string, any>>({
  name,
  label,
  options,
  register,
  error,
  required = false,
  disabled = false,
  className,
  helperText
}: FormCheckboxGroupProps<T>) {
  return (
    <div className={cn('space-y-3', className)}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              value={option.value}
              disabled={disabled || option.disabled}
              className={cn(
                'h-4 w-4 text-primary-600 border-gray-300 rounded',
                'focus:ring-primary-500 focus:ring-2',
                'dark:bg-gray-800 dark:border-gray-600',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
              {...register(name)}
            />
            <span className={cn(
              'text-sm text-gray-700 dark:text-gray-300',
              (disabled || option.disabled) && 'opacity-50'
            )}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

// Radio group component
interface FormRadioGroupProps<T extends Record<string, any>> {
  name: Path<T>;
  label: string;
  options: SelectOption[];
  register: UseFormRegister<T>;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helperText?: string;
  layout?: 'vertical' | 'horizontal';
}

export function FormRadioGroup<T extends Record<string, any>>({
  name,
  label,
  options,
  register,
  error,
  required = false,
  disabled = false,
  className,
  helperText,
  layout = 'vertical'
}: FormRadioGroupProps<T>) {
  return (
    <div className={cn('space-y-3', className)}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className={cn(
        layout === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'
      )}>
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              value={option.value}
              disabled={disabled || option.disabled}
              className={cn(
                'h-4 w-4 text-primary-600 border-gray-300',
                'focus:ring-primary-500 focus:ring-2',
                'dark:bg-gray-800 dark:border-gray-600',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
              {...register(name)}
            />
            <span className={cn(
              'text-sm text-gray-700 dark:text-gray-300',
              (disabled || option.disabled) && 'opacity-50'
            )}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

// Toggle/Switch component
interface FormToggleProps<T extends Record<string, any>> {
  name: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  disabled?: boolean;
  className?: string;
  helperText?: string;
  description?: string;
}

export function FormToggle<T extends Record<string, any>>({
  name,
  label,
  register,
  error,
  disabled = false,
  className,
  helperText,
  description
}: FormToggleProps<T>) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
        
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            id={name}
            type="checkbox"
            disabled={disabled}
            className="sr-only peer"
            {...register(name)}
          />
          <div className={cn(
            'w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4',
            'peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800',
            'rounded-full peer dark:bg-gray-700',
            'peer-checked:after:translate-x-full peer-checked:after:border-white',
            'after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px]',
            'after:bg-white after:border-gray-300 after:border after:rounded-full',
            'after:h-5 after:w-5 after:transition-all dark:border-gray-600',
            'peer-checked:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed'
          )} />
        </label>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}