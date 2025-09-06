import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { RPEScale, ExerciseSet } from '@/types/fitness'

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string {
  const d = new Date(date)
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    case 'long':
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    case 'time':
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    default:
      return d.toLocaleDateString()
  }
}

/**
 * Calculate workout duration in human-readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`
}

/**
 * Get RPE description based on scale
 */
export function getRPEDescription(rpe: RPEScale): string {
  const descriptions: Record<RPEScale, string> = {
    1: 'Very Easy',
    2: 'Easy',
    3: 'Moderate',
    4: 'Somewhat Hard',
    5: 'Hard',
    6: 'Very Hard',
    7: 'Very Hard+',
    8: 'Extremely Hard',
    9: 'Maximum Effort',
    10: 'Absolute Maximum'
  }
  return descriptions[rpe]
}

/**
 * Get RPE color for UI display
 */
export function getRPEColor(rpe: RPEScale): string {
  if (rpe <= 3) return 'text-green-600 bg-green-100'
  if (rpe <= 5) return 'text-yellow-600 bg-yellow-100'
  if (rpe <= 7) return 'text-orange-600 bg-orange-100'
  return 'text-red-600 bg-red-100'
}

/**
 * Calculate total workout volume
 */
export function calculateWorkoutVolume(sets: ExerciseSet[]): number {
  return sets.reduce((total, set) => {
    if (set.weight && set.reps) {
      return total + (set.weight * set.reps)
    }
    return total
  }, 0)
}

/**
 * Calculate average RPE from workout sessions
 */
export function calculateAverageRPE(workouts: any[]): number {
  const validRPEs = workouts.filter(w => w.rpe).map(w => w.rpe!)
  if (validRPEs.length === 0) return 0
  return Math.round(validRPEs.reduce((sum, rpe) => sum + rpe, 0) / validRPEs.length)
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Debounce function for search and input handling
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Calculate consistency score based on workout frequency
 */
export function calculateConsistencyScore(
  workouts: any[],
  targetWorkoutsPerWeek: number = 3,
  weeks: number = 4
): number {
  const now = new Date()
  const weeksAgo = new Date(now.getTime() - (weeks * 7 * 24 * 60 * 60 * 1000))
  
  const recentWorkouts = workouts.filter(w => 
    w.completedAt && new Date(w.completedAt) >= weeksAgo
  )
  
  const actualWorkouts = recentWorkouts.length
  const targetWorkouts = targetWorkoutsPerWeek * weeks
  
  return Math.min(100, Math.round((actualWorkouts / targetWorkouts) * 100))
}

/**
 * Format weight for display
 */
export function formatWeight(weight: number, unit: 'kg' | 'lbs' = 'kg'): string {
  return `${weight}${unit}`
}

/**
 * Convert between weight units
 */
export function convertWeight(weight: number, from: 'kg' | 'lbs', to: 'kg' | 'lbs'): number {
  if (from === to) return weight
  if (from === 'kg' && to === 'lbs') return Math.round(weight * 2.20462 * 100) / 100
  if (from === 'lbs' && to === 'kg') return Math.round(weight / 2.20462 * 100) / 100
  return weight
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get greeting based on time of day
 */
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase())
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}