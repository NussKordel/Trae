import React from 'react';
import { Play, Clock, Target, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ExerciseCardProps {
  exercise: {
    id: string;
    name: string;
    category: string;
    duration?: number;
    sets?: number;
    reps?: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    equipment?: string[];
    targetMuscles: string[];
    imageUrl?: string;
    gifUrl?: string;
  };
  variant?: 'default' | 'compact' | 'detailed';
  onClick?: () => void;
  className?: string;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  variant = 'default',
  onClick,
  className
}) => {
  const difficultyColors = {
    beginner: 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400',
    intermediate: 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400',
    advanced: 'bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-400'
  };

  const renderImage = () => {
    if (exercise.gifUrl || exercise.imageUrl) {
      return (
        <div className="exercise-card-image relative overflow-hidden group">
          <img
            src={exercise.gifUrl || exercise.imageUrl}
            alt={exercise.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {exercise.gifUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="h-12 w-12 text-white" />
            </div>
          )}
        </div>
      );
    }

    // Placeholder with exercise category icon
    return (
      <div className="exercise-card-image">
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
          <Zap className="h-16 w-16 mb-2" />
          <span className="text-sm font-medium">{exercise.category}</span>
        </div>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <Card
        className={cn(
          'exercise-card cursor-pointer hover:scale-[1.02] transition-transform duration-200',
          className
        )}
        onClick={onClick}
        padding="sm"
      >
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {exercise.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {exercise.category}
              </p>
              
              <div className="flex items-center space-x-2 mt-1">
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  difficultyColors[exercise.difficulty]
                )}>
                  {exercise.difficulty}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'exercise-card cursor-pointer hover:scale-[1.02] transition-all duration-300',
        className
      )}
      onClick={onClick}
      variant="elevated"
    >
      <CardContent>
        {renderImage()}
        
        <div className="mt-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-2">
              {exercise.name}
            </h3>
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0',
              difficultyColors[exercise.difficulty]
            )}>
              {exercise.difficulty}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {exercise.category}
          </p>
          
          {/* Exercise details */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
            {exercise.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{exercise.duration}min</span>
              </div>
            )}
            
            {exercise.sets && exercise.reps && (
              <div className="flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>{exercise.sets}×{exercise.reps}</span>
              </div>
            )}
          </div>
          
          {/* Target muscles */}
          <div className="flex flex-wrap gap-1 mb-3">
            {exercise.targetMuscles.slice(0, 3).map((muscle, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400 rounded-full text-xs"
              >
                {muscle}
              </span>
            ))}
            {exercise.targetMuscles.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                +{exercise.targetMuscles.length - 3}
              </span>
            )}
          </div>
          
          {/* Equipment */}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Equipment: {exercise.equipment.join(', ')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { ExerciseCard };
export type { ExerciseCardProps };