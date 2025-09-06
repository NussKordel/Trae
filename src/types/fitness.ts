// Core fitness-related types

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced'

export type ExerciseCategory = 'strength' | 'cardio' | 'flexibility' | 'balance' | 'plyometric'

export type ExerciseDifficulty = 'easy' | 'medium' | 'hard'

export type MuscleGroup = 
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'forearms'
  | 'abs' | 'obliques' | 'lower_back'
  | 'quadriceps' | 'hamstrings' | 'glutes' | 'calves'
  | 'full_body' | 'core'

export type Equipment = 
  | 'bodyweight' | 'dumbbells' | 'barbell' | 'kettlebell'
  | 'resistance_bands' | 'pull_up_bar' | 'bench'
  | 'yoga_mat' | 'stability_ball' | 'foam_roller'
  | 'treadmill' | 'stationary_bike' | 'rowing_machine'

export type WorkoutGoal = 
  | 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance'
  | 'flexibility' | 'general_fitness' | 'sport_specific' | 'rehabilitation'

export type RPEScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
export type RIRScale = 0 | 1 | 2 | 3 | 4 | 5 // Reps in Reserve

// Workout modes
export type WorkoutMode = 'classic' | 'emom' | 'amrap' | 'combined'

// Block types for structured workouts
export type BlockType = 'warmup' | 'emom' | 'amrap' | 'strength' | 'conditioning' | 'cooldown'

// Session parameters
export interface SessionParameters {
  duration: number // total workout duration in minutes
  goal: WorkoutGoal
  targetMuscleGroups: MuscleGroup[]
  mode: WorkoutMode
  intensity?: RPEScale
  equipment?: Equipment[]
  painLevel?: number // 0-10 scale
  noGoExercises?: string[]
}

// Exercise-related interfaces
export interface ExerciseSet {
  reps?: number
  weight?: number
  duration?: number // in seconds
  distance?: number // in meters
  restTime?: number // in seconds
  targetRPE?: RPEScale
  targetRIR?: RIRScale
  actualRPE?: RPEScale
  actualRIR?: RIRScale
}

// Enhanced exercise interface for workout generation
export interface WorkoutExercise {
  id?: string
  name: string
  description: string
  sets?: number
  reps?: number | string // can be "AMRAP" or "Max"
  duration?: number // in seconds
  restTime: number
  difficulty: ExerciseDifficulty
  equipment: Equipment[]
  muscleGroups: MuscleGroup[]
  instructions: string[]
  modifications: string[]
  targetRPE?: RPEScale
  targetRIR?: RIRScale
  safetyNotes?: string[]
  contraindications?: string[] // conditions where this exercise should be avoided
}

// Workout block structure
export interface WorkoutBlock {
  id: string
  type: BlockType
  name: string
  description?: string
  duration: number // in minutes
  exercises: WorkoutExercise[]
  instructions?: string[]
  restBetweenExercises?: number
  rounds?: number
  workTime?: number // for EMOM/AMRAP
  restTime?: number // for EMOM/AMRAP
}

export interface ExerciseProgression {
  week: number
  sets: ExerciseSet[]
  notes?: string
}

export interface ExerciseMetrics {
  totalVolume?: number
  averageRPE?: number
  personalRecord?: {
    weight?: number
    reps?: number
    duration?: number
  }
  lastPerformed?: Date
}

// Workout-related interfaces
export interface WorkoutTemplate {
  id: string
  name: string
  description: string
  category: ExerciseCategory
  difficulty: ExerciseDifficulty
  estimatedDuration: number
  targetMuscleGroups: MuscleGroup[]
  requiredEquipment: Equipment[]
  exercises: string[] // Exercise IDs
  tags: string[]
}

export interface WorkoutPlan {
  id: string
  name: string
  description: string
  duration: number // in weeks
  workoutsPerWeek: number
  targetGoals: WorkoutGoal[]
  fitnessLevel: FitnessLevel
  templates: WorkoutTemplate[]
  progression: {
    week: number
    adjustments: string[]
  }[]
}

// User progress and analytics
export interface ProgressMetrics {
  date: Date
  weight?: number
  bodyFat?: number
  measurements?: {
    chest?: number
    waist?: number
    hips?: number
    biceps?: number
    thighs?: number
  }
  fitnessTests?: {
    pushUps?: number
    plankDuration?: number
    mileTime?: number
  }
}

export interface WorkoutAnalytics {
  totalWorkouts: number
  totalDuration: number // in minutes
  averageRPE: number
  consistencyScore: number // 0-100
  strengthProgress: {
    exercise: string
    improvement: number // percentage
  }[]
  weeklyStats: {
    week: string
    workouts: number
    duration: number
    averageRPE: number
  }[]
}

// AI and personalization types
export interface UserPreferences {
  workoutDuration: number // preferred duration in minutes
  workoutFrequency: number // times per week
  exerciseTypes: ExerciseCategory[]
  equipment: Equipment[]
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'flexible'
  restDayPreference: string[] // days of week
  injuryHistory?: string[]
  limitations?: string[]
}

export interface AIRecommendation {
  type: 'exercise_swap' | 'intensity_adjustment' | 'rest_day' | 'progression'
  title: string
  description: string
  reasoning: string
  confidence: number // 0-1
  actionRequired: boolean
}

export interface AdaptationRule {
  condition: string
  action: string
  priority: 'low' | 'medium' | 'high'
}

// Notification and reminder types
export interface WorkoutReminder {
  id: string
  userId: string
  scheduledTime: Date
  workoutType: string
  message: string
  isActive: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: Date
  progress?: number // 0-100 for progress-based achievements
  target?: number
}

// API response types
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}