'use client';

import React from 'react';
import { Dumbbell } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
      <div className="text-center">
        {/* Logo Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-white rounded-2xl shadow-2xl flex items-center justify-center animate-pulse">
            <Dumbbell className="h-12 w-12 text-primary-600 animate-bounce" />
          </div>
          
          {/* Pulse rings */}
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl border-4 border-white/30 animate-ping" />
          <div className="absolute inset-2 w-20 h-20 mx-auto rounded-xl border-2 border-white/20 animate-ping" style={{ animationDelay: '0.5s' }} />
        </div>
        
        {/* App Name */}
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          PulseFit AI
        </h1>
        <p className="text-white/80 text-lg font-medium mb-8">
          Your Personal Workout Companion
        </p>
        
        {/* Loading Animation */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
        
        <p className="text-white/60 text-sm mt-4 animate-pulse">
          Preparing your fitness journey...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;