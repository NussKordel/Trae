import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { Smile, Zap, Heart, Brain, Target, Gamepad2 } from 'lucide-react';
import { FormRadioGroup } from '@/components/forms/FormField';
import { CompleteProfile, HumorLevel, WorkoutMode } from '@/types/user';
import { cn } from '@/lib/utils';

interface PersonalPreferencesStepProps {
  register: UseFormRegister<CompleteProfile>;
  errors: FieldErrors<CompleteProfile>;
  watch: UseFormWatch<CompleteProfile>;
  setValue: UseFormSetValue<CompleteProfile>;
  getValues: UseFormGetValues<CompleteProfile>;
}

const humorOptions = [
  {
    value: HumorLevel.NONE,
    label: 'Keep it serious',
    description: 'Professional and straightforward communication',
    icon: Target,
    color: 'from-gray-500 to-gray-600',
    emoji: '🎯'
  },
  {
    value: HumorLevel.LIGHT,
    label: 'Light humor',
    description: 'Occasional jokes and friendly encouragement',
    icon: Smile,
    color: 'from-blue-400 to-blue-500',
    emoji: '😊'
  },
  {
    value: HumorLevel.MODERATE,
    label: 'Moderate humor',
    description: 'Regular jokes and playful motivation',
    icon: Smile,
    color: 'from-green-400 to-green-500',
    emoji: '😄'
  },
  {
    value: HumorLevel.HIGH,
    label: 'Lots of humor',
    description: 'Frequent jokes, puns, and entertaining content',
    icon: Smile,
    color: 'from-yellow-400 to-orange-500',
    emoji: '🤣'
  }
];

const modeOptions = [
  {
    value: WorkoutMode.GUIDED,
    label: 'Guided Training',
    description: 'Step-by-step guidance with detailed instructions',
    icon: Heart,
    color: 'from-pink-400 to-rose-500',
    features: ['Clear instructions', 'Form guidance', 'Structured approach']
  },
  {
    value: WorkoutMode.FLEXIBLE,
    label: 'Flexible Training',
    description: 'Adaptable workouts that fit your schedule',
    icon: Target,
    color: 'from-blue-400 to-cyan-500',
    features: ['Customizable duration', 'Exercise substitutions', 'Flexible timing']
  },
  {
    value: WorkoutMode.CHALLENGE,
    label: 'Challenge Mode',
    description: 'Performance-driven with goals and achievements',
    icon: Zap,
    color: 'from-orange-400 to-red-500',
    features: ['Performance tracking', 'Personal records', 'Progressive challenges']
  }
];

export function PersonalPreferencesStep({ register, errors, watch }: PersonalPreferencesStepProps) {
  const selectedHumor = watch('humorLevel');
  const selectedMode = watch('workoutMode');

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <Smile className="h-6 w-6 text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Personal Preferences
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Let's personalize your experience to match your communication style and preferences.
        </p>
      </div>

      {/* Humor Level */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          How much humor do you want in your workout experience? <span className="text-red-500 ml-1">*</span>
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {humorOptions.map((humor) => {
            const Icon = humor.icon;
            const isSelected = selectedHumor === humor.value;
            
            return (
              <label key={humor.value} className="cursor-pointer">
                <input
                  type="radio"
                  value={humor.value}
                  className="sr-only"
                  {...register('humorLevel')}
                />
                <div className={cn(
                  'p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md',
                  isSelected 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}>
                  <div className="flex items-start space-x-3">
                    <div className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center text-2xl',
                      `bg-gradient-to-br ${humor.color}`
                    )}>
                      {humor.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {humor.label}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {humor.description}
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        
        {errors.humorLevel && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.humorLevel.message}</p>
        )}
      </div>

      {/* Mode Preference */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          What type of coaching style do you prefer? <span className="text-red-500 ml-1">*</span>
        </label>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {modeOptions.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.value;
            
            return (
              <label key={mode.value} className="cursor-pointer">
                <input
                  type="radio"
                  value={mode.value}
                  className="sr-only"
                  {...register('workoutMode')}
                />
                <div className={cn(
                  'p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-md h-full',
                  isSelected 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}>
                  <div className="flex items-start space-x-4">
                    <div className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      `bg-gradient-to-br ${mode.color}`
                    )}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {mode.label}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {mode.description}
                      </p>
                      <div className="space-y-1">
                        {mode.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        
        {(errors as any).workoutMode && (
          <p className="text-sm text-red-600 dark:text-red-400">{(errors as any).workoutMode?.message}</p>
        )}
      </div>

      {/* Preview Section */}
      {(selectedHumor || selectedMode) && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-primary-200 dark:border-primary-800">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <Zap className="h-4 w-4 mr-2 text-primary-500" />
            Preview: Your Personalized Experience
          </h4>
          <div className="space-y-2 text-sm">
            {selectedHumor && (
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Communication Style:</strong> {humorOptions.find(h => h.value === selectedHumor)?.description}
              </p>
            )}
            {selectedMode && (
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Coaching Approach:</strong> {modeOptions.find(m => m.value === selectedMode)?.description}
              </p>
            )}
          </div>
          
          {selectedHumor && selectedMode && (
            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sample message:</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                {selectedMode === WorkoutMode.GUIDED && selectedHumor === HumorLevel.HIGH && 
                  "🔥 Great job! Let's break down that next exercise step by step - you've got this! 😄"
                }
                {selectedMode === WorkoutMode.FLEXIBLE && selectedHumor === HumorLevel.LIGHT && 
                  "Nice work! 💪 Feel free to adjust the timing as needed - your schedule, your rules! 😊"
                }
                {selectedMode === WorkoutMode.CHALLENGE && selectedHumor === HumorLevel.MODERATE && 
                  "Personal record alert! 🚨 You just crushed your previous best. Ready for the next challenge? 😤"
                }
                {!(
                  (selectedMode === WorkoutMode.GUIDED && selectedHumor === HumorLevel.HIGH) ||
                  (selectedMode === WorkoutMode.FLEXIBLE && selectedHumor === HumorLevel.LIGHT) ||
                  (selectedMode === WorkoutMode.CHALLENGE && selectedHumor === HumorLevel.MODERATE)
                ) && "Your personalized messages will reflect your chosen style and humor preferences!"
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}