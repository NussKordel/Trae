import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { Dumbbell, Home, Building, Zap, Clock, Calendar } from 'lucide-react';
import { FormField, FormCheckboxGroup, FormRadioGroup } from '@/components/forms/FormField';
import { QuickStartProfile, CompleteProfile, WorkoutFrequency, Equipment } from '@/types/user';
import { cn } from '@/lib/utils';

interface WorkoutPreferencesStepProps {
  register: UseFormRegister<QuickStartProfile | CompleteProfile>;
  errors: FieldErrors<QuickStartProfile | CompleteProfile>;
  watch: UseFormWatch<QuickStartProfile | CompleteProfile>;
  setValue: UseFormSetValue<QuickStartProfile | CompleteProfile>;
  getValues: UseFormGetValues<QuickStartProfile | CompleteProfile>;
}

const frequencyOptions = [
  {
    value: WorkoutFrequency.ONE_TWO,
    label: '1-2x per week',
    description: 'Light activity, perfect for beginners',
    icon: Calendar,
    color: 'from-green-400 to-green-500'
  },
  {
    value: WorkoutFrequency.THREE_FOUR,
    label: '3-4x per week',
    description: 'Balanced approach for good results',
    icon: Calendar,
    color: 'from-purple-400 to-purple-500'
  },
  {
    value: WorkoutFrequency.FIVE_SIX,
    label: '5-6x per week',
    description: 'Dedicated training for faster progress',
    icon: Zap,
    color: 'from-orange-400 to-orange-500'
  },
  {
    value: WorkoutFrequency.DAILY,
    label: 'Daily',
    description: 'Intensive training for serious athletes',
    icon: Zap,
    color: 'from-red-400 to-red-500'
  }
];

const equipmentOptions = [
  {
    value: Equipment.NONE,
    label: 'No Equipment',
    description: 'Bodyweight exercises only',
    icon: '🏃'
  },
  {
    value: Equipment.BASIC,
    label: 'Basic Equipment',
    description: 'Dumbbells, resistance bands',
    icon: '🏋️'
  },
  {
    value: Equipment.HOME_GYM,
    label: 'Home Gym',
    description: 'Complete home setup',
    icon: '🏠'
  },
  {
    value: Equipment.FULL_GYM,
    label: 'Full Gym Access',
    description: 'Complete equipment range',
    icon: '🏢'
  }
];

export function WorkoutPreferencesStep({ register, errors, watch, setValue, getValues }: WorkoutPreferencesStepProps) {
  const selectedFrequency = watch('workoutFrequency');
  const selectedEquipment = watch('availableEquipment') || Equipment.NONE;

  const handleEquipmentChange = (equipment: typeof Equipment[keyof typeof Equipment]) => {
    setValue('availableEquipment', equipment);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          Tell us about your workout preferences so we can create the perfect routine for you.
        </p>
      </div>

      {/* Workout Frequency */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          How often do you want to work out? <span className="text-red-500 ml-1">*</span>
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {frequencyOptions.map((freq) => {
            const Icon = freq.icon;
            const isSelected = selectedFrequency === freq.value;
            
            return (
              <label key={freq.value} className="cursor-pointer">
                <input
                  type="radio"
                  value={freq.value}
                  className="sr-only"
                  {...register('workoutFrequency')}
                />
                <div className={cn(
                  'p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md text-center',
                  isSelected 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}>
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2',
                    `bg-gradient-to-br ${freq.color}`
                  )}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {freq.label}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {freq.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
        
        {errors.workoutFrequency && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.workoutFrequency.message}</p>
        )}
      </div>

      {/* Available Equipment */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          What equipment do you have access to?
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {equipmentOptions.map((equipment) => {
            const isSelected = selectedEquipment === equipment.value;
            
            return (
              <label key={equipment.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="availableEquipment"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => handleEquipmentChange(equipment.value)}
                />
                <div className={cn(
                  'p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md',
                  isSelected 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{equipment.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {equipment.label}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {equipment.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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
        
        {(errors as any).availableEquipment && (
          <p className="text-sm text-red-600 dark:text-red-400">{(errors as any).availableEquipment?.message}</p>
        )}
      </div>

      {/* Workout Duration Preference */}
      <FormField
          name="workoutDuration"
          label="Preferred workout duration (minutes)"
          type="number"
          placeholder="e.g., 45"
          register={register}
          error={(errors as any).workoutDuration}
          helperText="How long do you typically want your workouts to be?"
        />
    </div>
  );
}