import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { Target, TrendingUp, Zap, Heart, Activity, Shield, Trophy } from 'lucide-react';
import { FormRadioGroup } from '@/components/forms/FormField';
import { QuickStartProfile, CompleteProfile, FitnessGoal, FitnessLevel } from '@/types/user';
import { cn } from '@/lib/utils';

interface FitnessGoalsStepProps {
  register: UseFormRegister<QuickStartProfile | CompleteProfile>;
  errors: FieldErrors<QuickStartProfile | CompleteProfile>;
  watch: UseFormWatch<QuickStartProfile | CompleteProfile>;
  setValue: UseFormSetValue<QuickStartProfile | CompleteProfile>;
  getValues: UseFormGetValues<QuickStartProfile | CompleteProfile>;
}

const goalOptions = [
  {
    value: FitnessGoal.WEIGHT_LOSS,
    label: 'Weight Loss',
    description: 'Burn calories and lose weight through cardio and strength training',
    icon: TrendingUp,
    color: 'from-red-500 to-pink-500'
  },
  {
    value: FitnessGoal.MUSCLE_GAIN,
    label: 'Muscle Gain',
    description: 'Build lean muscle mass with progressive strength training',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    value: FitnessGoal.STRENGTH,
    label: 'Strength',
    description: 'Increase overall strength and power with compound movements',
    icon: Target,
    color: 'from-purple-500 to-indigo-500'
  },
  {
    value: FitnessGoal.ENDURANCE,
    label: 'Endurance',
    description: 'Improve cardiovascular fitness and stamina',
    icon: Heart,
    color: 'from-green-500 to-emerald-500'
  },
  {
    value: FitnessGoal.GENERAL_FITNESS,
    label: 'General Fitness',
    description: 'Overall health and wellness with balanced training',
    icon: Activity,
    color: 'from-orange-500 to-yellow-500'
  },
  {
    value: FitnessGoal.REHABILITATION,
    label: 'Rehabilitation',
    description: 'Recovery and injury prevention with therapeutic exercises',
    icon: Shield,
    color: 'from-teal-500 to-cyan-500'
  },
  {
    value: FitnessGoal.SPORT_SPECIFIC,
    label: 'Sport Specific',
    description: 'Training tailored for specific sports performance',
    icon: Trophy,
    color: 'from-violet-500 to-purple-500'
  }
];

const levelOptions = [
  {
    value: FitnessLevel.BEGINNER,
    label: 'Beginner',
    description: 'New to fitness or returning after a long break'
  },
  {
    value: FitnessLevel.INTERMEDIATE,
    label: 'Intermediate',
    description: 'Regular exercise routine for 6+ months'
  },
  {
    value: FitnessLevel.ADVANCED,
    label: 'Advanced',
    description: 'Experienced with consistent training for 2+ years'
  }
];

export function FitnessGoalsStep({ register, errors, watch, setValue }: FitnessGoalsStepProps) {
  const selectedGoal = watch('fitnessGoal');
  const selectedLevel = watch('fitnessLevel');

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          What's your primary fitness goal? This helps us create the perfect workout plan for you.
        </p>
      </div>

      {/* Fitness Goals */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Primary Fitness Goal <span className="text-red-500 ml-1">*</span>
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goalOptions.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoal === goal.value;
            
            return (
              <label key={goal.value} className="cursor-pointer">
                <input
                  type="radio"
                  value={goal.value}
                  className="sr-only"
                  {...register('fitnessGoal')}
                />
                <div className={cn(
                  'p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md',
                  isSelected 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}>
                  <div className="flex items-start space-x-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      `bg-gradient-to-br ${goal.color}`
                    )}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {goal.label}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        
        {errors.fitnessGoal && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.fitnessGoal.message}</p>
        )}
      </div>

      {/* Fitness Level */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Current Fitness Level <span className="text-red-500 ml-1">*</span>
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {levelOptions.map((level) => {
            const isSelected = selectedLevel === level.value;
            
            return (
              <label key={level.value} className="cursor-pointer">
                <input
                  type="radio"
                  value={level.value}
                  className="sr-only"
                  {...register('fitnessLevel')}
                />
                <div className={cn(
                  'p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md text-center',
                  isSelected 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {level.label}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {level.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
        
        {errors.fitnessLevel && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.fitnessLevel.message}</p>
        )}
      </div>
    </div>
  );
}