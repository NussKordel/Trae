'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Dumbbell, User, Home, Calendar, Settings, Cpu } from 'lucide-react';
import { Button } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/workouts', label: 'Workouts', icon: Dumbbell },
    { href: '/schedule', label: 'Schedule', icon: Calendar },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/ai-test', label: 'AI Test', icon: Cpu },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href) ?? false;
  };

  return (
    <nav className={cn(
      'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
              PulseFit AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle variant="icon" size="sm" />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4">
            <div className="flex flex-col space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200',
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export { Navigation };
export type { NavigationProps };