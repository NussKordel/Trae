'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useUserStore } from '@/store/useAppStore';
import LoadingScreen from './LoadingScreen';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const router = useRouter();
  const { isLoading, isFirstTime, setLoading, setFirstTime } = useAppStore();
  const { profile } = useUserStore();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      // Show loading screen for at least 5 seconds for smooth experience
      const minLoadingTime = 5000;
      const startTime = Date.now();

      // Check if user has completed onboarding
      const hasCompletedOnboarding = profile && profile.name && profile.email && profile.fitnessLevel;
      
      if (hasCompletedOnboarding) {
        setFirstTime(false);
      }

      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      setTimeout(() => {
        setLoading(false);
        setShowContent(true);
        
        // Redirect to onboarding if first time user
        if (isFirstTime && !hasCompletedOnboarding) {
          router.push('/onboarding');
        }
      }, remainingTime);
    };

    if (isLoading) {
      initializeApp();
    } else {
      setShowContent(true);
    }
  }, [isLoading, isFirstTime, profile, router, setLoading, setFirstTime]);

  if (isLoading || !showContent) {
    return <LoadingScreen isLoading={true} />;
  }

  return <>{children}</>;
};

export default AppInitializer;