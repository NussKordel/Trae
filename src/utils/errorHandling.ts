import { toast } from 'sonner';

// Error types for different categories
export enum ErrorType {
  API_KEY_INVALID = 'API_KEY_INVALID',
  API_KEY_MISSING = 'API_KEY_MISSING',
  NETWORK_ERROR = 'NETWORK_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  INSUFFICIENT_CREDITS = 'INSUFFICIENT_CREDITS',
  MODEL_UNAVAILABLE = 'MODEL_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  PARSING_ERROR = 'PARSING_ERROR',
  SERVER_ERROR = 'SERVER_ERROR'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Structured error interface
export interface AIError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  suggestions: string[];
  retryable: boolean;
  originalError?: Error;
  context?: Record<string, any>;
  timestamp: Date;
}

// Error messages in German
const ERROR_MESSAGES: Record<ErrorType, {
  message: string;
  userMessage: string;
  suggestions: string[];
  severity: ErrorSeverity;
  retryable: boolean;
}> = {
  [ErrorType.API_KEY_INVALID]: {
    message: 'Invalid API key provided',
    userMessage: 'Der API-Schlüssel ist ungültig oder abgelaufen.',
    suggestions: [
      'Überprüfe deinen API-Schlüssel in den Einstellungen',
      'Erstelle einen neuen API-Schlüssel bei OpenRouter',
      'Stelle sicher, dass der Schlüssel korrekt kopiert wurde'
    ],
    severity: ErrorSeverity.HIGH,
    retryable: false
  },
  [ErrorType.API_KEY_MISSING]: {
    message: 'No API key configured',
    userMessage: 'Kein API-Schlüssel konfiguriert.',
    suggestions: [
      'Gehe zu den Einstellungen und füge deinen OpenRouter API-Schlüssel hinzu',
      'Erstelle einen kostenlosen Account bei OpenRouter'
    ],
    severity: ErrorSeverity.CRITICAL,
    retryable: false
  },
  [ErrorType.NETWORK_ERROR]: {
    message: 'Network connection failed',
    userMessage: 'Netzwerkverbindung fehlgeschlagen.',
    suggestions: [
      'Überprüfe deine Internetverbindung',
      'Versuche es in ein paar Minuten erneut',
      'Prüfe, ob OpenRouter erreichbar ist'
    ],
    severity: ErrorSeverity.MEDIUM,
    retryable: true
  },
  [ErrorType.RATE_LIMIT]: {
    message: 'Rate limit exceeded',
    userMessage: 'Zu viele Anfragen. Bitte warte einen Moment.',
    suggestions: [
      'Warte 1-2 Minuten bevor du es erneut versuchst',
      'Reduziere die Anzahl der gleichzeitigen Anfragen',
      'Erwäge ein Upgrade deines OpenRouter Plans'
    ],
    severity: ErrorSeverity.MEDIUM,
    retryable: true
  },
  [ErrorType.INSUFFICIENT_CREDITS]: {
    message: 'Insufficient credits',
    userMessage: 'Nicht genügend Credits verfügbar.',
    suggestions: [
      'Lade dein OpenRouter Guthaben auf',
      'Wähle ein günstigeres AI-Modell',
      'Überprüfe dein Guthaben bei OpenRouter'
    ],
    severity: ErrorSeverity.HIGH,
    retryable: false
  },
  [ErrorType.MODEL_UNAVAILABLE]: {
    message: 'Selected model is unavailable',
    userMessage: 'Das gewählte AI-Modell ist momentan nicht verfügbar.',
    suggestions: [
      'Wähle ein anderes AI-Modell (Schnell, Präzise, oder Kreativ)',
      'Versuche es später erneut',
      'Überprüfe den Status bei OpenRouter'
    ],
    severity: ErrorSeverity.MEDIUM,
    retryable: true
  },
  [ErrorType.TIMEOUT]: {
    message: 'Request timeout',
    userMessage: 'Die Anfrage hat zu lange gedauert.',
    suggestions: [
      'Versuche es erneut',
      'Wähle ein schnelleres AI-Modell',
      'Überprüfe deine Internetverbindung'
    ],
    severity: ErrorSeverity.MEDIUM,
    retryable: true
  },
  [ErrorType.VALIDATION_ERROR]: {
    message: 'Request validation failed',
    userMessage: 'Die Anfrage enthält ungültige Daten.',
    suggestions: [
      'Überprüfe deine Eingaben',
      'Stelle sicher, dass alle Pflichtfelder ausgefüllt sind',
      'Kontaktiere den Support, falls das Problem weiterhin besteht'
    ],
    severity: ErrorSeverity.MEDIUM,
    retryable: false
  },
  [ErrorType.PARSING_ERROR]: {
    message: 'Failed to parse AI response',
    userMessage: 'Die AI-Antwort konnte nicht verarbeitet werden.',
    suggestions: [
      'Versuche es mit einem anderen AI-Modell',
      'Versuche es erneut',
      'Melde das Problem, falls es häufig auftritt'
    ],
    severity: ErrorSeverity.MEDIUM,
    retryable: true
  },
  [ErrorType.SERVER_ERROR]: {
    message: 'Server error occurred',
    userMessage: 'Ein Serverfehler ist aufgetreten.',
    suggestions: [
      'Versuche es in ein paar Minuten erneut',
      'Überprüfe den Status von OpenRouter',
      'Kontaktiere den Support, falls das Problem anhält'
    ],
    severity: ErrorSeverity.HIGH,
    retryable: true
  },
  [ErrorType.UNKNOWN_ERROR]: {
    message: 'Unknown error occurred',
    userMessage: 'Ein unbekannter Fehler ist aufgetreten.',
    suggestions: [
      'Versuche es erneut',
      'Lade die Seite neu',
      'Kontaktiere den Support mit Details zum Fehler'
    ],
    severity: ErrorSeverity.MEDIUM,
    retryable: true
  }
};

// Error classification function
export function classifyError(error: any, context?: Record<string, any>): AIError {
  const timestamp = new Date();
  
  // Handle network errors
  if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {
    return createAIError(ErrorType.NETWORK_ERROR, error, context, timestamp);
  }
  
  // Handle timeout errors
  if (error.name === 'TimeoutError' || error.code === 'TIMEOUT') {
    return createAIError(ErrorType.TIMEOUT, error, context, timestamp);
  }
  
  // Handle HTTP status codes
  if (error.status || error.response?.status) {
    const status = error.status || error.response.status;
    
    switch (status) {
      case 401:
        return createAIError(ErrorType.API_KEY_INVALID, error, context, timestamp);
      case 403:
        return createAIError(ErrorType.INSUFFICIENT_CREDITS, error, context, timestamp);
      case 429:
        return createAIError(ErrorType.RATE_LIMIT, error, context, timestamp);
      case 404:
        return createAIError(ErrorType.MODEL_UNAVAILABLE, error, context, timestamp);
      case 422:
        return createAIError(ErrorType.VALIDATION_ERROR, error, context, timestamp);
      case 500:
      case 502:
      case 503:
      case 504:
        return createAIError(ErrorType.SERVER_ERROR, error, context, timestamp);
    }
  }
  
  // Handle specific error messages
  const errorMessage = error.message?.toLowerCase() || '';
  
  if (errorMessage.includes('api key') || errorMessage.includes('unauthorized')) {
    return createAIError(ErrorType.API_KEY_INVALID, error, context, timestamp);
  }
  
  if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
    return createAIError(ErrorType.RATE_LIMIT, error, context, timestamp);
  }
  
  if (errorMessage.includes('credits') || errorMessage.includes('insufficient funds')) {
    return createAIError(ErrorType.INSUFFICIENT_CREDITS, error, context, timestamp);
  }
  
  if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
    return createAIError(ErrorType.TIMEOUT, error, context, timestamp);
  }
  
  if (errorMessage.includes('parse') || errorMessage.includes('json')) {
    return createAIError(ErrorType.PARSING_ERROR, error, context, timestamp);
  }
  
  // Default to unknown error
  return createAIError(ErrorType.UNKNOWN_ERROR, error, context, timestamp);
}

// Helper function to create AIError objects
function createAIError(
  type: ErrorType,
  originalError: Error,
  context?: Record<string, any>,
  timestamp: Date = new Date()
): AIError {
  const config = ERROR_MESSAGES[type];
  
  return {
    type,
    severity: config.severity,
    message: config.message,
    userMessage: config.userMessage,
    suggestions: config.suggestions,
    retryable: config.retryable,
    originalError,
    context,
    timestamp
  };
}

// Error logging function
export function logError(error: AIError): void {
  const logLevel = {
    [ErrorSeverity.LOW]: 'info',
    [ErrorSeverity.MEDIUM]: 'warn',
    [ErrorSeverity.HIGH]: 'error',
    [ErrorSeverity.CRITICAL]: 'error'
  }[error.severity];
  
  const logData = {
    type: error.type,
    severity: error.severity,
    message: error.message,
    userMessage: error.userMessage,
    retryable: error.retryable,
    timestamp: error.timestamp.toISOString(),
    context: error.context,
    originalError: error.originalError?.message,
    stack: error.originalError?.stack
  };
  
  const logMethod = console[logLevel as keyof typeof console] as (...args: any[]) => void;
  if (typeof logMethod === 'function') {
    logMethod('AI Error:', logData);
  }
  
  // In production, you might want to send this to an error tracking service
  // like Sentry, LogRocket, or similar
  if (process.env.NODE_ENV === 'production' && error.severity === ErrorSeverity.CRITICAL) {
    // Example: Sentry.captureException(error.originalError, { extra: logData });
  }
}

// User notification function
export function notifyUser(error: AIError, showSuggestions: boolean = true): void {
  const toastOptions = {
    duration: error.severity === ErrorSeverity.CRITICAL ? 10000 : 5000,
    action: showSuggestions && error.suggestions.length > 0 ? {
      label: 'Hilfe anzeigen',
      onClick: () => showErrorHelp(error)
    } : undefined
  };
  
  switch (error.severity) {
    case ErrorSeverity.CRITICAL:
      toast.error(error.userMessage, toastOptions);
      break;
    case ErrorSeverity.HIGH:
      toast.error(error.userMessage, toastOptions);
      break;
    case ErrorSeverity.MEDIUM:
      toast.warning(error.userMessage, toastOptions);
      break;
    case ErrorSeverity.LOW:
      toast.info(error.userMessage, toastOptions);
      break;
  }
}

// Show detailed error help
function showErrorHelp(error: AIError): void {
  const helpMessage = [
    `**${error.userMessage}**`,
    '',
    '**Lösungsvorschläge:**',
    ...error.suggestions.map((suggestion, index) => `${index + 1}. ${suggestion}`),
    '',
    `*Fehlertyp: ${error.type}*`,
    `*Zeitpunkt: ${error.timestamp.toLocaleString('de-DE')}*`
  ].join('\n');
  
  // You could show this in a modal, or use a more sophisticated notification
  toast.info(helpMessage, {
    duration: 15000,
    style: {
      whiteSpace: 'pre-line',
      maxWidth: '500px'
    }
  });
}

// Main error handler function
export function handleAIError(
  error: any,
  context?: Record<string, any>,
  options: {
    notify?: boolean;
    log?: boolean;
    showSuggestions?: boolean;
  } = {}
): AIError {
  const { notify = true, log = true, showSuggestions = true } = options;
  
  // Handle missing API key specifically
  if (!localStorage.getItem('openrouter_api_key')) {
    const apiKeyError = createAIError(ErrorType.API_KEY_MISSING, new Error('No API key configured'), context);
    
    if (log) logError(apiKeyError);
    if (notify) notifyUser(apiKeyError, showSuggestions);
    
    return apiKeyError;
  }
  
  // Classify and handle the error
  const aiError = classifyError(error, context);
  
  if (log) logError(aiError);
  if (notify) notifyUser(aiError, showSuggestions);
  
  return aiError;
}

// Retry logic helper
export function shouldRetry(error: AIError, attemptCount: number, maxAttempts: number = 3): boolean {
  if (attemptCount >= maxAttempts) return false;
  if (!error.retryable) return false;
  
  // Special retry logic for different error types
  switch (error.type) {
    case ErrorType.RATE_LIMIT:
      return attemptCount < 2; // Only retry once for rate limits
    case ErrorType.NETWORK_ERROR:
    case ErrorType.TIMEOUT:
    case ErrorType.SERVER_ERROR:
      return true;
    default:
      return error.retryable;
  }
}

// Calculate retry delay with exponential backoff
export function getRetryDelay(error: AIError, attemptCount: number): number {
  const baseDelay = {
    [ErrorType.RATE_LIMIT]: 60000, // 1 minute for rate limits
    [ErrorType.NETWORK_ERROR]: 2000, // 2 seconds for network errors
    [ErrorType.TIMEOUT]: 5000, // 5 seconds for timeouts
    [ErrorType.SERVER_ERROR]: 10000, // 10 seconds for server errors
    [ErrorType.API_KEY_INVALID]: 0, // No retry for invalid API key
    [ErrorType.API_KEY_MISSING]: 0, // No retry for missing API key
    [ErrorType.INSUFFICIENT_CREDITS]: 30000, // 30 seconds for credit issues
    [ErrorType.MODEL_UNAVAILABLE]: 15000, // 15 seconds for model issues
    [ErrorType.VALIDATION_ERROR]: 0, // No retry for validation errors
    [ErrorType.UNKNOWN_ERROR]: 5000, // 5 seconds for unknown errors
    [ErrorType.PARSING_ERROR]: 2000, // 2 seconds for parsing errors
  }[error.type] || 3000;
  
  // Exponential backoff with jitter
  const exponentialDelay = baseDelay * Math.pow(2, attemptCount - 1);
  const jitter = Math.random() * 1000; // Add up to 1 second of jitter
  
  return Math.min(exponentialDelay + jitter, 60000); // Cap at 1 minute
}

// Error recovery suggestions
export function getRecoveryActions(error: AIError): Array<{
  label: string;
  action: () => void;
  primary?: boolean;
}> {
  const actions: Array<{ label: string; action: () => void; primary?: boolean }> = [];
  
  switch (error.type) {
    case ErrorType.API_KEY_MISSING:
    case ErrorType.API_KEY_INVALID:
      actions.push({
        label: 'Einstellungen öffnen',
        action: () => {
          // Navigate to settings - you'd implement this based on your routing
          window.location.hash = '#/settings';
        },
        primary: true
      });
      break;
      
    case ErrorType.MODEL_UNAVAILABLE:
      actions.push({
        label: 'Anderes Modell wählen',
        action: () => {
          // Open model selector - implement based on your UI
          toast.info('Wähle ein anderes AI-Modell in den Einstellungen');
        },
        primary: true
      });
      break;
      
    case ErrorType.INSUFFICIENT_CREDITS:
      actions.push({
        label: 'Guthaben aufladen',
        action: () => {
          window.open('https://openrouter.ai/credits', '_blank');
        },
        primary: true
      });
      break;
  }
  
  // Always add a retry action for retryable errors
  if (error.retryable) {
    actions.push({
      label: 'Erneut versuchen',
      action: () => {
        // This would trigger a retry - implement based on your needs
        window.location.reload();
      }
    });
  }
  
  return actions;
}

export default {
  handleAIError,
  classifyError,
  logError,
  notifyUser,
  shouldRetry,
  getRetryDelay,
  getRecoveryActions,
  ErrorType,
  ErrorSeverity
};