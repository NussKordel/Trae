import axios from 'axios'
import type { WorkoutExercise } from '@/types/fitness'

interface User {
  id: string
  name: string
  fitnessLevel: string
  goals: string[]
  preferences: {
    exerciseTypes: string[]
    equipment: string[]
    workoutDuration: number
  }
}

interface WorkoutSession {
  id: string
  name: string
  exercises: WorkoutExercise[]
  duration: number
  rpe?: number
}

interface AIWorkoutRequest {
  user: User
  previousWorkouts?: WorkoutSession[]
  targetDuration?: number
  focusAreas?: string[]
}

interface AIWorkoutResponse {
  workout: WorkoutSession
  reasoning: string
  adaptations: string[]
}

class WorkoutAIService {
  private apiKey: string
  private baseURL = 'https://openrouter.ai/api/v1'
  private model: string

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || ''
    this.model = process.env.DEFAULT_AI_MODEL || 'anthropic/claude-3-haiku'
  }

  private async makeAIRequest(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are an expert AI fitness coach specializing in personalized workout planning. 
              You create adaptive, science-based workout programs tailored to individual users' fitness levels, 
              goals, preferences, and performance feedback. Always respond with valid JSON format.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
            'X-Title': 'AI Fitness Coach'
          }
        }
      )

      return response.data.choices[0].message.content
    } catch (error) {
      console.error('AI API Error:', error)
      throw new Error('Failed to generate AI workout plan')
    }
  }

  async generateWorkout(request: AIWorkoutRequest): Promise<AIWorkoutResponse> {
    const prompt = `
    Generate a personalized workout plan based on the following user data:
    
    User Profile:
    - Fitness Level: ${request.user.fitnessLevel}
    - Goals: ${request.user.goals.join(', ')}
    - Preferred Duration: ${request.targetDuration || request.user.preferences.workoutDuration} minutes
    - Equipment Available: ${request.user.preferences.equipment.join(', ')}
    - Exercise Preferences: ${request.user.preferences.exerciseTypes.join(', ')}
    
    ${request.focusAreas ? `Focus Areas: ${request.focusAreas.join(', ')}` : ''}
    
    ${request.previousWorkouts && request.previousWorkouts.length > 0 ? 
      `Recent Workout History (last 3):
      ${request.previousWorkouts.slice(0, 3).map(w => 
        `- ${w.name}: RPE ${w.rpe}/10, Duration: ${w.duration}min`
      ).join('\n')}` : 'No previous workout history available.'
    }
    
    Please generate a workout plan that:
    1. Matches the user's fitness level and goals
    2. Adapts based on recent performance (RPE feedback)
    3. Includes 4-8 exercises with proper progression
    4. Provides clear instructions and muscle group targeting
    
    Respond with a JSON object in this exact format:
    {
      "workout": {
        "id": "unique_id",
        "name": "Workout Name",
        "exercises": [
          {
            "id": "exercise_id",
            "name": "Exercise Name",
            "category": "strength|cardio|flexibility",
            "muscleGroups": ["muscle1", "muscle2"],
            "equipment": ["equipment_needed"],
            "difficulty": "easy|medium|hard",
            "instructions": ["step1", "step2", "step3"]
          }
        ],
        "duration": ${request.targetDuration || request.user.preferences.workoutDuration}
      },
      "reasoning": "Brief explanation of workout design choices",
      "adaptations": ["adaptation1", "adaptation2"]
    }
    `

    const aiResponse = await this.makeAIRequest(prompt)
    
    try {
      const parsedResponse = JSON.parse(aiResponse)
      return parsedResponse as AIWorkoutResponse
    } catch (error) {
      console.error('Failed to parse AI response:', error)
      throw new Error('Invalid AI response format')
    }
  }

  async adaptWorkout(
    currentWorkout: WorkoutSession, 
    userFeedback: { rpe: number; notes?: string },
    user: User
  ): Promise<AIWorkoutResponse> {
    const prompt = `
    Adapt the following workout based on user feedback:
    
    Current Workout:
    - Name: ${currentWorkout.name}
    - Exercises: ${currentWorkout.exercises.map((e: WorkoutExercise) => e.name).join(', ')}
    - Duration: ${currentWorkout.duration} minutes
    
    User Feedback:
    - RPE (Rate of Perceived Exertion): ${userFeedback.rpe}/10
    - Notes: ${userFeedback.notes || 'No additional notes'}
    
    User Profile:
    - Fitness Level: ${user.fitnessLevel}
    - Goals: ${user.goals.join(', ')}
    
    Based on the RPE feedback:
    - If RPE < 6: Increase intensity/difficulty
    - If RPE 6-8: Maintain current level with minor adjustments
    - If RPE > 8: Decrease intensity/difficulty
    
    Generate an adapted workout following the same JSON format as before.
    `

    const aiResponse = await this.makeAIRequest(prompt)
    
    try {
      const parsedResponse = JSON.parse(aiResponse)
      return parsedResponse as AIWorkoutResponse
    } catch (error) {
      console.error('Failed to parse AI adaptation response:', error)
      throw new Error('Invalid AI adaptation response format')
    }
  }

  async suggestExerciseSwap(
    currentExercise: WorkoutExercise,
    reason: string,
    user: User
  ): Promise<WorkoutExercise[]> {
    const prompt = `
    Suggest 3 alternative exercises to replace:
    
    Current Exercise: ${currentExercise.name}
    - Exercise: ${currentExercise.name}
    - Muscle Groups: ${currentExercise.muscleGroups.join(', ')}
    - Equipment: ${currentExercise.equipment.join(', ')}
    - Difficulty: ${currentExercise.difficulty}
    
    Reason for replacement: ${reason}
    
    User constraints:
    - Fitness Level: ${user.fitnessLevel}
    - Available Equipment: ${user.preferences.equipment.join(', ')}
    
    Provide 3 suitable alternatives in JSON format:
    {
      "alternatives": [
        {
          "id": "exercise_id",
          "name": "Exercise Name",
          "category": "category",
          "muscleGroups": ["muscle1", "muscle2"],
          "equipment": ["equipment"],
          "difficulty": "difficulty_level",
          "instructions": ["step1", "step2"]
        }
      ]
    }
    `

    const aiResponse = await this.makeAIRequest(prompt)
    
    try {
      const parsedResponse = JSON.parse(aiResponse)
      return parsedResponse.alternatives as WorkoutExercise[]
    } catch (error) {
      console.error('Failed to parse exercise swap response:', error)
      throw new Error('Invalid exercise swap response format')
    }
  }
}

export const workoutAI = new WorkoutAIService()
export default workoutAI