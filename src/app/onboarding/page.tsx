'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, User, Target, Dumbbell } from 'lucide-react'
import { useUserStore, useAppStore } from '@/store/useAppStore'
import type { FitnessLevel, WorkoutGoal, Equipment } from '@/types/fitness'

interface OnboardingStep {
  id: number
  title: string
  description: string
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Tell us about yourself'
  },
  {
    id: 2,
    title: 'Fitness Goals',
    description: 'What do you want to achieve?'
  },
  {
    id: 3,
    title: 'Equipment & Preferences',
    description: 'What equipment do you have access to?'
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const { setProfile } = useUserStore()
  const { setFirstTime } = useAppStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    fitnessLevel: 'beginner' as FitnessLevel,
    goals: [] as WorkoutGoal[],
    workoutDuration: 30,
    equipment: [] as Equipment[],
    exerciseTypes: [] as string[]
  })

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      const user = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        age: 25, // Default age
        fitnessGoal: 'general_fitness' as const,
        fitnessLevel: formData.fitnessLevel,
        workoutFrequency: '3-4' as const,
        availableEquipment: 'none' as const,
        workoutDuration: formData.workoutDuration,
        injuries: [],
        noGoExercises: [],
        painAreas: [],
        medicalConditions: [],
        rpeUnderstanding: false,
        workoutMode: 'guided' as const,
        humorLevel: 'light' as const,
        musicPreference: true,
        restDayPreference: [],
        notifications: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        onboardingCompleted: true,
        profileType: 'complete' as const,
        goals: formData.goals,
        joinDate: new Date().toISOString().split('T')[0]
      }
      setProfile(user)
      setFirstTime(false)
      router.push('/')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push('/')
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== '' && formData.email.trim() !== ''
      case 2:
        return formData.goals.length > 0
      case 3:
        return formData.equipment.length > 0
      default:
        return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
              <p className="text-gray-600">Let's get to know you better</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fitness Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['beginner', 'intermediate', 'advanced'] as FitnessLevel[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.fitnessLevel === level
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({ ...formData, fitnessLevel: level })}
                    >
                      <div className="font-medium capitalize">{level}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-secondary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Fitness Goals</h2>
              <p className="text-gray-600">What do you want to achieve?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select your primary goals (choose multiple)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['weight_loss', 'muscle_gain', 'strength', 'endurance', 'flexibility', 'general_fitness'] as WorkoutGoal[]).map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      className={`p-3 rounded-lg border-2 transition-colors text-left ${
                        formData.goals.includes(goal)
                          ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        const newGoals = formData.goals.includes(goal)
                          ? formData.goals.filter(g => g !== goal)
                          : [...formData.goals, goal]
                        setFormData({ ...formData, goals: newGoals })
                      }}
                    >
                      <div className="font-medium capitalize">{goal.replace('_', ' ')}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Workout Duration: {formData.workoutDuration} minutes
                </label>
                <input
                  type="range"
                  min="15"
                  max="90"
                  step="15"
                  value={formData.workoutDuration}
                  onChange={(e) => setFormData({ ...formData, workoutDuration: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>15 min</span>
                  <span>90 min</span>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="h-8 w-8 text-success-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Equipment & Preferences</h2>
              <p className="text-gray-600">What equipment do you have access to?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available Equipment (select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['bodyweight', 'dumbbells', 'barbell', 'kettlebell', 'resistance_bands', 'pull_up_bar', 'bench', 'yoga_mat'] as Equipment[]).map((equipment) => (
                    <button
                      key={equipment}
                      type="button"
                      className={`p-3 rounded-lg border-2 transition-colors text-left ${
                        formData.equipment.includes(equipment)
                          ? 'border-success-500 bg-success-50 text-success-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        const newEquipment = formData.equipment.includes(equipment)
                          ? formData.equipment.filter(e => e !== equipment)
                          : [...formData.equipment, equipment]
                        setFormData({ ...formData, equipment: newEquipment })
                      }}
                    >
                      <div className="font-medium capitalize">{equipment.replace('_', ' ')}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  step.id < steps.length ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.id}
                </div>
                {step.id < steps.length && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-lg font-medium text-gray-900">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
            </h1>
          </div>
        </div>

        {/* Step Content */}
        <div className="card">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`inline-flex items-center space-x-2 ${
              isStepValid()
                ? 'btn-primary'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed py-2 px-4 rounded-lg'
            }`}
          >
            <span>{currentStep === steps.length ? 'Complete Setup' : 'Next'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}