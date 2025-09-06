'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui';

interface ThemeToggleProps {
  variant?: 'button' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon',
  size = 'md',
  className
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={toggleTheme}
        className={className}
      >
        {isDark ? (
          <>
            <Sun className="h-4 w-4 mr-2" />
            Light Mode
          </>
        ) : (
          <>
            <Moon className="h-4 w-4 mr-2" />
            Dark Mode
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleTheme}
      className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      )}
    </Button>
  );
};

export { ThemeToggle };
export type { ThemeToggleProps };