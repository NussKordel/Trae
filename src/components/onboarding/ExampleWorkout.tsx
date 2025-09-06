import React, { useState } from 'react';
import { Play, Clock, Target, Zap, CheckCircle, Circle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { UserProfile, FitnessGoal, FitnessLevel } from '@/types/user';
import { cn } from '@/lib/utils';

interface ExampleWorkoutProps {
  userProfile: UserProfile;
  onComplete?: () => void;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restTime: number;
  description: string;
  targetMuscles: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  equipment?: string;
}

const generateWorkout = (userProfile: UserProfile): Exercise[] => {
  const { fitnessGoal, fitnessLevel, availableEquipment } = userProfile;
  const hasEquipment = availableEquipment && availableEquipment.length > 0;

  const baseWorkouts = {
    [FitnessGoal.WEIGHT_LOSS]: [
      {
        id: '1',
        name: 'Jumping Jacks',
        sets: 3,
        reps: '30 seconds',
        restTime: 30,
        description: 'Full-body cardio movement to elevate heart rate',
        targetMuscles: ['Full Body', 'Cardiovascular'],
        difficulty: 'Easy' as const
      },
      {
        id: '2',
        name: 'Bodyweight Squats',
        sets: 3,
        reps: '12-15',
        restTime: 45,
        description: 'Lower body strength and calorie burning',
        targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
        difficulty: 'Easy' as const
      },
      {
        id: '3',
        name: 'Push-ups (Modified if needed)',
        sets: 3,
        reps: '8-12',
        restTime: 45,
        description: 'Upper body strength with core engagement',
        targetMuscles: ['Chest', 'Shoulders', 'Triceps', 'Core'],
        difficulty: 'Medium' as const
      },
      {
        id: '4',
        name: 'Mountain Climbers',
        sets: 3,
        reps: '20 seconds',
        restTime: 30,
        description: 'High-intensity cardio with core strengthening',
        targetMuscles: ['Core', 'Shoulders', 'Cardiovascular'],
        difficulty: 'Medium' as const
      },
      {
        id: '5',
        name: 'Plank Hold',
        sets: 3,
        reps: '20-30 seconds',
        restTime: 45,
        description: 'Isometric core strengthening exercise',
        targetMuscles: ['Core', 'Shoulders'],
        difficulty: 'Medium' as const
      }
    ],
    [FitnessGoal.MUSCLE_GAIN]: [
      {
        id: '1',
        name: hasEquipment ? 'Dumbbell Squats' : 'Bodyweight Squats',
        sets: 4,
        reps: '8-12',
        restTime: 60,
        description: 'Primary lower body mass builder',
        targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
        difficulty: 'Medium' as const,
        equipment: hasEquipment ? 'Dumbbells' : undefined
      },
      {
        id: '2',
        name: hasEquipment ? 'Dumbbell Chest Press' : 'Push-ups',
        sets: 4,
        reps: '8-12',
        restTime: 60,
        description: 'Upper body pushing movement for chest development',
        targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
        difficulty: 'Medium' as const,
        equipment: hasEquipment ? 'Dumbbells' : undefined
      },
      {
        id: '3',
        name: 'Pike Push-ups',
        sets: 3,
        reps: '6-10',
        restTime: 60,
        description: 'Shoulder-focused pushing exercise',
        targetMuscles: ['Shoulders', 'Triceps', 'Upper Chest'],
        difficulty: 'Hard' as const
      },
      {
        id: '4',
        name: hasEquipment ? 'Dumbbell Rows' : 'Inverted Rows',
        sets: 4,
        reps: '8-12',
        restTime: 60,
        description: 'Back strengthening and muscle building',
        targetMuscles: ['Lats', 'Rhomboids', 'Biceps'],
        difficulty: 'Medium' as const,
        equipment: hasEquipment ? 'Dumbbells' : 'Pull-up Bar'
      },
      {
        id: '5',
        name: 'Bulgarian Split Squats',
        sets: 3,
        reps: '8-10 each leg',
        restTime: 60,
        description: 'Unilateral leg strength and stability',
        targetMuscles: ['Quadriceps', 'Glutes', 'Calves'],
        difficulty: 'Hard' as const
      }
    ],
    [FitnessGoal.STRENGTH]: [
      {
        id: '1',
        name: hasEquipment ? 'Goblet Squats' : 'Bodyweight Squats',
        sets: 4,
        reps: '5-8',
        restTime: 90,
        description: 'Foundation lower body strength movement',
        targetMuscles: ['Quadriceps', 'Glutes', 'Core'],
        difficulty: 'Medium' as const,
        equipment: hasEquipment ? 'Dumbbell/Kettlebell' : undefined
      },
      {
        id: '2',
        name: 'Push-up Progression',
        sets: 4,
        reps: '5-8',
        restTime: 90,
        description: 'Progressive upper body strength building',
        targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
        difficulty: 'Medium' as const
      },
      {
        id: '3',
        name: hasEquipment ? 'Single-Arm Dumbbell Row' : 'Superman Pulls',
        sets: 4,
        reps: '6-8 each side',
        restTime: 90,
        description: 'Unilateral back strength development',
        targetMuscles: ['Lats', 'Rhomboids', 'Rear Delts'],
        difficulty: 'Medium' as const,
        equipment: hasEquipment ? 'Dumbbell' : undefined
      },
      {
        id: '4',
        name: 'Single-Leg Glute Bridges',
        sets: 3,
        reps: '8-10 each leg',
        restTime: 60,
        description: 'Posterior chain strength and stability',
        targetMuscles: ['Glutes', 'Hamstrings', 'Core'],
        difficulty: 'Medium' as const
      },
      {
        id: '5',
        name: 'Dead Bug',
        sets: 3,
        reps: '6-8 each side',
        restTime: 45,
        description: 'Core stability and control',
        targetMuscles: ['Core', 'Hip Flexors'],
        difficulty: 'Medium' as const
      }
    ],
    [FitnessGoal.ENDURANCE]: [
      {
        id: '1',
        name: 'High Knees',
        sets: 3,
        reps: '45 seconds',
        restTime: 30,
        description: 'Cardio movement to build endurance',
        targetMuscles: ['Cardiovascular', 'Legs'],
        difficulty: 'Easy' as const
      },
      {
        id: '2',
        name: 'Mountain Climbers',
        sets: 3,
        reps: '30 seconds',
        restTime: 45,
        description: 'Full-body endurance exercise',
        targetMuscles: ['Core', 'Shoulders', 'Legs'],
        difficulty: 'Medium' as const
      }
    ],
    [FitnessGoal.GENERAL_FITNESS]: [
      {
        id: '1',
        name: 'Bodyweight Squats',
        sets: 3,
        reps: '10-12',
        restTime: 45,
        description: 'Basic lower body exercise',
        targetMuscles: ['Quadriceps', 'Glutes'],
        difficulty: 'Easy' as const
      },
      {
        id: '2',
        name: 'Push-ups',
        sets: 3,
        reps: '8-10',
        restTime: 45,
        description: 'Upper body strength exercise',
        targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
        difficulty: 'Medium' as const
      }
    ],
    [FitnessGoal.REHABILITATION]: [
      {
        id: '1',
        name: 'Gentle Stretching',
        sets: 2,
        reps: '30 seconds',
        restTime: 30,
        description: 'Low-impact mobility exercise',
        targetMuscles: ['Full Body'],
        difficulty: 'Easy' as const
      }
    ],
    [FitnessGoal.SPORT_SPECIFIC]: [
      {
        id: '1',
        name: 'Agility Ladder',
        sets: 3,
        reps: '30 seconds',
        restTime: 60,
        description: 'Sport-specific agility training',
        targetMuscles: ['Legs', 'Coordination'],
        difficulty: 'Medium' as const
      }
    ]
  };

  // Default to general fitness if goal not found
  const workout = baseWorkouts[fitnessGoal] || baseWorkouts[FitnessGoal.WEIGHT_LOSS];
  
  // Adjust difficulty based on fitness level
  if (fitnessLevel === FitnessLevel.BEGINNER) {
    return workout.map((exercise: Exercise) => ({
      ...exercise,
      sets: Math.max(2, exercise.sets - 1),
      reps: exercise.reps.includes('-') ? exercise.reps.split('-')[0] + '-' + (parseInt(exercise.reps.split('-')[1]) - 2) : exercise.reps,
      restTime: exercise.restTime + 15
    }));
  } else if (fitnessLevel === FitnessLevel.ADVANCED) {
    return workout.map((exercise: Exercise) => ({
      ...exercise,
      sets: exercise.sets + 1,
      reps: exercise.reps.includes('-') ? (parseInt(exercise.reps.split('-')[0]) + 2) + '-' + (parseInt(exercise.reps.split('-')[1]) + 3) : exercise.reps,
      restTime: Math.max(30, exercise.restTime - 15)
    }));
  }
  
  return workout;
};

export function ExampleWorkout({ userProfile, onComplete }: ExampleWorkoutProps) {
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);

  const workout = generateWorkout(userProfile);
  const totalExercises = workout.length;
  const completedCount = completedExercises.size;
  const progressPercentage = (completedCount / totalExercises) * 100;

  const toggleExerciseComplete = (exerciseId: string) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(exerciseId)) {
      newCompleted.delete(exerciseId);
    } else {
      newCompleted.add(exerciseId);
    }
    setCompletedExercises(newCompleted);
    
    if (newCompleted.size === totalExercises && !isWorkoutComplete) {
      setIsWorkoutComplete(true);
    } else if (newCompleted.size < totalExercises && isWorkoutComplete) {
      setIsWorkoutComplete(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'Hard': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getGoalTitle = () => {
    const titles = {
      [FitnessGoal.WEIGHT_LOSS]: 'Fat Burning Circuit',
      [FitnessGoal.MUSCLE_GAIN]: 'Muscle Building Workout',
      [FitnessGoal.STRENGTH]: 'Strength Foundation',
      [FitnessGoal.ENDURANCE]: 'Endurance Builder',
      [FitnessGoal.GENERAL_FITNESS]: 'Full Body Fitness',
      [FitnessGoal.REHABILITATION]: 'Recovery Workout',
      [FitnessGoal.SPORT_SPECIFIC]: 'Performance Training'
    };
    return titles[userProfile.fitnessGoal] || 'Custom Workout';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {getGoalTitle()}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Personalized for {userProfile.name} • {userProfile.fitnessLevel} Level
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span>Progress</span>
            <span>{completedCount}/{totalExercises} exercises</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Workout Completion Banner */}
      {isWorkoutComplete && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
          <Trophy className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
            Congratulations, {userProfile.name}! 🎉
          </h3>
          <p className="text-green-700 dark:text-green-300 mb-4">
            You've completed your first personalized workout! This is just the beginning of your fitness journey.
          </p>
          <button
            onClick={onComplete}
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Continue to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      )}

      {/* Exercise List */}
      <div className="space-y-4">
        {workout.map((exercise, index) => {
          const isCompleted = completedExercises.has(exercise.id);
          const isCurrent = currentExercise === exercise.id;
          
          return (
            <div
              key={exercise.id}
              className={cn(
                'bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-200',
                isCompleted 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : isCurrent 
                    ? 'border-primary-500 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      )}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {exercise.name}
                        </h3>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          getDifficultyColor(exercise.difficulty)
                        )}>
                          {exercise.difficulty}
                        </span>
                        {exercise.equipment && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                            {exercise.equipment}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                        {exercise.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {exercise.targetMuscles.map((muscle, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExerciseComplete(exercise.id)}
                    className={cn(
                      'flex-shrink-0 p-2 rounded-full transition-colors duration-200',
                      isCompleted 
                        ? 'text-green-600 hover:text-green-700' 
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {exercise.sets}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Sets</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {exercise.reps}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Reps</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center justify-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {exercise.restTime}s
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Rest</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => {
            setCompletedExercises(new Set());
            setCurrentExercise(null);
            setIsWorkoutComplete(false);
          }}
          className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Workout
        </button>
        
        {!isWorkoutComplete && (
          <button
            onClick={() => setCompletedExercises(new Set(workout.map(ex => ex.id)))}
            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            <Target className="mr-2 h-4 w-4" />
            Mark All Complete
          </button>
        )}
      </div>
    </div>
  );
}