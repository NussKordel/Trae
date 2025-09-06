import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Key, Shield, CheckCircle, XCircle, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { OpenRouterService } from '@/services/openrouter';
import { cn } from '@/lib/utils';

interface APIKeyManagerProps {
  onKeyValidated?: (isValid: boolean) => void;
  className?: string;
}

type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid' | 'error';

export function APIKeyManager({ onKeyValidated, className }: APIKeyManagerProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Load existing API key on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openrouter_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      // Auto-validate existing key
      validateApiKey(savedKey);
    }
  }, []);

  const validateApiKey = async (key: string) => {
    if (!key.trim()) {
      setValidationStatus('idle');
      setValidationMessage('');
      onKeyValidated?.(false);
      return;
    }

    // Basic format validation
    if (!key.startsWith('sk-or-v1-')) {
      setValidationStatus('invalid');
      setValidationMessage('API-Schlüssel muss mit "sk-or-v1-" beginnen');
      onKeyValidated?.(false);
      return;
    }

    if (key.length < 20) {
      setValidationStatus('invalid');
      setValidationMessage('API-Schlüssel ist zu kurz');
      onKeyValidated?.(false);
      return;
    }

    setValidationStatus('validating');
    setValidationMessage('Validiere API-Schlüssel...');

    try {
      const openRouterService = new OpenRouterService(key);
      const isValid = await openRouterService.testConnection();
      
      if (isValid) {
        setValidationStatus('valid');
        setValidationMessage('API-Schlüssel ist gültig und funktionsfähig');
        localStorage.setItem('openrouter_api_key', key);
        onKeyValidated?.(true);
      } else {
        setValidationStatus('invalid');
        setValidationMessage('API-Schlüssel ist ungültig oder hat keine Berechtigung');
        onKeyValidated?.(false);
      }
    } catch (error) {
      setValidationStatus('error');
      setValidationMessage('Fehler bei der Validierung. Bitte versuche es erneut.');
      onKeyValidated?.(false);
      console.error('API key validation error:', error);
    }
  };

  const handleKeyChange = (value: string) => {
    setApiKey(value);
    // Debounce validation
    const timeoutId = setTimeout(() => {
      validateApiKey(value);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const testConnection = async () => {
    if (!apiKey || validationStatus !== 'valid') return;

    setIsTestingConnection(true);
    try {
      const openRouterService = new OpenRouterService(apiKey);
      const response = await openRouterService.generateResponse({
        messages: [{ role: 'user', content: 'Test connection' }],
        model: 'openai/gpt-3.5-turbo',
        max_tokens: 10
      });

      if (response) {
        setValidationMessage('Verbindungstest erfolgreich! API funktioniert einwandfrei.');
      }
    } catch (error) {
      setValidationMessage('Verbindungstest fehlgeschlagen. Überprüfe deine Internetverbindung.');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const clearApiKey = () => {
    setApiKey('');
    setValidationStatus('idle');
    setValidationMessage('');
    localStorage.removeItem('openrouter_api_key');
    onKeyValidated?.(false);
  };

  const getStatusIcon = () => {
    switch (validationStatus) {
      case 'validating':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Key className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (validationStatus) {
      case 'validating':
        return 'border-blue-300 focus:border-blue-500 focus:ring-blue-500';
      case 'valid':
        return 'border-green-300 focus:border-green-500 focus:ring-green-500';
      case 'invalid':
        return 'border-red-300 focus:border-red-500 focus:ring-red-500';
      case 'error':
        return 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500';
      default:
        return 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            OpenRouter API-Schlüssel
          </h3>
        </div>
        <a
          href="https://openrouter.ai/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          <span>API-Schlüssel erstellen</span>
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>

      {/* Description */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">
              Sicher und privat
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              Dein API-Schlüssel wird nur lokal gespeichert und direkt an OpenRouter gesendet. 
              Wir haben keinen Zugriff auf deine Daten oder deinen Schlüssel.
            </p>
          </div>
        </div>
      </div>

      {/* API Key Input */}
      <div className="space-y-2">
        <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          API-Schlüssel
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {getStatusIcon()}
          </div>
          <input
            id="api-key"
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => handleKeyChange(e.target.value)}
            placeholder="sk-or-v1-..."
            className={cn(
              'block w-full pl-10 pr-20 py-3 border rounded-lg shadow-sm',
              'placeholder-gray-400 dark:placeholder-gray-500',
              'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              'transition-colors duration-200',
              getStatusColor()
            )}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            {apiKey && (
              <button
                type="button"
                onClick={clearApiKey}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="API-Schlüssel löschen"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mr-1"
              title={showKey ? 'Schlüssel verbergen' : 'Schlüssel anzeigen'}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        {/* Validation Message */}
        {validationMessage && (
          <div className={cn(
            'flex items-center text-sm p-2 rounded',
            validationStatus === 'valid' && 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20',
            validationStatus === 'invalid' && 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20',
            validationStatus === 'error' && 'text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20',
            validationStatus === 'validating' && 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20'
          )}>
            {getStatusIcon()}
            <span className="ml-2">{validationMessage}</span>
          </div>
        )}
      </div>

      {/* Test Connection Button */}
      {validationStatus === 'valid' && (
        <div className="flex justify-end">
          <button
            onClick={testConnection}
            disabled={isTestingConnection}
            className={cn(
              'flex items-center px-4 py-2 text-sm font-medium rounded-lg',
              'bg-primary-600 hover:bg-primary-700 text-white',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-colors duration-200'
            )}
          >
            {isTestingConnection ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            {isTestingConnection ? 'Teste Verbindung...' : 'Verbindung testen'}
          </button>
        </div>
      )}

      {/* Usage Info */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          Wie erhalte ich einen API-Schlüssel?
        </h4>
        <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
          <li>Besuche <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">openrouter.ai</a></li>
          <li>Erstelle ein kostenloses Konto</li>
          <li>Gehe zu "Keys" und erstelle einen neuen API-Schlüssel</li>
          <li>Kopiere den Schlüssel und füge ihn hier ein</li>
        </ol>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
          💡 Tipp: OpenRouter bietet oft kostenlose Credits für neue Nutzer
        </p>
      </div>
    </div>
  );
}

export default APIKeyManager;