import {
  OpenRouterRequest,
  OpenRouterResponse,
  OpenRouterMessage,
  AIRequestOptions,
  AIModelType,
  AI_MODELS,
  DEFAULT_MODELS
} from '@/types/ai';
import { handleAIError, shouldRetry, getRetryDelay } from '@/utils/errorHandling';

// OpenRouter API Configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  'X-Title': 'FitTrack - AI Fitness Assistant'
};

export class OpenRouterService {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || this.getStoredApiKey();
    this.baseURL = OPENROUTER_API_URL;
    
    // Validate API key is configured
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is required but not configured.');
    }
  }

  private getStoredApiKey(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('openrouter_api_key') || '';
    }
    return process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
  }

  private getHeaders(): Record<string, string> {
    return {
      ...DEFAULT_HEADERS,
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private selectModel(modelType: AIModelType): string {
    const models = AI_MODELS[modelType];
    if (!models || models.length === 0) {
      const defaultModel = DEFAULT_MODELS[modelType];
      if (!defaultModel) {
        throw new Error(`No models available for model type: ${modelType}`);
      }
      return defaultModel.id;
    }
    return models[0].id;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit,
    config: {
      timeout?: number;
      retries?: number;
    } = {}
  ): Promise<T> {
    const { timeout = 60000, retries = 3 } = config;
    
    let lastError: any;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          signal: controller.signal,
          headers: {
            ...this.getHeaders(),
            ...options.headers,
          },
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
          (error as any).status = response.status;
          (error as any).response = { status: response.status, data: errorData };
          throw error;
        }
        
        return await response.json();
      } catch (error) {
        lastError = error;
        
        // Use our error handling system to classify the error
        const aiError = handleAIError(error, {
          endpoint,
          attempt,
          maxAttempts: retries,
          apiKey: this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'missing'
        }, { notify: false, log: true });
        
        // Check if we should retry using our error handling logic
        if (attempt < retries && shouldRetry(aiError, attempt, retries)) {
          const delay = getRetryDelay(aiError, attempt);
          await this.delay(delay);
          continue;
        }
        
        // If we've exhausted retries or error is not retryable, throw the classified error
        throw aiError;
      }
    }
    
    throw lastError!;
  }

  async generateResponse(request: OpenRouterRequest, options: AIRequestOptions = {}): Promise<OpenRouterResponse> {
    // Check if API key is configured and valid
    if (!this.hasApiKey() || 
        this.apiKey === 'your_openrouter_api_key_here' || 
        this.apiKey.trim() === '' || 
        this.apiKey === 'undefined' || 
        this.apiKey === 'null') {
      throw new Error('OpenRouter API key is not configured or invalid. Please set a valid API key to use AI features.');
    }
    
    try {
      const requestBody = {
        ...request,
        stream: false, // We'll handle streaming separately if needed
      };
      
      const response = await this.makeRequest<OpenRouterResponse>('/chat/completions', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      }, {
        timeout: options.timeout,
        retries: options.retries,
      });
      
      return response;
    } catch (error) {
      // The error has already been classified and logged by makeRequest
      // Just handle user notification here
      handleAIError(error, {
        operation: 'generateResponse',
        model: request.model,
        messageCount: request.messages?.length || 0
      }, { log: false }); // Don't log again, just notify
      
      throw error;
    }
  }

  async generateWorkout(
    modelType: AIModelType,
    messages: OpenRouterMessage[],
    options: AIRequestOptions = {}
  ): Promise<OpenRouterResponse> {
    const model = this.selectModel(modelType);
    
    const request: OpenRouterRequest = {
      model,
      messages,
      max_tokens: options.maxTokens || 2000,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 0.9,
    };
    
    return await this.generateResponse(request, options);
  }

  async testConnection(): Promise<boolean> {
    try {
      // Test with a minimal request to check API key validity
      const testRequest: OpenRouterRequest = {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1,
      };
      
      const response = await this.makeRequest<OpenRouterResponse>('/chat/completions', {
        method: 'POST',
        body: JSON.stringify(testRequest),
      }, {
        timeout: 10000,
        retries: 1,
      });
      
      return response !== null;
    } catch (error) {
      // For connection tests, we don't want to show user notifications
      // Just log the error for debugging
      handleAIError(error, {
        operation: 'testConnection'
      }, { notify: false, log: true });
      
      return false;
    }
  }

  async getAvailableModels(): Promise<Array<{ id: string; name: string; provider: string }> | null> {
    try {
      const response = await this.makeRequest<{
        data: Array<{
          id: string;
          name: string;
          created: number;
          context_length: number;
          pricing: {
            prompt: string;
            completion: string;
          };
        }>;
      }>('/models', {
        method: 'GET',
      }, {
        timeout: 15000,
        retries: 2,
      });
      
      return response.data.map(model => ({
        id: model.id,
        name: model.name || model.id,
        provider: model.id.split('/')[0] || 'unknown'
      }));
    } catch (error) {
      handleAIError(error, {
        operation: 'getAvailableModels'
      }, { notify: false });
      
      throw error;
    }
  }

  async getModelInfo(modelId: string): Promise<any | null> {
    try {
      const response = await this.makeRequest(`/models/${modelId}`, {
        method: 'GET',
      }, {
        timeout: 10000,
        retries: 2,
      });
      
      return response;
    } catch (error) {
      handleAIError(error, {
        operation: 'getModelInfo',
        modelId
      }, { notify: false });
      
      throw error;
    }
  }

  // Utility method to update API key
  updateApiKey(newApiKey: string): void {
    this.apiKey = newApiKey;
    if (typeof window !== 'undefined') {
      localStorage.setItem('openrouter_api_key', newApiKey);
    }
  }

  // Utility method to check if API key is configured
  hasApiKey(): boolean {
    return !!this.apiKey && this.apiKey.length > 0 && this.apiKey.trim() !== '';
  }

  // Get current API key (masked for security)
  getMaskedApiKey(): string {
    if (!this.apiKey) return 'Not configured';
    return `${this.apiKey.substring(0, 10)}...${this.apiKey.substring(this.apiKey.length - 4)}`;
  }
}

// Export a default instance
let defaultInstance: OpenRouterService | null = null;

export function getOpenRouterService(): OpenRouterService {
  if (!defaultInstance) {
    try {
      defaultInstance = new OpenRouterService();
    } catch (error) {
      // If we can't create a default instance (no API key), return a placeholder
      // The actual error will be handled when methods are called
      throw error;
    }
  }
  return defaultInstance;
}

// Reset the default instance (useful for testing or when API key changes)
export function resetOpenRouterService(): void {
  defaultInstance = null;
}

export default OpenRouterService;