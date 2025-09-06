'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { Slider } from '@/components/ui'
import { ArrowLeft, ArrowRight, Zap, Target, Dumbbell, Clock, Activity } from 'lucide-react'
import { MuscleGroup, Equipment, RPEScale } from '@/types/fitness'
import { useUserStore } from '@/store/useAppStore'

type WorkoutMode = 'classic' | 'emom' | 'amrap' | 'combined'

interface QuestionnaireData {
  workoutMode: WorkoutMode | null
  muscleGroups: MuscleGroup[]
  equipment: Equipment[]
  targetRPE: RPEScale
  duration: number
  experience: 'beginner' | 'intermediate' | 'advanced'
}

const WORKOUT_MODES = [
  {
    id: 'classic' as WorkoutMode,
    name: 'Classic',
    description: 'Traditional sets x reps format',
    icon: Dumbbell,
    example: '3 sets of 8-12 reps'
  },
  {
    id: 'emom' as WorkoutMode,
    name: 'EMOM',
    description: 'Every Minute On the Minute',
    icon: Clock,
    example: '10 burpees every minute for 10 minutes'
  },
  {
    id: 'amrap' as WorkoutMode,
    name: 'AMRAP',
    description: 'As Many Rounds As Possible',
    icon: Activity,
    example: '20 min AMRAP: 5 pull-ups, 10 push-ups, 15 squats'
  },
  {
    id: 'combined' as WorkoutMode,
    name: 'Combined',
    description: 'Mix of EMOM and AMRAP',
    icon: Zap,
    example: 'EMOM strength + AMRAP conditioning'
  }
]

const MUSCLE_GROUPS: { id: MuscleGroup; name: string; description: string }[] = [
  { id: 'chest', name: 'Chest', description: 'Pectorals, push movements' },
  { id: 'back', name: 'Back', description: 'Lats, rhomboids, pull movements' },
  { id: 'shoulders', name: 'Shoulders', description: 'Deltoids, overhead movements' },
  { id: 'biceps', name: 'Arms', description: 'Biceps, triceps, forearms' },
  { id: 'quadriceps', name: 'Legs', description: 'Quads, hamstrings, glutes' },
  { id: 'core', name: 'Core', description: 'Abs, obliques, lower back' },
  { id: 'full_body', name: 'Full Body', description: 'Compound movements' }
]

const EQUIPMENT_OPTIONS: { id: Equipment; name: string; description: string }[] = [
  { id: 'bodyweight', name: 'Bodyweight', description: 'No equipment needed' },
  { id: 'dumbbells', name: 'Dumbbells', description: 'Adjustable or fixed weights' },
  { id: 'barbell', name: 'Barbell', description: 'Olympic or standard barbell' },
  { id: 'kettlebell', name: 'Kettlebells', description: 'Functional training tool' },
  { id: 'resistance_bands', name: 'Resistance Bands', description: 'Portable resistance training' },
  { id: 'pull_up_bar', name: 'Pull-up Bar', description: 'Upper body strength' },
  { id: 'bench', name: 'Bench', description: 'For pressing and support exercises' }
]

export default function WorkoutQuestionnaire() {
  const router = useRouter()
  const { profile } = useUserStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<QuestionnaireData>({
    workoutMode: null,
    muscleGroups: [],
    equipment: [],
    targetRPE: 7 as RPEScale,
    duration: 30,
    experience: 'intermediate'
  })

  const steps = [
    {
      title: 'Workout Mode',
      description: 'Choose your preferred training style',
      component: WorkoutModeStep
    },
    {
      title: 'Muscle Groups',
      description: 'Select target muscle groups',
      component: MuscleGroupStep
    },
    {
      title: 'Equipment',
      description: 'What equipment do you have?',
      component: EquipmentStep
    },
    {
      title: 'Intensity & Duration',
      description: 'Set your workout parameters',
      component: IntensityStep
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      generateWorkout()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const generateWorkout = () => {
    // Store questionnaire data and navigate to generation
    const queryParams = new URLSearchParams({
      mode: data.workoutMode || 'classic',
      muscles: data.muscleGroups.join(','),
      equipment: data.equipment.join(','),
      rpe: data.targetRPE.toString(),
      duration: data.duration.toString(),
      experience: data.experience
    })
    
    router.push(`/workouts/generate?${queryParams.toString()}`)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return data.workoutMode !== null
      case 1: return data.muscleGroups.length > 0
      case 2: return data.equipment.length > 0
      case 3: return true
      default: return false
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => currentStep === 0 ? router.back() : handleBack()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {steps[currentStep].title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            <div className="w-16" /> {/* Spacer */}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            {steps[currentStep].description}
          </p>
        </div>

        <CurrentStepComponent data={data} setData={setData} />

        {/* Navigation */}
        <div className="mt-8">
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Generate Workout
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function WorkoutModeStep({ data, setData }: { data: QuestionnaireData; setData: (data: QuestionnaireData) => void }) {
  return (
    <div className="space-y-3">
      {WORKOUT_MODES.map((mode) => {
        const Icon = mode.icon
        return (
          <Card
            key={mode.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              data.workoutMode === mode.id
                ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setData({ ...data, workoutMode: mode.id })}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                data.workoutMode === mode.id
                  ? 'bg-primary-100 dark:bg-primary-800'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <Icon className={`h-5 w-5 ${
                  data.workoutMode === mode.id
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {mode.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {mode.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Example: {mode.example}
                </p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function MuscleGroupStep({ data, setData }: { data: QuestionnaireData; setData: (data: QuestionnaireData) => void }) {
  const toggleMuscleGroup = (muscleGroup: MuscleGroup) => {
    const newMuscleGroups = data.muscleGroups.includes(muscleGroup)
      ? data.muscleGroups.filter(mg => mg !== muscleGroup)
      : [...data.muscleGroups, muscleGroup]
    setData({ ...data, muscleGroups: newMuscleGroups })
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {MUSCLE_GROUPS.map((group) => (
          <Card
            key={group.id}
            className={`p-3 cursor-pointer transition-all hover:shadow-md ${
              data.muscleGroups.includes(group.id)
                ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => toggleMuscleGroup(group.id)}
          >
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {group.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {group.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
      
      {data.muscleGroups.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Selected ({data.muscleGroups.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {data.muscleGroups.map((mg) => (
              <Badge key={mg} variant="secondary">
                {MUSCLE_GROUPS.find(g => g.id === mg)?.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EquipmentStep({ data, setData }: { data: QuestionnaireData; setData: (data: QuestionnaireData) => void }) {
  const toggleEquipment = (equipment: Equipment) => {
    const newEquipment = data.equipment.includes(equipment)
      ? data.equipment.filter(eq => eq !== equipment)
      : [...data.equipment, equipment]
    setData({ ...data, equipment: newEquipment })
  }

  return (
    <div className="space-y-3">
      {EQUIPMENT_OPTIONS.map((item) => (
        <Card
          key={item.id}
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            data.equipment.includes(item.id)
              ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          onClick={() => toggleEquipment(item.id)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              data.equipment.includes(item.id)
                ? 'border-primary-500 bg-primary-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {data.equipment.includes(item.id) && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function IntensityStep({ data, setData }: { data: QuestionnaireData; setData: (data: QuestionnaireData) => void }) {
  return (
    <div className="space-y-6">
      {/* RPE Selection */}
      <Card className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Target Intensity (RPE)
            </h3>
            <Badge variant="outline">
              {data.targetRPE}/10
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Rate of Perceived Exertion - how hard should the workout feel?
          </p>
        </div>
        
        <div className="space-y-4">
          <Slider
            value={[data.targetRPE]}
            onValueChange={([value]) => setData({ ...data, targetRPE: value as RPEScale })}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Very Easy</span>
            <span>Moderate</span>
            <span>Very Hard</span>
          </div>
          
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {data.targetRPE <= 3 && 'Very Easy - Light activity, could do all day'}
              {data.targetRPE >= 4 && data.targetRPE <= 6 && 'Moderate - Somewhat hard, sustainable pace'}
              {data.targetRPE >= 7 && data.targetRPE <= 8 && 'Hard - Challenging but manageable'}
              {data.targetRPE >= 9 && 'Very Hard - Maximum sustainable effort'}
            </p>
          </div>
        </div>
      </Card>

      {/* Duration Selection */}
      <Card className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Workout Duration
            </h3>
            <Badge variant="outline">
              {data.duration} min
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            How long do you want to exercise?
          </p>
        </div>
        
        <div className="space-y-4">
          <Slider
            value={[data.duration]}
            onValueChange={([value]) => setData({ ...data, duration: value })}
            min={15}
            max={90}
            step={5}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>15 min</span>
            <span>45 min</span>
            <span>90 min</span>
          </div>
        </div>
      </Card>

      {/* Experience Level */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Experience Level
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
            <Button
              key={level}
              variant={data.experience === level ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setData({ ...data, experience: level })}
              className="capitalize"
            >
              {level}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}