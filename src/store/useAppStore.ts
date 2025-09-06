import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UserProfile, OnboardingState, TrainingBaseline, ExampleWorkout, QuickStartProfile, CompleteProfile } from '@/types/user';
import { WorkoutBlock } from '@/types/fitness';

interface UserSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    timezone: string;
  };
  ai: {
    modelPreference: string;
    responseStyle: string;
    workoutComplexity: string;
  };
  notifications: {
    workoutReminders: boolean;
    progressUpdates: boolean;
    weeklyReports: boolean;
    emailNotifications: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    shareWorkouts: boolean;
    shareAchievements: boolean;
    dataCollection: boolean;
    dataSharing: boolean;
    analytics: boolean;
    crashReports: boolean;
  };
  appearance: {
    theme: string;
    colorScheme: string;
    fontSize: string;
  };
  preferences: {
    language: string;
    units: string;
    startOfWeek: string;
    defaultWorkoutDuration: number;
  };
}

interface AppState {
  isLoading: boolean;
  isFirstTime: boolean;
  setLoading: (loading: boolean) => void;
  setFirstTime: (firstTime: boolean) => void;
}

interface UserProfileState {
  // User profile data
  profile: UserProfile | null;
  onboarding: OnboardingState;
  trainingBaseline: TrainingBaseline | null;
  exampleWorkouts: ExampleWorkout[];
  settings: UserSettings;
  
  // Actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setQuickStartProfile: (profile: QuickStartProfile) => void;
  setCompleteProfile: (profile: CompleteProfile) => void;
  setOnboardingStep: (step: number) => void;
  setOnboardingType: (type: 'quick' | 'complete') => void;
  completeOnboarding: () => void;
  setTrainingBaseline: (baseline: TrainingBaseline) => void;
  setExampleWorkouts: (workouts: ExampleWorkout[]) => void;
  updateSettings: (section: keyof UserSettings, updates: Partial<UserSettings[keyof UserSettings]>) => void;
  resetProfile: () => void;
}

const initialOnboardingState: OnboardingState = {
  currentStep: 0,
  totalSteps: 3, // Will be updated based on profile type
  profileType: null,
  isCompleted: false
};

const initialSettings: UserSettings = {
  profile: {
    name: '',
    email: '',
    phone: '',
    timezone: 'America/New_York'
  },
  ai: {
    modelPreference: 'claude-3-sonnet',
    responseStyle: 'friendly',
    workoutComplexity: 'moderate'
  },
  notifications: {
    workoutReminders: true,
    progressUpdates: true,
    weeklyReports: false,
    emailNotifications: false
  },
  privacy: {
    profileVisibility: 'public' as const,
    shareWorkouts: true,
    shareAchievements: true,
    dataCollection: false,
    dataSharing: false,
    analytics: true,
    crashReports: true
  },
  appearance: {
    theme: 'system',
    colorScheme: 'blue',
    fontSize: 'medium'
  },
  preferences: {
    language: 'English',
    units: 'metric',
    startOfWeek: 'monday',
    defaultWorkoutDuration: 45
  }
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        isLoading: true,
        isFirstTime: true,
        setLoading: (loading: boolean) => set({ isLoading: loading }),
        setFirstTime: (firstTime: boolean) => set({ isFirstTime: firstTime }),
      }),
      {
        name: 'app-storage',
      }
    )
  )
);

export const useUserStore = create<UserProfileState>()(devtools(
  persist(
    (set, get) => ({
      profile: null,
      onboarding: initialOnboardingState,
      trainingBaseline: null,
      exampleWorkouts: [],
      settings: initialSettings,
      
      setProfile: (profile) => set({ profile }),
      
      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          ...updates,
          updatedAt: new Date()
        } : null
      })),
      
      setQuickStartProfile: (quickProfile) => {
        const profile: UserProfile = {
          ...quickProfile,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          onboardingCompleted: true,
          profileType: 'quick',
          // Set defaults for complete profile fields
          availableEquipment: 'none',
          workoutDuration: 30,
          injuries: [],
          noGoExercises: [],
          painAreas: [],
          medicalConditions: [],
          rpeUnderstanding: false,
          workoutMode: 'guided',
          humorLevel: 'light',
          musicPreference: true,
          restDayPreference: [],
          notifications: true
        };
        set({ profile });
      },
      
      setCompleteProfile: (completeProfile) => {
        const profile: UserProfile = {
          ...completeProfile,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          onboardingCompleted: true,
          profileType: 'complete'
        };
        set({ profile });
      },
      
      setOnboardingStep: (step) => set((state) => ({
        onboarding: { ...state.onboarding, currentStep: step }
      })),
      
      setOnboardingType: (type) => set((state) => ({
        onboarding: {
          ...state.onboarding,
          profileType: type,
          totalSteps: type === 'quick' ? 3 : 8
        }
      })),
      
      completeOnboarding: () => set((state) => ({
        onboarding: { ...state.onboarding, isCompleted: true }
      })),
      
      setTrainingBaseline: (baseline) => set({ trainingBaseline: baseline }),
      
      setExampleWorkouts: (workouts) => set({ exampleWorkouts: workouts }),
      
      updateSettings: (section, updates) => set((state) => ({
        settings: {
          ...state.settings,
          [section]: {
            ...state.settings[section],
            ...updates
          }
        }
      })),
      
      resetProfile: () => set({
        profile: null,
        onboarding: initialOnboardingState,
        trainingBaseline: null,
        exampleWorkouts: [],
        settings: initialSettings
      })
    }),
    {
      name: 'user-profile-storage',
      partialize: (state) => ({
        profile: state.profile,
        onboarding: state.onboarding,
        trainingBaseline: state.trainingBaseline
      })
    }
  )
));

// Workout storage interface
interface SavedWorkout {
  id: string;
  title: string;
  description?: string;
  duration: number;
  estimatedDuration?: number;
  targetRPE?: number;
  warmup?: {
    exercises: any[];
  };
  blocks?: WorkoutBlock[];
  cooldown?: {
    exercises: any[];
  };
  tips?: string[];
  createdAt: Date;
  completedAt?: Date;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  equipment?: string[];
}

interface WorkoutState {
  savedWorkouts: SavedWorkout[];
  
  // Actions
  saveWorkout: (workout: Omit<SavedWorkout, 'id' | 'createdAt'> & { completedAt?: Date }) => void;
  completeWorkout: (workoutId: string) => void;
  deleteWorkout: (workoutId: string) => void;
  getWorkoutById: (workoutId: string) => SavedWorkout | undefined;
  getRecentWorkouts: (limit?: number) => SavedWorkout[];
}

export const useWorkoutStore = create<WorkoutState>()(devtools(
  persist(
    (set, get) => ({
      savedWorkouts: [],
      
      saveWorkout: (workout) => {
        const newWorkout: SavedWorkout = {
          ...workout,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          completedAt: workout.completedAt
        };
        set((state) => ({
          savedWorkouts: [newWorkout, ...state.savedWorkouts]
        }));
      },
      
      completeWorkout: (workoutId) => {
        set((state) => ({
          savedWorkouts: state.savedWorkouts.map(workout =>
            workout.id === workoutId
              ? { ...workout, completedAt: new Date() }
              : workout
          )
        }));
      },
      
      deleteWorkout: (workoutId) => {
        set((state) => ({
          savedWorkouts: state.savedWorkouts.filter(workout => workout.id !== workoutId)
        }));
      },
      
      getWorkoutById: (workoutId) => {
        return get().savedWorkouts.find(workout => workout.id === workoutId);
      },
      
      getRecentWorkouts: (limit = 10) => {
        return get().savedWorkouts
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);
      }
    }),
    {
      name: 'workout-storage',
      partialize: (state) => ({
        savedWorkouts: state.savedWorkouts
      })
    }
  )
));

// Legacy store for backward compatibility
interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useCounterStore = create<CounterState>()(devtools((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
})));