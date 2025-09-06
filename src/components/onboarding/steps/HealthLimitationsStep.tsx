import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { AlertTriangle, Heart, Shield, Activity } from 'lucide-react';
import { FormField, FormCheckboxGroup, FormRadioGroup } from '@/components/forms/FormField';
import { CompleteProfile } from '@/types/user';
import { cn } from '@/lib/utils';

interface HealthLimitationsStepProps {
  register: UseFormRegister<CompleteProfile>;
  errors: FieldErrors<CompleteProfile>;
  watch: UseFormWatch<CompleteProfile>;
  setValue: UseFormSetValue<CompleteProfile>;
  getValues: UseFormGetValues<CompleteProfile>;
}

const painAreaOptions = [
  {
    value: 'lower_back',
    label: 'Lower Back',
    description: 'Pain or discomfort in the lumbar region',
    icon: '🔴'
  },
  {
    value: 'upper_back',
    label: 'Upper Back',
    description: 'Pain between shoulder blades or thoracic spine',
    icon: '🟠'
  },
  {
    value: 'neck',
    label: 'Neck',
    description: 'Cervical spine or neck muscle issues',
    icon: '🟡'
  },
  {
    value: 'shoulders',
    label: 'Shoulders',
    description: 'Shoulder joint or rotator cuff problems',
    icon: '🔵'
  },
  {
    value: 'knees',
    label: 'Knees',
    description: 'Knee joint pain or previous injuries',
    icon: '🟢'
  },
  {
    value: 'hips',
    label: 'Hips',
    description: 'Hip joint or hip flexor issues',
    icon: '🟣'
  },
  {
    value: 'wrists',
    label: 'Wrists',
    description: 'Wrist pain or carpal tunnel issues',
    icon: '🟤'
  },
  {
    value: 'ankles',
    label: 'Ankles',
    description: 'Ankle instability or previous sprains',
    icon: '⚫'
  }
];

const noGoExerciseOptions = [
  {
    value: 'running',
    label: 'Running/Jogging',
    description: 'High-impact cardio activities'
  },
  {
    value: 'jumping',
    label: 'Jumping/Plyometrics',
    description: 'Explosive jumping movements'
  },
  {
    value: 'overhead_pressing',
    label: 'Overhead Pressing',
    description: 'Pressing weights above head'
  },
  {
    value: 'heavy_squats',
    label: 'Heavy Squats',
    description: 'Deep squats with heavy weight'
  },
  {
    value: 'deadlifts',
    label: 'Deadlifts',
    description: 'Conventional or sumo deadlifts'
  },
  {
    value: 'burpees',
    label: 'Burpees',
    description: 'Full-body explosive movements'
  },
  {
    value: 'planks',
    label: 'Planks/Core Work',
    description: 'Isometric core exercises'
  },
  {
    value: 'pull_ups',
    label: 'Pull-ups/Chin-ups',
    description: 'Hanging upper body exercises'
  }
];

const rpeOptions = [
  {
    value: 'false',
    label: 'No, I\'m not familiar with RPE',
    description: "I don't know what RPE (Rate of Perceived Exertion) is"
  },
  {
    value: 'true',
    label: 'Yes, I understand RPE',
    description: 'I know how to use RPE to gauge workout intensity'
  }
];

export function HealthLimitationsStep({ register, errors, watch, setValue, getValues }: HealthLimitationsStepProps) {
  const selectedPainAreas = watch('painAreas') || [];
  const selectedNoGoExercises = watch('noGoExercises') || [];
  const selectedRPE = watch('rpeUnderstanding');

  const handlePainAreaChange = (painArea: string, checked: boolean) => {
    const currentAreas = getValues('painAreas') || [];
    let newAreas;
    
    if (checked) {
      newAreas = [...currentAreas, painArea];
    } else {
      newAreas = currentAreas.filter(area => area !== painArea);
    }
    
    setValue('painAreas', newAreas);
  };

  const handleNoGoExerciseChange = (exercise: string, checked: boolean) => {
    const currentExercises = getValues('noGoExercises') || [];
    let newExercises;
    
    if (checked) {
      newExercises = [...currentExercises, exercise];
    } else {
      newExercises = currentExercises.filter(ex => ex !== exercise);
    }
    
    setValue('noGoExercises', newExercises);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-6 w-6 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Health & Safety Information
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Help us create a safe and effective workout plan by sharing any limitations or concerns.
        </p>
      </div>

      {/* Pain Areas */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <AlertTriangle className="inline h-4 w-4 mr-1 text-amber-500" />
          Do you have any current pain or previous injuries? <span className="text-gray-500">(Select all that apply)</span>
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {painAreaOptions.map((painArea) => {
            const isSelected = selectedPainAreas.includes(painArea.value);
            
            return (
              <label key={painArea.value} className="cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  onChange={(e) => handlePainAreaChange(painArea.value, e.target.checked)}
                />
                <div className={cn(
                  'p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md',
                  isSelected 
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}>
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">{painArea.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {painArea.label}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {painArea.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        
        {errors.painAreas && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.painAreas.message}</p>
        )}
      </div>

      {/* No-Go Exercises */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Are there any exercises you want to avoid? <span className="text-gray-500">(Select all that apply)</span>
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {noGoExerciseOptions.map((exercise) => {
            const isSelected = selectedNoGoExercises.includes(exercise.value);
            
            return (
              <label key={exercise.value} className="cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  onChange={(e) => handleNoGoExerciseChange(exercise.value, e.target.checked)}
                />
                <div className={cn(
                  'p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md',
                  isSelected 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {exercise.label}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {exercise.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center ml-2">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        
        {errors.noGoExercises && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.noGoExercises.message}</p>
        )}
      </div>

      {/* RPE Understanding */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <Activity className="inline h-4 w-4 mr-1 text-primary-500" />
          How familiar are you with RPE (Rate of Perceived Exertion)? <span className="text-red-500 ml-1">*</span>
        </label>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>RPE</strong> is a scale from 1-10 that measures how hard an exercise feels. 
            It helps us adjust workout intensity to match your capabilities and goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rpeOptions.map((rpe, index) => {
            const isSelected = String(selectedRPE) === rpe.value;
            
            return (
              <label key={index} className="cursor-pointer">
                <input
                  type="radio"
                  value={rpe.value}
                  className="sr-only"
                  {...register('rpeUnderstanding')}
                />
                <div className={cn(
                  'p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md',
                  isSelected 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {rpe.label}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {rpe.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
        
        {errors.rpeUnderstanding && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.rpeUnderstanding.message}</p>
        )}
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Additional health information or concerns
        </label>
        <textarea
          {...register('medicalConditions.0')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Any other health conditions, medications, or concerns we should know about..."
        />
        {(errors as any).medicalConditions && (
          <p className="text-sm text-red-600 dark:text-red-400">{(errors as any).medicalConditions?.message}</p>
        )}
      </div>
    </div>
  );
}