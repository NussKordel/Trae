'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { 
  ArrowLeft, 
  ArrowRight,
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  CheckCircle, 
  Clock,
  Target,
  Dumbbell
} from 'lucide-react'
import { RPEScale } from '@/types/fitness'
import { useWorkoutStore } from '@/store/useAppStore'

interface WorkoutBlock {
  id: string
  type: string
  name: string
  description?: string
  duration: number
  exercises: WorkoutExercise[]
}

interface EnhancedWorkout {
  title: string
  description: string
  warmup: { exercises: WorkoutExercise[] }
  blocks: WorkoutBlock[]
  cooldown: { exercises: WorkoutExercise[] }
  tips?: string[]
  estimatedDuration?: number
}

interface GeneratedWorkout {
  title: string
  description: string
  warmup: string[]
  mainWorkout: string
  cooldown: string[]
  notes: string[]
  estimatedDuration: number
  targetRPE: RPEScale
}

interface WorkoutExercise {
  name: string
  sets?: number
  reps?: string
  duration?: string
  rest?: string
}

const WorkoutExecutePage: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [workout, setWorkout] = useState<GeneratedWorkout | EnhancedWorkout | null>(null)
  const [currentPhase, setCurrentPhase] = useState<'warmup' | 'main' | 'cooldown'>('warmup')
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [exerciseTime, setExerciseTime] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [restTime, setRestTime] = useState(0)
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())

  useEffect(() => {
    const workoutParam = searchParams?.get('workout')
    if (workoutParam) {
      try {
        const decodedWorkout = JSON.parse(decodeURIComponent(workoutParam))
        setWorkout(decodedWorkout)
      } catch (error) {
        console.error('Failed to parse workout data:', error)
        router.push('/workouts/generate')
      }
    } else {
      router.push('/workouts/generate')
    }
  }, [searchParams, router])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
        if (!isResting) {
          setExerciseTime(prev => prev + 1)
        } else {
          setRestTime(prev => prev - 1)
          if (restTime <= 1) {
            setIsResting(false)
            setRestTime(0)
          }
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, isResting, restTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const isEnhancedWorkout = (w: any): w is EnhancedWorkout => {
    return w && w.blocks && Array.isArray(w.blocks)
  }

  const getCurrentExercises = () => {
    if (!workout) return []
    
    if (isEnhancedWorkout(workout)) {
      // Handle enhanced workout format with blocks
      switch (currentPhase) {
        case 'warmup':
          return workout.warmup?.exercises?.map(ex => ex.name) || []
        case 'main':
          if (workout.blocks && workout.blocks[currentBlockIndex]) {
            return workout.blocks[currentBlockIndex].exercises.map(ex => {
              const repsInfo = ex.sets && ex.reps ? `${ex.sets} sets x ${ex.reps} reps` : 
                              ex.duration ? `${ex.duration}s` : ''
              return `${ex.name}${repsInfo ? ` - ${repsInfo}` : ''}`
            })
          }
          return []
        case 'cooldown':
          return workout.cooldown?.exercises?.map(ex => ex.name) || []
        default:
          return []
      }
    } else {
      // Handle legacy workout format
      const legacyWorkout = workout as GeneratedWorkout
      switch (currentPhase) {
        case 'warmup':
          return legacyWorkout.warmup
        case 'main':
          return legacyWorkout.mainWorkout.split('\n').filter((line: string) => line.trim() && !line.includes(':'))
        case 'cooldown':
          return legacyWorkout.cooldown
        default:
          return []
      }
    }
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleNextExercise = () => {
    const exercises = getCurrentExercises()
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
      setExerciseTime(0)
    } else {
      // Check if we need to move to next block in enhanced workout
      if (isEnhancedWorkout(workout) && currentPhase === 'main' && workout.blocks) {
        if (currentBlockIndex < workout.blocks.length - 1) {
          setCurrentBlockIndex(currentBlockIndex + 1)
          setCurrentExerciseIndex(0)
          setExerciseTime(0)
          return
        }
      }
      handleNextPhase()
    }
  }

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1)
      setExerciseTime(0)
    } else {
      // Check if we need to move to previous block in enhanced workout
      if (isEnhancedWorkout(workout) && currentPhase === 'main' && currentBlockIndex > 0) {
        setCurrentBlockIndex(currentBlockIndex - 1)
        const prevBlockExercises = workout.blocks[currentBlockIndex - 1].exercises
        setCurrentExerciseIndex(prevBlockExercises.length - 1)
        setExerciseTime(0)
        return
      }
      handlePreviousPhase()
    }
  }

  const handlePreviousPhase = () => {
    if (currentPhase === 'cooldown') {
      setCurrentPhase('main')
      // Go to last exercise of last block or main workout
      if (isEnhancedWorkout(workout) && workout.blocks) {
        setCurrentBlockIndex(workout.blocks.length - 1)
        setCurrentExerciseIndex(workout.blocks[workout.blocks.length - 1].exercises.length - 1)
      } else {
        const mainExercises = getCurrentExercises()
        setCurrentExerciseIndex(mainExercises.length - 1)
      }
      setExerciseTime(0)
    } else if (currentPhase === 'main') {
      setCurrentPhase('warmup')
      setCurrentExerciseIndex(0)
      setCurrentBlockIndex(0)
      setExerciseTime(0)
    }
  }

  const handleNextPhase = () => {
    if (currentPhase === 'warmup') {
      setCurrentPhase('main')
      setCurrentExerciseIndex(0)
      setCurrentBlockIndex(0)
      setExerciseTime(0)
    } else if (currentPhase === 'main') {
      setCurrentPhase('cooldown')
      setCurrentExerciseIndex(0)
      setExerciseTime(0)
    } else {
      // Workout complete
      setIsRunning(false)
      
      // Save workout completion to store
      const { saveWorkout } = useWorkoutStore.getState()
      
      // Create a completed workout entry
      if (workout && 'blocks' in workout) {
        // Enhanced workout format
        const enhancedWorkout = workout as EnhancedWorkout;
        saveWorkout({
          title: enhancedWorkout.title,
          description: enhancedWorkout.description,
          duration: Math.floor(timeElapsed / 60),
          estimatedDuration: enhancedWorkout.estimatedDuration || Math.floor(timeElapsed / 60),
          targetRPE: 7, // Default RPE
          warmup: enhancedWorkout.warmup,
          blocks: enhancedWorkout.blocks as any, // Type assertion for compatibility
          cooldown: enhancedWorkout.cooldown,
          tips: enhancedWorkout.tips,
          difficulty: 'intermediate' as const,
          equipment: [],
          completedAt: new Date()
        });
      } else {
        // Legacy workout format
        const legacyWorkout = workout as GeneratedWorkout;
        saveWorkout({
          title: legacyWorkout.title,
          description: legacyWorkout.description,
          duration: Math.floor(timeElapsed / 60),
          estimatedDuration: legacyWorkout.estimatedDuration || Math.floor(timeElapsed / 60),
          targetRPE: legacyWorkout.targetRPE || 7,
          warmup: { exercises: legacyWorkout.warmup.map(ex => ({ name: ex })) },
          blocks: [{
            id: 'main',
            type: 'strength' as const,
            name: 'Main Workout',
            duration: Math.floor(timeElapsed / 60),
            exercises: legacyWorkout.mainWorkout.split('\n').map(ex => ({
               name: ex.trim(),
               description: '',
               restTime: 60,
               difficulty: 'medium' as const,
               equipment: [],
               muscleGroups: [],
               instructions: [],
               modifications: []
             })).filter(ex => ex.name)
          }],
          cooldown: { exercises: legacyWorkout.cooldown.map(ex => ({ name: ex })) },
          tips: legacyWorkout.notes,
          difficulty: 'intermediate' as const,
          equipment: [],
          completedAt: new Date()
        });
      }
      
      router.push('/workouts')
    }
  }

  const handleCompleteExercise = () => {
    const exercises = getCurrentExercises()
    const exerciseKey = `${currentPhase}-${currentExerciseIndex}`
    setCompletedExercises(prev => new Set([...Array.from(prev), exerciseKey]))
    
    // Start rest period for main workout
    if (currentPhase === 'main') {
      setIsResting(true)
      setRestTime(60) // 60 seconds rest
    }
    
    handleNextExercise()
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeElapsed(0)
    setExerciseTime(0)
    setCurrentPhase('warmup')
    setCurrentExerciseIndex(0)
    setCompletedExercises(new Set())
    setIsResting(false)
    setRestTime(0)
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading workout...</p>
        </div>
      </div>
    )
  }

  const exercises = getCurrentExercises()
  const currentExercise = exercises[currentExerciseIndex]
  const exerciseKey = `${currentPhase}-${currentExerciseIndex}`
  const isExerciseCompleted = completedExercises.has(exerciseKey)
  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {workout.title}
            </h1>
            <Badge variant="outline" className="mt-1">
              {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
            </Badge>
          </div>
          
          <Button variant="ghost" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Timer and Stats */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600">
                {formatTime(timeElapsed)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {formatTime(exerciseTime)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {isResting ? 'Rest Time' : 'Exercise Time'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {currentExerciseIndex + 1}/{exercises.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Exercise</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Rest Timer */}
        {isResting && (
          <Card className="p-6 mb-6 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {formatTime(restTime)}
              </div>
              <div className="text-orange-700 dark:text-orange-300">
                Rest Time - Get ready for the next exercise!
              </div>
            </div>
          </Card>
        )}

        {/* Current Exercise */}
        <Card className="p-6 mb-6">
          <div className="text-center mb-4">
            {/* Block Information for Enhanced Workouts */}
            {isEnhancedWorkout(workout) && currentPhase === 'main' && workout.blocks && (
              <div className="mb-3">
                <Badge variant="secondary" className="text-sm">
                  Block {currentBlockIndex + 1} of {workout.blocks.length}: {workout.blocks[currentBlockIndex]?.name}
                </Badge>
              </div>
            )}
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Current Exercise
            </h2>
            <div className={`text-lg p-4 rounded-lg ${
              isExerciseCompleted 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
            }`}>
              {isExerciseCompleted && (
                <CheckCircle className="h-5 w-5 inline mr-2" />
              )}
              {currentExercise}
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} className="bg-yellow-600 hover:bg-yellow-700">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            
            <Button 
              onClick={handleCompleteExercise}
              className="bg-primary-600 hover:bg-primary-700"
              disabled={isExerciseCompleted}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Exercise
            </Button>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-center space-x-4 mt-4">
            <Button 
              onClick={handlePreviousExercise} 
              variant="outline"
              disabled={currentPhase === 'warmup' && currentExerciseIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button onClick={handleNextExercise} variant="outline">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>

        {/* Exercise List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} Exercises
          </h3>
          <div className="space-y-2">
            {exercises.map((exercise: string, index: number) => {
              const exerciseKey = `${currentPhase}-${index}`
              const isCompleted = completedExercises.has(exerciseKey)
              const isCurrent = index === currentExerciseIndex
              
              return (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    isCurrent 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : isCompleted
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}>
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <span className={`flex-1 ${
                      isCompleted
                        ? 'text-green-800 dark:text-green-200 line-through'
                        : isCurrent
                        ? 'text-primary-800 dark:text-primary-200 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {exercise}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default WorkoutExecutePage