// AI Model Types and Interfaces
import { UserProfile } from './user';
import { SessionParameters, WorkoutBlock, WorkoutExercise, RPEScale, RIRScale } from './fitness';

export enum AIModelType {
  SCHNELL = 'schnell',
  PRAEZISE = 'praezise', 
  KREATIV = 'kreativ',
  CUSTOM = 'custom'
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  type: AIModelType;
  provider: string;
  maxTokens: number;
  costPer1kTokens: number;
  capabilities: string[];
}

export interface AIModelConfig {
  [AIModelType.SCHNELL]: AIModel[];
  [AIModelType.PRAEZISE]: AIModel[];
  [AIModelType.KREATIV]: AIModel[];
  [AIModelType.CUSTOM]: AIModel[];
}

// OpenRouter API Types
export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenRouterError {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}

// AI Service Types
export interface AIRequestOptions {
  modelType?: AIModelType;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  retryAttempts?: number;
  retries?: number;
  timeout?: number;

}

export interface AIResponse {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: string;
}

export interface AIError {
  message: string;
  type: 'network' | 'api' | 'rate_limit' | 'authentication' | 'unknown';
  code?: string;
  retryable: boolean;
}

// Enhanced workout generation types
export interface WorkoutGenerationRequest {
  userProfile: UserProfile;
  sessionParameters: SessionParameters;
  workoutType?: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  focus?: string;
  additionalInstructions?: string;
}

export interface EnhancedWorkoutResponse {
  workout: {
    id: string;
    title: string;
    description: string;
    totalDuration: number;
    difficulty: 'easy' | 'medium' | 'hard';
    mode: string;
    warmup: WorkoutBlock;
    blocks: WorkoutBlock[];
    cooldown: WorkoutBlock;
    tips: string[];
    safetyNotes: string[];
    warnings?: string[];
  };
  personalizedMessage: string;
  modelUsed: string;
  rpeGuidance: {
    targetIntensity: RPEScale;
    progressionNotes: string[];
    recoveryRecommendations: string[];
  };
  safetyAnalysis: {
    riskLevel: 'low' | 'medium' | 'high';
    contraindications: string[];
    modifications: string[];
  };
}

// Legacy support
export interface WorkoutGenerationResponse {
  workout: {
    title: string;
    description: string;
    duration: number;
    difficulty: 'easy' | 'medium' | 'hard';
    exercises: {
      name: string;
      description: string;
      sets?: number;
      reps?: number;
      duration?: number;
      restTime: number;
      difficulty: 'easy' | 'medium' | 'hard';
      equipment: string[];
      muscleGroups: string[];
      instructions: string[];
      modifications?: string[];
    }[];
    warmup: {
      name: string;
      duration: number;
      instructions: string;
    }[];
    cooldown: {
      name: string;
      duration: number;
      instructions: string;
    }[];
    tips: string[];
    safetyNotes: string[];
  };
  personalizedMessage: string;
  modelUsed: string;
}

// Model Configuration
export const AI_MODELS: AIModelConfig = {
  [AIModelType.SCHNELL]: [
    {
      id: 'deepseek/deepseek-chat-v3.1:free',
      name: 'DeepSeek Chat v3.1 (Free)',
      description: 'Kostenlose, schnelle AI für effiziente Workouts',
      type: AIModelType.SCHNELL,
      provider: 'DeepSeek',
      maxTokens: 4096,
      costPer1kTokens: 0.0,
      capabilities: ['fast_response', 'basic_workouts', 'science_based']
    },
    {
      id: 'anthropic/claude-3-haiku',
      name: 'Claude 3 Haiku',
      description: 'Schnelle Antworten für einfache Workouts',
      type: AIModelType.SCHNELL,
      provider: 'Anthropic',
      maxTokens: 4096,
      costPer1kTokens: 0.25,
      capabilities: ['fast_response', 'basic_workouts']
    },
    {
      id: 'openai/gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Bewährte schnelle AI für Basis-Workouts',
      type: AIModelType.SCHNELL,
      provider: 'OpenAI',
      maxTokens: 4096,
      costPer1kTokens: 0.5,
      capabilities: ['fast_response', 'basic_workouts']
    }
  ],
  [AIModelType.PRAEZISE]: [
    {
      id: 'deepseek/deepseek-chat-v3.1:free',
      name: 'DeepSeek Chat v3.1 (Free)',
      description: 'Kostenlose, wissenschaftlich fundierte Workout-Planung',
      type: AIModelType.PRAEZISE,
      provider: 'DeepSeek',
      maxTokens: 8192,
      costPer1kTokens: 0.0,
      capabilities: ['detailed_planning', 'safety_analysis', 'form_corrections', 'science_based']
    },
    {
      id: 'anthropic/claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      description: 'Präzise Workout-Planung mit detaillierten Anweisungen',
      type: AIModelType.PRAEZISE,
      provider: 'Anthropic',
      maxTokens: 8192,
      costPer1kTokens: 3.0,
      capabilities: ['detailed_planning', 'safety_analysis', 'form_corrections']
    },
    {
      id: 'openai/gpt-4-turbo',
      name: 'GPT-4 Turbo',
      description: 'Hochpräzise Workout-Erstellung mit Sicherheitsfokus',
      type: AIModelType.PRAEZISE,
      provider: 'OpenAI',
      maxTokens: 8192,
      costPer1kTokens: 10.0,
      capabilities: ['detailed_planning', 'safety_analysis', 'form_corrections']
    }
  ],
  [AIModelType.KREATIV]: [
    {
      id: 'deepseek/deepseek-chat-v3.1:free',
      name: 'DeepSeek Chat v3.1 (Free)',
      description: 'Kostenlose, kreative und wissenschaftlich fundierte Workouts',
      type: AIModelType.KREATIV,
      provider: 'DeepSeek',
      maxTokens: 8192,
      costPer1kTokens: 0.0,
      capabilities: ['creative_workouts', 'motivational_content', 'personalized_humor', 'science_based']
    },
    {
      id: 'anthropic/claude-3-opus',
      name: 'Claude 3 Opus',
      description: 'Kreative und motivierende Workout-Erlebnisse',
      type: AIModelType.KREATIV,
      provider: 'Anthropic',
      maxTokens: 8192,
      costPer1kTokens: 15.0,
      capabilities: ['creative_workouts', 'motivational_content', 'personalized_humor']
    },
    {
      id: 'openai/gpt-4',
      name: 'GPT-4',
      description: 'Innovative Workout-Konzepte mit persönlicher Note',
      type: AIModelType.KREATIV,
      provider: 'OpenAI',
      maxTokens: 8192,
      costPer1kTokens: 30.0,
      capabilities: ['creative_workouts', 'motivational_content', 'personalized_humor']
    }
  ],
  [AIModelType.CUSTOM]: [
    {
      id: 'deepseek/deepseek-chat-v3.1:free',
      name: 'DeepSeek Chat v3.1 (Free)',
      description: 'Benutzerdefinierte Konfiguration für wissenschaftlich fundierte Workouts',
      type: AIModelType.CUSTOM,
      provider: 'DeepSeek',
      maxTokens: 8192,
      costPer1kTokens: 0.0,
      capabilities: ['custom_configuration', 'science_based', 'flexible_parameters']
    }
  ]
};

// Default model selection
export const DEFAULT_MODELS = {
  [AIModelType.SCHNELL]: AI_MODELS[AIModelType.SCHNELL][0],
  [AIModelType.PRAEZISE]: AI_MODELS[AIModelType.PRAEZISE][0],
  [AIModelType.KREATIV]: AI_MODELS[AIModelType.KREATIV][0],
  [AIModelType.CUSTOM]: AI_MODELS[AIModelType.CUSTOM][0]
};

// Retry configuration
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors: string[];
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryableErrors: ['rate_limit', 'network', 'timeout', 'server_error']
};