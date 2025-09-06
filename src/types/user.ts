import { z } from 'zod';

// Enums for user profile data
export const FitnessGoal = {
  WEIGHT_LOSS: 'weight_loss',
  MUSCLE_GAIN: 'muscle_gain',
  STRENGTH: 'strength',
  ENDURANCE: 'endurance',
  GENERAL_FITNESS: 'general_fitness',
  REHABILITATION: 'rehabilitation',
  SPORT_SPECIFIC: 'sport_specific'
} as const;

export const FitnessLevel = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
} as const;

export const WorkoutFrequency = {
  ONE_TWO: '1-2',
  THREE_FOUR: '3-4',
  FIVE_SIX: '5-6',
  DAILY: 'daily'
} as const;

export const Equipment = {
  NONE: 'none',
  BASIC: 'basic',
  HOME_GYM: 'home_gym',
  FULL_GYM: 'full_gym'
} as const;

export const WorkoutMode = {
  GUIDED: 'guided',
  FLEXIBLE: 'flexible',
  CHALLENGE: 'challenge'
} as const;

export const HumorLevel = {
  NONE: 'none',
  LIGHT: 'light',
  MODERATE: 'moderate',
  HIGH: 'high'
} as const;

// Zod schemas for validation
export const QuickStartSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  age: z.number().min(13, 'Must be at least 13 years old').max(120, 'Please enter a valid age'),
  fitnessGoal: z.enum([FitnessGoal.WEIGHT_LOSS, FitnessGoal.MUSCLE_GAIN, FitnessGoal.STRENGTH, FitnessGoal.ENDURANCE, FitnessGoal.GENERAL_FITNESS, FitnessGoal.REHABILITATION, FitnessGoal.SPORT_SPECIFIC]),
  fitnessLevel: z.enum([FitnessLevel.BEGINNER, FitnessLevel.INTERMEDIATE, FitnessLevel.ADVANCED]),
  workoutFrequency: z.enum([WorkoutFrequency.ONE_TWO, WorkoutFrequency.THREE_FOUR, WorkoutFrequency.FIVE_SIX, WorkoutFrequency.DAILY])
});

export const CompleteProfileSchema = QuickStartSchema.extend({
  // Physical characteristics
  height: z.number().min(100, 'Height must be at least 100cm').max(250, 'Height must be less than 250cm').optional(),
  weight: z.number().min(30, 'Weight must be at least 30kg').max(300, 'Weight must be less than 300kg').optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  
  // Equipment and preferences
  availableEquipment: z.enum([Equipment.NONE, Equipment.BASIC, Equipment.HOME_GYM, Equipment.FULL_GYM]),
  workoutDuration: z.number().min(10, 'Minimum 10 minutes').max(180, 'Maximum 3 hours'),
  preferredWorkoutTime: z.enum(['morning', 'afternoon', 'evening', 'flexible']).optional(),
  
  // Restrictions and health
  injuries: z.array(z.string()).default([]),
  noGoExercises: z.array(z.string()).default([]),
  painAreas: z.array(z.string()).default([]),
  medicalConditions: z.array(z.string()).default([]),
  
  // Experience and preferences
  rpeUnderstanding: z.boolean().default(false),
  workoutMode: z.enum([WorkoutMode.GUIDED, WorkoutMode.FLEXIBLE, WorkoutMode.CHALLENGE]),
  humorLevel: z.enum([HumorLevel.NONE, HumorLevel.LIGHT, HumorLevel.MODERATE, HumorLevel.HIGH]),
  
  // Additional preferences
  musicPreference: z.boolean().default(true),
  restDayPreference: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])).default([]),
  notifications: z.boolean().default(true)
});

// Type definitions
export type FitnessGoalType = typeof FitnessGoal[keyof typeof FitnessGoal];
export type FitnessLevelType = typeof FitnessLevel[keyof typeof FitnessLevel];
export type WorkoutFrequencyType = typeof WorkoutFrequency[keyof typeof WorkoutFrequency];
export type EquipmentType = typeof Equipment[keyof typeof Equipment];
export type WorkoutModeType = typeof WorkoutMode[keyof typeof WorkoutMode];
export type HumorLevelType = typeof HumorLevel[keyof typeof HumorLevel];

export type QuickStartProfile = z.infer<typeof QuickStartSchema>;
export type CompleteProfile = z.infer<typeof CompleteProfileSchema>;

// User profile state
export interface UserProfile extends CompleteProfile {
  id: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
  onboardingCompleted: boolean;
  profileType: 'quick' | 'complete';
}

// Onboarding state
export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  profileType: 'quick' | 'complete' | null;
  isCompleted: boolean;
}

// Training baseline data
export interface TrainingBaseline {
  userId: string;
  assessmentDate: Date;
  cardioFitness: number; // 1-10 scale
  strength: number; // 1-10 scale
  flexibility: number; // 1-10 scale
  balance: number; // 1-10 scale
  overallFitness: number; // calculated average
  recommendations: string[];
}

// Example workout structure
export interface ExampleWorkout {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: FitnessLevelType;
  targetGoal: FitnessGoalType;
  exercises: {
    id: string;
    name: string;
    sets?: number;
    reps?: number;
    duration?: number;
    restTime: number;
    instructions: string[];
    targetMuscles: string[];
    equipment: string[];
  }[];
  estimatedCalories: number;
  tags: string[];
}

// Form step configuration
export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
  isOptional?: boolean;
  validation?: z.ZodSchema;
}

export const QUICK_START_STEPS: FormStep[] = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Tell us a bit about yourself',
    fields: ['name', 'age']
  },
  {
    id: 'fitness-goals',
    title: 'Fitness Goals',
    description: 'What do you want to achieve?',
    fields: ['fitnessGoal', 'fitnessLevel']
  },
  {
    id: 'workout-frequency',
    title: 'Workout Schedule',
    description: 'How often can you work out?',
    fields: ['workoutFrequency']
  }
];

export const COMPLETE_PROFILE_STEPS: FormStep[] = [
  ...QUICK_START_STEPS,
  {
    id: 'physical-stats',
    title: 'Physical Information',
    description: 'Help us personalize your workouts',
    fields: ['height', 'weight', 'gender'],
    isOptional: true
  },
  {
    id: 'equipment-preferences',
    title: 'Equipment & Preferences',
    description: 'What equipment do you have access to?',
    fields: ['availableEquipment', 'workoutDuration', 'preferredWorkoutTime']
  },
  {
    id: 'health-restrictions',
    title: 'Health & Restrictions',
    description: 'Any injuries or limitations we should know about?',
    fields: ['injuries', 'noGoExercises', 'painAreas', 'medicalConditions'],
    isOptional: true
  },
  {
    id: 'workout-style',
    title: 'Workout Style',
    description: 'How do you like to train?',
    fields: ['rpeUnderstanding', 'workoutMode', 'humorLevel']
  },
  {
    id: 'final-preferences',
    title: 'Final Touches',
    description: 'Last few preferences to personalize your experience',
    fields: ['musicPreference', 'restDayPreference', 'notifications'],
    isOptional: true
  }
];