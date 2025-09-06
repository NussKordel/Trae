'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, User, Target, Calendar, Dumbbell, Heart, Settings, Zap } from 'lucide-react';
import { Button, Card, CardContent, CardHeader } from '@/components/ui';
import { useUserStore } from '@/store/useAppStore';
import { QuickStartSchema, CompleteProfileSchema, QuickStartProfile, CompleteProfile, QUICK_START_STEPS, COMPLETE_PROFILE_STEPS } from '@/types/user';
import { cn } from '@/lib/utils';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { FitnessGoalsStep } from './steps/FitnessGoalsStep';
import { WorkoutPreferencesStep } from './steps/WorkoutPreferencesStep';
import { HealthLimitationsStep } from './steps/HealthLimitationsStep';
import { PersonalPreferencesStep } from './steps/PersonalPreferencesStep';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const stepIcons = {
  'basic-info': User,
  'fitness-goals': Target,
  'workout-frequency': Calendar,
  'physical-stats': User,
  'equipment-preferences': Dumbbell,
  'health-restrictions': Heart,
  'workout-style': Settings,
  'final-preferences': Zap
};

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const {
    onboarding,
    setOnboardingStep,
    setOnboardingType,
    setQuickStartProfile,
    setCompleteProfile,
    completeOnboarding
  } = useUserStore();

  const [profileType, setProfileTypeState] = useState<'quick' | 'complete' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = profileType === 'quick' ? QUICK_START_STEPS : COMPLETE_PROFILE_STEPS;
  const currentStep = steps[onboarding.currentStep];
  const isLastStep = onboarding.currentStep === steps.length - 1;
  const isFirstStep = onboarding.currentStep === 0;

  // Form setup
  const schema = profileType === 'quick' ? QuickStartSchema : CompleteProfileSchema;
  
  const quickDefaults = {
    name: '',
    age: 25,
    fitnessGoal: 'general_fitness' as const,
    fitnessLevel: 'beginner' as const,
    workoutFrequency: '1-2' as const
  };
  
  const completeDefaults = {
    name: '',
    age: 25,
    fitnessGoal: 'general_fitness' as const,
    fitnessLevel: 'beginner' as const,
    workoutFrequency: '1-2' as const,
    availableEquipment: 'none' as const,
    workoutDuration: 30,
    rpeUnderstanding: false,
    workoutMode: 'guided' as const,
    humorLevel: 'light' as const,
    musicPreference: true,
    restDayPreference: [],
    injuries: [],
    noGoExercises: [],
    painAreas: [],
    medicalConditions: []
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
    getValues
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: profileType === 'quick' ? quickDefaults : completeDefaults
  });

  // Initialize onboarding type
  useEffect(() => {
    if (profileType && !onboarding.profileType) {
      setOnboardingType(profileType);
    }
  }, [profileType, onboarding.profileType, setOnboardingType]);

  const handleProfileTypeSelection = (type: 'quick' | 'complete') => {
    setProfileTypeState(type);
    setOnboardingType(type);
    setOnboardingStep(0);
  };

  const handleNext = async () => {
    // Validate current step fields
    const fieldsToValidate = currentStep.fields as any[];
    const isStepValid = await trigger(fieldsToValidate);
    
    if (!isStepValid) return;

    if (isLastStep) {
      await handleFormSubmit();
    } else {
      setOnboardingStep(onboarding.currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (isFirstStep) {
      setProfileTypeState(null);
      setOnboardingStep(0);
    } else {
      setOnboardingStep(onboarding.currentStep - 1);
    }
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = getValues();
      
      if (profileType === 'quick') {
        setQuickStartProfile(formData as QuickStartProfile);
      } else {
        setCompleteProfile(formData as CompleteProfile);
      }
      
      completeOnboarding();
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    if (!currentStep) return null;

    const stepProps = {
      register: register as any,
      errors: errors as any,
      watch: watch as any,
      setValue: setValue as any,
      getValues: getValues as any
    };

    switch (currentStep.id) {
      case 'basic-info':
        return <BasicInfoStep {...stepProps} />;
      case 'fitness-goals':
        return <FitnessGoalsStep {...stepProps} />;
      case 'workout-frequency':
        return <WorkoutPreferencesStep {...stepProps} />;
      case 'physical-stats':
        return <WorkoutPreferencesStep {...stepProps} />;
      case 'equipment-preferences':
        return <WorkoutPreferencesStep {...stepProps} />;
      case 'health-restrictions':
        return <HealthLimitationsStep {...stepProps} />;
      case 'workout-style':
        return <PersonalPreferencesStep {...stepProps} />;
      case 'final-preferences':
        return <PersonalPreferencesStep {...stepProps} />;
      default:
        return null;
    }
  };

  // Profile type selection screen
  if (!profileType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Welcome to Your
              <span className="gradient-text block">Fitness Journey</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose how you'd like to get started. You can always add more details later.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Quick Start Option */}
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => handleProfileTypeSelection('quick')}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Quick Start
                </h3>
                <div className="flex items-center justify-center space-x-2 text-success-600 dark:text-success-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">2-3 minutes</span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Get started quickly with just the essentials. Perfect for trying out the app and getting your first workout.
                </p>
                <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success-500" />
                    <span>Basic information</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success-500" />
                    <span>Fitness goals & level</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success-500" />
                    <span>Workout frequency</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Complete Profile Option */}
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => handleProfileTypeSelection('complete')}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Complete Profile
                </h3>
                <div className="flex items-center justify-center space-x-2 text-primary-600 dark:text-primary-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">5-7 minutes</span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Create a comprehensive profile for the most personalized experience and optimal workout recommendations.
                </p>
                <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary-500" />
                    <span>Everything in Quick Start</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary-500" />
                    <span>Physical stats & equipment</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary-500" />
                    <span>Health restrictions & preferences</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary-500" />
                    <span>Workout style customization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Main onboarding flow
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {profileType === 'quick' ? 'Quick Start' : 'Complete Profile'}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Step {onboarding.currentStep + 1} of {steps.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((onboarding.currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              {currentStep && (
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  {React.createElement(stepIcons[currentStep.id as keyof typeof stepIcons], {
                    className: 'h-6 w-6 text-white'
                  })}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {currentStep?.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {currentStep?.description}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              {renderStepContent()}
            </form>
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isSubmitting}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{isFirstStep ? 'Back to Options' : 'Previous'}</span>
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            loading={isSubmitting}
            className="flex items-center space-x-2"
          >
            <span>{isLastStep ? 'Complete Setup' : 'Next'}</span>
            {!isLastStep && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}