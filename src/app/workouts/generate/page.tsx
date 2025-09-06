'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui'
import { Card } from '@/components/ui'
import { Badge } from '@/components/ui'
import { LoadingSpinner } from '@/components/ui'
import { ArrowLeft, Download, Share, RefreshCw, Clock, Target, Dumbbell, Zap, Play } from 'lucide-react'
import { MuscleGroup, Equipment, RPEScale, WorkoutExercise } from '@/types/fitness'
import { useUserStore, useWorkoutStore } from '@/store/useAppStore'
import { getWorkoutGeneratorService } from '@/services/ai/workoutGenerator'
import { WorkoutGenerationRequest, AIModelType } from '@/types/ai'
import { Equipment as UserEquipment, UserProfile } from '@/types/user'

// Helper function to map fitness equipment to user equipment types
function mapEquipmentToUserEquipment(equipment: Equipment[]): typeof UserEquipment[keyof typeof UserEquipment] {
  if (equipment.length === 0) return 'none'
  
  // Check for gym equipment
  const gymEquipment = ['barbell', 'treadmill', 'stationary_bike', 'rowing_machine']
  if (equipment.some(eq => gymEquipment.includes(eq))) {
    return 'full_gym'
  }
  
  // Check for home gym equipment
  const homeGymEquipment = ['dumbbells', 'kettlebell', 'bench', 'pull_up_bar']
  if (equipment.some(eq => homeGymEquipment.includes(eq))) {
    return 'home_gym'
  }
  
  // Check for basic equipment
  const basicEquipment = ['resistance_bands', 'yoga_mat', 'stability_ball', 'foam_roller']
  if (equipment.some(eq => basicEquipment.includes(eq))) {
    return 'basic'
  }
  
  // Default to none for bodyweight or unknown equipment
  return 'none'
}

type WorkoutMode = 'classic' | 'emom' | 'amrap' | 'combined'

interface WorkoutParameters {
  mode: WorkoutMode
  muscles: MuscleGroup[]
  equipment: Equipment[]
  rpe: RPEScale
  duration: number
  experience: 'beginner' | 'intermediate' | 'advanced'
}

interface WorkoutBlock {
  id: string
  type: string
  name: string
  description?: string
  duration: number
  exercises: WorkoutExercise[]
}

interface GeneratedWorkout {
  title: string
  description: string
  warmup: { exercises: WorkoutExercise[] }
  blocks: WorkoutBlock[]
  cooldown: { exercises: WorkoutExercise[] }
  tips?: string[]
  estimatedDuration: number
  targetRPE: RPEScale
}

export default function WorkoutGeneration() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { profile } = useUserStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [workout, setWorkout] = useState<GeneratedWorkout | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [parameters, setParameters] = useState<WorkoutParameters | null>(null)

  useEffect(() => {
    // Parse URL parameters
    const mode = searchParams?.get('mode') as WorkoutMode || 'classic'
    const muscles = searchParams?.get('muscles')?.split(',') as MuscleGroup[] || []
    const equipment = searchParams?.get('equipment')?.split(',') as Equipment[] || []
    const rpe = parseInt(searchParams?.get('rpe') || '7') as RPEScale
    const duration = parseInt(searchParams?.get('duration') || '30')
    const experience = searchParams?.get('experience') as 'beginner' | 'intermediate' | 'advanced' || 'intermediate'

    const params: WorkoutParameters = {
      mode,
      muscles,
      equipment,
      rpe,
      duration,
      experience
    }

    setParameters(params)
    generateWorkout(params)
  }, [searchParams])



  const generateDynamicPrompt = (params: WorkoutParameters): string => {
    const { mode, muscles, equipment, rpe, duration, experience } = params
    
    // Base prompt structure
    let prompt = `Create a personalized ${duration}-minute workout for a ${experience} level athlete.\n\n`
    
    // Workout mode specific instructions
    switch (mode) {
      case 'classic':
        prompt += `WORKOUT FORMAT: Traditional sets x reps format\n`
        prompt += `- Structure: 3-4 exercises with 3-4 sets each\n`
        prompt += `- Rep ranges: ${experience === 'beginner' ? '8-12 reps' : experience === 'intermediate' ? '6-12 reps' : '4-10 reps'}\n`
        prompt += `- Rest periods: ${experience === 'beginner' ? '60-90 seconds' : experience === 'intermediate' ? '45-75 seconds' : '30-60 seconds'}\n`
        break
      case 'emom':
        prompt += `WORKOUT FORMAT: EMOM (Every Minute On the Minute)\n`
        prompt += `- Structure: ${Math.floor(duration / 2)}-${duration} rounds\n`
        prompt += `- Each minute: Complete prescribed reps, rest remaining time\n`
        prompt += `- Intensity: Moderate to allow completion within each minute\n`
        break
      case 'amrap':
        prompt += `WORKOUT FORMAT: AMRAP (As Many Rounds As Possible)\n`
        prompt += `- Time cap: ${duration} minutes\n`
        prompt += `- Structure: Circuit of 3-5 exercises\n`
        prompt += `- Goal: Complete as many full rounds as possible\n`
        break
      case 'combined':
        prompt += `WORKOUT FORMAT: Combined EMOM + AMRAP\n`
        prompt += `- Part 1: ${Math.floor(duration * 0.6)} min EMOM for strength\n`
        prompt += `- Part 2: ${Math.ceil(duration * 0.4)} min AMRAP for conditioning\n`
        break
    }
    
    // Target muscle groups
    if (muscles.length > 0) {
      prompt += `\nTARGET MUSCLE GROUPS: ${muscles.join(', ')}\n`
      if (muscles.includes('full_body')) {
        prompt += `- Focus on compound movements that work multiple muscle groups\n`
      }

    }
    
    // Available equipment
    prompt += `\nAVAILABLE EQUIPMENT: ${equipment.join(', ')}\n`
    if (equipment.includes('bodyweight')) {
      prompt += `- Prioritize bodyweight exercises when possible\n`
    }
    if (equipment.includes('dumbbells') || equipment.includes('barbell')) {
      prompt += `- Weight training equipment available\n`
    }
    
    // Intensity and experience adjustments
    prompt += `\nINTENSITY TARGET: RPE ${rpe}/10\n`
    prompt += `EXPERIENCE LEVEL: ${experience}\n`
    
    switch (experience) {
      case 'beginner':
        prompt += `- Focus on proper form and basic movement patterns\n`
        prompt += `- Include detailed form cues and modifications\n`
        prompt += `- Avoid overly complex exercises\n`
        break
      case 'intermediate':
        prompt += `- Include moderate complexity exercises\n`
        prompt += `- Balance strength and conditioning\n`
        prompt += `- Provide progression options\n`
        break
      case 'advanced':
        prompt += `- Include complex, challenging exercises\n`
        prompt += `- Higher intensity and volume\n`
        prompt += `- Advanced movement patterns welcome\n`
        break
    }
    
    // User profile integration
    if (profile) {
      prompt += `\nUSER PROFILE:\n`
      if (profile.fitnessGoal) {
        prompt += `- Primary goal: ${profile.fitnessGoal}\n`
      }
      if (profile.fitnessLevel) {
        prompt += `- Fitness level: ${profile.fitnessLevel}\n`
      }
    }
    
    // Output format requirements
    prompt += `\nOUTPUT FORMAT:\n`
    prompt += `Please provide the workout in this exact JSON format:\n`
    prompt += `{\n`
    prompt += `  "title": "Descriptive workout name",\n`
    prompt += `  "description": "Brief overview of the workout",\n`
    prompt += `  "warmup": ["warmup exercise 1", "warmup exercise 2", "warmup exercise 3"],\n`
    prompt += `  "mainWorkout": "Detailed main workout with sets, reps, and instructions",\n`
    prompt += `  "cooldown": ["cooldown exercise 1", "cooldown exercise 2", "cooldown exercise 3"],\n`
    prompt += `  "notes": ["Important tip 1", "Important tip 2", "Safety note"],\n`
    prompt += `  "estimatedDuration": ${duration},\n`
    prompt += `  "targetRPE": ${rpe}\n`
    prompt += `}\n\n`
    prompt += `Make the workout challenging but achievable for the specified experience level and RPE target.`
    
    return prompt
  }

  const generateWorkout = async (params: WorkoutParameters) => {
    setIsGenerating(true)
    setError(null)
    
    try {
      // Use WorkoutGeneratorService (API key validation handled by service)
      const workoutGenerator = getWorkoutGeneratorService()
      
      // Convert parameters to WorkoutGenerationRequest format
      const request: WorkoutGenerationRequest = {
        userProfile: {
          ...profile,
          id: profile?.id || 'user',
          name: profile?.name || 'User',
          email: profile?.email || '',
          fitnessLevel: params.experience,
          fitnessGoal: 'general_fitness',
          workoutDuration: params.duration,
          availableEquipment: mapEquipmentToUserEquipment(params.equipment),
          createdAt: profile?.createdAt || new Date(),
          updatedAt: profile?.updatedAt || new Date(),
          onboardingCompleted: profile?.onboardingCompleted || false,
          profileType: profile?.profileType || 'quick'
        } as UserProfile,
        sessionParameters: {
          mode: params.mode,
          duration: params.duration,
          goal: 'general_fitness',
          targetMuscleGroups: params.muscles,
          equipment: params.equipment,
          intensity: params.rpe
        }
      }
      
      const enhancedResponse = await workoutGenerator.generateWorkout(request, AIModelType.PRAEZISE)
      
      // Use the enhanced workout format directly for better exercise handling
      const enhancedWorkout = {
        ...enhancedResponse.workout,
        estimatedDuration: params.duration,
        targetRPE: params.rpe
      }
      
      setWorkout(enhancedWorkout)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the workout')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerate = () => {
    if (parameters) {
      generateWorkout(parameters)
    }
  }

  const handleSaveWorkout = () => {
    if (!workout || !parameters) return;
    
    const { saveWorkout } = useWorkoutStore.getState();
    
    // Create a title based on the workout parameters
    const title = `${parameters.mode.charAt(0).toUpperCase() + parameters.mode.slice(1)} Workout`;
    
    saveWorkout({
      title,
      description: `${parameters.duration} min ${parameters.mode} workout targeting ${parameters.muscles.join(', ')}`,
      duration: parameters.duration,
      estimatedDuration: workout.estimatedDuration,
      targetRPE: workout.targetRPE,
      warmup: workout.warmup,
      blocks: workout.blocks as any, // Type assertion for now
      cooldown: workout.cooldown,
      tips: workout.tips,
      difficulty: parameters.experience,
      equipment: parameters.equipment
    });
    
    // Show success message or redirect
    alert('Workout saved successfully!');
  }

  const handleShareWorkout = () => {
    // TODO: Implement workout sharing
    console.log('Sharing workout:', workout)
  }

  if (!parameters) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading workout parameters..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Your Personalized Workout
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generated just for you
              </p>
            </div>
            <div className="flex space-x-2">
              {workout && (
                <>
                  <Button variant="outline" size="sm" onClick={handleShareWorkout}>
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSaveWorkout}>
                    <Download className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Parameters Summary */}
        <Card className="mb-6 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-primary-600" />
              <span className="font-medium capitalize">{parameters.mode}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>{parameters.duration} min</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-green-600" />
              <span>RPE {parameters.rpe}/10</span>
            </div>
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-4 w-4 text-purple-600" />
              <span className="capitalize">{parameters.experience}</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {parameters.muscles.map((muscle) => (
              <Badge key={muscle} variant="secondary" className="capitalize">
                {muscle.replace('_', ' ')}
              </Badge>
            ))}
            {parameters.equipment.map((eq) => (
              <Badge key={eq} variant="outline" className="capitalize">
                {eq.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Loading State */}
        {isGenerating && (
          <Card className="p-8 text-center">
            <LoadingSpinner size="lg" text="Generating your personalized workout..." />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              This may take a few moments while our AI creates the perfect workout for you.
            </p>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 border-red-200 dark:border-red-800">
            <div className="text-center">
              <div className="text-red-600 dark:text-red-400 mb-4">
                <Zap className="h-12 w-12 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Generation Failed</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Button onClick={handleRegenerate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {/* Generated Workout */}
        {workout && !isGenerating && (
          <div className="space-y-6">
            {/* Workout Header */}
            <Card className="p-6">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {workout.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {workout.description}
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => window.location.href = `/workouts/execute?workout=${encodeURIComponent(JSON.stringify(workout))}`} className="bg-primary-600 hover:bg-primary-700">
                  <Play className="h-4 w-4 mr-2" />
                  Start Workout
                </Button>
                <Button onClick={handleRegenerate} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate New Workout
                </Button>
              </div>
            </Card>

            {/* Warmup */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                🔥 Warmup (5-10 minutes)
              </h3>
              <ul className="space-y-2">
                {workout.warmup?.exercises?.map((exercise, index) => (
                  <li key={exercise.id || `warmup-${index}`} className="flex items-start space-x-2">
                    <span className="text-primary-600 font-medium">{index + 1}.</span>
                    <span className="text-gray-700 dark:text-gray-300">{exercise.name}</span>
                  </li>
                )) || [
                  <li key="default" className="flex items-start space-x-2">
                    <span className="text-primary-600 font-medium">1.</span>
                    <span className="text-gray-700 dark:text-gray-300">Dynamic warm-up</span>
                  </li>
                ]}
              </ul>
            </Card>

            {/* Main Workout */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                💪 Main Workout
              </h3>
              <div className="space-y-6">
                {workout.blocks?.map((block, blockIndex) => (
                  <div key={block.id || blockIndex} className="border-l-4 border-primary-500 pl-4">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      {block.name}
                    </h4>
                    <ul className="space-y-2">
                      {block.exercises.map((exercise, exerciseIndex) => (
                        <li key={exercise.id || `${block.id || blockIndex}-${exerciseIndex}`} className="flex items-start space-x-2">
                          <span className="text-primary-600 font-medium">{exerciseIndex + 1}.</span>
                          <div className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">{exercise.name}</span>
                            {(exercise.sets || exercise.reps || exercise.duration) && (
                              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                {exercise.sets && exercise.reps ? `${exercise.sets} sets × ${exercise.reps} reps` : 
                                 exercise.duration ? `${exercise.duration}s` : ''}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )) || (
                  <div className="text-gray-500 dark:text-gray-400 italic">
                    No workout exercises available
                  </div>
                )}
              </div>
            </Card>

            {/* Cooldown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                🧘 Cooldown (5-10 minutes)
              </h3>
              <ul className="space-y-2">
                {workout.cooldown?.exercises?.map((exercise, index) => (
                  <li key={exercise.id || `cooldown-${index}`} className="flex items-start space-x-2">
                    <span className="text-primary-600 font-medium">{index + 1}.</span>
                    <span className="text-gray-700 dark:text-gray-300">{exercise.name}</span>
                  </li>
                )) || [
                  <li key="default" className="flex items-start space-x-2">
                    <span className="text-primary-600 font-medium">1.</span>
                    <span className="text-gray-700 dark:text-gray-300">Cool-down stretches</span>
                  </li>
                ]}
              </ul>
            </Card>

            {/* Notes */}
            {workout.tips && workout.tips.length > 0 && (
              <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                  📝 Important Notes
                </h3>
                <ul className="space-y-2">
                  {workout.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 font-medium">•</span>
                      <span className="text-blue-800 dark:text-blue-200">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button onClick={handleSaveWorkout} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Save to My Workouts
              </Button>
              <Button onClick={() => router.push('/')} variant="outline" className="flex-1">
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}