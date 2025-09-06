import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  children: React.ReactNode;
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  className,
  children,
  ...props
}) => {
  const baseClasses = 'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground';
  
  const variantClasses = {
    default: 'bg-background text-foreground border-border',
    destructive: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 [&>svg]:text-red-600 dark:[&>svg]:text-red-400',
    success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400 [&>svg]:text-green-600 dark:[&>svg]:text-green-400',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400',
    info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400'
  };
  
  return (
    <div
      role="alert"
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertDescription: React.FC<AlertDescriptionProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { Alert, AlertDescription };
export type { AlertProps, AlertDescriptionProps };