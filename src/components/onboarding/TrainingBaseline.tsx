import React from 'react';
import { Target, TrendingUp, Calendar, Clock, Dumbbell, Heart, Award, ArrowRight } from 'lucide-react';
import { UserProfile, FitnessGoal, FitnessLevel, WorkoutFrequency } from '@/types/user';
import { cn } from '@/lib/utils';

interface TrainingBaselineProps {
  userProfile: UserProfile;
  onStartWorkout?: () => void;
}

const goalIcons = {
  [FitnessGoal.WEIGHT_LOSS]: { icon: TrendingUp, color: 'from-red-500 to-pink-500' },
  [FitnessGoal.MUSCLE_GAIN]: { icon: Dumbbell, color: 'from-blue-500 to-cyan-500' },
  [FitnessGoal.STRENGTH]: { icon: Target, color: 'from-purple-500 to-indigo-500' },
  [FitnessGoal.ENDURANCE]: { icon: Heart, color: 'from-green-500 to-emerald-500' },
  [FitnessGoal.GENERAL_FITNESS]: { icon: Award, color: 'from-orange-500 to-yellow-500' },
  [FitnessGoal.REHABILITATION]: { icon: Heart, color: 'from-teal-500 to-cyan-500' },
  [FitnessGoal.SPORT_SPECIFIC]: { icon: Award, color: 'from-violet-500 to-purple-500' }
};

const levelDescriptions = {
  [FitnessLevel.BEGINNER]: {
    title: 'Beginner Level',
    description: 'Building foundation with basic movements',
    focus: ['Form and technique', 'Bodyweight exercises', 'Light resistance training']
  },
  [FitnessLevel.INTERMEDIATE]: {
    title: 'Intermediate Level',
    description: 'Progressive overload and skill development',
    focus: ['Compound movements', 'Progressive loading', 'Varied training methods']
  },
  [FitnessLevel.ADVANCED]: {
    title: 'Advanced Level',
    description: 'Specialized training and optimization',
    focus: ['Advanced techniques', 'Periodization', 'Performance optimization']
  }
};

const frequencyPlans = {
  [WorkoutFrequency.ONE_TWO]: {
    title: '1-2x Weekly Plan',
    description: 'Light maintenance routine',
    structure: 'Full-body compound movements'
  },
  [WorkoutFrequency.THREE_FOUR]: {
    title: '3-4x Weekly Plan',
    description: 'Standard fitness routine',
    structure: 'Balanced muscle group targeting'
  },
  [WorkoutFrequency.FIVE_SIX]: {
    title: '5-6x Weekly Plan',
    description: 'Intermediate to advanced training',
    structure: 'Enhanced recovery and progression'
  },
  [WorkoutFrequency.DAILY]: {
    title: 'Daily Training',
    description: 'High-frequency training with careful recovery management',
    structure: 'Specialized muscle group focus'
  }
};

export function TrainingBaseline({ userProfile, onStartWorkout }: TrainingBaselineProps) {
  const goalConfig = goalIcons[userProfile.fitnessGoal];
  const levelConfig = levelDescriptions[userProfile.fitnessLevel];
  const frequencyConfig = frequencyPlans[userProfile.workoutFrequency as keyof typeof frequencyPlans];
  const GoalIcon = goalConfig.icon;

  const getPersonalizedMessage = () => {
    const messages = {
      [FitnessGoal.WEIGHT_LOSS]: `Great choice, ${userProfile.name}! We'll focus on calorie-burning workouts that combine cardio and strength training.`,
      [FitnessGoal.MUSCLE_GAIN]: `Perfect, ${userProfile.name}! Your plan will emphasize progressive overload and muscle-building exercises.`,
      [FitnessGoal.STRENGTH]: `Excellent goal, ${userProfile.name}! We'll build your strength with compound movements and progressive loading.`,
      [FitnessGoal.ENDURANCE]: `Awesome, ${userProfile.name}! Your training will improve cardiovascular fitness and muscular endurance.`,
      [FitnessGoal.GENERAL_FITNESS]: `Great approach, ${userProfile.name}! We'll create a balanced routine for overall health and wellness.`,
      [FitnessGoal.REHABILITATION]: `Smart choice, ${userProfile.name}! Your plan will focus on safe, therapeutic exercises for recovery.`,
      [FitnessGoal.SPORT_SPECIFIC]: `Excellent, ${userProfile.name}! We'll tailor your training for optimal sports performance.`
    };
    return messages[userProfile.fitnessGoal];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className={cn(
          'w-20 h-20 mx-auto rounded-full flex items-center justify-center',
          `bg-gradient-to-br ${goalConfig.color}`
        )}>
          <GoalIcon className="h-10 w-10 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Your Training Baseline
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {getPersonalizedMessage()}
          </p>
        </div>
      </div>

      {/* Profile Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fitness Goal Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              `bg-gradient-to-br ${goalConfig.color}`
            )}>
              <GoalIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Primary Goal
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {userProfile.fitnessGoal.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </p>
            </div>
          </div>
        </div>

        {/* Fitness Level Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {levelConfig.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {levelConfig.description}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            {levelConfig.focus.map((item, index) => (
              <div key={index} className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Frequency Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {frequencyConfig.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {frequencyConfig.description}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {frequencyConfig.structure}
          </p>
        </div>
      </div>

      {/* Equipment & Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Equipment */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Dumbbell className="h-5 w-5 mr-2 text-primary-500" />
            Available Equipment
          </h3>
          {userProfile.availableEquipment && userProfile.availableEquipment !== 'none' ? (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-primary-400 rounded-full mr-2" />
                {userProfile.availableEquipment.replace('_', ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Bodyweight exercises only</p>
          )}
        </div>

        {/* Workout Duration */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary-500" />
            Workout Duration
          </h3>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {userProfile.workoutDuration || 45} minutes
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Optimal duration for your goals and schedule
            </p>
          </div>
        </div>
      </div>

      {/* Safety Considerations */}
      {(userProfile.painAreas?.length > 0 || userProfile.noGoExercises?.length > 0) && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
          <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Safety Considerations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userProfile.painAreas && userProfile.painAreas.length > 0 && (
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Areas of Concern:</h4>
                <div className="space-y-1">
                  {userProfile.painAreas.map((area, index) => (
                    <div key={index} className="flex items-center text-sm text-amber-700 dark:text-amber-300">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2" />
                      {area.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {userProfile.noGoExercises && userProfile.noGoExercises.length > 0 && (
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Exercises to Avoid:</h4>
                <div className="space-y-1">
                  {userProfile.noGoExercises.map((exercise, index) => (
                    <div key={index} className="flex items-center text-sm text-amber-700 dark:text-amber-300">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2" />
                      {exercise.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={onStartWorkout}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Start Your First Workout
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Your personalized workout plan is ready based on your preferences
        </p>
      </div>
    </div>
  );
}